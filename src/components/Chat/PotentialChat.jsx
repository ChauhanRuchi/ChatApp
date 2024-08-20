import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChats, onlineUser } = useContext(ChatContext);

  return (
    <div className="all-users">
      {potentialChats &&
        potentialChats?.map((u, index) => {
          return (
            <>
              <div
                className="single-user"
                key={index}
                onClick={() => createChats(user?.user_id, u?.user_id)}
              >
                {" "}
                {u?.user_name}
                <span
                  className={
                    onlineUser?.some((user) => user?.user_id === u?.user_id)
                      ? "user-online"
                      : ""
                  }
                ></span>{" "}
              </div>
            </>
          );
        })}
    </div>
  );
};
export default PotentialChats;
