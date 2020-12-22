import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Square from "./Square";
import "./BoardGame.css";
import { getSocket } from "../../../../shared/utils/socket.io-client";
import gameService from './gameService'
import { Row, Col } from "antd";
import { connect } from 'react-redux'
import { updateNextPlayer } from '../../../../store/actions/game.action'
const boardSize = 17;

function BoardGame(props) {
  const [history, setHistory] = useState([
    {
      squares: Array(boardSize * boardSize).fill(null)
    }
  ]);
  const [xIsNext, setXIsNext] = useState(true);
  //const [move, setMove] = useState(null);
  //const [room, setRoom] = useState(null);
  const [disable, setDisable] = useState(true); //disable board and waiting
  const location = useLocation();
  const reactHistory = useHistory();

  //const [stepNumber, setStepNumber] = useState(1);

  // const jumpTo = (step) => {
  //   console.log(`jumpTo`, step);
  //   setStepNumber(step);
  //   setXIsNext(step % 2 === 0);
  // };
  let socket;
  // useEffect(() => {
  //   jumpTo(props.locationToJump);
  // }, [props.locationToJump]);
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (props.room) {
      //Người đầu tiên là X
      if (props.room.user.u1.userRef._id === userId) {
        setXIsNext(true);// X
        props.setNextPlayer(true)
        setDisable(false);// Đi trước
        console.log("here u1");
      }
      //Người thứ 2 là O
      if (props.room.user.u2) {
        if (props.room.user.u2.userRef._id === userId) {
          setXIsNext(false);// O
          props.setNextPlayer(false)
          setDisable(true);// Đi sau
        }
      }
    }


    return () => {
      console.log("board game unmounted");
    }
  }, [props.room]);

  useEffect(() => {
    let socket = getSocket();
    socket.on('receive-move', (message) => {
      const { move } = message
      console.log(message)

      //Bỏ step number để làm chơi 2 người
      // const newHistory = history.slice(0, stepNumber + 1);
      //const current = newHistory[newHistory.length - 1];

      let newHistory = history.slice();
      console.log("history-before-on-socket:" + newHistory.length)
      let current = newHistory[newHistory.length - 1];
      let squares = current.squares.slice();
      squares[move.index] = move.value;
      setHistory([...newHistory, { squares: squares }]);
      setDisable(false);
      setXIsNext(move.value === 'O' ? true : false);
      props.setNextPlayer(move.value === 'O' ? true : false)

    })
  }, [history])

  const sendMove = (i) => {
    socket = getSocket();
    socket.emit("send-move", {
      move: { index: i, value: xIsNext ? 'X' : 'O' },
      roomId: props.room.roomId
    });
  };

  const renderSquare = (i) => {
    //const val = history[stepNumber].squares[i] || null;
    const val = history[history.length - 1].squares[i];
    return (
      <Square
        key={i}
        index={i}
        value={val}
        onClick={() => handleSquareClick(i)}
        disable={disable}
        setDisable={setDisable}
      />
    );
  };

  const handleSquareClick = (i) => {
    //const newHistory = history.slice(0, stepNumber + 1);
    const newHistory = history.slice();
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();
    if (!squares[i]) {//Nếu ô đó chưa có giá trị có giá trị
      squares[i] = xIsNext ? "X" : "O";
      setHistory(newHistory.concat([{ squares: squares }]));
      // * Need to improve
      props.emitHistory(history);
      //setStepNumber(newHistory.length);
      // TODO: Alert comment disable in here
      setXIsNext(!xIsNext);
      props.setNextPlayer(!xIsNext)
      //Send move to socket
      sendMove(i);
    }
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
  console.log("winner: " + winner)
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
      {console.log(xIsNext + " " + disable)}
      {console.log("history-client:" + history.length)}
    </div>
  );
}
const mapDispatchToProps = (dispatch) => ({
  setNextPlayer: (nextPlayer) => dispatch(updateNextPlayer(nextPlayer))
})

export default connect(null, mapDispatchToProps)(BoardGame)