import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, batch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import axios from "axios";

import { useWebSockets } from "../utils/index.js";

import routes from "../routes.js";
import AddChannel from "../modals/AddChannel.jsx";
import ChannelList from "./ChannelsList.jsx";
import Messages from "./Messages.jsx";
//slices
import { addChannels } from "../slices/channelsSlice.js";
import { channelsSelectors } from "../slices/channelsSlice.js";
import { addMessages } from "../slices/messagesSlice.js";
import { messagesSelectors } from "../slices/messagesSlice.js";
import { setCurrentChannel } from "../slices/currentChannelSlice.js";
//slices
function Chat(socketHandlers) {
  const { newMessage } = useWebSockets();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");

  const [show, setShow] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [username, setUsername] = useState("");
  const [loggedIn, setLogged] = useState(false);

  const channels = useSelector(channelsSelectors.selectAll);
  const messages = useSelector(messagesSelectors.selectAll);
  const currentChannel = useSelector((state) => state.currentChannel).id
    .payload;

  const currentChannelName = currentChannel
    ? channels.find((channel) => channel.id === currentChannel).name
    : null;

  const componentProps = {
    username,
    currentChannel,
    channels,
    messages,
    show,
    handleClose,
    handleShow,
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const username = localStorage.getItem("username");
      setUsername(username);
      setLogged(true);
      navigate("/");
    } else {
      navigate("/login");
    }
    const header = { Authorization: `Bearer ${token}` };
    const path = routes.dataPath();
    axios
      .get(path, { headers: header })
      .then((response) => {
        const { data } = response;
        const { channels, messages, currentChannelId } = data;

        const normilizedChannels = channels.map((channel) => {
          const { id, name, removable, ...rest } = channel;
          const normalizedName = !name ? Object.values(rest).join("") : name;
          return { id, name: normalizedName, removable };
        });

        const normalizedMessages = messages.map((message) => {
          const { currentChannel, id, ...rest } = message;
          const messageText = Object.values(rest).join("");
          return { name: messageText, id, channel: currentChannel };
        });

        batch(() => {
          dispatch(addChannels(normilizedChannels));
          dispatch(addMessages(normalizedMessages));
          dispatch(setCurrentChannel(currentChannelId));
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">
                Chat
              </a>
              <button
                type="button"
                to="/login"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  if (loggedIn) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    setLogged(false);
                    navigate("/login");
                  }
                }}
              >
                {loggedIn ? "Log Out" : "Log In"}
              </button>
            </div>
          </nav>
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row">
              <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
                <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
                  <span>Channels</span>
                  <button
                    type="button"
                    className="p-0 text-primary btn btn-group-vertical"
                    onClick={(e) => {
                      e.preventDefault();
                      setShow(true);
                    }}
                  >
                    +
                  </button>
                </div>
                <ul className="nav flex-column nav-pills nav-fill px-2">
                  {channels && <ChannelList {...componentProps} />}
                </ul>
              </div>
              <div className="col p-0 h-100">
                <div className="d-flex flex-column h-100">
                  <div className="bg-light mb-4 p-3 shadow-sm small">
                    <p className="m-0">
                      {currentChannelName && <b># {currentChannelName}</b>}
                    </p>
                    <span className="text-muted"> messages count</span>
                  </div>
                  <div
                    id="messages-box"
                    className="chat-messages overflow-auto px-5"
                  >
                    {messages && <Messages {...componentProps} />}
                  </div>
                  <div className="mt-auto px-5 py-3">
                    <form
                      noValidate
                      className="py-1 border rounded-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const data = { ...message, currentChannel };
                        newMessage(data);
                        setMessage("");
                      }}
                    >
                      <div className="input-group has-validation">
                        <input
                          name="body"
                          aria-label="new message"
                          placeholder="enter your message..."
                          className="border-0 p-0 ps-2 form-control"
                          value={message}
                          onChange={(e) => {
                            e.preventDefault();
                            setMessage(e.target.value);
                          }}
                        />
                        <button
                          type="submit"
                          className="btn btn-primary btn-group-vertical"
                        >
                          submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {show && <AddChannel {...componentProps} />}
          </div>
        </div>
      </div>
    </>
  );
}
export default Chat;
