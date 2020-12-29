import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import Square from './Square';

import './BoardGame.css';
import { getSocket } from '../../../../shared/utils/socket.io-client';
import gameService from './gameService';
import { updateNextPlayer } from '../../../../store/actions/game.action';
import { getUserIdFromStorage } from '../../../../shared/utils/utils';
import api from '../../apiGame'
import { forEach, map } from 'lodash';

const boardSize = 17;

const BoardGame = React.memo((props) => {
  const [disable, setDisable] = useState(true); //disable board and waiting
  const reactHistory = useHistory();
  const [rerender, setRerender] = useState(false)

  //Check đúng userId và lượt đi, mở ô cho đánh
  const setPlaying = (xIsNext) => {
    const userId = getUserIdFromStorage();
    if (props.players.length === 2 && xIsNext !== null) {
      if ((props.players[0].user._id === userId && xIsNext) ||
        (props.players[1].user._id === userId && !xIsNext)) {
        setDisable(false);
      }
    }
  }

  const receiveMove = useCallback(() => {
    if (props.socket && props.match) {
      props.socket.on('receive-move', (message) => {
        const { move } = message;
        const newHistory = props.match.history.slice();
        newHistory.push(move)
        props.setMatch({ ...props.match, history: newHistory, xIsNext: !props.match.xIsNext })
        // props.setHistory(newHistory)
        // props.setXIsNext(!props.xIsNext)
        setPlaying(!props.match.xIsNext);//check userId vaf xIsNext
      });
    }
  }, [props.match])

  useEffect(() => {
    receiveMove()
    if (props.match) {
      setPlaying(props.match.xIsNext)
    }
  }, [props.match])


  const sendMove = (i) => {
    props.socket.emit('send-move', {
      move: i,
      matchId: props.match._id,
    });
  };

  const getSquareValue = (i) => {
    if (props.match) {
      for (let k = 0; k < props.match.history.length; k++) {
        if (props.match.history[k] === i) {
          return k % 2 === 0 ? 'X' : 'O';
        }
      }
      return null
    }
    return null;
  }

  const checkWinSquare = useCallback((i) => {
    if (props.match) {
      props.match.winRaw.forEach(sq => {
        return sq === i
      })
    }
    return false
  }, [props.match])

  const renderSquare = (i) => {
    return (
      <Square
        key={i}
        index={i}
        winRaw={checkWinSquare(i)}
        value={getSquareValue(i)}
        onClick={() => handleSquareClick(i)}
        disable={disable}
        setDisable={setDisable}
      />
    );
  };



  const handleSquareClick = async (i) => {

    if (props.match) {
      const newHistory = props.match.history.slice();
      //Nếu bước chưa tồn tại
      if (!getSquareValue(i)) {
        newHistory.push(i)
        props.setMatch({ ...props.match, history: newHistory, xIsNext: !props.match.xIsNext })
        await api.addMove(props.match._id, i, !props.xIsNext)//add to db
        sendMove(i);//socket emit
      }
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

  let status;
  // if (props.room) {
  //   if (props.room.rule === 'BLOCK_TWO_SIDE') {
  //     winner = gameService.checkWin2(squares, boardSize);
  //   } else if (props.room.rule === 'NOT_BLOCK_TWO_SIDE') {
  //     winner = gameService.checkWin(squares, boardSize);
  //   }
  // }
  return (
    <div>
      <div className="game-info">
        {console.log(props.match)}
        {console.log("xIsNext: " + (props.match ? props.match.xIsNext : null) + " disable: " + disable)}
        <div>{status}</div>
      </div>
      <table className="board">
        <tbody>{renderBoard()}</tbody>
      </table>
    </div>
  );
})

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
