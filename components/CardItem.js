import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

const CardItem = ({ movie }) => {
  const navigation = useNavigation();
  const movieId = movie.id;
  return (
    <TouchableWithoutFeedback
      
      onPress={() => {
        navigation.navigate("Movie", {
          movieId,
        });
      }}
    >
      <View style={styles.container}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${movie.poster_path}`,
          }}
          style={styles.image}
        />
        <Text style={styles.title}>{movie.original_title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "42%", // Make it occupy horizontally half of the screen
    aspectRatio: 4 / 5, // Set the aspect ratio to 5:4
    borderRadius: 10,
    backgroundColor: "#efefef",
    elevation: 5, // Add elevation for shadow on Android
    shadowColor: "black", // Add shadow properties for iOS
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.51,
    shadowRadius: 3.84,
    marginLeft: "6%",
  },
  image: {
    width: "100%",
    height: "80%", // Take up the entire height of the container
  },
  title: {
    height: "20%",
    fontSize: 10,
    fontWeight: "600",
    margin: 10,
    textAlign: "center",
  },
});

export default CardItem;
