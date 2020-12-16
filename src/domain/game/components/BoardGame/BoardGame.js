import React, { useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom';
import Square from './Square'
import './BoardGame.css'
import { getSocket } from '../../../../shared/utils/socket.io-client'

const boardSize = 20;


export default function BoardGame() {
    const [history, setHistory] = useState([{
        squares: Array(boardSize).fill(null),
    }])
    const [xIsNext, setXIsNext] = useState(true);
    const [move, setMove] = useState(null);
    const [room, setRoom] = useState(null);
    const [disable, setDisable] = useState(false);//disable check in board and wait ...
    const location = useLocation();
    const reactHistory = useHistory();
    let socket;

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
            socket.emit(
                'sendMove',
                { move, room },
                () => setMove(null)
            );
        }
    };

    const renderSquare = (i) => {
        return (
            <Square
                key={i}
                index={i}
                value={history[history.length - 1].squares[i]}
                onClick={() => {
                    console.log(i)
                    sendMove(i);
                    return handleSquareClick(i);
                }}
                disable={disable}
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
        setMove(i);
        setDisable(!disable);
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
            {console.log(reactHistory)}
            <tbody>
                {renderBoard()}
            </tbody>
        </table>
    )
}