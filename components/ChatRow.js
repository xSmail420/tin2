import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import useAuth from "../hooks/useAuth";
import { db } from "../firebase";
import { collection, doc, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import generateId from "../lib/generateId";

const ChatRow = ({ userDetails }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    try {
      onSnapshot(
      query(
        collection(db, "messages", generateId(user.uid, userDetails.id), "chat"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setLastMessage(snapshot.docs[0]?.data()?.message)
    );
    } catch (error) {
      console.log(error);
    }
  }, [userDetails, db]);

  return (
    <TouchableOpacity
      className="flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg"
      style={styles.cardShadow}
      onPress={() =>
        navigation.navigate("Message", {
          userDetails,
        })
      }
    >
      <Image
        className="rounded-full h-16 w-16 mr-4"
        source={{
          uri: userDetails?.photoURL,
        }}
        // userDetails?.photoURL
        //                ^ very important (at some point might be null)
      />
      <View>
        <Text className="text-lg font-semibold">
          {userDetails?.displayName}
        </Text>
        <Text>{lastMessage || "Say Hi!👋 "}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});
