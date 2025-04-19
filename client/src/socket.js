import { io } from "socket.io-client";

const socket = io("https://whats-on-my-head-server.onrender.com", {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    timeout: 20000,
});

export default socket;