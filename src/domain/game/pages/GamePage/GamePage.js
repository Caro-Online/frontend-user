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
  const [roomID, setRoomId] = useState(null);
  const [numPeopleInRoom, setNumPeopleInRoom] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [locationToJump, setLocationToJump] = useState(1);
  const [audiences, setAudiences] = useState([]);
  const [history, setHistory] = useState([]);
  const [players, setPlayers] = useState(null)
  const [xIsNext, setXIsNext] = useState(true);
  const [match, setMatch] = useState(null)

  //F5 => Init socket - Don't comment it
  useEffect(() => {
    socket = getSocket();
    if (!socket) {
      //Nếu k tồn tại socket (do load lại page) .
      socket = initSocket(getUserIdFromStorage());
      return () => {
        socket.disconnect();
      };
    }

  }, []);

  const getCurrentMatch = (idOfRoom) => {
    console.log("get curr match")
    api.getCurrentMatchByIdOfRoom(idOfRoom)
      .then(res => {//lần promise thứ 2 k set state đc
        console.log(res.data)// k hiển thị
        if (res.data.match) {
          setMatch(res.data.match)
          setHistory(res.data.match.history);
          setXIsNext(res.data.match.xIsNext);
          setPlayers(res.data.match.players)
        }

      })
  }

  const addAudience = useCallback(
    (audiences) => {
      const userId = getUserIdFromStorage();
      const join = () => {
        api.joinRoom(userId, params.roomId).then((res) => {
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
      if (res.data) {
        if (socket) socket.emit('audience-out', { userId });
      }
    });
  }, [params.roomId]);

  const getRoomInfo = useCallback(() => {
    setIsLoading(true);
    api.getRoomInfoById(roomId)
      .then((response) => {
        setIsLoading(false);
        if (response.data) {
          console.log(response.data.room.players)
          getCurrentMatch(response.data.room._id)
          setNumPeopleInRoom(
            response.data.room.players.length + response.data.room.audiences.length
          );
          setRoom(() => {
            // response.room.players = undefined;
            return response.data.room;
          });
          setRoomId(response.data.room.roomId)
          setIsSuccess(true);
          //add audience, socket new audience
          setAudiences(response.data.room.audiences); //add to state
          addAudience(response.data.room.audiences); // add to db
          //get cur match

          socket = getSocket();
          socket.emit(
            'join',
            {
              userId: getUserIdFromStorage(),
              roomId: response.data.room.roomId,
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
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [roomId, addAudience]);

  useEffect(() => {
    let socket = getSocket();
    socket.on('new-audience', (message) => {
      getUserById(message.userId).then((res) => {
        setAudiences([...audiences, res.data.user]);
      });
    });
    socket.on('audience-out-update', (message) => {
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
    setHistory(history);
  }, []);

  const jumpTo = useCallback((move) => {
    setLocationToJump(move);
  }, []);

  let content = (
    <Row gutter={8}>
      {console.log(props.history)}
      {console.log("gamepage")}
      <Col className="game-board" span={12}>
        <BoardGame
          matchId={match ? match._id : null}
          socket={socket}
          room={room}
          history={history}
          setHistory={setHistory}
          xIsNext={xIsNext}
          setXIsNext={setXIsNext}
          players={players}
          setPlayers={setPlayers}
        />
      </Col>
      <Col span={6}>
        <UserInfo
          roomId={roomID}
          players={players}
          setPlayers={setPlayers}
          audiences={audiences}
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

// const mapStateToProps = (state) => ({
//   players: state.game.players,
//   xIsNext: state.game.xIsNext,
//   history: state.game.history
// })

// const mapDispatchToProps = (dispatch) => ({
//   setPlayers: (players) => dispatch({ type: 'SET_PLAYERS', players }),
//   setXIsNext: (xIsNext) => dispatch({ type: 'SET_XISNEXT', xIsNext }),
//   setHistory: (history) => dispatch({ type: 'SET_HISTORY', history })
// })

//export default connect(mapStateToProps, mapDispatchToProps)(GamePage);
export default (GamePage);
