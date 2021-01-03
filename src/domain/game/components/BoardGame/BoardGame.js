import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { message as antMessage } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';

import Square from './Square';

import './BoardGame.css';
import { getSocket } from '../../../../shared/utils/socket.io-client';
import gameService from './gameService';
import { updateNextPlayer } from '../../../../store/actions/game.action';
import { getUserIdFromStorage } from '../../../../shared/utils/utils';
import api from '../../apiGame';
import { forEach, map } from 'lodash';
import loading from 'src/shared/assets/images/loading.svg';

const boardSize = 17;

const BoardGame = React.memo(
  ({
    players,
    match,
    socket,
    setMatch,
    disable,
    setDisable,
    countdownDuration,
  }) => {
    const reactHistory = useHistory();
    const params = useParams();
    const { roomId } = params;

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
      [players, setDisable]
    );

    useEffect(() => {
      // Nếu match start thì lắng nghe sự kiện receive-move
      const receiveMoveListener = ({ updatedMatch }) => {
        console.log('ReceiveMove');
        // Cập nhật lại match cho các client trong room
        setMatch({ ...updatedMatch });
        if (!updatedMatch.winner) {
          setPlaying(!updatedMatch.xIsNext); //check userId vaf xIsNext
        }
      };

      socket.on('receive-move', receiveMoveListener);

      return () => {
        socket.off('receive-move', receiveMoveListener);
      };
    }, [socket, setMatch, setPlaying]);

    useEffect(() => {
      if (match) {
        if (!match.winner) {
          setPlaying(match.xIsNext);
        }
      }
    }, [match, setMatch, setPlaying, socket]);

    const emitSendMove = useCallback(
      (updatedMatch) => {
        socket.emit('send-move', {
          match: updatedMatch,
        });
      },
      [socket]
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

    let checkWinSquare = useCallback(
      (i) => {
        let isWin = false;
        if (match) {
          if (match.winRaw) {
            match.winRaw.forEach((sq) => {
              if (sq === i) {
                console.log(i);
                isWin = true; //nếu index có trong winraw trả về true
                return;
              }
            });
          }
        }
        return isWin;
      },
      [match]
    );

    const handleSquareClick = useCallback(
      async (i) => {
        if (match) {
          const newHistory = match.history.slice();
          //Nếu bước chưa tồn tại
          if (!getSquareValue(i)) {
            newHistory.push(i);
            const date = new Date(Date.now() + countdownDuration * 1000);
            const timeExp = moment.utc(date).format();
            const updatedMatch = {
              ...match,
              history: newHistory,
              xIsNext: !match.xIsNext,
              timeExp: timeExp,
            };
            setMatch(updatedMatch);
            emitSendMove(updatedMatch);
            const response = await api.addMove(
              match._id,
              i,
              !match.xIsNext,
              roomId
            ); //add to db
            const { match: returnMatch, message } = response.data;
            if (!returnMatch) {
              console.log(message);
              antMessage.error(message);
            }
          }
        } else {
          setDisable(!disable);
        }
      },
      [
        emitSendMove,
        getSquareValue,
        match,
        setMatch,
        countdownDuration,
        roomId,
        disable,
        setDisable,
      ]
    );

    const getPreviousMove = useCallback(
      (i) => {
        if (match) {
          if (match.history[match.history.length - 1] === i) {
            return true;
          }
        }
        return false;
      },
      [match]
    );

    const renderSquare = useCallback(
      (i) => {
        let isWin = checkWinSquare(i);

        return (
          <Square
            key={i}
            index={i}
            isPrevious={getPreviousMove(i)}
            isWin={isWin} // nếu ô nằm trong winraw thì highlight
            value={getSquareValue(i)}
            onClick={() => handleSquareClick(i)}
            disable={disable}
            setDisable={setDisable}
          />
        );
      },
      [
        checkWinSquare,
        disable,
        getSquareValue,
        handleSquareClick,
        setDisable,
        getPreviousMove,
      ]
    );

    const renderBoardRow = useCallback(
      (i) => {
        let row = [];
        for (let t = 0; t < boardSize; t++) {
          row.push(renderSquare(i * boardSize + t));
        }
        return (
          <tr key={i} className="board-row">
            {row}
          </tr>
        );
      },
      [renderSquare]
    );

    const renderBoard = useCallback(() => {
      let board = [];
      for (let t = 0; t < boardSize; t++) {
        board.push(renderBoardRow(t));
      }
      return board;
    }, [renderBoardRow]);

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
          {!disable ? (
            <div className="your-turn">
              Đến lượt bạn <img src={loading} />
            </div>
          ) : (
            <div className="your-turn"></div>
          )}
        </div>
        <table className="board">
          <tbody>{renderBoard()}</tbody>
        </table>
      </div>
    );
  }
);

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
