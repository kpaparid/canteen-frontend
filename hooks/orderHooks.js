// import { io } from "socket.io-client";

import { io } from "socket.io-client";

const { useEffect, useState } = require("react");

export function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const k = process.env.BACKEND_URI;
    console.log(k);
    const socketIo = io(process.env.BACKEND_URI).connect();

    setSocket(socketIo);
    console.log("setting socket", socketIo);
    function cleanup() {
      socketIo.disconnect();
    }
    return cleanup;
  }, []);

  return socket;
}
