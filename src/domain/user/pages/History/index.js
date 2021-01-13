import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import "./History.css";
import Board from "./Board";
import List from "./List";
import { getMatchHistoryByUserId } from "../../apiUser";
import { getUserIdFromStorage } from "src/shared/utils/utils";
const History = () => {
  const userId = getUserIdFromStorage();
  const [matches, setMatches, isLoadingMatches] = useMatchedHistoryApi(userId);
  const [match, setMatch] = useState(null);
  const getMatchDetail = (match) => {
    // const match = matches?.find((match) => match._id === matchId);
    setMatch(match);
  };
  return (
    <Row
      justify="center"
      align="center"
      className="history-content"
      gutter={[16, 16]}
    >
      <Col className="content-center" flex="2 0 440px">
        <Board match={match} />
      </Col>
      <Col flex="1 0 250px">
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
