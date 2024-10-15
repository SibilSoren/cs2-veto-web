import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:5000"); // Backend URL

export default socket;
