import React from 'react';
import { Tooltip } from 'antd';

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, userId, userName, createdAt }, name }) => {
  // const Message = ({ message, name }) => {
  let isSentByCurrentUser = false;

  // const trimmedName = name.trim().toLowerCase();

  if (userName === name) {
    isSentByCurrentUser = true;
  }
  let year, createdMonth, createdDay, createdHour, createdMinute, date, time;
  if (!(userName === 'admin' && !userId)) {
    year = createdAt.split('-')[0];
    createdMonth = createdAt.split('-')[1];
    createdDay = createdAt.split('-')[2].split('T')[0];
    const behindTString = createdAt.split('-')[2].split('T')[1];
    createdHour = +behindTString.split(':')[0] + 7;
    createdMinute = +behindTString.split(':')[1];
    if (createdMonth < 10) {
      createdMonth = '0' + createdMonth;
    }
    if (createdDay < 10) {
      createdDay = '0' + createdDay;
    }
    if (createdHour < 10) {
      createdHour = '0' + createdHour;
    }
    if (createdMinute < 10) {
      createdMinute = '0' + createdMinute;
    }
    date = [createdDay, createdMonth, year];
    time = [createdHour, createdMinute];
  }

  return isSentByCurrentUser ? (
    <Tooltip
      placement="right"
      title={<span>{date.join('-') + ' ' + time.join(':')}</span>}
      trigger="hover"
    >
      <div className="messageContainer justifyEnd">
        <p className="sentText pr-10">{userName}</p>
        <div className="messageBox backgroundBlue">
          <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
        </div>
      </div>
    </Tooltip>
  ) : (
    <>
      {!userId && userName === 'admin' ? (
        <div className="messageContainer justifyStart">
          <div className="messageBox backgroundLight">
            <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
          </div>
          <p className="sentText pl-10 ">{userName}</p>
        </div>
      ) : (
        <Tooltip
          placement="left"
          title={<span>{date.join('-') + ' ' + time.join(':')}</span>}
          trigger="hover"
        >
          <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
              <p className="messageText colorDark">
                {ReactEmoji.emojify(text)}
              </p>
            </div>
            <p className="sentText pl-10 ">{userName}</p>
          </div>
        </Tooltip>
      )}
    </>
  );
};

export default React.memo(Message);
