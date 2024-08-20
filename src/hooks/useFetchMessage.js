import { useContext, useEffect, useState } from "react";
import { getUserMessage } from "../utils/service";
import { ChatContext } from "../context/ChatContext";

export const UserFetchLatestMessage=( chat, user )=> {
  let [latestMessage, setLatestMessage] = useState();
  let {notifications,newMessage}=useContext(ChatContext)
  let recipientId = chat?.members?.find((id) => id != user?.user_id);
  useEffect(() => {
    const getUserMessages = async () => {
        try {
          const response = await getUserMessage(chat?.id);
          setLatestMessage(response?.data?.data[response?.data?.data?.length-1])
  
          return response?.data?.data;
        } catch (err) {
        }
      };
      if(typeof chat?.id !=undefined)
      getUserMessages();
  }, [notifications,newMessage]);
  return {latestMessage};
}
