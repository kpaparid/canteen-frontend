import io from "socket.io-client";

export const sio = io(process.env.BACKEND_URI);
