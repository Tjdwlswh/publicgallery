import React, { useEffect } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Profile from "../components/Profile";
import { useUserContext } from "../contexts/UserContext";
import IconRightButton from "../components/IconRightButton";

function MyProfileScreen() {
  const { user } = useUserContext();
  const navigation = useNavigation();
  console.log(user);
  useEffect(() => {
    navigation.setOptions({
      title: user.displayName,
      headerRight: () => (
        <IconRightButton
          name="settings"
          onPress={() => navigation.push("Setting")}
        />
      ),
    });
  }, [navigation, user]);

  return <Profile userId={user.id} />;
}

export default MyProfileScreen;
