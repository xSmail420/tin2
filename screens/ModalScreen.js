import { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const ModalScreen = () => {
  const { user } = useAuth();
  const [image, setImage] = useState("");
  const [job, setJob] = useState("");
  const [age, setAge] = useState(0);
  const navigation = useNavigation();

  const incompleteForm = !job || !age;

  const updateUserProfile = async () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image == "" || !image.includes("https://")? user.photoURL:image,
      job: job,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => navigation.navigate("Home"))
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View className="flex-1 items-center pt-7  h-auto">
      <Image
        className="h-20 w-full"
        resizeMode="contain"
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtSJ64vmb3nxIWURqS_MJo92BLXbqnidjD9EGb5IheFtNheIR6zPZXl-NDmBSZv6JD_Ds&usqp=CAU",
        }}
      />
      <Text className="text-xl text-gray-500 p-2 font-bold">
        Welcome {user.displayName}
      </Text>

      {/* 1 FIRST STEP - IMAGE PICK */}
      <Text className="text-center p-4 font-bold text-red-400 text-4xl">
        Step 1: The Profile Pic
      </Text>
      <View>
        <TextInput
          placeholder="update Profile pic (url)"
          className="text-center text-xl pb-2"
          value={image}
          onChangeText={setImage}
        />
      </View>

      {/* 2  STEP - JOB */}
      <Text className="text-center p-4 font-bold text-red-400 text-4xl">
        Step 2: The Job
      </Text>
      <View>
        <TextInput
          placeholder="Enter your job"
          className="text-center text-xl pb-2"
          value={job}
          onChangeText={setJob}
        />
      </View>

      {/* 3 STEP - AGE */}
      <Text className="text-center p-4 font-bold text-red-400 text-4xl">
        Step 3: The Age
      </Text>
      <View>
        <TextInput
          placeholder="Enter your age"
          className="text-center text-xl pb-2"
          value={age}
          onChangeText={setAge}
          maxLength={2}
          keyboardType="numeric"
        />
      </View>

      {/* UPDATE PROFILE BUTTON */}
      <TouchableOpacity
        disabled={incompleteForm}
        className={`w-64 p-3 rounded-xl absolute bottom-10 ${
          incompleteForm ? "bg-gray-400" : "bg-[#FF5864]"
        }`}
        onPress={updateUserProfile}
      >
        <Text className="text-center font-semibold">Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
