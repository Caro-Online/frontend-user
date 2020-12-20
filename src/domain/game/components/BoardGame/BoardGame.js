import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Square from "./Square";
import "./BoardGame.css";
import { getSocket } from "../../../../shared/utils/socket.io-client";
import gameService from './gameService'

import { Row, Col } from "antd";
const boardSize = 17;

export default function BoardGame(props) {
  const [history, setHistory] = useState([
    {
      squares: Array(boardSize).fill(null),
    },
  ]);
  const [xIsNext, setXIsNext] = useState(true);
  const [move, setMove] = useState(null);
  //const [room, setRoom] = useState(null);
  const [disable, setDisable] = useState(false); //disable board and waiting
  const location = useLocation();
  const reactHistory = useHistory();

  const [stepNumber, setStepNumber] = useState(1);

  const jumpTo = (step) => {
    console.log(`jumpTo`, step);
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };
  let socket;
  useEffect(() => {
    jumpTo(props.locationToJump);
  }, [props.locationToJump]);
  // useEffect(() => {
  //     socket = getSocket();
  //     socket.emit(
  //         'join',
  //         { userId: localStorage.getItem('userId'), roomId: "123" },
  //         (error) => {
  //             if (error) {
  //                 alert(error);
  //             }
  //         }
  //     );
  //     socket.on('receiveMove', (move) => {
  //         handleSquareClick(move)
  //     });
  // }, [location]);

  // const sendMove = () => {
  //   socket = getSocket();
  //   if (move) {
  //     socket.emit("sendMove", { move, room }, () => setMove(null));
  //   }
  // };

  const renderSquare = (i) => {
    const val = history[stepNumber]?.squares[i] || null;
    return (
      <Square
        key={i}
        index={i}
        value={val}
        onClick={() => {
          console.log(i);
          //sendMove(i);
          return handleSquareClick(i);
        }}
        disable={disable}
      />
    );
  };

  const handleSquareClick = (i) => {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();
    squares[i] = squares[i] ? squares[i] : xIsNext ? "X" : "O";
    setHistory(newHistory.concat([{ squares: squares, location: i }]));
    // * Need to improve
    props.emitHistory(history);
    setStepNumber(newHistory.length);
    setMove(i);
    // TODO: Alert comment disable in here
    // setDisable(!disable);
    setXIsNext(!xIsNext);
  };

  const renderBoardRow = (i) => {
    let row = [];
    for (let t = 0; t < boardSize; t++) {
      row.push(renderSquare(i * boardSize + t));
    }
    return (
      <tr key={i} className="board-row">
        {row}
      </tr>
    );
  };

  const renderBoard = () => {
    let board = [];
    for (let t = 0; t < boardSize; t++) {
      board.push(renderBoardRow(t));
    }
    return board;
  };

  const squares = history[history.length - 1].squares;
  let winner = null
  console.log(winner)
  let status;
  if (props.room) {
    if (props.room.rule === 'BLOCK_TWO_SIDE') {
      winner = gameService.checkWin2(squares, boardSize);
    } else if (props.room.rule === 'NOT_BLOCK_TWO_SIDE') {
      winner = gameService.checkWin(squares, boardSize);
    }
  }
  if (winner) {
    if (winner === 'D') {

    } else {
      status = "Winner: " + winner;
    }
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  return (
    <div>
      <div className="game-info">
        <div>{status}</div>
      </div>
      <table className="board">
        {console.log(reactHistory)}
        <tbody>{renderBoard()}</tbody>
      </table>
    </div>
  );
}





