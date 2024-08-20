import { useEffect, useState } from "react";
import { getUser } from "../utils/service";

export const UserFetchRecipient=( chat, user )=> {
  let [recipientUser, setRecipientUser] = useState();
  let recipientId = chat?.members?.find((id) => id != user?.user_id);
  useEffect(() => {
    let getUserData=async()=>{
        if(!recipientId){
            return  null
        }
        else{
            let res= await getUser(recipientId)
            setRecipientUser(res?.data?.data)
            
        }
    }
    getUserData()
  }, [recipientId]);
  return {recipientUser,chat_id:recipientId};
}
