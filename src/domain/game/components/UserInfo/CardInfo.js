import React from 'react';
import { Col, Card, Avatar } from 'antd';
import x from '../../../../shared/assets/images/x.png';
import o from '../../../../shared/assets/images/o.png';
import { StarFilled } from '@ant-design/icons';
import { connect } from 'react-redux';
const { Meta } = Card;
function CardInfo(props) {
  const getIconNext = () => {
    if (props.xIsNext === props.x) {
      return <StarFilled style={{ color: 'yellow' }} />;
    }
    return <div></div>;
  };

  const getStatus = () => {
    if (props.player) {
      if (props.isPlaying) {
        return 'Đang chơi';
      } else {
        if (props.player.isReady) {
          return 'Đang đợi';
        }
      }
    } else {
      return 'Còn trống';
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
        avatar={<Avatar src={props.x ? x : o} />}
        title={props.player ? props.player.user.name : ''}
        description={getStatus()}
      />
      {/* {console.log(props.user)} */}
      <img path="../../shared/assets/images/x.png" />
      {getIconNext()}
    </Card>
  );
}

export default CardInfo;
