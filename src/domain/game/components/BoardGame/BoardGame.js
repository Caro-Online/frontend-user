import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import Square from './Square';

import './BoardGame.css';
import { getSocket } from '../../../../shared/utils/socket.io-client';
import gameService from './gameService';
import { updateNextPlayer } from '../../../../store/actions/game.action';
import { getUserIdFromStorage } from '../../../../shared/utils/utils';
import api from '../../apiGame';
import { forEach, map } from 'lodash';

const boardSize = 17;

const BoardGame = React.memo(({ players, match, socket, setMatch }) => {
  const [disable, setDisable] = useState(true); //disable board and waiting
  const reactHistory = useHistory();
  const [rerender, setRerender] = useState(false);

  //Check đúng userId và lượt đi, mở ô cho đánh
  const setPlaying = useCallback(
    (xIsNext) => {
      const userId = getUserIdFromStorage();
      if (players.length === 2 && xIsNext !== null) {
        if (
          (players[0].user._id === userId && xIsNext) ||
          (players[1].user._id === userId && !xIsNext)
        ) {
          setDisable(false);
        }
      }
    },
    [players]
  );

  useEffect(() => {
    // Nếu match start thì lắng nghe sự kiện receive-move
    socket.on('match-start', async ({ matchId }) => {
      console.log('In here');
      socket.on('receive-move', ({ updatedMatch }) => {
        console.log('ReceiveMove');
        // Cập nhật lại match cho các client trong room
        setMatch({ ...updatedMatch });
        if (!updatedMatch.winner) {
          setPlaying(!updatedMatch.xIsNext); //check userId vaf xIsNext
        }
      });
      socket.on('have-winner', ({ updatedMatch }) => {
        setMatch({ ...updatedMatch });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, setMatch, setPlaying]);

  useEffect(() => {
    if (match) {
      if (!match.winner) {
        setPlaying(match.xIsNext);
      }
    }
  }, [match, setMatch, setPlaying, socket]);

  const emitSendMove = useCallback(
    () => {
      socket.emit('send-move', {
        matchId: match._id,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [socket, match]
  );

  const getSquareValue = useCallback(
    (i) => {
      if (match) {
        for (let k = 0; k < match.history.length; k++) {
          if (match.history[k] === i) {
            return k % 2 === 0 ? 'X' : 'O';
          }
        }
        return null;
      }
      return null;
    },
    [match]
  );

  let checkWinSquare = (i) => {
    let isWin = false;
    if (match) {
      match.winRaw.forEach(sq => {
        if (sq === i) {
          console.log(i)
          isWin = true;//nếu index có trong winraw trả về true
          return;
        }
      })
    }
    return isWin;
  }

  const renderSquare = (i) => {
    let isWin = checkWinSquare(i);

    return (
      <Square
        key={i}
        index={i}
        isWin={isWin}// nếu ô nằm trong winraw thì highlight
        value={getSquareValue(i)}
        onClick={() => handleSquareClick(i)}
        disable={disable}
        setDisable={setDisable}
      />
    );
  };

  const handleSquareClick = async (i) => {
    if (match) {
      const newHistory = match.history.slice();
      //Nếu bước chưa tồn tại
      if (!getSquareValue(i)) {
        newHistory.push(i);
        setMatch({ ...match, history: newHistory, xIsNext: !match.xIsNext });
        await api.addMove(match._id, i, !match.xIsNext); //add to db
        emitSendMove(i); //socket emit
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
  // if (room) {
  //   if (room.rule === 'BLOCK_TWO_SIDE') {
  //     winner = gameService.checkWin2(squares, boardSize);
  //   } else if (room.rule === 'NOT_BLOCK_TWO_SIDE') {
  //     winner = gameService.checkWin(squares, boardSize);
  //   }
  // }
  return (
    <div>
      <div className="game-info">
        {console.log(match)}
        <div>{status}</div>
      </div>
      <table className="board">
        <tbody>{renderBoard()}</tbody>
      </table>
    </div>
  );
});

// const mapStateToProps = (state) => ({
//   players: state.game.players,
//   xIsNext: state.game.xIsNext,
//   history: state.game.history
// })
// const mapDispatchToProps = (dispatch) => ({
//   setHistory: (history) => dispatch({ type: 'SET_HISTORY', history }),
//   setXIsNext: (xIsNext) => dispatch({ type: 'SET_XISNEXT', xIsNext })
// });

export default BoardGame;
