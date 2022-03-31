// import { io } from "socket.io-client";

import { io } from "socket.io-client";

const { useEffect, useState } = require("react");

export function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIo = io("http://localhost:3005").connect();

    setSocket(socketIo);
    console.log("setting socket", socketIo);
    function cleanup() {
      socketIo.disconnect();
    }
    return cleanup;

    // should only run once and not on every re-render,
    // so pass an empty array
  }, []);

  return socket;
}
