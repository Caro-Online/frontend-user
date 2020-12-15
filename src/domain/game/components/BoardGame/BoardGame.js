import React, { useState } from 'react'
import Square from './Square'
import './BoardGame.css'

const boardSize = 20;

export default function BoardGame() {
    const [history, setHistory] = useState([{
        squares: Array(boardSize).fill(null),
    }])
    const [xIsNext, setXIsNext] = useState(true);

    const renderSquare = (i) => {
        return (
            <Square
                key={i}
                index={i}
                value={history[history.length - 1].squares[i]}
                onClick={() => {
                    console.log(i)
                    return handleSquareClick(i)

                }
                }

            />
        );
    }

    const handleSquareClick = (i) => {
        const newHistory = history.slice(0, history.length);
        const current = newHistory[history.length - 1];
        const squares = current.squares.slice();

        squares[i] = squares[i] ? squares[i] : (xIsNext ? 'X' : 'O');

        setHistory(newHistory.concat([{
            squares: squares,
        }]));
        setXIsNext(!xIsNext);
    }


    const renderBoardRow = (i) => {
        let row = []
        for (let t = 0; t < boardSize; t++) {
            row.push(renderSquare(i * boardSize + t))
        }
        return (
            <tr key={i} className="board-row">
                {row}
            </tr>
        );
    }

    const renderBoard = () => {
        let board = [];
        for (let t = 0; t < boardSize; t++) {
            board.push(renderBoardRow(t));
        }
        return board;
    }
    return (
        <table className="board">
            <tbody>
                {renderBoard()}
            </tbody>
        </table>
    )
}