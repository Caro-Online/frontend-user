import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Square from "./Square";
import "./BoardGame.css";
import { getSocket } from "../../../../shared/utils/socket.io-client";

import { Row, Col } from "antd";
const boardSize = 20;

export default function BoardGame({ emitHistory, locationToJump }) {
  const [history, setHistory] = useState([
    {
      squares: Array(boardSize).fill(null),
    },
  ]);
  const [xIsNext, setXIsNext] = useState(true);
  const [move, setMove] = useState(null);
  const [room, setRoom] = useState(null);
  const [disable, setDisable] = useState(false); //disable check in board and wait ...
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
    jumpTo(locationToJump);
  }, [locationToJump]);
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

  const sendMove = () => {
    socket = getSocket();
    if (move) {
      socket.emit("sendMove", { move, room }, () => setMove(null));
    }
  };

  const renderSquare = (i) => {
    const val = history[stepNumber]?.squares[i] || null;
    return (
      <Square
        key={i}
        index={i}
        value={val}
        onClick={() => {
          console.log(i);
          sendMove(i);
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
    emitHistory(history);
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

  const winner = calculateWinner(null);
  const squaresWinner = winner;
  let status;
  if (squaresWinner) {
    status = "Winner: " + squaresWinner;
  } else if (winner.isDraw) {
    status = "Draw!!";
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
function calculateWinner(squares) {
  return false;
}
