import React, { useCallback, useEffect, useState } from "react";
import { Row, Col } from "antd";
import "./History.css";
import Board from "./Board";
import List from "./List";
import { getMatchHistoryByUserId } from "../../apiUser";
import { getUserIdFromStorage } from "src/shared/utils/utils";
import { Card, Avatar, Tag } from 'antd';
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
        description={player._id === match.winner ?
          <Tag color="green" style={{ borderRadius: 8 }}>
            <strong>Thắng</strong>
          </Tag> :
          <Tag color="red" style={{ borderRadius: 8 }}>
            <strong>Thua</strong>
          </Tag>}
      />
      <div className="status-image">
        <div>
          <Avatar src={index === 0 ? ximage : o} />
        </div>
      </div>
    </Card>
  )


  return (
    <Row
      justify="center"
      align="center"
      className="history-content"
      gutter={[16, 16]}
    >
      <Col className="content-center" flex="4 0 440px">
        <Board match={match ? match : (matches ? matches[0] : null)}
          historyMatchLength={historyMatchLength ? historyMatchLength :
            (matches ? matches[0].history.length : null)} />
      </Col>
      <Col flex="1 0 200px">
        {match ? match.players.map((player, index) => (returnCard(match, player, index))) :
          matches ? matches[0].players.map((player, index) => (returnCard(matches[0], player, index))) : ''
        }
      </Col>
      <Col flex="1 0 300px">
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
  const [matches, setMatches] = useState();
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
