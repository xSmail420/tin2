import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import ProfileRow from "../components/ProfileRow";

const SearchScreen = () => {
  const [fullData, setFullData] = useState([]);
  const [text, setText] = useState(null);
  const { user } = useAuth();
  const navigation = useNavigation();

  const fetchFilteredData = async (queryText) => {
    try {
      const querySnapshot = await getDocs(query(collection(db, "users")));

      const filteredData = querySnapshot.docs
        .map((doc) => doc.data())
        .filter((userData) =>
          userData.displayName.toLowerCase().includes(queryText.toLowerCase()) && user.uid !== userData.id
        );

      console.log("Filtered Data:", filteredData);
      setFullData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <SafeAreaProvider
      style={{
        backgroundColor: "#fff",
        padding: 10,
        marginVertical: 10,
        borderRadius: 20,
      }}
    >
      <SafeAreaView>
        <View
          style={{
            height: 50,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
            <Ionicons name="chevron-back-outline" size={34} color="#FF5864" />
          </TouchableOpacity>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="always"
            onChangeText={(queryText) => fetchFilteredData(queryText)}
            placeholder="Search"
            style={{
              backgroundColor: "#efefef",
              paddingHorizontal: 20,
              borderRadius: 25,
              height: 50,
              width: "87%",
            }}
          />
        </View>
        {fullData.length > 0 ? (
          <FlatList
            className="h-full"
            data={fullData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProfileRow profileDetails={item} />}
          />
        ) : (
          <View
            style={{
              alignItems: "center",
              height: "80%",
              justifyContent: "center",
            }}
          >
            <Text>No results!</Text>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
