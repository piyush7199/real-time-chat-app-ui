import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  FormControl,
  Input,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../profile/UserBadgeItem";
import axios from "axios";
import { getHeadersConfig } from "../../utility/utility";
import UserListItems from "../sideBar/UserListItems";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchRes, setSearchRes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleRemoveUser = async (removeUser) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      removeUser._id !== user._id
    ) {
      toast({
        title: "Only admin can add someone!",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const body = {
        chatId: selectedChat._id,
        userId: removeUser._id,
      };
      const req = {
        ...getHeadersConfig(user.token),
        data: body,
      };
      console.log(req);
      const { data } = await axios.delete("/api/group/user", req);

      removeUser._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured",
        description: "Failed to remove user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const body = {
        chatId: selectedChat._id,
        chatName: groupChatName,
      };
      const { data } = await axios.put(
        "/api/group",
        body,
        getHeadersConfig(user.token)
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured",
        // description: error.response.msg,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "buttom",
      });
    }
    setRenameLoading(false);
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    console.log(query);
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/user?search=${search}`,
        getHeadersConfig(user.token)
      );
      setSearchRes(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
    setLoading(false);
  };

  const handleAddUser = async (addUser) => {
    if (selectedChat.users.find((u) => u._id === addUser._id)) {
      toast({
        title: "User already in group",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admin can add someone!",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const body = {
        chatId: selectedChat._id,
        userId: addUser._id,
      };
      const { data } = await axios.put(
        "/api/group/user",
        body,
        getHeadersConfig(user.token)
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to Load the add user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontFamily="Work sans"
            fontSize="35px"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => {
                return (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemoveUser(u)}
                  />
                );
              })}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="New Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display="flex">
              <Input
                placeholder={`Add new users to ${selectedChat.chatName}`}
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchRes?.map((u) => {
                return (
                  <UserListItems
                    key={u._id}
                    user={u}
                    handleFunction={() => {
                      handleAddUser(u);
                    }}
                  />
                );
              })
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleRemoveUser(user)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
