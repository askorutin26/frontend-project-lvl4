import React from 'react';
import { Modal } from 'react-bootstrap';
import { Provider, useDispatch, useSelector, batch } from 'react-redux';
import { setCurrentChannel } from '../slices/currentChannelSlice.js';
const SubmitDelete = (props) => {
  const dispatch = useDispatch();

  const {
    channels,
    messages,
    showDelete,
    showRename,
    setShowRemove,
    setShowRename,
    socket,
    deleteId,
  } = props;

  const channelToDelete = channels.find((channel) => channel.id === deleteId);
  const name = (
    <p className='font-weight-bold'>{`"${channelToDelete.name}"`}</p>
  );
  console.log(channels);

  return (
    <Modal show={showDelete}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          socket.emit('removeChannel', { id: deleteId });
          dispatch(setCurrentChannel(1));
          setShowRemove(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>Submit deletion</Modal.Title>
          <button
            type='button'
            aria-label='Close'
            data-bs-dismiss='modal'
            className='btn btn-close'
            onClick={(e) => {
              e.preventDefault();
              setShowRemove(false);
            }}
          ></button>
        </Modal.Header>
        <Modal.Body>
          <h4 className='font-weight-normal'>
            {' '}
            Are you sure you want to delete channel: {name}{' '}
          </h4>
        </Modal.Body>
        <Modal.Footer>
          <input className='btn btn-primary' type='submit' value='submit' />
          <button
            type='button'
            className='btn btn-secondary'
            value='close'
            onClick={(e) => {
              e.preventDefault();
              setShowRemove(false);
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

export default SubmitDelete;
