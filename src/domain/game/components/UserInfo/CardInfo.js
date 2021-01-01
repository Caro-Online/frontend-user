import React, { useCallback } from 'react';
import moment from 'moment';
import { Col, Card, Avatar, Statistic } from 'antd';
import api from '../../apiGame';

import ximage from '../../../../shared/assets/images/x.png';
import o from '../../../../shared/assets/images/o.png';
import { StarFilled } from '@ant-design/icons';
import { connect } from 'react-redux';

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
  setMatch,
  setDisable,
}) {
  const getIconNext = useCallback(() => {
    if (xIsNext === x) {
      return <StarFilled style={{ color: 'yellow' }} />;
    }
    return <div></div>;
  }, [x, xIsNext]);

  const getCountdownNext = useCallback(() => {
    if (!timeExp) {
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
            // Gửi api update lại phòng
            const response = await api.endMatch(matchId, player.user._id);
            setMatch(response.data.match);
            setDisable(true);
            console.log('set disable');
            console.log(response.data.match);
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
          return 'Đang đợi';
        }
      }
    } else {
      return 'Còn trống';
    }
  }, [isPlaying, player]);

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
    </Card>
  );
}

const mapStateToProps = (state) => {
  return {
    socket: state.auth.socket,
  };
};

export default connect(mapStateToProps)(CardInfo);
