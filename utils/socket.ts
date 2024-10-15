import { io, Socket } from "socket.io-client";

const socket: Socket = io("https://cs2-veto-server.onrender.com"); // Backend URL

export default socket;
