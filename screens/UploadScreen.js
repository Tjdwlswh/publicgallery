import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  useWindowDimensions,
  Animated,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import IconRightButton from "../components/IconRightButton";
import { storage } from "../firebase";
import { useUserContext } from "../contexts/UserContext";
import * as Crypto from "expo-crypto";
import { createPost } from "../lib/posts";
import events from "../lib/events";

function UploadScreen() {
  const route = useRoute();
  const { result } = route.params || {};
  const { width } = useWindowDimensions();
  const animation = useRef(new Animated.Value(width)).current;
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [description, setDescription] = useState("");
  const { user } = useUserContext();
  const navigation = useNavigation();

  const onSubmit = useCallback(async () => {
    navigation.pop();

    const asset = result.assets[0];
    const extension = asset.uri.split(".").pop();

    let storageRef = storage.ref();
    var metadata = {
      contentType: "image/jpeg",
    };

    const reference = storageRef.child(
      `/photo/${user.id}/${Crypto.randomUUID()}.${extension}`
    );
    if (Platform.OS === "android") {
      const response = await fetch(asset.uri);
      const blob = await response.blob();

      await reference.put(blob, metadata);
    } else {
      await reference.put(asset.uri, metadata);
    }

    const photoURL = await reference.getDownloadURL();
    console.log("photo", photoURL);

    await createPost({ description, photoURL, user });

    events.emit("refresh");
  }, [result, user, description, navigation]);

  useEffect(() => {
    const didShow = Keyboard.addListener("keyboardDidShow", () =>
      setIsKeyboardOpen(true)
    );

    const didHide = Keyboard.addListener("keyboardDidHide", () =>
      setIsKeyboardOpen(false)
    );

    return () => {
      didShow.remove();
      didHide.remove();
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton onPress={onSubmit} name="send" />,
    });
  }, [navigation, onSubmit]);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isKeyboardOpen ? 0 : width,
      useNativeDriver: false,
      duration: 150,
      delay: 100,
    }).start();
  }, [isKeyboardOpen, width, animation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "height" })}
      style={styles.block}
      keyboardVerticalOffset={Platform.select({
        ios: 180,
      })}
    >
      <View style={styles.block}>
        <Animated.Image
          source={{ uri: result.assets[0]?.uri }}
          style={[styles.image, { height: animation }]}
          resizeMode="cover"
        />
        <TextInput
          style={styles.input}
          multiline={true}
          placeholder="이 사진에 대한 설명을 입력하세요..."
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
  image: { width: "100%" },
  input: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flex: 1,
    fontSize: 16,
  },
});

export default UploadScreen;
