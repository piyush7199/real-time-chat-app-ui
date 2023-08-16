import React, { useState } from "react";
import axios from "axios";
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
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import ChatLoading from "./ChatLoading";
import UserListItems from "../sideBar/UserListItems";
import { getHeadersConfig } from "../../utility/utility";
import UserBadgeItem from "../profile/UserBadgeItem";

const GroupChatModel = ({ children }) => {
  const toast = useToast();
  const { user, chats, setChats } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchRes, setSearchRes] = useState([]);
  const [loading, setLoading] = useState(false);

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
      setLoading(false);
      setSearchRes(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName) {
      toast({
        title: "Please provide group-name",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (!selectedUsers || selectedUsers.length <= 0) {
      toast({
        title: "Please select users",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      console.log(groupChatName);
      const body = {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      };
      const { data } = await axios.post(
        "/api/group",
        body,
        getHeadersConfig(user.token)
      );
      setChats([data, ...chats]);
      handleOncloseOfModal();
      toast({
        title: "New Group chat created",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "buttom",
      });
    } catch (error) {
      toast({
        title: "Failed to create new Group chat",
        description: error.response.msg,
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "buttom",
      });
    }
  };

  const handleDelete = (deleteUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== deleteUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleOncloseOfModal = () => {
    setLoading(false);
    setSelectedUsers([]);
    setSearch("");
    setSearchRes([]);
    onClose();
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={handleOncloseOfModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users.."
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u) => {
                return (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                );
              })}
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchRes?.slice(0, 4).map((searchedUser) => {
                return (
                  <UserListItems
                    key={searchedUser._id}
                    user={searchedUser}
                    handleFunction={() => handleGroup(searchedUser)}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
