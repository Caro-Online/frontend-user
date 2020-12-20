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
        return null;
    },
    checkWin2: (squares, boardSize) => {
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
                    if (numRow === 5) {
                        //Nếu 1 đầu trùng với biên
                        if ((j === 0 && squares[i * boardSize + j + 5] !== squares[i * boardSize + j]) ||
                            (j === boardSize - 4 && squares[i * boardSize + j - 1] !== squares[i * boardSize + j])) {
                            continue;
                        }
                        //Nếu trống 1 đầu bất kì
                        if (!squares[i * boardSize + j - 1] || !squares[i * boardSize + j + 5]) {
                            return squares[i * boardSize + j]
                        }
                        //Nếu chặn cả 2 đầu với 1 ô cùng nước đi (tức 6 ô giống nhau)
                        //Bên trái
                        if (!squares[i * boardSize + j - 1]) {
                            if (squares[i * boardSize + j - 1] === squares[i * boardSize + j]) {
                                return squares[i * boardSize + j]
                            }
                        }
                        //Bên phải
                        if (squares[i * boardSize + j + 5]) {
                            if (squares[i * boardSize + j + 5] === squares[i * boardSize + j]) {
                                return squares[i * boardSize + j]
                            }
                        }
                    }
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
                    if (numRow === 5) {
                        //Nếu 1 đầu trùng với biên
                        if ((i === 0 && squares[i + (j + 5) * boardSize] !== squares[i + j * boardSize]) ||
                            (i === boardSize - 4 && squares[i + (j - 1) * boardSize] !== squares[i + j * boardSize])) {
                            continue;
                        }
                        //Nếu trống 1 đầu bất kì
                        if (!squares[i + (j - 1) * boardSize] || !squares[i + (j + 5) * boardSize]) {
                            return squares[i + j * boardSize]
                        }
                        //Nếu chặn cả 2 đầu với 1 ô cùng nước đi (tức 6 ô giống nhau)
                        //Bên trái
                        if (!squares[i + (j - 1) * boardSize]) {
                            if (squares[i + (j - 1) * boardSize] === squares[i + j * boardSize]) {
                                return squares[i + j * boardSize]
                            }
                        }
                        //Bên phải
                        if (squares[i + (j + 5) * boardSize]) {
                            if (squares[i + (j + 5) * boardSize] === squares[i + j * boardSize]) {
                                return squares[i + j * boardSize]
                            }
                        }
                    }
                }
            }
        }

        //Theo đường chéo xuống
        for (let i = 0; i < boardSize - 4; i++) {
            for (let j = 0; j < boardSize - 4; j++) {
                let numRow = 1;
                if (squares[i * boardSize + j]) {
                    for (let k = 1; k < 5; k++) {
                        if (squares[i * boardSize + j] !== squares[i * boardSize + j - k * (boardSize + 1)]) {
                            j = j + k - 1;
                            break;
                        } else {
                            numRow += 1;
                        }
                    }
                    if (numRow === 5) {
                        //Nếu 1 đầu trùng với biên
                        if (((i === 0 || j === 0) && squares[i * boardSize + j + 5 * boardSize + 5] !== squares[i * boardSize + j]) ||
                            ((i === boardSize - 4 || j === boardSize - 4) && squares[i * boardSize + j - boardSize - 1] !== squares[i * boardSize + j])) {
                            continue;
                        }
                        //Nếu trống 1 đầu bất kì
                        if (!squares[i * boardSize + j - boardSize - 1] || !squares[i * boardSize + j + 5 * boardSize + 5]) {
                            return squares[i * boardSize + j]
                        }
                        //Nếu chặn cả 2 đầu với 1 ô cùng nước đi (tức 6 ô giống nhau)
                        //Bên trái
                        if (!squares[i * boardSize + j - boardSize - 1]) {
                            if (squares[i * boardSize + j - boardSize - 1] === squares[i * boardSize + j]) {
                                return squares[i * boardSize + j]
                            }
                        }
                        //Bên phải
                        if (squares[i * boardSize + j + 5 * boardSize + 5]) {
                            if (squares[i * boardSize + j + 5 * boardSize + 5] === squares[i * boardSize + j]) {
                                return squares[i * boardSize + j]
                            }
                        }
                    }
                }
            }
        }

        //Theo đường chéo lên
        for (let i = 4; i < boardSize; i++) {
            for (let j = 0; j < boardSize - 4; j++) {
                let numRow = 1;
                if (squares[i * boardSize + j]) {
                    for (let k = 1; k < 5; k++) {
                        if (squares[i * boardSize + j] !== squares[i * boardSize + j - k * (boardSize - 1)]) {
                            j = j + k - 1;
                            break;
                        } else {
                            numRow += 1;
                        }
                    }
                    if (numRow === 5) {
                        //Nếu 1 đầu trùng với biên
                        if (((i === boardSize || j === boardSize) && squares[i * boardSize + j - 5 * boardSize + 5] !== squares[i * boardSize + j]) ||
                            ((i === boardSize - 4 || j === 4) && squares[i * boardSize + j + boardSize - 1] !== squares[i * boardSize + j])) {
                            continue;
                        }
                        //Nếu trống 1 đầu bất kì
                        if (!squares[i * boardSize + j + boardSize + -1] || !squares[i * boardSize + j - 5 * boardSize + 5]) {
                            return squares[i * boardSize + j]
                        }
                        //Nếu chặn cả 2 đầu với 1 ô cùng nước đi (tức 6 ô giống nhau)
                        //Bên phải
                        if (!squares[i * boardSize + j + boardSize - 1]) {
                            if (squares[i * boardSize + j + boardSize - 1] === squares[i * boardSize + j]) {
                                return squares[i * boardSize + j]
                            }
                        }
                        //Bên phảii
                        if (squares[i * boardSize + j - 5 * boardSize + 5]) {
                            if (squares[i * boardSize + j - 5 * boardSize + 5] === squares[i * boardSize + j]) {
                                return squares[i * boardSize + j]
                            }
                        }
                    }
                }
            }
        }


        return null;
    }
}

export default gameService;