import React from "react";
import { ChatState } from "../../context/ChatProvider";
import { getHeadersConfig } from "../../utility/utility";
import { Box, useToast } from "@chakra-ui/react";
import SingleChatBox from "./SingleChatBox";

const ChatInbox = ({ fetchAgain, setFetchAgain }) => {
  const toast = useToast();
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatInbox;
