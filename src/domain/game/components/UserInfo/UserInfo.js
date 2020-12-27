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
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const userId = getUserIdFromStorage();
    // console.log(props.players)
    if (props.players) {
      let isXNext = true;//players[0] la X
      props.players.forEach(player => {
        if (userId === player.user._id) {
          setPlaying(isXNext);
        }
        isXNext = false;//players[1] la O
      });
      if (props.players.length === 2) {
        setPlaying(false);//disable button play
      }
    }
  }, [props.players]);

  const joinPlayerQueueHanler = () => {
    const userId = getUserIdFromStorage();
    api.joinPlayerQueue(userId, props.roomId).then((res) => {
      getUserById(userId).then((res) => {
        setPlaying(true);
        let socket = getSocket();
        socket.emit('join-player-queue', { userId });
      });
      props.setPlayers([...props.players, userId])
    });
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
        <CardInfo user={props.players ? props.players[0].user : null} x={true} />
        <CardInfo user={props.players ? props.players[1] ? props.players[1].user : null : null} x={false} />
        <Card className="join-game" style={{ width: '100%', height: '10%' }}>
          <Button
            style={{ display: playing ? 'none' : '' }}
            type="primary"
            onClick={joinPlayerQueueHanler}
          >
            Vào chơi
          </Button>
        </Card>
        <Card style={{ width: '100%', height: '30%' }}>
          <div>Đang xem</div>
          {/* {console.log(props.audiences)} */}
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

const mapDispatchToProps = (dispatch) => ({
  setPlayers: (players) => dispatch({ type: 'SET_PLAYERS', players })
})

export default connect(null, mapDispatchToProps)(UserInfo)
