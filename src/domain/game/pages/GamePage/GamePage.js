//Library
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Components
import BoardGame from '../../components/BoardGame/BoardGame';
import UserInfo from '../../components/UserInfo/UserInfo';
import History from '../../components/History/History';
import Chat from '../../components/Chat/Chat';
import {
  initSocket,
  getSocket,
} from '../../../../shared/utils/socket.io-client';
import AllUser from '../../components/AllUser/AllUser';
//Others
import { API } from '../../../../config';
import './GamePage.css';
import { Row, Col } from 'antd';
import { Spin } from 'antd';
import api from '../../apiGame';
import { getUserById } from '../../../user/apiUser';

const GamePage = (props) => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [history, setHistory] = useState(null);
  const [locationToJump, setLocationToJump] = useState(1);
  const [render, setRender] = useState(false);

  //Thên user hiện hành vào danh sách ng xem
  const addAudience = useCallback(
    (room) => {
      const userId = localStorage.getItem('userId');
      const join = () => {
        api.joinRoom(userId, params.roomId).then((res) => {
          console.log('join success');
          setRoom((room) => {
            room.audience.push(userId);
            console.log(room);
            return room;
          });
        });
      };

      if ((room.user.u1.userRef._id !== userId) & !room.user.u2) {
        join();
      }
      if (room.user.u2) {
        if (
          room.user.u1.userRef._id !== userId &&
          room.user.u2.userRef._id !== userId
        ) {
          join();
        }
      }
    },
    [params.roomId]
  );

  const removeAudience = useCallback(() => {
    const userId = localStorage.getItem('userId');
    api.outRoom(userId, params.roomId).then((res) => {
      console.log('out success');
    });
  }, [params.roomId]);

  // Người xem Join room socket
  // const socketListener = useCallback(() => {
  //   let socket = getSocket();
  //   socket.emit(
  //     'join',
  //     { userId: localStorage.getItem('userId'), roomId: room.roomId },
  //     (error) => {
  //       if (error) {
  //         alert(error);
  //       }
  //     }
  //   );
  //   socket.on('newaudience', (message) => {
  //     console.log(message);
  //     // getUserById(message).then(res => {
  //     //   console.log(res)
  //     //   res.data.room.audience.push(userId)
  //     //   setRoom(res.data.room)
  //     // })
  //   });
  // }, [room]);

  const getRoomInfo = useCallback(() => {
    const { roomId } = params;
    setIsLoading(true);
    fetch(`${API}/room/${roomId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setIsLoading(false);
        console.log(response);
        if (response.success) {
          setRoom(response.room);
          console.log(response.room);
          setIsSuccess(true);
          //add audience, socket new audience
          addAudience(response.room);
          let socket = getSocket();
          socket.emit(
            'join',
            {
              userId: localStorage.getItem('userId'),
              roomId: response.room.roomId,
            },
            (error) => {
              if (error) {
                alert(error);
              }
            }
          );
          socket.on('newaudience', (message) => {
            console.log(message);
            // getUserById(message).then(res => {
            //   console.log(res)
            //   res.data.room.audience.push(userId)
            //   setRoom(res.data.room)
            // })
          });
          // socketListener();
        } else {
          setNotFound(true);
          setIsSuccess(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setIsSuccess(false);
      });
  }, [addAudience, params]);

  useEffect(() => {
    let socket;
    // socket = initSocket(localStorage.getItem('userId'));
    socket = getSocket();
    getRoomInfo();

    // return () => {
    //Không dùng socket.disconnect(), vì khi out khỏi GamePage component sẽ mất instance socket => user sẽ bị offline mặc dù vẫn đang online
    //   socket.disconnect();
    //Nên emit sự kiện outRoom ở đây và lắng nghe trên server
    //   removeAudience();
    // };
  }, [getRoomInfo, removeAudience]);

  const emitHistory = useCallback((history) => {
    console.log(`emitHistory`, history);
    setHistory(history);
  }, []);

  const jumpTo = useCallback((move) => {
    setLocationToJump(move);
  }, []);

  let content = (
    <Row>
      <Col className="game-board" flex="3 0 500px">
        <BoardGame emitHistory={emitHistory} locationToJump={locationToJump} />
      </Col>
      <Col flex="1 0 200px">
        <UserInfo
          roomId={isSuccess ? room.roomId : null}
          user={isSuccess ? room.user : null}
          audience={isSuccess ? room.audience : null}
        />
      </Col>
      <Col flex="1 0 200px">
        <History history={history} jumpTo={jumpTo} />
        {room ? <Chat room={room} /> : null}
      </Col>
      <Col flex="1 0 200px" style={{ padding: '4px 8px' }}>
        Online user
        <AllUser />
      </Col>
    </Row>
  );

  if (isLoading) {
    content = <Spin style={{ fontSize: '64px' }} />;
  }

  if (notFound) {
    content = <h1>Room not found</h1>;
  }

  return content;
};

export default GamePage;
