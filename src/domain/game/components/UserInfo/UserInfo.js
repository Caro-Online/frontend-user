import React, { useCallback, useEffect, useState } from 'react';
import { Card, Avatar, Button } from 'antd';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import CardInfo from './CardInfo';

import api from '../../apiGame';
import './UserInfo.css';
import { getUserById } from '../../../user/apiUser';
import { getSocket } from '../../../../shared/utils/socket.io-client';
import {
  removeItem,
  getUserIdFromStorage,
} from '../../../../shared/utils/utils';
import { connect } from 'react-redux';

const { Meta } = Card;

function UserInfo({
  socket,
  roomId,
  idOfRoom,
  match,
  setMatch,
  players,
  setPlayers,
  audiences,
  setAudiences,
  setNumPeopleInRoom,
  setRoom,
}) {
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    const userId = getUserIdFromStorage();
    if (players.length === 1) {
      if (players[0].user._id === userId) {
        setShowButton(false);
      }
    }
    if (players.length === 2) setShowButton(false);
  }, [players]);

  const joinPlayerQueueHandler = useCallback(async () => {
    const userId = getUserIdFromStorage();
    const res = await api.joinPlayerQueue(userId, roomId);
    const { success, room } = res.data;
    if (success) {
      console.log('join queue success');
      setAudiences(room.audiences);
      setNumPeopleInRoom(room.audiences.length + room.players.length);
      setRoom(room);
      const response1 = await getUserById(userId);
      const resp = await api.createMatch(idOfRoom, [
        players[0].user._id,
        userId,
      ]);
      await api.updateRoomStatus(roomId, 'PLAYING');//update lại trạng thái của room là playing 
      setPlayers([...players, { user: response1.data.user, isReady: true }]);
      setMatch(resp.data.match);
      setShowButton(false);
      // Thằng vào sau emit match start
      socket.emit('match-start', { matchId: resp.data.match._id });
    }
  }, [
    idOfRoom,
    players,
    roomId,
    setAudiences,
    setMatch,
    setNumPeopleInRoom,
    setPlayers,
    setRoom,
    socket,
  ]);

  //ĐƯA RA NGOÀI BOARD GAME
  // useEffect(() => {
  //   let socket = getSocket();
  //   socket.on('join-match-update', (message) => {
  //     getUserById(message.userId).then((res) => {
  //       setUser2(res.data.user);
  //     });
  //   });
  // });

  const getXIsNext = () => {
    if (match) {
      if (!match.winner) {
        return match.xIsNext;
      }
    }
    return null;
  };

  return (
    <div className="user-info">
      <Card className="card-group">
        <CardInfo
          player={players.length > 0 ? players[0] : null}
          x={true}
          xIsNext={getXIsNext()}
          isPlaying={match ? true : false}
          timeExp={match ? (match.timeExp ? match.timeExp : null) : null}
          matchId={match ? match._id : null}
        />
        <CardInfo
          player={players.length > 1 ? players[1] : null}
          x={false}
          xIsNext={getXIsNext()}
          isPlaying={match ? true : false}
          timeExp={match ? (match.timeExp ? match.timeExp : null) : null}
          matchId={match ? match._id : null}
        />
        <Card className="join-game" style={{ width: '100%', height: '10%' }}>
          <Button
            style={{ display: showButton ? '' : 'none' }}
            type="primary"
            onClick={joinPlayerQueueHandler}
          >
            Vào chơi
          </Button>
        </Card>
        <Card style={{ width: '100%', height: '30%' }}>
          <div>Đang xem</div>
          <ul>
            {audiences ? (
              audiences.map((au, i) => <li key={i}>{au.name}</li>)
            ) : (
              <li>Không có khán giả</li>
            )}
          </ul>
        </Card>
      </Card>
    </div>
  );
}

// const mapDispatchToProps = (dispatch) => ({
//   setXIsNext: (xIsNext) => dispatch({ type: 'SET_XISNEXT', xIsNext }),
//   setPlayers: (players) => dispatch({ type: 'SET_PLAYER', players })
// })
// const mapStateToProps = (state) => ({
//   xIsNext: state.game.xIsNext
// })

export default React.memo(UserInfo);
