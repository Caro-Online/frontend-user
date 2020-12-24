import React from 'react';
import moment from 'moment';
import { Popover } from 'antd';

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, userId, userName, createdAt }, name }) => {
  let isSentByCurrentUser = false;

  // const trimmedName = name.trim().toLowerCase();

  if (userName === name) {
    isSentByCurrentUser = true;
  }

  // const Year = createdAt.split('-')[0];
  // const createdMonth = createdAt.split('-')[1];
  // const createdDay = createdAt.split('-')[2].split('T')[0];
  // const behindTString = createdAt.split('-')[2].split('T')[1];
  // const createdHour = +behindTString.split(':')[0] + 7;
  // const createdMinute = +behindTString.split(':')[1];
  // const date = [createdDay, createdMonth, Year];
  // const time = [createdHour, createdMinute];
  // console.log(Date.now());
  // console.log(createdAt);
  // console.log(moment(createdAt));

  return isSentByCurrentUser ? (
    <Popover content={<> </>} title="Title" trigger="hover">
      <div className="messageContainer justifyEnd">
        <p className="sentText pr-10">{userName}</p>
        <div className="messageBox backgroundBlue">
          <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
        </div>
      </div>
    </Popover>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
      </div>
      <p className="sentText pl-10 ">{userName}</p>
    </div>
  );
};

export default Message;
