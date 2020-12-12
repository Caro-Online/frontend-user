import React from 'react'
import Square from './Square'
import './BoardGame.css'

const boardSize = 20;

export default function BoardGame() {
    const renderSquare = (i) => {
        return (
            <Square
                key={i}
                index={i}
            />
        );
    }

    const renderBoardRow = (i) => {
        let row = []
        for (let t = 0; t < boardSize; t++) {
            row.push(renderSquare(i * 19 + t))
        }
        return (
            <div key={i} className="board-row">
                {row}
            </div>
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
        <div className="board-container" >
            <div className="board">
                {renderBoard()}
            </div>
        </div>
    )
}
