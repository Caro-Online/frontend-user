import React, { useCallback } from "react";
import { Space, Button } from "antd";
import { boardSize } from "src/domain/game/components/BoardGame/BoardGame";
import Square from "./Square";
import "./Board.css";
const Board = ({ match, historyMatchLength }) => {
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
  const getSquareValue = useCallback(
    (i) => {
      if (match) {
        for (let k = 0; k < match.history.length; k++) {
          if (match.history[k] === i) {
            return k % 2 === 0 ? "X" : "O";
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

  const renderSquare = useCallback((i) => {
    let isWin;
    if (historyMatchLength === match?.history.length) {
      isWin = checkWinSquare(i);
    }
    return (
      <Square
        key={i}
        index={i}
        isPrevious={getPreviousMove(i)}
        isWin={isWin} // nếu ô nằm trong winraw thì highlight
        value={getSquareValue(i)}
      />
    );
  });
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
  return (
    <div>
      <Space align="center">
        <table className="board">
          <tbody>{renderBoard()}</tbody>
        </table>
      </Space>
    </div>
  );
};
export default Board;
