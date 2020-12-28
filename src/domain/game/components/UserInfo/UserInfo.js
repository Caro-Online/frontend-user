import React, { useEffect, useState } from 'react';
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
import { connect } from 'react-redux'

const { Meta } = Card;

function UserInfo(props) {
  const [showButton, setShowButton] = useState(true);
  useEffect(() => {
    const userId = getUserIdFromStorage();
    if (props.players.length === 1) {
      if (props.players[0].user._id === userId) {
        setShowButton(false)
      }
    }
    if (props.players.length === 2) setShowButton(false)

  }, [props.players]);

  const joinPlayerQueueHanler = async () => {
    const userId = getUserIdFromStorage();
    const res = await api.joinPlayerQueue(userId, props.roomId)
    const { success } = res;
    if (success) {
      const res = await getUserById(userId);
      let socket = getSocket();
      socket.emit('join-player-queue', { userId });
      props.setPlayers([...props.players, res.data.user])
      setShowButton(false)
      api.createMatch(props.idOfRoom, [...props.players, res.data.user])
    }
  };

  //ĐƯA RA NGOÀI BOARD GAME
  // useEffect(() => {
  //   let socket = getSocket();
  //   socket.on('join-match-update', (message) => {
  //     getUserById(message.userId).then((res) => {
  //       setUser2(res.data.user);
  //     });
  //   });
  // });

  return (
    <div className="user-info">
      <Card className="card-group">
        <CardInfo user={props.players.length > 0 ? props.players[0].user : null} x={true} xIsNext={props.xIsNext} />
        <CardInfo user={props.players.length > 1 ? props.players[1].user : null} x={false} xIsNext={props.xIsNext} />
        <Card className="join-game" style={{ width: '100%', height: '10%' }}>
          <Button
            style={{ display: showButton ? '' : 'none' }}
            type="primary"
            onClick={joinPlayerQueueHanler}
          >
            Vào chơi
          </Button>
        </Card>
        <Card style={{ width: '100%', height: '30%' }}>
          <div>Đang xem</div>
          <ul>
            {props.audiences ? (
              props.audiences.map((au, i) => <li key={i}>{au.name}</li>)
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

export default (UserInfo)
