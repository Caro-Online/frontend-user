import React, { useCallback, useEffect, useState } from 'react';
import { Card, Button } from 'antd';

import CardInfo from './CardInfo';

import api from '../../apiGame';
import './UserInfo.css';
import { getUserById } from '../../../user/apiUser';
import { getUserIdFromStorage } from '../../../../shared/utils/utils';

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
  setRoom,
  setDisable,
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
    // Update room out audiences thêm vào players
    const res = await api.joinPlayerQueue(userId, roomId);
    const { success, room } = res.data;
    if (success) {
      setAudiences(room.audiences);
      setRoom(room);
      const response1 = await getUserById(userId);
      setPlayers([...players, { user: response1.data.user, isReady: true }]);
      // Nếu có 2 người trong players thì bắt đầu game luôn
      if (players.length + 1 === 2) {
        const resp = await api.createMatch(idOfRoom, [
          players[0].user._id,
          userId,
        ]);
        // Thằng vào sau emit match start
        socket.emit('match-start', { match: resp.data.match });
        setMatch(resp.data.match);
        setShowButton(false);
        api.updateRoomStatus(roomId, 'PLAYING'); //update lại trạng thái của room là playing
      }
    }
  }, [
    idOfRoom,
    players,
    roomId,
    setAudiences,
    setMatch,
    setPlayers,
    setRoom,
    socket,
  ]);

  useEffect(() => {
    let updatePlayerReadyListener = ({ room }) => {
      setPlayers(room.players);
    };
    if (socket) {
      socket.on('update-player-ready', updatePlayerReadyListener);
    }
    return () => {
      socket.off('update-player-ready', updatePlayerReadyListener);
    };
  }, [socket, setRoom, setPlayers]);

  const getXIsNext = () => {
    if (match) {
      if (!match.winner) {
        return match.xIsNext;
      }
    }
    return null;
  };
  //Bắt sự kiện click bắt đầu khi kết thúc ván
  const onStartClick = useCallback(async () => {
    const userId = getUserIdFromStorage();
    const res = await api.updatePlayerIsReady(roomId, userId, true); //trả về  room để update user status
    setPlayers(res.data.room.players);
    socket.emit('set-player-ready', { userId });
  }, [setPlayers, socket, roomId]);

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
          setMatch={setMatch}
          setDisable={setDisable}
          isMatchEnd={match ? (match.winner ? true : false) : false}
          onStartClick={onStartClick}
          playersLength={players ? players.length : null}
        />
        <CardInfo
          player={players.length > 1 ? players[1] : null}
          x={false}
          xIsNext={getXIsNext()}
          isPlaying={match ? true : false}
          timeExp={match ? (match.timeExp ? match.timeExp : null) : null}
          matchId={match ? match._id : null}
          setMatch={setMatch}
          setDisable={setDisable}
          roomId={roomId}
          isMatchEnd={match ? (match.winner ? true : false) : false}
          onStartClick={onStartClick}
          playersLength={players ? players.length : null}
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
