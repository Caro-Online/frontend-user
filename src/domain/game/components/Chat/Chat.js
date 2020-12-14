//Library
import React, { useCallback, useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { MessageFilled } from '@ant-design/icons';

//Components
import InfoBar from './InfoBar/InfoBar';
import InputMessage from './InputMessage/InputMessage';
import Messages from './Messages/Messages';
//Others
import './Chat.css';
import { getSocket } from '../../../../shared/utils/socket.io-client';
import { useLocation } from 'react-router-dom';
import { API } from '../../../../config';

let socket;

export default function Chat({ room }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    socket = getSocket();
    socket.emit(
      'join',
      { userId: localStorage.getItem('userId'), roomId: room.roomId },
      (error) => {
        if (error) {
          alert(error);
        }
      }
    );
  }, [location, room]);

  useEffect(() => {
    socket = getSocket();
    const responseMessages = room.chat.map((chat) => {
      return {
        userId: chat.user._id,
        userName: chat.user.name,
        text: chat.content,
      };
    });
    setMessages([...responseMessages]);

    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, [room]);

  const sendMessage = (event) => {
    event.preventDefault();

    socket = getSocket();

    if (message) {
      socket.emit(
        'sendMessage',
        { message, userId: localStorage.getItem('userId') },
        () => setMessage('')
      );
    }
  };

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
            <Messages
              messages={messages}
              name={localStorage.getItem('userName')}
            />
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
}
