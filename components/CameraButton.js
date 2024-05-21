import React, { useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  ActionSheetIOS,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import UploadModeModal from "./UploadModeModal";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import ActionSheetModal from "./ActionSheetModal";

const TABBAR_HEIGHT = 49;

function CameraButton() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModeVisible] = useState(false);
  const bottom = Platform.select({
    android: TABBAR_HEIGHT / 2,
    ios: TABBAR_HEIGHT / 2 + insets.bottom - 4,
  });
  const navigation = useNavigation();

  const onLaunchCamera = async () => {
    const status = await ImagePicker.requestCameraPermissionsAsync();
    console.log(status);
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 3],
      });

      if (result.canceled || !result) {
        return;
      }
      console.log(result);
      navigation.push("Upload", { result });
    } catch (error) {
      console.log("Error occurred while launching the camera: ", error);
    }
  };

  const onLaunchImageLibrary = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        Base64: true,
      });

      if (result.canceled || !result) {
        return;
      }
      console.log(result);
      navigation.push("Upload", { result });
    } catch (error) {
      console.log("Error occurred while launching the gallery: ", error);
    }
  };

  const onPress = () => {
    if (Platform.OS === "android") {
      setModeVisible(true);
      return;
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: "사진 업로드",
        options: ["카메라로 촬영하기", "사진 선택하기", "취소"],
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          onLaunchCamera();
        } else if (buttonIndex === 1) {
          onLaunchImageLibrary();
        }
      }
    );
  };

  return (
    <>
      <View style={[styles.wrapper, { bottom }]}>
        <Pressable
          android_ripple={{
            color: "#ffffff",
          }}
          style={styles.circle}
          onPress={onPress}
        >
          <Icon name="camera-alt" color="white" size={24} />
        </Pressable>
      </View>
      {/* <UploadModeModal
        visible={modalVisible}
        onClose={() => setModeVisible(false)}
        onLaunchCamera={onLaunchCamera}
        onLaunchImageLibrary={onLaunchImageLibrary}
      /> */}
      <ActionSheetModal
        visible={modalVisible}
        onClose={() => setModeVisible(false)}
        actions={[
          {
            icon: "camera-alt",
            text: "카메라로 촬영하기",
            onPress: onLaunchCamera,
          },
          {
            icon: "photo",
            text: "사진 선택하기",
            onPress: onLaunchImageLibrary,
          },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 5,
    borderRadius: 27,
    height: 54,
    width: 54,
    position: "absolute",
    left: "50%",
    transform: [
      {
        translateX: -27,
      },
    ],
    ...Platform.select({
      ios: {
        shadowColor: "#4d4d4d",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
        overflow: "hidden",
      },
    }),
  },
  circle: {
    backgroundColor: "#6200ee",
    borderRadius: 27,
    height: 54,
    width: 54,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CameraButton;
