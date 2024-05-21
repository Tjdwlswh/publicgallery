import { useNavigation, useRoute } from "@react-navigation/native";
import { React, useState } from "react";
import {
  StyleSheet,
  View,
  Platform,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { logOut } from "../lib/auth";
import { createUser } from "../lib/users";
import BorderedInput from "./BorderedInput";
import CustomButton from "./CustomButton";
import { useUserContext } from "../contexts/UserContext";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../firebase";
import Avatar from "./Avatar";

function SetupProfile() {
  const [displayName, setDisplayName] = useState("");
  const navigation = useNavigation();
  const { params } = useRoute();
  const { uid } = params || {};
  const { setUser } = useUserContext();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(params, uid);

  const onSelectImage = async () => {
    console.log("확인");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      includeBase64: Platform.OS === "android",
    });

    if (!result.canceled) {
      setResponse(result);
    } else {
      return;
    }
  };
  console.log("state", response);
  console.log("storage", storage);
  // https://docs.expo.dev/versions/latest/sdk/imagepicker/?redirected
  // expo 에서는 react-native-image-picker가 작동하지 않음, expo-image-picker를 사용해야함

  const onSubmit = async () => {
    setLoading(true);

    let photoURL = null;

    if (response) {
      const asset = response.assets[0];
      const extension = asset.uri.split(".").pop();

      let storageRef = storage.ref();
      var metadata = {
        contentType: "image/jpeg",
      };
      const reference = storageRef.child(`/profile/${uid}.${extension}`);
      if (Platform.OS === "android") {
        const res = await fetch(asset.uri);
        const blob = await res.blob();

        await reference.put(blob, metadata);
      } else {
        await reference.put(asset.uri, metadata);
      }

      photoURL = response ? await reference.getDownloadURL() : null;
      console.log("photo", photoURL);
    }

    const user = {
      id: uid,
      displayName,
      photoURL,
    };

    createUser(user);
    setUser(user);
  };

  const onCancel = () => {
    logOut();
    navigation.goBack();
  };

  return (
    <View style={styles.block}>
      <Pressable onPress={onSelectImage}>
        <Avatar source={response && { uri: response.uri }} size={128} />
      </Pressable>

      <View style={styles.form}>
        <BorderedInput
          placeholder="닉네임"
          value={displayName}
          onChangeText={setDisplayName}
          onSubmitEditing={onSubmit}
          returnKeyType="next"
        />
        {loading ? (
          <ActivityIndicator size={32} color="#6200ee" style={styles.spinner} />
        ) : (
          <View style={styles.buttons}>
            <CustomButton title="다음" onPress={onSubmit} hasMarginBottom />
            <CustomButton title="취소" onPress={onCancel} theme="secondary" />
          </View>
        )}
      </View>
    </View>
  );
}

//storage가 함수가 아니라고 뜨니깐 사용법 찾아보기 expo storage 사용법이 따로있을것임

const styles = StyleSheet.create({
  block: {
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 16,
    width: "100%",
  },

  form: {
    marginTop: 16,
    width: "100%",
  },
  buttons: {
    marginTop: 48,
  },
});

export default SetupProfile;
