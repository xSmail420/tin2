import { View, Text, TouchableOpacity } from "react-native";
import { Foundation, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Header = ({ title, callEnabled, searchEnabled , titlecolor}) => {
  const navigation = useNavigation();

  return (
    <View className="p-2 flex-row items-center justify-between">
      <View className="flex flex-row items-center ">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1 rounded-full mr-3 bg-red-200">
          <Ionicons name="chevron-back-outline" size={34} color="#FF5864" />
        </TouchableOpacity>
        {title && <Text className="text-2xl font-bold pl-2" style={{color : titlecolor}}>{title}</Text>}
      </View>

      {callEnabled && (
        <TouchableOpacity className="rounded-full mr-4 p-3 bg-red-200">
          <Foundation name="telephone" size={20} color="#FF5864" />
        </TouchableOpacity>
      )}

      {searchEnabled && (
        <TouchableOpacity
          onPress={() => navigation.navigate("Search")}
          className="rounded-full mr-4 p-3 bg-red-200"
        >
          <Ionicons name="search-outline" size={20} color="#FF5864" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
