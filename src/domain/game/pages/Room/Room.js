//Library
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Components
import BoardGame from '../../../game/components/BoardGame/BoardGame';
import UserInfo from '../../../game/components/UserInfo/UserInfo';
import History from '../../../game/components/History/History';
import Chat from '../../../game/components/Chat/Chat';
import { initSocket } from '../../../../shared/utils/socket.io-client';
import AllUser from '../../../game/components/AllUser/AllUser';

//Others
import './Room.css';
import { API } from '../../../../config';
import { Spin } from 'antd';

const Room = (props) => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let socket;
    socket = initSocket(localStorage.getItem('userId'));
    // history.push('/');

    const { roomId } = params;
    setIsLoading(true);
    fetch(`${API}/game/${roomId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setIsLoading(false);
        console.log(response);
        if (response.success) {
          setRoom(response.room);
        } else {
          setNotFound(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });

    return () => {
      socket.disconnect();
    };
  }, [params]);

  let content = (
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-md-6">
          <BoardGame />
        </div>
        <div className="col-lg-4 col-md-4 d-flex flex-column justify-content-between">
          <UserInfo />
          <History />
          {room ? <Chat room={room} /> : null}
        </div>
        <div className="col-lg-2 col-md-2">
          <AllUser />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    content = <Spin style={{ fontSize: '64px' }} />;
  }

  if (notFound) {
    content = <h1>Room not found</h1>;
  }

  return content;
};

export default Room;
