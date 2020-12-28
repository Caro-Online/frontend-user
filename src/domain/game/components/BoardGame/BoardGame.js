import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';

import Square from './Square';

import './BoardGame.css';
import { getSocket } from '../../../../shared/utils/socket.io-client';
import gameService from './gameService';
import { updateNextPlayer } from '../../../../store/actions/game.action';
import { getUserIdFromStorage } from '../../../../shared/utils/utils';
import api from '../../apiGame'
import { map } from 'lodash';

const boardSize = 17;

function BoardGame(props) {
  const [disable, setDisable] = useState(true); //disable board and waiting
  const location = useLocation();
  const reactHistory = useHistory();

  //Check đúng userId và lượt đi, mở ô cho đánh
  const setPlaying = (xIsNext) => {
    const userId = getUserIdFromStorage();
    console.log(props.players)
    if (props.players) {
      console.log(props.players)
      if ((props.players[0].user._id === userId && xIsNext) ||
        (props.players[1].user._id === userId && !xIsNext)) {
        setDisable(false);
        console.log("setPlaying call")
      }
    }
  }

  const receiveMove = () => {
    if (props.socket) {
      props.socket.on('receive-move', (message) => {
        const { move } = message;
        const newHistory = props.history.slice();
        newHistory.push(move)
        props.setHistory(newHistory)
        props.setXIsNext(!props.xIsNext)
        setPlaying(!props.xIsNext);//check userId vaf xIsNext
      });
    }
  }


  useEffect(() => {
    receiveMove()
  }, [props.history])

  useEffect(() => {
    console.log("useEffect boardgame call")
    setPlaying(props.xIsNext)
  }, [])



  const sendMove = (i) => {
    props.socket.emit('send-move', {
      move: i,
      roomId: props.room.roomId,
    });
  };

  const getSquareValue = (i) => {
    if (props.history) {
      for (let k = 0; k < props.history.length; k++) {
        if (props.history[k] === i) {
          return k % 2 === 0 ? 'X' : 'O';
        }
      }
      return null
    }
    return null;
  }

  const renderSquare = (i) => {
    return (
      <Square
        key={i}
        index={i}
        value={getSquareValue(i)}
        onClick={() => handleSquareClick(i)}
        disable={disable}
        setDisable={setDisable}
      />
    );
  };



  const handleSquareClick = (i) => {
    const newHistory = props.history.slice();
    //Nếu bước chưa tồn tại
    newHistory.push(i)
    props.setHistory(newHistory)
    if (!getSquareValue(i)) {
      api.addMove(props.matchId, i, !props.xIsNext)
      props.setXIsNext(!props.xIsNext);
      sendMove(i);//socket
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

  let winner = null;
  let status;
  // if (props.room) {
  //   if (props.room.rule === 'BLOCK_TWO_SIDE') {
  //     winner = gameService.checkWin2(squares, boardSize);
  //   } else if (props.room.rule === 'NOT_BLOCK_TWO_SIDE') {
  //     winner = gameService.checkWin(squares, boardSize);
  //   }
  // }
  if (winner) {
    if (winner === 'D') {
    } else {
      status = 'Winner: ' + winner;
    }
  } else {
    status = 'Next player: ' + (props.xIsNext ? 'X' : 'O');
  }
  return (
    <div>
      <div className="game-info">
        {console.log("boardgame")}
        {console.log("xIsNext: " + props.xIsNext + " disable: " + disable)}
        <div>{status}</div>
      </div>
      <table className="board">
        <tbody>{renderBoard()}</tbody>
      </table>
    </div>
  );
}

// const mapStateToProps = (state) => ({
//   players: state.game.players,
//   xIsNext: state.game.xIsNext,
//   history: state.game.history
// })
// const mapDispatchToProps = (dispatch) => ({
//   setHistory: (history) => dispatch({ type: 'SET_HISTORY', history }),
//   setXIsNext: (xIsNext) => dispatch({ type: 'SET_XISNEXT', xIsNext })
// });

export default (BoardGame)
