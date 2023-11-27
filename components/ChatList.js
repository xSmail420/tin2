import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import ChatRow from "../components/ChatRow";

const ChatList = () => {
  const [friends, setFriends] = useState([]);
  const { user } = useAuth();

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db,"users",user.uid ,"Friends")
        ),
        (snapshot) =>
          setFriends(
            snapshot.docs.map((doc) => (doc.data()))
          )
      ),
    [user]
  );

  return friends.length > 0 ? (
    <FlatList
      className="h-full"
      data={friends}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatRow userDetails={item} />}
    />
  ) : (
    <View>
      <Text>No Friends at the moment!🥶</Text>
    </View>
  );
};

export default ChatList;
