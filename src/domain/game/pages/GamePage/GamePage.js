//Library
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Row,
  Col,
  Tabs,
  Spin,
  Typography,
  Descriptions,
  // Card,
  Statistic,
} from 'antd';
import { FaTrophy, FaUsers, FaInfoCircle } from 'react-icons/fa';

// Components
import BoardGame from '../../components/BoardGame/BoardGame';
import UserInfo from '../../components/UserInfo/UserInfo';
// import History from '../../components/History/History';
import Chat from '../../components/Chat/Chat';
import OnlineUsers from '../../components/OnlineUsers/OnlineUsers';
import TopUsers from '../../components/TopUsers/TopUsers';

//Others
import { getSocket } from '../../../../shared/utils/socket.io-client';
import { API } from '../../../../config';
import './GamePage.css';
import api from '../../apiGame';
import { getUserById } from '../../../user/apiUser';
import {
  removeItem,
  addItem,
  getUserIdFromStorage,
} from '../../../../shared/utils/utils';
import { connect } from 'react-redux';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const GamePage = (props) => {
  const params = useParams();
  const location = useLocation();
  const { roomId } = params;
  const { socket } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [idOfRoom, setIdOfRoom] = useState(null);
  const [numPeopleInRoom, setNumPeopleInRoom] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [locationToJump, setLocationToJump] = useState(1);
  const [audiences, setAudiences] = useState([]);
  const [history, setHistory] = useState([]);
  const [players, setPlayers] = useState([]);
  const [xIsNext, setXIsNext] = useState(null);
  const [match, setMatch] = useState(null);

  const getCurrentMatch = useCallback(
    (idOfRoom) => {
      console.log('get curr match');
      api.getCurrentMatchByIdOfRoom(idOfRoom).then((res) => {
        console.log(res.data);
        if (res.data.success) {
          setMatch(res.data.match);
          // setHistory(res.data.match.history);
          // setXIsNext(res.data.match.xIsNext);
          //setPlayers(res.data.match.players);
          return true;
        }
        return false;
      });
    },
    [roomId]
  );

  const addAudience = useCallback(
    async () => {
      const userId = getUserIdFromStorage();
      try {
        await api.joinRoom(userId, roomId);
      } catch (error) {
        console.log(error);
        alert(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roomId]
  );

  const getRoomInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.getRoomInfoById(roomId);
      const { room, success } = response.data;
      setIsLoading(false);
      if (success) {
        setPlayers(room.players);
        setIdOfRoom(room._id);
        setAudiences(room.audiences);
        setNumPeopleInRoom(room.players.length + room.audiences.length);
        setRoom(room);
        setIsSuccess(true);
        getCurrentMatch(room._id);
        if (socket) {
          socket.emit(
            'join',
            {
              userId: getUserIdFromStorage(),
              roomId: room.roomId,
            },
            (error) => {
              if (error) {
                alert(error);
              }
            }
          );
        }
      } else {
        setNotFound(true);
        setIsSuccess(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsSuccess(false);
    }
  }, [roomId, setPlayers, socket]);

  useEffect(() => {
    // socket.on('new-audience', ({ user }) => {
    //   setAudiences([...audiences, user]);
    // });
    if (socket) {
      socket.on('room-data', ({ room }) => {
        console.log(room);
        setAudiences(room.audiences);
        setRoom(room);
        setNumPeopleInRoom(room.players.length + room.audiences.length);
        setPlayers(room.players);
      });
    }
  }, [audiences, setPlayers, socket]);

  useEffect(() => {
    socket.on('match-start-update', async ({ matchId }) => {
      console.log('match-start-update');
      const res = await api.getMatchById(matchId);
      console.log(matchId);
      setMatch(res.data.match);
    });
    // socket.on('join-players-queue-update', async ({ userId }) => {
    //   console.log('join-players-queue-update');
    //   const res = await getUserById(userId);
    //   setPlayers([...players, { user: res.data.user, isReady: true }]);
    // });
  }, [players, socket]);

  useEffect(() => {
    async function doStuff() {
      // Nếu là người tạo phòng thì ko add vào audiences , còn lại add vào audiences của phòng trong db
      if (!location.state) {
        await addAudience();
      }
      // Lấy thông tin của phòng về để set state
      getRoomInfo();
    }
    doStuff();
    return () => {
      // Khi người dùng thoát khỏi room thì emit sự kiện leave room
      if (socket) {
        socket.emit('leave-room', {
          userId: getUserIdFromStorage(),
        });
      }
    };
  }, [getRoomInfo, addAudience, location, socket]);

  const emitHistory = useCallback((history) => {
    setHistory(history);
  }, []);

  // const jumpTo = useCallback((move) => {
  //   setLocationToJump(move);
  // }, []);

  let content = (
    <Row gutter={8}>
      {console.log(props.history)}
      {console.log('gamepage')}
      <Col className="game-board" span={12}>
        <BoardGame
          match={match}
          setMatch={setMatch}
          socket={socket}
          room={room}
          // history={history}
          // setHistory={setHistory}
          // xIsNext={xIsNext}
          // setXIsNext={setXIsNext}
          players={players}
        />
      </Col>
      <Col span={6}>
        <UserInfo
          socket={socket}
          roomId={roomId}
          idOfRoom={idOfRoom}
          match={match}
          setMatch={setMatch}
          players={players}
          setPlayers={setPlayers}
          audiences={audiences}
          setAudiences={setAudiences}
          setNumPeopleInRoom={setNumPeopleInRoom}
          setRoom={setRoom}
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
  socket: state.auth.socket,
});

export default connect(mapStateToProps)(GamePage);
