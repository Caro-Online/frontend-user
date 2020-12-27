//Library
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Row,
  Col,
  Tabs,
  Spin,
  Typography,
  Descriptions,
  Card,
  Statistic,
} from 'antd';
import { FaTrophy, FaUsers, FaInfoCircle } from 'react-icons/fa';

// Components
import BoardGame from '../../components/BoardGame/BoardGame';
import UserInfo from '../../components/UserInfo/UserInfo';
import History from '../../components/History/History';
import Chat from '../../components/Chat/Chat';
import OnlineUsers from '../../components/OnlineUsers/OnlineUsers';
import TopUsers from '../../components/TopUsers/TopUsers';

//Others
import {
  getSocket,
  initSocket,
} from '../../../../shared/utils/socket.io-client';
import { API } from '../../../../config';
import './GamePage.css';
import api from '../../apiGame';
import { getUserById } from '../../../user/apiUser';
import {
  removeItem,
  addItem,
  getUserIdFromStorage,
  getTokenFromStorage,
} from '../../../../shared/utils/utils';
import { connect } from 'react-redux'

const { TabPane } = Tabs;
const { Title, Text } = Typography;

let socket;
const GamePage = (props) => {
  const params = useParams();
  const { roomId } = params;
  const [isLoading, setIsLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [numPeopleInRoom, setNumPeopleInRoom] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [history, setHistory] = useState(null);
  const [locationToJump, setLocationToJump] = useState(1);
  const [audiences, setAudiences] = useState([]);
  const [match, setMatch] = useState(null)

  //F5 => Init socket 
  useEffect(() => {
    socket = getSocket();
    if (!socket) {
      //Nếu k tồn tại socket (do load lại page)
      socket = initSocket(getUserIdFromStorage());
      return () => {
        socket.disconnect();
      };
    }

  }, []);

  const getCurrentMatch = (idOfRoom) => {
    api.getCurrentMatchByIdOfRoom(idOfRoom).then(res => {
      console.log(res.data)
      setMatch(res.data.match)
    })
  }

  const addAudience = useCallback(
    (audiences) => {
      const userId = getUserIdFromStorage();
      const join = () => {
        api.joinRoom(userId, params.roomId).then((res) => {
          console.log('join success');
          getUserById(userId).then((res) => {
            setAudiences(addItem(audiences, res.data.user));
          });
        });
      };
      //Nếu đã là player thì ko là audience
      let isAu = true; //
      props.players.forEach((player) => {
        if (player._id === userId) {
          isAu = false;
        }
      });
      if (isAu) join(); //tham gia vào audience
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.roomId]
  );

  const removeAudience = useCallback(() => {
    const userId = getUserIdFromStorage();
    api.outRoom(userId, params.roomId).then((res) => {
      console.log('out success');
      if (res.data) {
        if (socket) socket.emit('audience-out', { userId });
      }
    });
  }, [params.roomId]);

  const getRoomInfo = useCallback(() => {
    setIsLoading(true);
    fetch(`${API}/room/${roomId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getTokenFromStorage()}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setIsLoading(false);
        if (response.success) {
          props.setPlayers(response.room.players);
          setNumPeopleInRoom(
            response.room.players.length + response.room.audiences.length
          );
          setRoom(() => {
            // response.room.players = undefined;
            return response.room;
          });
          setIsSuccess(true);
          //add audience, socket new audience
          setAudiences(response.room.audiences); //add to state
          addAudience(response.room.audiences); // add to db
          getCurrentMatch(response.room._id)
          socket = getSocket();
          console.log('Emit join');
          socket.emit(
            'join',
            {
              userId: getUserIdFromStorage(),
              roomId: response.room.roomId,
            },
            (error) => {
              if (error) {
                alert(error);
              }
            }
          );

          //socketListener();
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
  }, [roomId, addAudience]);

  useEffect(() => {
    let socket = getSocket();
    socket.on('new-audience', (message) => {
      console.log(message.userId);
      getUserById(message.userId).then((res) => {
        console.log(res);
        setAudiences([...audiences, res.data.user]);
      });
    });
    socket.on('audience-out-update', (message) => {
      console.log(message.userId);
      setAudiences(removeItem(audiences, message.userId));
    });
  }, [audiences]);

  useEffect(() => {
    getRoomInfo();
    return () => {
      removeAudience();
      // Khi người dùng thoát khỏi room thì emit sự kiện leave room
      let socket = getSocket();
      socket.emit('leave-room', {
        userId: getUserIdFromStorage(),
      });
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
    <Row gutter={8}>
      <Col className="game-board" span={12}>
        <BoardGame
          match={match}
          socket={socket}
          room={room}
          players={props.players}
          emitHistory={emitHistory}
          locationToJump={locationToJump}
        />
      </Col>
      <Col span={6}>
        <UserInfo
          roomId={isSuccess ? room.roomId : null}
          players={isSuccess ? props.players : null}
          audiences={isSuccess ? audiences : null}
        />
      </Col>
      <Col span={6}>
        <Tabs defaultActiveKey="2" type="card" size="middle">
          <TabPane tab="Card Tab 1" key="1">
            Content of card tab 1
          </TabPane>
          <TabPane
            tab={
              <div className="tabpane-main">
                <FaInfoCircle size="24" />
                <Title level={5} style={{ marginBottom: 0, fontSize: '14px' }}>
                  Phòng
                </Title>
              </div>
            }
            key="2"
          >
            {/* Các khán giả trong phòng chơi, nội dung chat, thông tin về phòng chơi */}
            {room ? (
              <>
                <Descriptions
                  style={{ marginTop: '8px' }}
                  title={
                    <div className="tabpane-sub">
                      <FaInfoCircle size="24" style={{ marginRight: '8px' }} />
                      <Title
                        level={5}
                        style={{ marginBottom: 0, fontSize: '14px' }}
                      >
                        Thông tin phòng
                      </Title>
                    </div>
                  }
                  layout="vertical"
                >
                  <Descriptions.Item label="Tên phòng">
                    <Text strong>{room.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số người trong phòng" span={2}>
                    <Statistic value={numPeopleInRoom}></Statistic>
                  </Descriptions.Item>
                  <Descriptions.Item label="Chủ phòng">
                    <Text strong>Tam thoi de trong</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Luật chơi">
                    <Text strong>
                      {room.rule ? 'Chặn 2 đầu' : 'Không chặn 2 đầu'}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Id phòng">
                    <Text strong>{room.roomId}</Text>
                  </Descriptions.Item>
                </Descriptions>
                <Chat room={room} />
              </>
            ) : null}
          </TabPane>
          <TabPane
            tab={
              <div className="tabpane-main">
                <FaUsers size="24" />
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
                  <div className="tabpane-sub">
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
                  <div className="tabpane-sub">
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

const mapStateToProps = (state) => ({
  players: state.game.players
})

const mapDispatchToProps = (dispatch) => ({
  setPlayers: (players) => dispatch({ type: 'SET_PLAYERS', players })
})

export default connect(mapStateToProps, mapDispatchToProps)(GamePage);
