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

function CardInfo({ xIsNext, player, isPlaying, x, timeExp, matchId, socket, isMatchEnd, onStartClick, setMatch,
  setDisable }) {
  const [visibleButton, setVisibleButton] = useState(true);
  const getIconNext = useCallback(() => {
    if (xIsNext === x) {
      return <StarFilled style={{ color: 'yellow' }} />;
    }
    return <div></div>;
  }, [x, xIsNext]);
  useEffect(() => {
    setVisibleButton(true);
  }, [matchId])

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
          return 'Sẵn sàng';
        } else {
          return 'Đang đợi...'
        }
      }
    } else {
      return 'Còn trống';
    }
  }, [isPlaying, player, isMatchEnd]);

  const handleClickButtonStart = () => {
    setVisibleButton(false);
    onStartClick();
  }

  const renderButtonStart = () => { //Nút chơi lại hiển thị khi ván chơi kết thúc
    const userId = getUserIdFromStorage();
    if (isMatchEnd && player.user._id === userId) {//Nếu match kết thúc mới render
      return <>
        <Button
          dis
          onClick={handleClickButtonStart}
          type="primary"
          style={{ display: visibleButton ? '' : 'none' }}>
          Start
        </Button>
        <div>20 giây</div>
      </>
    }
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
