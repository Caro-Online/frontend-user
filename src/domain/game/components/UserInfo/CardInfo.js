import React, { useCallback, useState, useEffect } from 'react';
import moment from 'moment';
import { Col, Card, Avatar, Statistic, Button } from 'antd';
import api from '../../apiGame';

import ximage from '../../../../shared/assets/images/x.png';
import o from '../../../../shared/assets/images/o.png';
import { StarFilled } from '@ant-design/icons';
import { connect } from 'react-redux';
import { getUserIdFromStorage } from '../../../../shared/utils/utils';

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
        <Countdown
          title="Thời gian còn lại"
          value={deadline}
          format="ss"
          suffix="giây"
          onFinish={async () => {
            // Xử thua cho user đó
            // Gửi api update lại trận đấu
            const response = await api.endMatch(matchId, player.user._id);
            const { match } = response.data;
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
    } else {
      return 'Còn trống';
    }
  }, [isPlaying, player]);

  const handleClickButtonStart = () => {
    setVisibleButton(false);
    onStartClick();
  };

  const renderButtonStart = () => {
    //Nút chơi lại hiển thị khi ván chơi kết thúc
    const userId = getUserIdFromStorage();
    if (player) {
      if (isMatchEnd && player.user._id === userId) {
        const deadline = moment.utc(timeExp).valueOf();
        //Nếu match kết thúc mới render
        return (
          <>
            <Button
              onClick={handleClickButtonStart}
              type="primary"
              style={{ display: visibleButton ? '' : 'none' }}
            >
              Sẵn sàng
            </Button>
            <Countdown
              value={deadline}
              prefix="Bạn còn "
              format="ss"
              suffix="giây để sẵn sàng"
              onFinish={async () => {
                console.log('Helo there');
              }}
            />
          </>
        );
      }
    }
  };

  return (
    <Card
      style={{
        width: '100%',
        height: '150px',
        padding: '3px',
      }}
    >
      <Meta
        avatar={<Avatar src={x ? ximage : o} />}
        title={player ? player.user.name : ''}
        description={getStatus()}
      />
      {/* {console.log(user)} */}
      <img path="../../shared/assets/images/x.png" />
      {getIconNext()}
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
