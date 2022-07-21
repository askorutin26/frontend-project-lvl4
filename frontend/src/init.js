// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

//комноненты
import App from './App.jsx';

//

import { io } from 'socket.io-client';

import store from './slices/index.js';

//слайсы
import {
  addChannels,
  addChannel,
  removeChannel,
  renameChannel,
} from './slices/channelsSlice.js';
import { channelsSelectors } from './slices/channelsSlice.js';
import {
  addMessages,
  addMessage,
  deleteMessage,
  renameMessage,
} from './slices/messagesSlice.js';
import { messagesSelectors } from './slices/messagesSlice.js';

import { setCurrentChannel } from './slices/currentChannelSlice.js';

//слайсы
import axios from 'axios';
import routes from './routes.js';

function app() {
  //sockets
  const socket = io();
  console.log(socket);
  socket.on('newMessage', (message) => {
    console.log('SOCKET!!!!');
    console.log(message);
    const { id, currentChannel, ...rest } = message;
    const name = Object.values(rest).join('');
    const normalizedMessage = { name, id, channel: currentChannel };
    store.dispatch(addMessage(normalizedMessage));
  });

  socket.on('deleteMessages', (status) => {});

  socket.on('newChannel', (channel) => {
    const { removable, id, ...rest } = channel;
    const name = Object.values(rest).join('');
    const normalizedChannel = {
      name,
      id,
      removable,
    };

    store.dispatch(addChannel(normalizedChannel));
  });

  socket.on('removeChannel', (data) => {
    store.dispatch(removeChannel(data.id));
  });

  socket.on('renameChannel', (data) => {
    const { id, removable, name } = data;
    store.dispatch(renameChannel({ id, changes: { removable, name } }));
  });
  //sockets
  const root = ReactDOM.createRoot(document.getElementById('root'));

  root.render(<App {...socket} />);
}

export default app;
