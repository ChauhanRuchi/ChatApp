import { Stack } from "react-bootstrap";
import { UserFetchRecipient } from "../../hooks/userFetchRecipient";
import { CheckCircle, CheckCircleFill, PersonCircle } from "react-bootstrap-icons";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { UnReadNotificationFun } from "../../utils/unreadNotification";
import { UserFetchLatestMessage } from "../../hooks/useFetchMessage";
import moment from "moment";

function UserChat({ chat, user }) {
  let { recipientUser } = UserFetchRecipient(chat, user);
  let { onlineUser, notifications, markUserNotiRead } = useContext(ChatContext);
  let { latestMessage } = UserFetchLatestMessage(chat)
  let unreadNotification = UnReadNotificationFun(notifications
  )
  let userNotification = unreadNotification?.filter((res) => res?.sender_id == recipientUser?.user_id)
  const isOnline = onlineUser?.some((u) => u?.user_id === recipientUser?.user_id)
  const trunCateText = (text) => {
    let shortText = text?.substring(0, 20)
    if (text?.length > 20) {
      shortText = shortText + "...."
    }
    return shortText
  }


  return (
    <>
      <Stack
        direction="horizontal"
        gap={3}
        className="user-card align-items-center p-2 justify-content-between"
        role="button"
        onClick={() => {
          if (userNotification?.length !== 0)
            markUserNotiRead(userNotification, notifications);
        }}
      >
        <div className="me-2">
          <PersonCircle />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.user_name}</div>
          <div className="text">{latestMessage?.content && trunCateText(latestMessage?.content)}</div>
        </div>

        <div className="d-flex flex-column align-items-end">
          <div className="date">{moment(latestMessage?.created_date).calendar()}</div>
          <div className={userNotification?.length > 0 ? 'this-user-notifications' : ''}>{userNotification?.length > 0 ? userNotification?.length : ''}</div>
          <span className={isOnline ? "user-online" : ''}></span>
        </div>

      </Stack>
    </>
  );
}
export default UserChat;
