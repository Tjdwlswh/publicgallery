import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import IconRightButton from "../components/IconRightButton";
import { updatePost } from "../lib/posts";
import events from "../lib/events";

function ModifyScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const [description, setDescription] = useState(params.description);

  console.log(params);

  const onSubmit = useCallback(() => {
    // 포스트 수정 및 포스트 목록 업데이트
    updatePost({ id: params.id, description });
    events.emit("updatePost", { postId: params.id, description });
    navigation.pop();
  }, [params.id, navigation, description]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconRightButton onPress={onSubmit} name="check" />,
    });
  }, [navigation, onSubmit]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "height" })}
      style={styles.block}
      keyboardVerticalOffset={Platform.select({
        ios: 88,
      })}
    >
      <TextInput
        style={styles.input}
        multiline={true}
        placeholder="이 사진에 대한 설명을 입력하세요"
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
  input: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flex: 1,
    fontSize: 16,
  },
});

export default ModifyScreen;
