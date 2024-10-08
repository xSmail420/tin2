import { SafeAreaView } from "react-native-safe-area-context";
import ChatList from "../components/ChatList";
import Header from "../components/Header";

const ChatScreen = () => {
  return (
    <SafeAreaView>
      <Header title="Chat" searchEnabled={true} />
      <ChatList />
    </SafeAreaView>
  );
};

export default ChatScreen;
