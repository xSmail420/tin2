import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import CardItem from "../components/CardItem";
import Header from "../components/Header";

const ProfileScreen = ({route}) => {
  const { user } = route.params;
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(likes);
  const [friends, setFriends] = useState([])

  useEffect(() => {
    fetchCards();
    setTitle("Likes");
  }, []);

  useEffect(() => {
    if (title == "Likes") {
      setContent(likes);
    }
    if (title == "Dislikes") {
      setContent(dislikes);
    }
  }, [title,likes,dislikes]);

  const fetchCards = async () => {
    const passes = await getDocs(
      collection(db, "users", user.uid, "Nope")
    ).then((snapshot) => snapshot.docs.map((doc) => doc.data()));
    setDislikes(passes);
    const swipes = await getDocs(
      collection(db, "users", user.uid, "Like")
    ).then((snapshot) => snapshot.docs.map((doc) => doc.data()));
    setLikes(swipes);
    const friends = await getDocs(
      collection(db, "users", user.uid, "Friends")
    ).then((snapshot) => snapshot.docs.map((doc) => doc.data()));
    setFriends(friends);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={"Profile"}/>
      <View style={styles.headerContainer}>
        
        <Image style={styles.userImage} source={{ uri: user.photoURL }} />
        <Text style={styles.userNameText}>{user.displayName}</Text>
        <View style={styles.socialInfoContainer}>
          <View style={styles.textContainer}>
            <TouchableOpacity onPress={() => setTitle("Likes")}>
              <View>
                <Text style={{ ...styles.counter, ...styles.textStyle }}>
                  {likes.length}
                </Text>
                <Text style={styles.textStyle}>Likes</Text>
              </View>
            </TouchableOpacity>

            <TouchableWithoutFeedback>
              <View>
                <Text style={{ ...styles.counter, ...styles.textStyle }}>
                  {friends.length}
                </Text>
                <Text style={styles.textStyle}>Friends</Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableOpacity onPress={() => setTitle("Dislikes")}>
              <View>
                <Text style={{ ...styles.counter, ...styles.textStyle }}>
                  {dislikes.length}
                </Text>
                <Text style={styles.textStyle}>Dislikes</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Add social icons or any other profile information as needed */}
      <View style={styles.scroll}>
        <View style={styles.recentPostsContainer}>
          <Text style={styles.recentPostsTitle}>{title}</Text>
        </View>
        <FlatList
          data={content}
          height={"65%"}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CardItem movie = {item}/>
          )}
          ItemSeparatorComponent={itemSeparator}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const itemSeparator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    backgroundColor: "#FFF",
  },
  headerContainer: {
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingTop: 30,
  },
  userImage: {
    borderRadius: 60,
    height: 90,
    marginBottom: 10,
    width: 90,
  },
  userNameText: {
    color: "#5B5A5A",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  userBioText: {
    color: "gray",
    fontSize: 13.5,
    textAlign: "center",
  },
  socialInfoContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  recentPostsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor:"transparent"
  },

  counter: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 20,
    
  },
  recentPostsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    zIndex: 0,
    backgroundColor:"transparent"
  },
  textStyle: {
    textAlign: "center",
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "33%",
  },
  flatListContainer: {
    paddingBottom: 30,
    paddingTop:10,
  },
  separator: {
    height: 15, // Vertical spacing between rows
  },
});

export default ProfileScreen;
