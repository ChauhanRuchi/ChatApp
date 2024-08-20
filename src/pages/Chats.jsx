import { useContext, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/Chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/Chat/PotentialChat";
import ChatBox from "../components/Chat/ChatBox";

function Chats() {
  let { userChats, updateCurrentChat ,onlineUser,setOpenedChats,socket} = useContext(ChatContext);
  let { user } = useContext(AuthContext);

  return (
    <Container className="mt-5">
      {/* display all user and current user not display */}
      <PotentialChats />
      {userChats?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {userChats?.map((item, index) => {
              return (
                <div key={index} onClick={() => updateCurrentChat(item)}>
                  <UserChat chat={item} user={user} />
                </div>
              );
            })}
          </Stack>
          <ChatBox/>
        </Stack>
      )}
    </Container>
  );
}
export default Chats;
