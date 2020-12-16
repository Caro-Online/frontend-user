//Library
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Components
import BoardGame from "../../components/BoardGame/BoardGame";
import UserInfo from "../../components/UserInfo/UserInfo";
import History from "../../components/History/History";
import Chat from "../../components/Chat/Chat";
import { initSocket } from "../../../../shared/utils/socket.io-client";
import AllUser from "../../components/AllUser/AllUser";

//Others
import { API } from "../../../../config";
import "./GamePage.css";
import { Row, Col } from "antd";
import { Spin } from "antd";
const GamePage = (props) => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [history, setHistory] = useState(null);
  const [locationToJump, setLocationToJump] = useState(1);
  useEffect(() => {
    let socket;
    socket = initSocket(localStorage.getItem("userId"));
    // history.push('/');

    const { roomId } = params;
    setIsLoading(true);
    fetch(`${API}/game/${roomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setIsLoading(false);
        console.log(response);
        if (response.success) {
          setRoom(response.room);
        } else {
          setNotFound(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });

    return () => {
      socket.disconnect();
    };
  }, [params]);
  const emitHistory = (history) => {
    console.log(`emitHistory`, history);
    setHistory(history);
  };
  const jumpTo = (move) => {
    setLocationToJump(move);
  };
  let content = (
    <Row>
      <Col flex="1 1 200px" className="main-content">
        <div className="game-page__board">
          <BoardGame
            emitHistory={emitHistory}
            locationToJump={locationToJump}
          />
        </div>
        <div className="game-page__info">
          <UserInfo />
          <History history={history} jumpTo={jumpTo} />
          {room ? <Chat room={room} /> : null}
        </div>
      </Col>
      <Col flex="0 1 250px" style={{ padding: "4px 8px" }}>
        Online user
        <AllUser />
        {/* <div className="game-page__all-user">
        </div> */}
      </Col>
    </Row>
  );

  if (isLoading) {
    content = <Spin style={{ fontSize: "64px" }} />;
  }

  if (notFound) {
    content = <h1>Room not found</h1>;
  }

  return content;
};

export default GamePage;
