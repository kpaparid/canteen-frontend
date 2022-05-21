// import { io } from "socket.io-client";

import { io } from "socket.io-client";

const { useEffect, useState } = require("react");

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const connect = () => {
    const socketIo = io(process.env.BACKEND_URI).connect();
    console.log("connected", socketIo);
    setSocket(socketIo);
    return socketIo;
  };
  useEffect(() => {
    return socket?.disconnect();
  }, []);

  return { socket, connect };
}
