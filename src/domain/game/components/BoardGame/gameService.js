const gameService = {
    checkWin: (squares, boardSize) => {
        //Theo chiều ngang
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize - 4; j++) {
                let numRow = 1;
                if (squares[i * boardSize + j]) {
                    for (let k = 1; k < 5; k++) {
                        if (squares[i * boardSize + j] !== squares[i * boardSize + j + k]) {
                            j = j + k - 1;
                            break;
                        } else {
                            numRow += 1;
                        }
                    }
                    if (numRow === 5) return squares[i * boardSize + j]
                }
            }
        }
        //Theo chiều dọc
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize - 4; j++) {
                let numRow = 1;
                if (squares[i + j * boardSize]) {
                    for (let k = 1; k < 5; k++) {
                        if (squares[i + j * boardSize] !== squares[i + j * boardSize + k * boardSize]) {
                            j = j + k - 1;
                            break;
                        } else {
                            numRow += 1;
                        }
                    }
                    if (numRow === 5) return squares[i + j * boardSize]
                }
            }
        }
        //Theo đường chéo xuống
        for (let i = 0; i < boardSize - 4; i++) {
            for (let j = 0; j < boardSize - 4; j++) {
                let numRow = 1;
                if (squares[i * boardSize + j]) {
                    for (let k = 1; k < 5; k++) {
                        if (squares[i * boardSize + j] !== squares[i * boardSize + j + k * (boardSize + 1)]) {
                            j = j + k - 1;
                            break;
                        } else {
                            numRow += 1;
                        }
                    }
                    if (numRow === 5) return squares[i * boardSize + j]
                }
            }
        }
        //Theo đường chéo lên
        for (let i = 4; i < boardSize; i++) {
            for (let j = 0; j < boardSize - 4; j++) {
                let numRow = 1;
                if (squares[i * boardSize + j]) {
                    for (let k = 1; k < 5; k++) {
                        if (squares[i * boardSize + j] !== squares[i * boardSize + j + k * (boardSize - 1)]) {
                            j = j + k - 1;
                            break;
                        } else {
                            numRow += 1;
                        }
                    }
                    if (numRow === 5) return squares[i * boardSize + j]
                }
            }
        }
        //Hòa
        let full = true;
        for (let i; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (!squares[i * boardSize + j]) {
                    full = false;
                    break;
                }
            }
            if (!full) break;
        }
        if (full) return 'D'
    }
}

export default gameService;