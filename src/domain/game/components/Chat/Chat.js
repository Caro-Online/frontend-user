//Library
import React, { useCallback, useState, useEffect } from 'react';
import { MessageFilled } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

//Components
import InfoBar from './InfoBar/InfoBar';
import InputMessage from './InputMessage/InputMessage';
import Messages from './Messages/Messages';

//Others
import './Chat.css';
import { getSocket } from '../../../../shared/utils/socket.io-client';
import {
  getUserIdFromStorage,
  getUsernameFromStorage,
} from '../../../../shared/utils/utils';

const Chat = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let socket = getSocket();
    const responseMessages = room.chat.map((chat) => {
      return {
        userId: chat.user._id,
        userName: chat.user.name,
        text: chat.content,
        createdAt: chat.createdAt,
      };
    });
    setMessages([...responseMessages]);
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, [room]);

  const sendMessage = useCallback(
    (event) => {
      event.preventDefault();

      let socket = getSocket();

      if (message) {
        socket.emit(
          'sendMessage',
          { message, userId: getUserIdFromStorage() },
          () => setMessage('')
        );
      }
    },
    [message]
  );

  return (
    <div className="chat-container">
      <div className="chat-container__header">
        <MessageFilled className="chat-container__messageicon" />
        Trò chuyện
      </div>
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

export default React.memo(Chat);
