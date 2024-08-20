// import { useEffect, useState } from "react";
// import { Offline, Online } from "react-detect-offline";

// export const UserFetchStatus = () => {
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   return isOnline
// };
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socketUrl = "http://localhost:3002"; // Adjust URL as needed

export const UserFetchStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const socket = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(socketUrl);

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (socket.current) {
        socket.current.emit('clientStatus', 'online');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (socket.current) {
        socket.current.emit('clientStatus', 'offline');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
