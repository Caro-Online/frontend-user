//Library
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Tabs, Spin, Typography } from 'antd';
import { FaTrophy, FaUsers } from 'react-icons/fa';

// Components
import BoardGame from '../../components/BoardGame/BoardGame';
import UserInfo from '../../components/UserInfo/UserInfo';
import History from '../../components/History/History';
import Chat from '../../components/Chat/Chat';
import OnlineUsers from '../../components/OnlineUsers/OnlineUsers';
import TopUsers from '../../components/TopUsers/TopUsers';

//Others
import { getSocket } from '../../../../shared/utils/socket.io-client';
import { API } from '../../../../config';
import './GamePage.css';
import api from '../../apiGame';
import { getUserById } from '../../../user/apiUser';
import { removeItem } from '../../../../shared/utils/utils'

const { TabPane } = Tabs;
const { Title } = Typography;

const GamePage = (props) => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [history, setHistory] = useState(null);
  const [locationToJump, setLocationToJump] = useState(1);
  const [audience, setAudience] = useState([]);

  //Thên user hiện hành vào danh sách ng xem
  const addAudience = useCallback(
    (room) => {
      const userId = localStorage.getItem('userId');
      const join = () => {
        api.joinRoom(userId, params.roomId).then((res) => {
          console.log('join success');
          getUserById(userId).then((res) => {
            setAudience([...audience, res.data.user]);
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
      if (res.data) {
        let socket = getSocket();
        socket.emit('audience-out', { userId })
      }

    });
  }, [params.roomId]);

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
          setAudience(response.room.audience);//add to state
          addAudience(response.room);// add to db
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
          socket.on('new-audience', (message) => {
            console.log(message.userId);
            getUserById(message.userId).then((res) => {
              console.log(res);
              setAudience([...audience, res.data.user]);
            });
          });
          const userId = localStorage.getItem('userId');
          socket.on('audience-out-update', (message) => {
            console.log(message.userId);
            setAudience(removeItem(audience, message.userId));
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
    getRoomInfo();
    return () => {
      removeAudience();
    };
  }, [getRoomInfo, removeAudience]);

  const emitHistory = useCallback((history) => {
    console.log(`emitHistory`, history);
    setHistory(history);
  }, []);

  const jumpTo = useCallback((move) => {
    setLocationToJump(move);
  }, []);

  let content = (
    // <Row>
    //   <Col className="game-board" flex="3 0 500px">
    //     <BoardGame
    //       room={room}
    //       emitHistory={emitHistory}
    //       locationToJump={locationToJump}
    //     />
    //   </Col>
    //   <Col className="game-board" flex="3 0 500px">
    //     <BoardGame
    //       room={room}
    //       emitHistory={emitHistory}
    //       locationToJump={locationToJump}
    //     />
    //   </Col>
    //   <Col flex="1 0 200px">
    //     <UserInfo
    //       roomId={isSuccess ? room.roomId : null}
    //       user={isSuccess ? room.user : null}
    //       audience={isSuccess ? audience : null}
    //     />
    //   </Col>
    //   {/* <Col flex="1 0 200px">
    //     <History history={history} jumpTo={jumpTo} />
    //     {room ? <Chat room={room} /> : null}
    //   </Col> */}
    //   <Col flex="1 0 200px" style={{ padding: '4px 8px' }}>
    //     Online user
    //     <AllUser />
    //   </Col>
    // </Row>
    <Row gutter={8}>
      <Col className="game-board" span={12}>
        <BoardGame
          room={room}
          emitHistory={emitHistory}
          locationToJump={locationToJump}
        />
      </Col>
      <Col span={6}>
        <UserInfo
          roomId={isSuccess ? room.roomId : null}
          user={isSuccess ? room.user : null}
          audience={isSuccess ? audience : null}
        />
      </Col>
      <Col span={6}>
        <Tabs defaultActiveKey="1" type="card" size="middle">
          <TabPane tab="Card Tab 1" key="1">
            Content of card tab 1
          </TabPane>
          <TabPane tab="Card Tab 2" key="2">
            Content of card tab 2
          </TabPane>
          <TabPane
            tab={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaUsers size="24" style={{ marginRight: '8px' }} />
                <Title level={5} style={{ marginBottom: 0, fontSize: '14px' }}>
                  Các kỳ thủ
                </Title>
              </div>
            }
            key="3"
          >
            <Tabs defaultActiveKey="1" type="card" size="small">
              <TabPane
                tab={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaUsers size="24" style={{ marginRight: '8px' }} />
                    <Title
                      level={5}
                      style={{ marginBottom: 0, fontSize: '14px' }}
                    >
                      Người chơi online
                    </Title>
                  </div>
                }
                key="1"
              >
                <OnlineUsers />
              </TabPane>
              <TabPane
                tab={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaTrophy size="24" style={{ marginRight: '8px' }} />
                    <Title
                      level={5}
                      style={{ marginBottom: 0, fontSize: '14px' }}
                    >
                      Người chơi hàng đầu
                    </Title>
                  </div>
                }
                key="2"
              >
                <TopUsers />
              </TabPane>
            </Tabs>
          </TabPane>
        </Tabs>
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
