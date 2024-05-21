import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import RootStack from "./screens/RootStack";
import { NavigationContainer } from "@react-navigation/native";
import { UserContextProvider } from "./contexts/UserContext";

export default function App() {
  return (
    <UserContextProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </UserContextProvider>
  );
}
