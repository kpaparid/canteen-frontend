import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState();
  const connect = () => {
    const socketIo = io(process.env.BACKEND_URI).connect();
    console.log("connected", socketIo);
    setSocket(socketIo);
    return socketIo;
  };

  useEffect(() => {
    connect();
    return socket?.disconnect();
  }, []);

  const value = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
