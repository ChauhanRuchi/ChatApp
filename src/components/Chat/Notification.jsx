import { useContext, useState } from "react";
import { ChatFill, ChatLeftFill } from "react-bootstrap-icons";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { UnReadNotificationFun } from "../../utils/unreadNotification";
import moment from "moment";

function Notification() {
  const { user } = useContext(AuthContext);
  let [isOpen,setIsOpen]=useState(false)
  const { notifications, userChats, getAllUsers ,markAllNotificationsAsRead,marNotificationAsRead} = useContext(ChatContext);
  let unreadNotifications = UnReadNotificationFun(notifications);

  let modifiedNotifications = notifications.map((n) => {
    const sender = getAllUsers?.find((user) => user?.user_id === n?.sender_id);
    return {
      ...n,
      sender_name: sender?.user_name
    };
  });
  return (
    <div className="notifications">
      <div className="notifications-icon " style={{ color: "black" }} onClick={()=>setIsOpen(!isOpen)}>
        <ChatLeftFill />
        {unreadNotifications?.length === 0 ? null : (
          <span className="notification-count">
            {" "}
            <span>{unreadNotifications?.length}</span>
          </span>
        )}
      </div>

      {isOpen ? (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div className="mark-as-read" onClick={()=>{markAllNotificationsAsRead(notifications);setIsOpen(false)}}>Mark all as read</div>
          </div>
          {modifiedNotifications?.length === 0 ? (
            <span className="notification">No notification yet..</span>
          ) : null}
          {modifiedNotifications &&
            modifiedNotifications.map((n, index) => {
              return (
                <div
                  key={index}
                  className={
                    n.isRead ? "notification" : "notification not-read"
                  }
                  onClick={()=>marNotificationAsRead(n,userChats,user,notifications)}
                >
                  <span>{`${n.sender_name} sent you a new message`}</span>{" "}
                  <span>{moment(n.date).calendar()}</span>{" "}
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
}
export default Notification;
