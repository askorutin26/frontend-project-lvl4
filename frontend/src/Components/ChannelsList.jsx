import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import SubmitDelete from '../modals/SubmitDelete.jsx';
import RenameChannel from '../modals/RenameChannel.jsx';
import { setCurrentChannel } from '../slices/currentChannelSlice.js';

function ChannelsList(props) {
  const {
    channels,
    messages,
    currentChannel,
    show,
    handleClose,
    handleShow,
    socket,
  } = props;

  const [showDelete, setShowRemove] = useState(false);
  const [showRename, setShowRename] = useState(false);

  const [deleteId, setId] = useState('');
  const submitProps = {
    channels,
    messages,
    currentChannel,
    showDelete,
    showRename,
    setShowRemove,
    setShowRename,
    socket,
    deleteId,
  };
  const dispatch = useDispatch();

  return channels.map((channel) => {
    const { removable, id, name } = channel;
    const isActive = currentChannel === id ? true : false;

    const btnClass = cn(
      'btn',
      'w-100',
      'rounded-0',
      'text-start',
      'text-truncate',
      {
        'btn-secondary': isActive,
      }
    );
    return (
      <li id={id} key={id} className='nav-item w-100'>
        {showDelete && <SubmitDelete {...submitProps} />}
        {showRename && <RenameChannel {...submitProps} />}
        {removable ? (
          <div role='group' className='d-flex dropdown btn-group'>
            <button
              type='button'
              className={btnClass}
              onClick={(e) => {
                e.preventDefault();
                console.log('clicked');

                dispatch(setCurrentChannel(id));
              }}
            >
              {name}
            </button>
            <button
              type='button'
              className={`${
                isActive ? 'btn-secondary' : null
              } flex-grow-0 dropdown-toggle dropdown-toggle-split btn`}
              data-toggle='dropdown'
              aria-haspopup='true'
              aria-expanded='false'
            >
              <span className='visually-hidden'>Toggle Dropdown</span>
            </button>
            <div className='dropdown-menu'>
              <button
                className='dropdown-item'
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  const channelId = Number(e.target.closest('li').id);
                  console.log(channelId);
                  setId(channelId);
                  setShowRemove(true);
                }}
              >
                Delete
              </button>
              <button
                className='dropdown-item'
                onClick={(e) => {
                  e.preventDefault();
                  const channelId = e.target.closest('li').id;
                  setShowRename(true);
                  setId(channelId);
                }}
              >
                Rename
              </button>
            </div>
          </div>
        ) : (
          <button
            id={id}
            type='button'
            className={btnClass}
            onClick={(e) => {
              e.preventDefault();
              dispatch(setCurrentChannel(id));
            }}
          >
            <span className='me-1'>#</span>
            {name}
          </button>
        )}
      </li>
    );
  });
}

export default ChannelsList;
