import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SignButtons from "../components/SignButtons";
import SignForm from "../components/SignForm";
import { signIn, signUp } from "../lib/auth";
import { getUser } from "../lib/users";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "../contexts/UserContext";

function SignInScreen({ route }) {
  const { isSignUp } = route.params || {};
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState();
  const { setUser } = useUserContext();

  const navigation = useNavigation();

  const createChangeTextHandler = (name) => (value) => {
    setForm({ ...form, [name]: value });
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
    const { email, password, confirmPassword } = form;

    if (isSignUp && password !== confirmPassword) {
      Alert.alert("실패", "비밀번호가 일치하지 않습니다.");
      return;
    }

    const info = { email, password };
    setLoading(true);
    try {
      const { user } = isSignUp ? await signUp(info) : await signIn(info);
      const profile = await getUser(user.uid);
      console.log(profile);
      if (!profile) {
        navigation.navigate("Welcome", { uid: user.uid });
      } else {
        setUser(profile);
        //profile 조회가 되면 useContext 로 보내서 전역으로 사용하도록 관리함
      }
    } catch (e) {
      const messages = {
        "auth/email-already-in-use": "이미 가입된 이메일입니다.",
        "auth/wrong-password": "잘못된 비밀번호입니다.",
        "auth/user-not-found": "존재하지 않는 계정입니다.",
        "auth/invalid-email": "유효하지 않은 이메일 주소입니다.",
      };
      const msg = messages[e.code] || `${isSignUp ? "가입" : "로그인"} 실패`;
      Alert.alert("실패", msg);
      console.log("error잡이", e);
    } finally {
      setLoading(false);
    }
  };

  console.log(route.params);
  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.select({ ios: "padding" })}
    >
      <SafeAreaView style={styles.fullscreen}>
        <Text style={styles.text}>PublicGallery</Text>
        <View style={styles.form}>
          <SignForm
            isSignUp={isSignUp}
            onSubmit={onSubmit}
            form={form}
            createChangeTextHandler={createChangeTextHandler}
          />
          <SignButtons
            isSignUp={isSignUp}
            onSubmit={onSubmit}
            loading={loading}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
  },
  form: {
    marginTop: 64,
    width: "100%",
    paddingHorizontal: 16,
  },

  keyboardAvoidingView: { flex: 1 },
});

export default SignInScreen;
