import { createContext, useCallback, useEffect, useState } from "react";
import {
  createChat,
  getUser,
  getUserChat,
  getUserData,
  getUserMessage,
  getUserNotifications,
  sendMessages,
  updateNotification
} from "../utils/service";
import { io } from "socket.io-client";
import { UserFetchStatus } from "../hooks/useFetchStatus";
import { UserFetchRecipient } from "../hooks/userFetchRecipient";
import { BoundingBox } from "react-bootstrap-icons";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  let [userChats, setUseChats] = useState([]);
  let [potentialChats, setPotentialChats] = useState(null);
  let [currentChat, setCurrentChat] = useState(null);
  let [messages, setMessages] = useState([]);
  let [newMessage, setNewMessage] = useState(null);
  let [socket, setSocket] = useState(null);
  let [onlineUser, setOnlineUser] = useState(null);
  let [notifications, setNotifications] = useState([]);
  let [getAllUsers, setAllUsers] = useState([]);
  const [openedChats, setOpenedChats] = useState([]);
  let [recipientUser, setRecipientUser] = useState(null);
  let [updateMessage, setUpdateMessage] = useState(false);

  const data = UserFetchStatus();
  console.log("notification//", notifications);

  useEffect(() => {
    let newSocket = io("http://localhost:3002");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // useEffect(() => {

  //   if (!data) {
  //     let dataa = onlineUser?.filter((res) => res?.user_id != user?.user_id);
  //     socket.emit("getOnlineUsers", dataa);
  //     setOnlineUser(dataa);
  //   }

  //   return () => {
  //     socket?.off("getOnlineUsers");
  //   };
  // }, [data, socket]);
  useEffect(() => {
    let recipientId = currentChat?.members?.find((id) => id != user?.user_id);
    let reci = getAllUsers?.filter((res) => res?.user_id === recipientId);
    setRecipientUser(reci);
  }, [currentChat, messages, getAllUsers]);

  useEffect(() => {
    if (socket === null || user?.user_id === null) return;

    socket?.emit("addNewUser", user?.user_id);

    socket?.on("getOnlineUsers", (res) => {
      setOnlineUser(res);
    });
    return () => {
      socket?.off("getOnlineUsers");
    };
  }, [socket, user]);

  useEffect(() => {
    const getUserChats = async () => {
      try {
        const response = await getUserChat();

        setUseChats(response?.data?.data);

        return response?.data?.data;
      } catch (err) {
        console.error("Error registering user:", err);
      }
    };
    getUserChats();
  }, [user, notifications, onlineUser]);

  useEffect(() => {
    let getNotification = async () => {
      try {
        let res = await getUserNotifications();
        setNotifications(res?.data?.data);
      } catch (error) {}
    };
    getNotification();
  }, []);

  // useEffect(() => {
  //   // Listen for updates to the chat list
  //   socket?.on("updateChatList", (updatedChatList) => {
  //     setUseChats(updatedChatList);
  //   });

  //   return () => {
  //     socket?.off("updateChatList");
  //   };
  // }, [socket]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await getUserData();

        const pChats = response?.data?.data.filter((U) => {
          let isChatCreated = false;
          if (user?.user_id === U?.user_id) return false;

          isChatCreated = userChats?.some((chat) => {
            return (
              chat?.members?.[0] === U?.user_id ||
              chat?.members?.[1] === U?.user_id
            );
          });
          return !isChatCreated;
        });
        setAllUsers(response?.data?.data);
        setPotentialChats(pChats);
      } catch (err) {
        console.error("Error registering user:", err);
      }
    };
    getUser();
  }, [userChats, user]);

  // send message
  useEffect(() => {
    if (socket === null || !newMessage) return;
    const recipientId = currentChat?.members?.find(
      (id) => id !== user?.user_id
    );
    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  useEffect(() => {
    socket?.on("chatOpened1", (data) => {
      setOpenedChats(data);
    });
  }, [socket, currentChat, messages, recipientUser]);

  let updateNotifications = async (items) => {
    try {
      let res = await updateNotification(items);
      return res;
    } catch (error) {}
  };

  // receive message and notification
  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", (res) => {
    console.log("======= res getMessage=======\n", res);
      if (currentChat?.id !== res?.chat_id) return;
      setMessages((prev) => {
        if (!prev.some((msg) => msg.message_id === res.message_id)) {
          return [...prev, res];
        }
        return prev;
      });
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some(
        (id) => id === res.sender_id
      );
      if (isChatOpen) {
        updateNotifications({ items: [{ ...res, isRead: true }] });
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => {
          if (!prev.some((noti) => noti.message_id === res.message_id)) {
            return [res, ...prev];
          }
          return prev;
        });
      }
    });
    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  let createChats = useCallback(async (firstId, secoundId) => {
    try {
      const response = await createChat(firstId, secoundId);
      setUseChats((prev) => [...prev, response?.data?.data]);
    } catch (err) {
      console.error("Error registering user:", err);
    }
  }, []);
  useEffect(() => {
    const getUserMessages = async () => {
      try {
        const response = await getUserMessage(currentChat?.id);

        setMessages(response?.data?.data);

        return response?.data?.data;
      } catch (err) {
        console.error("Error registering user:", err);
      }
    };
    if (typeof currentChat?.id != undefined) {
      getUserMessages();
    }
  }, [currentChat, socket, updateMessage]);

  let sendMessage = useCallback(
    async (
      content,
      sender_id,
      chat_id,
      message_type,
      sendTextMessage,
      recipientUser
    ) => {
      try {
        console.log("call sendmessage api", openedChats, recipientUser[0]);
        const userOnline = onlineUser?.some(
          (user) => user?.user_id === recipientUser[0]?.user_id
        );
        const chatOpen = openedChats?.some(
          (res) =>
            res?.user_id === recipientUser[0]?.user_id &&
            res?.chat_id === chat_id
        );
        console.log(
          "openchat",
          openedChats,
          chatOpen,
          recipientUser[0],
          chatOpen,
          openedChats
        );
        const status = userOnline ? (chatOpen ? "read" : "delivered") : "sent";
        const response = await sendMessages(
          content,
          sender_id,
          chat_id,
          message_type,
          status
        );
        setNewMessage(response?.data?.data);
        sendTextMessage("");
        setMessages((prev) => [...prev, response?.data?.data]);
      } catch (err) {}
    },
    [onlineUser, openedChats]
  );

  let updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const markAllNotificationsAsRead = useCallback((notifications) => {
    let data = notifications?.map((res) => {
      return { ...res, isRead: true };
    });
    updateNotifications({ items: data });
    setNotifications(data);
  }, []);
  const marNotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      //find chat to open

      const desiredChat = userChats?.find((chat) => {
        const chatMember = [user?.user_id, n?.sender_id];
        const idDChat = chat?.members?.every((member) => {
          return chatMember?.includes(member);
        });
        return idDChat;
      });

      //mark notification as read
      const mNotification = notifications?.map((el) => {
        if (n?.sender_id === el?.sender_id) {
          return { ...n, isRead: true };
        } else return el;
      });
      updateCurrentChat(desiredChat);
      updateNotifications({ items: mNotification });

      setNotifications(mNotification);
    }
  );
  useEffect(() => {
    if (
      user?.user_id &&
      !openedChats.some((chat) => chat.user_id === user.user_id) &&
      currentChat?.id
    ) {
      const handleChatOpened = (data) => {
        const updatedChats = [
          ...data,
          { chat_id: currentChat?.id, user_id: user?.user_id }
        ];
        setOpenedChats((prev) => [...prev, ...updatedChats]); // Update the state with new chats
        socket.emit("chatOpened", updatedChats); // Emit the updated chats
      };

      // Listen for the "chatOpened1" event only once
      socket?.once("chatOpened1", handleChatOpened);

      // Emit the initial event to trigger the process
      socket.emit("chatOpened", [
        { chat_id: currentChat?.id, user_id: user?.user_id }
      ]);

      // Cleanup the socket listener when the component unmounts or dependencies change
      return () => {
        socket?.off("chatOpened1", handleChatOpened);
      };
    }
  }, [socket, currentChat, user, openedChats]);

  const markUserNotiRead = useCallback((thisUserNoti, notification) => {
    console.log("usernotiiii1", thisUserNoti, notification);

    const mNoti = notification?.map((n) => {
      let noti = n; // Start with the original notification

      thisUserNoti?.forEach((el) => {
        if (n?.sender_id === el?.sender_id) {
          noti = { ...el, isRead: true }; // Mark as read if sender_id matches
        }
      });

      return noti; // Return the processed notification
    });

    console.log("usernotiiii", mNoti);

    updateNotifications({ items: mNoti });
    setNotifications(mNoti);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        potentialChats,
        createChats,
        updateCurrentChat,
        messages,
        currentChat,
        sendMessage,
        onlineUser,
        notifications,
        getAllUsers,
        markAllNotificationsAsRead,
        marNotificationAsRead,
        markUserNotiRead,
        socket,
        openedChats,
        setOpenedChats,
        setUpdateMessage,
        setMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
