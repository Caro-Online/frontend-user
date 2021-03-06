//Library
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import {
  Row,
  Col,
  Tabs,
  Spin,
  Typography,
  Descriptions,
  // Card,
  Statistic,
  message as antMessage,
} from 'antd';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import { FaTrophy, FaUsers, FaInfoCircle } from 'react-icons/fa';

// Components
import BoardGame from '../../components/BoardGame/BoardGame';
import UserInfo from '../../components/UserInfo/UserInfo';
// import History from '../../components/History/History';
import Chat from '../../components/Chat/Chat';
import OnlineUsers from '../../components/OnlineUsers/OnlineUsers';
import TopUsers from '../../components/TopUsers/TopUsers';

//Others
import './GamePage.css';
import api from '../../apiGame';
import {
  getUserIdFromStorage,
  getCupChangeMessage,
} from '../../../../shared/utils/utils';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const GamePage = React.memo((props) => {
  const params = useParams();
  const location = useLocation();
  const history = useHistory();
  const { roomId } = params;
  const { socket } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [idOfRoom, setIdOfRoom] = useState(null);
  const [numPeopleInRoom, setNumPeopleInRoom] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [audiences, setAudiences] = useState([]);
  const [players, setPlayers] = useState([]);
  const [match, setMatch] = useState(null);
  const [winRaw, setWinRaw] = useState(null);
  const [disable, setDisable] = useState(true); //disable board and waiting

  const setCurrentMatch = useCallback((idOfRoom) => {
    api.getCurrentMatchByIdOfRoom(idOfRoom).then((res) => {
      if (res.data.success) {
        setMatch(res.data.match);
        // setHistory(res.data.match.history);
        // setXIsNext(res.data.match.xIsNext);
        //setPlayers(res.data.match.players);
        return true;
      }
      return false;
    });
  }, []);

  const addAudience = useCallback(async () => {
    const userId = getUserIdFromStorage();
    try {
      const response = await api.joinRoom(userId, roomId);
      const { success, message, room } = response.data;
      if (!success) {
        antMessage.error(message);
        return null;
      }
      return room;
    } catch (err) {
      console.log(err);
      antMessage.error(err);
      return null;
    }
  }, [roomId]);

  const getRoomInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.getRoomInfoById(roomId);
      const { room, success } = response.data;
      setIsLoading(false);
      if (success) {
        setAudiences(room.audiences);
        setIdOfRoom(room._id);
        setRoom(room);
        setNumPeopleInRoom(room.players.length + room.audiences.length);
        setPlayers(room.players);
        return room;
      } else {
        setNotFound(true);
        return null;
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      return null;
    }
  }, [roomId]);

  useEffect(() => {
    async function doStuff() {
      // Lấy thông tin của phòng về
      const room = await getRoomInfo();
      // Nếu không sử dụng chức năng nhập id, hoặc bấm tham gia bên rooms mà nhập id trên url để vào
      if (room.password) {
        if (!location.state) {
          antMessage.info(
            'Hãy vào phòng bằng cách sử dụng chức năng nhập id hoặc tham gia phòng'
          );
          history.replace('/rooms');
          return;
        }
      }
      // Lấy thông tin match hiện tại đang chơi (nếu có) và set vào match
      if (room.players.length > 1) {
        setCurrentMatch(room._id);
      }
      // Xét xem khi f5 lại user có phải player đang chơi hay không, nếu ko có trong players thì add vào audiences
      const userId = getUserIdFromStorage();
      let userInPlayers = false;
      room.players.forEach((player) => {
        if (player.user._id.toString() === userId.toString()) {
          userInPlayers = true;
        }
      });
      // Nếu user không nằm trong players thì đây là audience mới vào hoặc audience cũ f5 lại
      // Thêm audience mới vào room.audiences
      if (!userInPlayers) {
        const responseRoom = await addAudience();
        if (responseRoom) {
          // Set lại thông tin
          setAudiences(responseRoom.audiences);
          setIdOfRoom(responseRoom._id);
          setRoom(responseRoom);
          setNumPeopleInRoom(
            responseRoom.players.length + responseRoom.audiences.length
          );
          setPlayers(responseRoom.players);
        }
      }
      // Emit lai thong tin phong cho cac client khac
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
  }, [getRoomInfo, addAudience, location, socket, setCurrentMatch, history]);

  useEffect(() => {
    const roomDataListener = ({ room }) => {
      setAudiences(room.audiences);
      setIdOfRoom(room._id);
      setRoom(room);
      setNumPeopleInRoom(room.players.length + room.audiences.length);
      setPlayers(room.players);
      if (room.players.length < 2) {
        setMatch(null);
      }
    };
    if (socket) {
      socket.on('room-data', roomDataListener);
    }
    return () => {
      socket.off('room-data', roomDataListener);
    };
  }, [setPlayers, socket]);

  useEffect(() => {
    const matchStartUpdateListener = async ({ match }) => {
      //const res = await api.getMatchById(matchId);
      setMatch(match);
    };
    socket.on('match-start-update', matchStartUpdateListener);
    const haveWinnerListener = ({
      updatedMatch,
      cupDataChange,
      matchPlayers,
    }) => {
      console.log(cupDataChange);
      console.log('have winner');
      console.log(updatedMatch);
      setMatch({ ...updatedMatch });
      getCupChangeMessage(updatedMatch, cupDataChange);
      // let newPlayers = Object.assign([], players);
      let newPlayers = cloneDeep(players);
      console.log(matchPlayers);
      newPlayers[0].isReady = false;
      newPlayers[0].user = matchPlayers[0];
      newPlayers[1].isReady = false;
      newPlayers[1].user = matchPlayers[1];
      console.log(newPlayers);
      setPlayers(newPlayers);
    };
    socket.on('have-winner', haveWinnerListener);
    const endMatchListener = ({ updatedMatch }) => {
      console.log('end match');
      setMatch({ ...updatedMatch });
    };
    socket.on('end-match', endMatchListener);
    return () => {
      socket.off('match-state-update', matchStartUpdateListener);
      socket.off('have-winner', haveWinnerListener);
      socket.off('end-match', endMatchListener);
    };
  }, [socket, players, setPlayers]);

  // const jumpTo = useCallback((move) => {
  //   setLocationToJump(move);
  // }, []);

  let content = (
    <Row gutter={8}>
      <Col className="game-board" flex="4 0 440px">
        <BoardGame
          match={match}
          setMatch={setMatch}
          socket={socket}
          room={room}
          players={players}
          disable={disable}
          setDisable={setDisable}
          countdownDuration={room ? room.countdownDuration : null}
          rule={room ? room.rule : null}
        />
      </Col>
      <Col flex="1 0 200px">
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
          setDisable={setDisable}
        />
      </Col>
      <Col flex="2 1 300px">
        <Tabs defaultActiveKey="2" type="card" size="middle">
          <TabPane
            tab={
              <div className="tabpane-main">
                <FaInfoCircle size="24" />
                <Title level={5} style={{ marginBottom: 0, fontSize: '13px' }}>
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
                    <Text strong> {room.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số người trong phòng" span={2}>
                    <Statistic value={numPeopleInRoom}></Statistic>
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian 1 nước">
                    <Text strong>{room.countdownDuration} giây</Text>
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
                <Chat room={room} match={match} />
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
                      Trực tuyến
                    </Title>
                  </div>
                }
                key="1"
              >
                <div style={{ height: '75vh', overflow: 'auto' }}>
                  <OnlineUsers
                    roomId={room?.roomId}
                    style={{ height: '85vh' }}
                  />
                </div>
              </TabPane>
              <TabPane
                tab={
                  <div className="tabpane-sub">
                    <FaTrophy size="24" style={{ marginRight: '8px' }} />
                    <Title
                      level={5}
                      style={{ marginBottom: 0, fontSize: '14px' }}
                    >
                      BXH
                    </Title>
                  </div>
                }
                key="2"
              >
                <div style={{ height: '75vh', overflow: 'auto' }}>
                  <TopUsers roomId={room?.roomId} />
                </div>
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
});

const mapStateToProps = (state) => ({
  socket: state.auth.socket,
});

export default connect(mapStateToProps)(GamePage);
