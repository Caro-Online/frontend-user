import React, { useCallback, useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';
import {
  Col,
  Card,
  Avatar,
  Statistic,
  Button,
  message as antMessage,
} from 'antd';
import api from '../../apiGame';

import ximage from '../../../../shared/assets/images/x.png';
import o from '../../../../shared/assets/images/o.png';
import { StarFilled, TrophyFilled, ClockCircleTwoTone } from '@ant-design/icons';
import { connect } from 'react-redux';
import { getUserIdFromStorage, getCupChangeMessage } from '../../../../shared/utils/utils';
import './UserInfo.css'

const { Countdown } = Statistic;
const { Meta } = Card;

function CardInfo({
  xIsNext,
  player,
  isPlaying,
  x,
  timeExp,
  matchId,
  socket,
  isMatchEnd,
  onStartClick,
  setMatch,
  setDisable,
}) {
  const params = useParams();
  const history = useHistory();
  const { roomId } = params;
  const [visibleButton, setVisibleButton] = useState(true);
  const getIconNext = useCallback(() => {
    if (xIsNext === x) {
      return <StarFilled style={{ color: 'yellow' }} />;
    }
    return <div></div>;
  }, [x, xIsNext]);
  useEffect(() => {
    setVisibleButton(true);
  }, [matchId]);

  const getCountdownNext = useCallback(() => {
    if (!timeExp && !isMatchEnd) {
      return <div></div>;
    }
    const deadline = moment.utc(timeExp).valueOf();
    if (xIsNext === x) {
      return (
        <>
          <Countdown
            value={deadline}
            format="ss"
            suffix="s"
            prefix={<ClockCircleTwoTone />}
            style={{ fontSize: "12px !important" }}
            onFinish={async () => {
              // Xử thua cho user đó
              // Gửi api update lại trận đấu
              const response = await api.endMatch(matchId, player.user._id);
              const { match, cupDataChange } = response.data.endData;
              getCupChangeMessage(match, cupDataChange)
              setMatch(match);
              setDisable(true);
              // Emit check xem player nào out ra khỏi phòng trước đó => xóa player đó ra khỏi players trong room
              socket.emit('check-player-out-during-play', { roomId: match.room });
              // Emit sự kiện end-match để các client khác trong phòng update lại thông tin
              socket.emit('end-match', {
                matchId: matchId,
              });
            }}
          />
        </>
      );
    }
    return <div></div>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, xIsNext, timeExp, matchId, socket]);



  const getStatus = useCallback(() => {
    if (player) {
      if (isPlaying) {
        return 'Đang chơi';
      } else {
        if (player.isReady) {
          return 'Sẵn sàng';
        } else {
          return 'Đang đợi...';
        }
      }
    }
  }, [isPlaying, player]);

  const handleClickButtonStart = useCallback(() => {
    // Tắt hiển thị nút sẵn sàng
    setVisibleButton(false);
    // Update lại isReady của user và emit cho các user khác biết
    onStartClick();
  }, [onStartClick]);

  const renderButtonStart = useCallback(() => {
    //Nút chơi lại hiển thị khi ván chơi kết thúc
    const userId = getUserIdFromStorage();
    if (player) {
      if (isMatchEnd && player.user._id === userId) {
        const deadline = moment.utc(timeExp).valueOf();
        //Nếu match kết thúc mới render
        return (
          <>
            {visibleButton ?
              <div className="start-again">
                <div>
                  <Countdown
                    value={deadline}
                    prefix={<ClockCircleTwoTone style={{ fontSize: "23px" }} />}
                    format="s"
                    suffix="s"
                    onFinish={async () => {
                      console.log('Helo there');
                      setVisibleButton(false);
                      const response = await api.updateRoomWhenPlayerNotReady(
                        roomId,
                        userId
                      );
                      const { success, message } = response.data;
                      if (success) {
                        // Cho user quay ve rooms => fire sự kiện leaveroom
                        history.replace('/rooms');
                      } else {
                        console.log(message);
                        antMessage.error(message);
                      }
                    }}
                  />
                </div>
                <div>
                  <Button
                    onClick={handleClickButtonStart}
                    type="primary"
                  >
                    Sẵn sàng
                </Button>
                </div>
              </div> : ''}
          </>
        );
      }
    }
  }, [
    handleClickButtonStart,
    isMatchEnd,
    player,
    roomId,
    timeExp,
    visibleButton,
    socket,
  ]);

  const getCup = () => {
    return player ?
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TrophyFilled style={{ color: '#F1C40F', padding: "5px" }} />
        <span>{player.user.cup}</span>
      </div> : <div style={{ height: "20px" }}></div>
  }

  return (
    <Card
      style={{
        width: '100%',
        height: '150px',
        padding: '3px',
      }}
    >
      <Meta
        avatar={<Avatar shape="square" style={{ width: '50px', height: '50px' }}
          src={player ? (player.user.imageUrl ? player.user.imageUrl : "https://picsum.photos/seed/picsum/50/50") : ""} />}
        title={player ? player.user.name : 'Còn trống'}
        description={getCup()}
      />
      <div className="status-image">
        <div>{getStatus()}</div>
        <div>< Avatar src={x ? ximage : o} /></div>
      </div>
      {getCountdownNext()}
      {renderButtonStart()}
    </Card>
  );
}

const mapStateToProps = (state) => {
  return {
    socket: state.auth.socket,
  };
};

export default connect(mapStateToProps)(CardInfo);
