import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/sideBar/SideDrawer";
import ChatInbox from "../components/chatBox/ChatInbox";
import ChatContacts from "../components/chatBox/ChatContacts";

const ChatPage = () => {
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <ChatContacts />}
        {user && <ChatInbox />}
      </Box>
    </div>
  );
};

export default ChatPage;
