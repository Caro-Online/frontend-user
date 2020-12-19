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
import api from '../../apiGame'


const GamePage = (props) => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [history, setHistory] = useState(null);
  const [locationToJump, setLocationToJump] = useState(1);
  const [render, setRender] = useState(false);

  const getRoomInfo = () => {
    const { roomId } = params;
    setIsLoading(true);
    fetch(`${API}/room/${roomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setIsLoading(false);
        console.log(response);
        if (response.success) {
          setRoom(response.room);
          console.log(response.room)
          setIsSuccess(true);
          addAudience(response.room)
        } else {
          setNotFound(true);
          setIsSuccess(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setIsSuccess(false);
      });

  }

  const addAudience = (room) => {
    const userId = localStorage.getItem('userId');
    const join = () => {
      api.joinRoom(userId, params.roomId).then(res => {
        console.log('join success');
        setRender(!render)
      })
    }

    if (room.user.u1.userRef._id !== userId & !room.user.u2) {
      join();
    }
    if (room.user.u2) {
      if (room.user.u1.userRef._id !== userId && room.user.u2.userRef._id !== userId) {
        join();
      }
    }

  }

  const removeAudience = () => {
    const userId = localStorage.getItem('userId');
    api.outRoom(userId, params.roomId).then(res => {
      console.log('out success');
    })
  }

  useEffect(() => {
    let socket;
    socket = initSocket(localStorage.getItem("userId"));
    getRoomInfo();
    return () => {
      socket.disconnect();
      removeAudience()
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
      <Col className="game-board" flex="3 0 500px" >
        <BoardGame
          emitHistory={emitHistory}
          locationToJump={locationToJump} />
      </Col>
      <Col flex="1 0 200px">
        <UserInfo
          roomId={isSuccess ? room.roomId : null}
          user={isSuccess ? room.user : null}
          audience={isSuccess ? room.audience : null} />
      </Col>
      <Col flex="1 0 200px">
        <History history={history} jumpTo={jumpTo} />
        {room ? <Chat room={room} /> : null}
      </Col>
      <Col flex="1 0 200px" style={{ padding: "4px 8px" }}>
        Online user
        <AllUser />
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
