import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import useAuth from "../hooks/useAuth";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { Ionicons } from "@expo/vector-icons";
import generateId from "../lib/generateId";
import { useNavigation } from "@react-navigation/native";

const ProfileRow = ({ profileDetails }) => {
  const [friend, setFriend] = useState(false);
  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "users", user.uid, "Friends"),
          where("id", "==", profileDetails.id)
        ),
        (snapshot) => {
          setFriend(snapshot.docs[0]?.data() ? true : false);
          console.log("====================================");
          console.log(snapshot.docs[0]?.data());
          console.log("====================================");
        }
      ),
    [profileDetails, db]
  );

  const addFriend = async () => {
    try {
      await setDoc(
        doc(db, "users", user.uid, "Friends", profileDetails.id.toString()),
        profileDetails
      );

      const querySnapshot = await getDoc(doc(db, "users", user.uid));

      await setDoc(
        doc(db, "users", profileDetails.id, "Friends", user.uid.toString()),
        querySnapshot.data()
      );

      await setDoc(
        doc(db, "messages", generateId(user.uid, profileDetails.id)),
        {
          timestamp: serverTimestamp(),
        }
      );
    } catch (error) {
      console.log("Erreur lors de la sauvegarde des données :", error);
    }
  };

  return (
    <View
      className="flex-row items-center justify-between py-3 px-5 bg-white mx-3 my-1 rounded-lg"
      style={styles.cardShadow}
    >
      <View className="flex-row items-center">
        <Image
          className="rounded-full h-16 w-16 mr-4"
          source={{
            uri: profileDetails?.photoURL,
          }}
        />
        <Text className="text-lg font-semibold">
          {profileDetails?.displayName}
        </Text>
      </View>

      {!friend && (
        <TouchableOpacity
          style={{}}
          onPress={() => addFriend()}
          className="p-1"
        >
          <Ionicons name="add-outline" size={34} color="#FF5864" />
        </TouchableOpacity>
      )}
      {friend && (
        <TouchableOpacity
          style={{}}
          onPress={() =>
            navigation.navigate("Message", {
                userDetails : profileDetails,
            })
          }
          className="p-1"
        >
          <Ionicons name="send-outline" size={34} color="#FF5864" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProfileRow;

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
