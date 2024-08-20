import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { UserFetchRecipient } from "../../hooks/userFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { Send } from "react-bootstrap-icons";
import {  updateUserMessage } from "../../utils/service";

function ChatBox() {
  const { user } = useContext(AuthContext);
  const { currentChat, messages, sendMessage, socket, openedChats, setOpenedChats, getAllUsers,setUpdateMessage ,setMessages} = useContext(ChatContext);
  console.log("======= openedChats =======\n", openedChats);

  const scroll = useRef();

  let { recipientUser ,chat_id} = UserFetchRecipient(currentChat, user);
  let [textMessage, setTextMessage] = useState("");
  const [typing, setTyping] = useState(false);
  console.log("======= typing =======\n", typing);

  useEffect(() => {
    socket.on('userTyping', (data) => {
      setTyping(data);
    });

    return () => {
      socket.off('userTyping');
    };
  }, [socket]);
  const renderMessageTick = useCallback((latestMessage) => {

    if (latestMessage === 'sent') {
      return <span className="text-white">✓</span>;
    } else if (latestMessage === 'delivered') {
      return <span className="text-white">✓✓</span>;
    } else if (latestMessage === 'read') {
      return <span style={{ color: "blue" }}>✓✓</span>;
    }

    return null;
  }, [messages]);
  useEffect(() => {
    let updateStatua = async () => {
      try {

        let res = await updateUserMessage(recipientUser?.user_id, { status: "read" })
        if(res?.data?.data)

        setUpdateMessage(true)
      } catch (error) {

      }
    }
  
    updateStatua()

  }, [recipientUser,openedChats])
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    socket.emit('chatOpened', []);
    setOpenedChats([])
  }, []);



  if (!recipientUser) {

    return (
      <p style={{ width: "100%", textAlign: "center" }}>
        no select conversation yet
      </p>
    );
  }
  let recipientId = currentChat?.members?.find((id) => id != user?.user_id);
  let reci = getAllUsers?.filter((res) => res?.user_id === recipientId)

  let handleChange=(e)=>{
    socket.emit("typing",true,user?.user_id,currentChat?.id)
    setTextMessage(e?.target?.value)
    setTimeout(() => {
      setTyping(false);
      socket.emit('typing', false, user?.user_id,currentChat?.id); 
    }, 1000);
  }

  return (
    <>
      <Stack gop={4} className="chat-box">
        {" "}
        <div className="chat-header">
          <strong>{recipientUser?.user_name}</strong>
        </div>
        <Stack gap={3} className="messages">
          {messages &&
            messages.map((message, index) => (
              <Stack
                key={index}
                className={`${message?.sender_id === user?.user_id
                  ? "message_self align-self-end flex-grow-0"
                  : "message align-self-start flex-grow-0"
                  }`}
                ref={scroll}
              >
                <span>{message?.content}</span>
                <span className="message-footer">
                  {moment(message?.created_date).calendar()}
                </span>
                <span>{renderMessageTick(message?.status)}</span>
              </Stack>
            ))}
        </Stack>
        <Stack
          direction="horizontal"
          gap={3}
          className="chat-input flex-grow-0"
        >
          {" "}
          <InputEmoji
            value={textMessage}
            onChange={handleChange}
            fontFamily="nunito"
            borderColor="rgba(72, 112, 223, 0.2)"
          />
          
          <button
            className="send-btn"
            onClick={() =>
              sendMessage(
                textMessage,
                user?.user_id,
                currentChat?.id,
                "text",
                setTextMessage, reci
              )
            }
          >
            <Send />
          </button>
        </Stack>
      </Stack>
    </>
  );
}
export default ChatBox;