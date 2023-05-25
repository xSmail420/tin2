import React, { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  Linking,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";
import { Images, materialTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;

const MovieScreen = ({ route }) => {
  const { movieId } = route.params;
  const [requestData, setRequestData] = useState({
    api_key: "5bf66db933f207fc7fa8608cea3ffbc7",
  });
  const [movieData, setMovieData] = useState({
    genres: [],
    spoken_languages: [],
    production_companies: [],
  });
  useLayoutEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${requestData.api_key}`
    )
      .then((response) => response.json())
      .then((data) => {
        const result = data;
        setMovieData(result);
        // console.log("====================================");
        // console.log(results.length());
        // console.log("====================================");
      })
      .catch((error) => console.log("error", error));
  }, []);

  const openLink = () => {
    const uri = `https://www.imdb.com/title/${movieData.imdb_id}`;
    Linking.openURL(uri);
  };

  return (
    <Block flex style={styles.profile}>
      <ImageBackground
        source={{
          uri: `https://image.tmdb.org/t/p/w600_and_h900_bestv2${movieData.poster_path}`,
        }}
        style={styles.profileContainer}
        imageStyle={styles.profileImage}
      >
        <Block flex style={styles.profileDetails}>
          <Block style={styles.profileTexts}>
            <Text color="white" size={28} style={{ paddingBottom: 8 }}>
              {movieData.original_title}
            </Text>
          </Block>
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)"]}
            style={styles.gradient}
          />
        </Block>
      </ImageBackground>
      <Block flex={0.8}>
        <Block style={styles.options}>
          <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
            <Block row space="around" style={{ padding: theme.SIZES.BASE }}>
              <Block middle>
                <Text bold size={12} style={{ marginBottom: 8 }}>
                  {movieData.release_date}
                </Text>
                <Text muted size={12}>
                  Release date
                </Text>
              </Block>
              <Block middle>
                <Text bold size={12} style={{ marginBottom: 8 }}>
                  ⭐ {movieData.vote_average}
                </Text>
                <Text muted size={12}>
                  Vote average
                </Text>
              </Block>
            </Block>

            <Block
              row
              space="between"
              style={{ paddingVertical: 16, alignItems: "baseline" }}
            >
              <Text size={20}>Overview</Text>
              <Text
                size={12}
                color={theme.COLORS.PRIMARY}
                onPress={() => openLink()}
              >
                View IMDB
              </Text>
            </Block>
            <Block style={{  }}>
              <Text multiline style={{ margin: 10, marginBottom: 0 }} size={16}>{movieData.overview}</Text>
              <Text
                size={12}
                style={{ margin: 10}}
                color={theme.COLORS.PRIMARY}
                onPress={() => {Linking.openURL(movieData.homepage);}}
              >
                Home page
              </Text>
              <Text size={16} style={{fontWeight: "bold",}}>
                Run time :
              </Text>
              <Text multiline style={{ margin: 2 }} size={14}>{movieData.runtime} min</Text>
              <Text size={16} style={{fontWeight: "bold",}}>
                Genres :
              </Text>
              {movieData.genres.map((genre) => (
                <Text
                  multiline style={{ margin: 2 , color: "#3A3B3C", }}
                  key={`viewed-${genre.name}`}
                  size={14}
                >
                  - {genre.name}
                </Text>
              ))}
              <Text size={16} style={{fontWeight: "bold",}}>
               Spoken languages :
              </Text>
              {movieData.spoken_languages.map((genre) => (
                <Text
                  multiline style={{ margin: 2 , color: "#3A3B3C", }}
                  key={`viewed-${genre.english_name}`}
                  size={14}
                >
                  - {genre.english_name}
                </Text>
              ))}
              <Text size={16} style={{fontWeight: "bold",}}>
              Production companies :
              </Text>
              {movieData.production_companies.map((genre) => (
                <Text
                  multiline style={{ margin: 2 , color: "#3A3B3C", }}
                  key={`viewed-${genre.name}`}
                  size={14}
                >
                  - {genre.name}
                </Text>
              ))}
              <Text size={16} style={{fontWeight: "bold",}}>
              Budget :
              </Text>
              <Text multiline style={{ margin: 2 }} size={14}>{movieData.budget} $</Text>
            </Block>
          </ScrollView>
        </Block>
      </Block>
    </Block>
  );
};

export default MovieScreen;

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
  },
  profileImage: {
    width: width,
    height: "auto",
  },
  profileContainer: {
    flex: 1.4,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "contain",
  },
  Map: {
    width: width,
    height: height,

    backgroundColor: "red",
  },
  profileDetails: {
    paddingTop: theme.SIZES.BASE * 4,
    justifyContent: "flex-end",
    position: "relative",
  },
  profileTexts: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
    zIndex: 2,
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginRight: theme.SIZES.BASE / 2,
    borderRadius: 4,
    height: 22,
    width: 38,
  },
  seller: {
    marginRight: "30%",
  },
  options: {
    position: "relative",
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: -theme.SIZES.BASE,
    marginBottom: 0,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  thumb: {
    borderRadius: 4,
    margin: 4,
    marginVertical: 11,
    alignSelf: "center",
    width: thumbMeasure * 1.4,
    height: thumbMeasure,
  },
  gradient: {
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: "30%",
    position: "absolute",
  },
});
