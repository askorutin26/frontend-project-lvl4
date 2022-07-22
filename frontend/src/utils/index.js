import { useContext } from "react";
import { SocketContext } from "../contexts/index.js";

export const useWebSockets = () => useContext(SocketContext);
