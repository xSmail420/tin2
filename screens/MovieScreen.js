import React, { useLayoutEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";

import { Icon } from "../components";
import { Images, materialTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";

const MovieScreen = () => {
  const [requestData, setRequestData] = useState({
    api_key: "5bf66db933f207fc7fa8608cea3ffbc7",
  });

  useLayoutEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${requestData.api_key}`
    )
      .then((response) => response.json())
      .then((data) => {
        const results = data.results;
        setMovies(results);
        console.log("====================================");
        // console.log(results.length());
        console.log("====================================");
      })
      .catch((error) => console.log("error", error));
  }, []);
  return (
    <Block flex style={styles.profile}>
      <ImageBackground
        source={{ uri: userData.pfp? userData.pfp : Images.Profile  }}
        style={styles.profileContainer}
        imageStyle={styles.profileImage}
      >
        <Block flex style={styles.profileDetails}>
          <Block style={styles.profileTexts}>
            <Text color="white" size={28} style={{ paddingBottom: 8 }}>
              {userData.firstLast}
            </Text>
            <Block row space="between">
              <Block flex row>
                <Block middle style={styles.pro}>
                  <Text size={19} color="white" style={{ top: -3 }}>
                  {userData.adminId == "" ? "Dir" : "Rep"}
                  </Text>
                </Block>
                <Text color="white" size={16} muted style={styles.seller}>
                  {userData.email}
                </Text>
                {userData.adminId != "" && (
                  <Block right>
                    <Text
                      size={16}
                      color={materialTheme.COLORS.WARNING}
                      style={{ justifyContent: "flex-end" }}
                    >
                      {userData.kpa}
                      <Icon name="shape-star" family="GalioExtra" size={14} />
                    </Text>
                  </Block>
                )}
              </Block>
            </Block>
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
                  36
                </Text>
                <Text muted size={12}>
                  {userData.userType == "directeur" ? "Pipelines" : "Orders"}
                </Text>
              </Block>
              <Block middle>
                <Text bold size={12} style={{ marginBottom: 8 }}>
                  5
                </Text>
                <Text muted size={12}>
                  {userData.userType == "directeur"
                    ? "Representant"
                    : "Contact"}
                </Text>
              </Block>
            </Block>

            <Block
              row
              space="between"
              style={{ paddingVertical: 16, alignItems: "baseline" }}
            >
              <Text size={16}>Recently viewed</Text>
              <Text
                size={12}
                color={theme.COLORS.PRIMARY}
                onPress={() => props.navigation.navigate("Home")}
              >
                View All
              </Text>
            </Block>
            <Block row space="between" style={{ flexWrap: "wrap" }}>
              {Images.Viewed.map((img, imgIndex) => (
                <Image
                  source={{ uri: img }}
                  key={`viewed-${img}`}
                  resizeMode="cover"
                  style={styles.thumb}
                />
              ))}
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
      width: width * 1.1,
      height: "auto",
    },
    profileContainer: {
      width: width,
      height: "auto",
      flex: 1,
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
  