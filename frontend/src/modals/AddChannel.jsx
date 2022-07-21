import React, { useEffect, useRef, useState } from 'react';

import { Modal, FormGroup, FormControl } from 'react-bootstrap';

const AddChannel = (props) => {
  const inputEl = useRef(null);
  useEffect(() => {
    inputEl.current.focus();
  });
  const { channels, messages, show, handleClose, socket, store } = props;

  const [channelName, setChannelName] = useState('');
  const [error, setError] = useState('');
  return (
    <Modal show={show}>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const alreadyExists = channels.find(
            (channel) => channel.name === channelName
          );

          if (alreadyExists !== undefined) {
            setError('The channel with this name already exists');
          } else {
            console.log(error);
            socket.emit('newChannel', channelName);
            handleClose();
          }
        }}
      >
        <Modal.Header>
          <Modal.Title>Add new channel</Modal.Title>
          <button
            type='button'
            aria-label='Close'
            data-bs-dismiss='modal'
            className='btn btn-close'
            onClick={handleClose}
          ></button>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <FormControl
              ref={inputEl}
              value={channelName}
              onChange={(e) => {
                e.preventDefault();
                setChannelName(e.target.value);
              }}
            />
            {error && <p className='text-danger'>already exist</p>}
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <input className='btn btn-primary' type='submit' value='submit' />
          <button
            type='button'
            className='btn btn-secondary'
            value='close'
            onClick={handleClose}
          >
            {' '}
            Close{' '}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
export default AddChannel;
