import React, { useEffect, useRef, useState } from 'react';

import { Modal, FormGroup, FormControl } from 'react-bootstrap';

const RenameChannel = (props) => {
  const inputEl = useRef(null);
  useEffect(() => {
    inputEl.current.focus();
  });
  const { channels, messages, showRename, setShowRename, socket, deleteId } =
    props;

  const [channelName, setChannelName] = useState('');
  const [error, setError] = useState('');
  const channelToRename = channels.find(
    (channel) => channel.id === Number(deleteId)
  );

  const alreadyExists = channels.find(
    (channel) => channel.name === channelName
  );
  const { id, removable, ...rest } = channelToRename;
  const name = Object.values(rest).join('');

  return (
    <Modal show={showRename}>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (alreadyExists !== undefined) {
            setError('The channel with this name already exists');
          } else {
            socket.emit('renameChannel', { id: deleteId, name: channelName });
            setShowRename(false);
          }
        }}
      >
        <Modal.Header>
          <Modal.Title>{`Rename channel "${name}"?`}</Modal.Title>
          <button
            type='button'
            aria-label='Close'
            data-bs-dismiss='modal'
            className='btn btn-close'
            onClick={(e) => {
              e.preventDefault();
              setShowRename(false);
            }}
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
          <input className='btn btn-primary' type='submit' value='Submit' />
          <button
            type='button'
            className='btn btn-secondary'
            value='close'
            onClick={(e) => {
              e.preventDefault();
              setShowRename(false);
            }}
          >
            {' '}
            Close{' '}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
export default RenameChannel;
