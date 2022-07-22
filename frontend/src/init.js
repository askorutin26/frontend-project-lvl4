import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App.jsx";

//
import { io } from "socket.io-client";

import store from "./slices/index.js";

import {
  addChannel,
  removeChannel,
  renameChannel,
} from "./slices/channelsSlice.js";

import { addMessage } from "./slices/messagesSlice.js";

import { SocketContext } from "./contexts/index.js";
function app() {
  const socket = io();

  const socketHandlers = {
    newMessage: (message) => socket.emit("newMessage", message),
    newChannel: (channel) => socket.emit("newChannel", channel),
    removeChannel: (channel) => socket.emit("removeChannel", channel),
    renameChannel: (channel) => socket.emit("renameChannel", channel),
  };

  socket.on("newMessage", (message) => {
    const { id, currentChannel, ...rest } = message;
    const name = Object.values(rest).join("");
    const normalizedMessage = { name, id, channel: currentChannel };
    store.dispatch(addMessage(normalizedMessage));
  });

  socket.on("newChannel", (channel) => {
    const { removable, id, ...rest } = channel;
    const name = Object.values(rest).join("");
    const normalizedChannel = {
      name,
      id,
      removable,
    };
    store.dispatch(addChannel(normalizedChannel));
  });

  socket.on("removeChannel", (data) => {
    store.dispatch(removeChannel(data.id));
  });

  socket.on("renameChannel", (data) => {
    console.log(data);
    const { id, removable, name } = data;
    store.dispatch(renameChannel({ id, changes: { removable, name } }));
  });

  const root = ReactDOM.createRoot(document.getElementById("root"));

  root.render(
    <SocketContext.Provider value={socketHandlers}>
      <App />
    </SocketContext.Provider>
  );
}

export default app;
