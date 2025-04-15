import { io } from "socket.io-client";

const socket = io("https://whats-on-my-head-server.onrender.com"); // Your deployed backend

export default socket;