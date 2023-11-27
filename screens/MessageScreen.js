import { useRoute } from "@react-navigation/native";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import ReceiverMessage from "../components/ReceiverMessage";
import SenderMessage from "../components/SenderMessage";
import useAuth from "../hooks/useAuth";
import { db } from "../firebase";
import generateId from "../lib/generateId";

const MessagesScreen = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const { userDetails } = params;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db,"messages",generateId(user.uid, userDetails.id),"chat"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [userDetails, db]
  );

  const sendMessage = () => {
    if (input === "") return;
    addDoc(collection(db,"messages",generateId(user.uid, userDetails.id),"chat"), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      message: input,
    });

    setInput("");
  };

  return (
    <SafeAreaView className="flex-1">
      <Header
        title={userDetails.displayName}
        callEnabled
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={messages}
            inverted={-1}
            className="pl-4"
            keyExtractor={(item) => item.id}
            renderItem={({ item: message }) =>
              message.userId === user.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
          />
        </TouchableWithoutFeedback>

        <View className="flex-row justify-between items-center border-t border-gray-200 px-5 py-2 bg-white">
          <TextInput
            className="h-10 text-lg"
            placeholder="Send Message..."
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <TouchableOpacity onPress={sendMessage}>
            <Text className="text-[#FF5864] text-lg">Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessagesScreen;
