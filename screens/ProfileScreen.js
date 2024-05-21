import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import Profile from "../components/Profile";

function ProfileScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId, displayName } = route.params ?? {};

  useEffect(() => {
    navigation.setOptions({
      title: displayName,
    });
  }, [navigation, displayName]);
  console.log("유저아이디", userId);
  return <Profile userId={userId} />;
}

export default ProfileScreen;
