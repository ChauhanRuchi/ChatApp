export function UnReadNotificationFun(notifications){
    return notifications?.filter((n) => Boolean(n?.isRead)
    ===
    false) 
}


