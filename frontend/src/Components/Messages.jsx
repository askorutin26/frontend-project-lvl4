import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

function Messages(props) {
  const {
    username,
    channels,
    currentChannel,
    messages,
    show,
    handleClose,
    handleShow,
  } = props;

  const channelMessages = messages.filter(
    (message) => message.channel === currentChannel
  );

  return channelMessages.map((message) => {
    const { name, id, channel } = message;

    return (
      <div className="text-break mb-2" id={id} key={id}>
        <b>{username && username}</b>: {name}
      </div>
    );
  });
}
export default Messages;
