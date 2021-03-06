//Library
import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { MessageFilled } from '@ant-design/icons';

//Components
import InfoBar from './InfoBar/InfoBar';
import InputMessage from './InputMessage/InputMessage';
import Messages from './Messages/Messages';

//Others
import './Chat.css';
import {
  getUserIdFromStorage,
  getUsernameFromStorage,
} from '../../../../shared/utils/utils';

const Chat = ({ room, socket, match }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const messageListener = (message) => {
      setMessages((messages) => [...messages, message]);
    };
    if (socket) {
      const responseMessages = room.chat.map((chat) => {
        return {
          userId: chat.user._id,
          userName: chat.user.name,
          text: chat.content,
          createdAt: chat.createdAt,
        };
      });
      setMessages([...responseMessages]);
      socket.on('message', messageListener);
    }
    return () => {
      socket.off('message', messageListener);
    };
  }, [socket, room.chat]);

  const sendMessage = useCallback(
    (event) => {
      event.preventDefault();

      if (message) {
        if (!match) {
          socket.emit(
            'sendMessage',
            { message, userId: getUserIdFromStorage() },
            () => setMessage('')
          );
        } else {
          socket.emit(
            'sendMessage',
            { message, userId: getUserIdFromStorage(), matchId: match._id },
            () => setMessage('')
          );
        }
      }
    },
    [message, socket]
  );

  return (
    <div className="chat-container">
      <div className="chat-container__body">
        <div className="chat-container__chatbox">
          <div className="chat-container__tab-content">
            <InfoBar room={room} />
            <Messages messages={messages} name={getUsernameFromStorage()} />
            <InputMessage
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    socket: state.auth.socket,
  };
};

export default connect(mapStateToProps)(React.memo(Chat));
