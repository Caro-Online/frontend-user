import React, { useCallback, useEffect, useState } from "react";
import { Row, Col } from "antd";
import "./History.css";
import Board from "./Board";
import List from "./List";
import { getMatchHistoryByUserId } from "../../apiUser";
import { getUserIdFromStorage } from "src/shared/utils/utils";
import { Card, Avatar, Tag } from 'antd';
import { TrophyFilled } from '@ant-design/icons';
import ximage from 'src/shared/assets/images/x.png';
import o from 'src/shared/assets/images/o.png';
const { Meta } = Card;

const History = () => {
  const userId = getUserIdFromStorage();
  const [matches, setMatches, isLoadingMatches] = useMatchedHistoryApi(userId);
  const [match, setMatch] = useState(null);
  const [historyMatchLength, setHistoryMatchLength] = useState(null)

  const getMatchDetail = (match, historyLength) => {
    // const match = matches?.find((match) => match._id === matchId);
    setMatch(match);
    setHistoryMatchLength(historyLength)
  }

  const returnCard = (match, player, index) => (
    <Card
      key={index}
      style={{
        width: '100%',
        height: '150px',
        padding: '3px',
      }}
    >
      <Meta
        avatar={
          <Avatar
            shape="square"
            style={{ width: '50px', height: '50px' }}
            src={player.imageUrl ?
              player.imageUrl
              : 'https://picsum.photos/seed/picsum/50/50'
            }
          />
        }
        title={`${player.name} ${player._id === userId ? '(Bạn)' : ''} `}
        description={getCup(player)}

      />
      <div className="status-image">
        <div className="status-match">
          <div > <div>Kết quả:</div>
            <div >{player._id === match.winner ?
              <Tag color="green" style={{ borderRadius: 8 }}>
                <strong>Thắng</strong>
              </Tag> :
              <Tag color="red" style={{ borderRadius: 8 }}>
                <strong>Thua</strong>
              </Tag>}
            </div>
          </div>
          <div>
            <div>Nước đi: </div>
            <Avatar src={index === 0 ? ximage : o} />
          </div>

        </div>
      </div>
    </Card>
  )
  const getCup = (player) => {
    return player ? (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TrophyFilled style={{ color: '#F1C40F', padding: '5px' }} />
        <span>{player.cup}</span>
      </div>
    ) : (
        <div style={{ height: '20px' }}></div>
      );
  };

  const getRoomInfo = (room) => (
    <Card
      style={{
        width: '100%',
        height: '150px',
        padding: '3px',
      }}
    >
      <Meta
        title="   Thông tin phòng"
      />
      <div className="room-info">
        <div className="room-info-item"><span>ID : </span>{room.roomId}</div>
        <div className="room-info-item"><span>Tên phòng : </span>{room.name}</div>
        <div className="room-info-item"><span>Luật : </span>{room.rule ? 'Chặn 2 đầu' : 'Không chặn 2 đầu'}</div>
        <div className="room-info-item"><span>Thời gian 1 nước đi : </span>{room.countdownDuration} giây</div>
      </div>
    </Card>
  )

  const getChats = (match) => (
    < Card
      style={{
        width: '100%',
        height: '200px',
        padding: '3px',
        overflow: 'auto'
      }}
    >
      <Meta
        title="   Lịch sử trò chuyện"
      />
      <div className="room-info">
        {match.chat.map(message => (
          <div key={message._id} className="room-info-item">
            <span> {message.user.name}:</span> {message.content}</div>
        ))}
      </div>
    </Card >)


  return (
    <Row
      justify="center"
      align="center"
      className="history-content"
      gutter={[16, 16]}
    >
      <Col className="content-center" flex="4 0 440px">

        <Board match={match ? match : (matches.length > 0 ? matches[0] : null)}
          historyMatchLength={historyMatchLength ? historyMatchLength :
            (matches.length > 0 ? matches[0].history.length : null)} />
      </Col>
      <Col flex="1 0 200px" style={{ marginTop: "10px" }}>
        {match ? getRoomInfo(match.room) : (matches.length > 0 ? getRoomInfo(matches[0].room) : '')}
        {match ? match.players.map((player, index) => (returnCard(match, player, index))) :
          matches.length > 0 ? matches[0].players.map((player, index) => (returnCard(matches[0], player, index))) : ''
        }
        {/* {match ? getChats(match) :
          (matches.length > 0 ? getChats(matches[0]) : '')
        } */}
      </Col>
      <Col flex="1 0 300px" style={{ height: '100%', overflow: 'auto' }}>
        <List
          matches={matches}
          isLoading={isLoadingMatches}
          onClickMatch={getMatchDetail}
        />
      </Col>
    </Row>
  );
};
export default History;
export const useMatchedHistoryApi = (userId) => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getMatchesByUserId = async (userId) => {
      if (!userId) return;
      setIsLoading(true);
      try {
        const res = await getMatchHistoryByUserId(userId);
        const data = res.data;
        setMatches(data.matches);
        setIsLoading(false);
        console.log(`getMatchesByUserId`, data);
      } catch (e) {
        console.error(e);
      }
    };
    getMatchesByUserId(userId);
    // Passing URL as a dependency
  }, [userId]);

  // Return 'isLoading' not the 'setIsLoading' function
  return [matches, setMatches, isLoading];
};
