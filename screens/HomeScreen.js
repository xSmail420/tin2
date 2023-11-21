import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  DevSettings,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import RNPickerSelect from "react-native-picker-select";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const swipeRef = useRef(null);
  const [movies, setMovies] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [cardInd, setCardInd] = useState(0);

  const [requestData, setRequestData] = useState({
    api_key: "5bf66db933f207fc7fa8608cea3ffbc7",
    page: 1,
    category: "popular",
  });

  useEffect(() => {
    if (cardInd == movies.length - 2) {
      setRequestData({
        ...requestData,
        ...{ page: requestData.page + 1 },
      });
    }
  }, [cardInd]);

  useLayoutEffect(() => {
    onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (!snapshot.exists()) {
        navigation.navigate("Modal");
      }
    });
    fetch(
      `https://api.themoviedb.org/3/movie/${requestData.category}?api_key=${requestData.api_key}&language=en-US&page=${requestData.page}`
    )
      .then((response) => response.json())
      .then((data) => {
        const results = data.results;
        setMovies([...movies, ...results]);
      })
      .catch((error) => console.log("error", error));
  }, [requestData.page]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${requestData.category}?api_key=${requestData.api_key}&language=en-US&page=${requestData.page}`
    )
    .then((response) => response.json())
    .then((data) => {
      const results = data.results;
      setMovies(results);
    })
    .catch((error) => console.log("error", error));
  }, [requestData.category]);

  useEffect(() => {
    let unsub;
    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "Nope")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));
      const swipes = await getDocs(
        collection(db, "users", user.uid, "Like")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passesUserIds = passes.length > 0 ? passes : ["test"];
      const swipedUserIds = swipes.length > 0 ? swipes : ["test"];

      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passesUserIds, ...swipedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };

    fetchCards();
    return unsub;
  }, [db]);

  const swipeLeft = async (cardIndex) => {
    setCardInd(cardIndex);
    if (!movies[cardIndex]) return;
    const movie_Info = movies[cardIndex];
    const userUid = user.uid;
    try {
      await setDoc(
        doc(db, "users", userUid, "Nope", movie_Info.id.toString()),
        movie_Info
      );
    } catch (error) {
      console.log("Erreur lors de la sauvegarde des données :", error);
    }
  };

  const swipeRight = async (cardIndex) => {
    setCardInd(cardIndex);
    if (!movies[cardIndex]) return;
    const movie_Info = movies[cardIndex];
    const userUid = user.uid;

    try {
      await setDoc(
        doc(db, "users", userUid, "Like", movie_Info.id.toString()),
        movie_Info
      );
      createMatch();
    } catch (error) {
      console.log("Erreur lors de la sauvegarde des données :", error);
    }
  };


  const createMatch = async () => {
    //create match with the two users
    id_user2 = "QsXPGlspVyXysGUoYYZ7uHCUnRv2"
    if ("QsXPGlspVyXysGUoYYZ7uHCUnRv2" == user.uid) {
      id_user2 = "rW5RTPXMCRfFBrMBZsIACr6lHsv1"
    }

    const loggedInProfile = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();
          
    const usersMatchedProfile = await (
      await getDoc(doc(db, "users", id_user2))
    ).data();

    setDoc(doc(db, "matches", generateId(user.uid, id_user2)), {
      users: {
        [user.uid]: loggedInProfile,
        [id_user2]: usersMatchedProfile,
      },
      usersMatched: [user.uid, id_user2],
      timestamp: serverTimestamp(),
    });

    navigation.navigate("Match", {
      loggedInProfile,
      usersMatchedProfile,
    });

  }

  const generateId = (id1 , id2) => {
    return (id1+id2)
  }
  // const swipeRight = async (cardIndex) => {
  //   setCardInd(cardIndex);

  //   if (!movies[cardIndex]) return;
  //   const movie_Info = movies[cardIndex].id;
  //   setDoc(doc(db, "users", user.uid, "Like", movie_Info.id), movie_Info);

  // if (!movies[cardIndex]) return;
  // const movie_Id = movies[cardIndex];
  // const loggedInProfile = await (
  //   await getDoc(doc(db, "users", user.uid))
  // ).data();
  // // console info
  // console.log(`You swipe right on ${movie_Id.displayName}`);
  // // Check if the user swiped on you...
  // getDoc(doc(db, "users", movie_Id.id, "swipes", user.uid)).then(
  //   (DocumentSnapshot) => {
  //     if (DocumentSnapshot.exists()) {
  //       // User has matched with you before you matched with them...
  //       console.log(`LETS GO! You matched with ${movie_Id.displayName}!`);
  //       setDoc(
  //         doc(db, "users", user.uid, "swipes", movie_Id.id),
  //         movie_Id
  //       );
  //       // CREATE A MATCH!
  //       setDoc(doc(db, "matches", generateId(user.uid, movie_Id.id)), {
  //         users: {
  //           [user.uid]: loggedInProfile,
  //           [movie_Id.id]: movie_Id,
  //         },
  //         usersMatched: [user.uid, movie_Id.id],
  //         timestamp: serverTimestamp(),
  //       });
  //       navigation.navigate("Match", {
  //         loggedInProfile,
  //         movie_Id,
  //       });
  //     } else {
  //       // User has swiped as first interaction between the two...
  //       console.log(`You swiped on ${movie_Id.displayName}!`);
  //       setDoc(
  //         doc(db, "users", user.uid, "swipes", movie_Id.id),
  //         movie_Id
  //       );
  //     }
  //   }
  // );
  // setDoc(doc(db, "users", user.uid, "swipes", movie_Id.id), movie_Id);
  // };

  const viewMovie = (movieId) => {
    if (!movieId) return;
    navigation.navigate("Movie", {
      movieId,
    });
  };

  return (
    <SafeAreaView className="flex-1 top-2">
      <View className="flex-row items-center justify-between relative px-5">
        <TouchableOpacity onPress={logout}>
          <Image
            source={{
              uri: user.photoURL,
            }}
            className="h-10 w-10 rounded-full"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            source={require("../logo.png")}
            className="h-12 w-12"
            style={{ tintColor: "#FF3854" }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubbles-sharp" size={45} color="#FF5864" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 -mt-6">
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={movies}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={(cardIndex) => {
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            swipeRight(cardIndex);
          }}
          backgroundColor={"#4FD0E9"}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "LIKE",
              style: {
                label: {
                  textAlign: "left",
                  color: "#4DED30",
                },
              },
            },
          }}
          renderCard={(card) =>
            card ? (
              <View
                className="relative bg-white h-5/6 rounded-xl"
                style={styles.cardShadow}
                key={card.id}
              >
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${card.poster_path}`,
                  }}
                  className="absolute top-0 h-full w-full rounded-xl"
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    className="text-white text-2xl font-bold px-2 py-2"
                  >
                    {card.vote_average}
                  </Text>
                  <Ionicons
                    name="star"
                    size={25}
                    color="#ffdf00"
                    className="top-0 py-2"
                  />
                </View>

                <TouchableOpacity
                  className="absolute opacity-90 items-center mx-2 bottom-20 h-16 w-16 rounded-xl"
                  onPress={() => viewMovie(card.id)}
                >
                  <Image
                    source={{
                      uri: "https://cdn.discordapp.com/attachments/1057858293789380629/1111071665837846598/View.png",
                    }}
                    className="h-16 w-16"
                  />
                </TouchableOpacity>
                <View
                  style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
                  className="absolute bottom-0 bg-neutral-400/[.2] w-full h-20 justify-between items-center flex-row px-6 py-2 rounded-b-xl"
                >
                  <View>
                    <Text
                      numberOfLines={1}
                      className="text-white text-2xl font-bold"
                    >
                      {card.original_title}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={styles.text}
                      className="text-white text-lg"
                    >
                      {card.overview}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View
                className="relative bg-white h-4/5 rounded-xl justify-center items-center"
                style={styles.cardShadow}
              >
                <Text className="pb-5 font-bold">
                  No more movies at the moment!
                </Text>
                <Image
                  className="h-20 w-20"
                  source={{
                    uri: "https://links.papareact.com/6gb",
                  }}
                />
              </View>
            )
          }
        />
      </View>
      {/* END OF SWIPER CARDS */}

      <RNPickerSelect
        onValueChange={(value) => {
          setRequestData({
            ...requestData,
            ...{ category: value },
          });
        }}
        value={requestData.category}
        items={[
          { label: "top_rated", value: "top_rated" },
          { label: "popular", value: "popular" },
        ]}
      />

      {/* BOTTOM BUTTONS */}
      <View className="flex flex-row justify-evenly bottom-6">
        {/* LEFT BUTTON*/}
        <TouchableOpacity
          className="items-center justify-center rounded-full w-16 h-16 bg-red-200"
          onPress={() => swipeRef.current.swipeLeft()}
        >
          <Entypo name="cross" size={30} color="red" />
        </TouchableOpacity>
        {/* RIGHT BUTTON */}
        <TouchableOpacity
          className="items-center justify-center rounded-full w-16 h-16 bg-green-200"
          onPress={() => swipeRef.current.swipeRight()}
        >
          <AntDesign name="heart" size={30} color="green" />
        </TouchableOpacity>
      </View>
      {/* END OF BOTTOM BUTTONS */}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 20,
  },
  text: {
    fontSize: 12,
    textAlign: "justify",
    lineHeight: 20,
  },
});
