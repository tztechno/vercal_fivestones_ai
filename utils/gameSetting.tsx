
//値に'black'か'white'かnullしかとらない型
export type CellValue = 'black' | 'white' | null;
//Cellvalueの二次元配列型
export type BoardState = CellValue[][];
//blackかwhiteしか値をとらない型
export type Player = 'black' | 'white';
//Playerか'draw'かnullしか値をとらない型
export type Winner = Player | 'draw' | null;


/**
 * ボードの初期化をする関数
 * @returns board: ボード情報
 */
export const initBoard = (): BoardState => {
    const board: BoardState = Array(8).fill(null).map(() => Array(8).fill(null));
    board[3][3] = 'white';
    board[3][4] = 'black';
    board[4][3] = 'black';
    board[4][4] = 'white';

    return board;
}
/**
 * プレイヤーの初期化をする関数
 * @returns player
 */
export const initPlayer = (advance: Boolean): Player => {
    return advance ? 'black' : 'white';
}
/**
 * AIの初期化をする関数
 * @returns player
 */
export const initAI = (player: Player): Player => {
    return player === 'black' ? 'white' : 'black';
}

/**
 * ひっくり返した後のボード情報を更新する関数
 * @param board 更新前のボード情報
 * @param col 置いたマスの横
 * @param row 置いたマスの縦
 * @param player 色
 * @returns newBoard: ひっくり返した後のボード情報
 */
export const makeBoard = (board: BoardState, col: number, row: number, player: Player): BoardState | null => {
    const newBoard: BoardState = board.map(row => [...row]);
    if(newBoard[row][col] != null){
        return null;
    }else{
        //ひっくり返せるか判定
        const checkBoardLines: BoardState = new Array(8).fill(null).map(() => Array(0));
            
        /** checkBoardLines = [右, 左, 上, 下, 右上, 左上, 右下, 左下]*/
        //左右
        board[row].forEach((cell, colIndex) => {
            (colIndex > col) ? checkBoardLines[0].push(cell) : (colIndex < col) ? checkBoardLines[1].unshift(cell) : {}
        });
        //上下
        board.map((rows) => rows[col]).map((cell, rowIndex) => {
            (rowIndex < row) ? checkBoardLines[2].unshift(cell) : (rowIndex > row) ? checkBoardLines[3].push(cell) : {}
        });
        //斜め四方向
        board.forEach((rows, rowIndex) => rows.forEach((cell, colIndex) => {
            (colIndex > col && rowIndex + colIndex === row + col) ? checkBoardLines[4].unshift(cell) : 
            (colIndex < col && rowIndex - colIndex === row - col) ? checkBoardLines[5].unshift(cell) : 
            (colIndex > col && rowIndex - colIndex === row - col) ? checkBoardLines[6].push(cell) : 
            (colIndex < col && rowIndex + colIndex === row + col) ? checkBoardLines[7].push(cell) : {}
        }));
        //checkBoardLines上でひっくり返す
        let retchenge = false;
        checkBoardLines.forEach((direction, dirIndex) => {
            let i = 0;
            while(direction[i] !== player && direction[i] !== null && direction.length > i){
                i++;
            }
            if(direction[i] === player && i !== 0){
                let j = 0;
                while(direction[j] !== player){
                    direction[j] = player;
                    j++;
                }
                retchenge = true;
            }else{
                return;
            }
        });

        //ひっくり返す(newBoardにcheckBoardLinesの結果を写す)
        if(retchenge){
            //左右方向をひっくり返す
            newBoard[row] = [...checkBoardLines[1].reverse(), newBoard[row][col], ...checkBoardLines[0]];
            //上下方向をひっくり返す
            newBoard.map((rows, rowIndex) => {
                if(rowIndex < row){
                    newBoard[rowIndex][col] = checkBoardLines[2][row - rowIndex - 1];
                }else if(rowIndex > row){
                    newBoard[rowIndex][col] = checkBoardLines[3][rowIndex - row - 1];
                }
            });
            //斜め方向をひっくり返す
            newBoard.map((rows, rowIndex) => {
                // 右上
                col + row - rowIndex < 8 && col + row - rowIndex > col ? newBoard[rowIndex][col + row - rowIndex] = checkBoardLines[4][row - rowIndex - 1] : {};
                //左上
                col - row + rowIndex >= 0 && col - row + rowIndex < col ? newBoard[rowIndex][col - row + rowIndex] = checkBoardLines[5][row - rowIndex - 1] : {};
                //右下
                col - row + rowIndex < 8 && col - row + rowIndex > col ? newBoard[rowIndex][col - row + rowIndex] = checkBoardLines[6][rowIndex - row - 1] : {};
                //左下
                col + row - rowIndex >= 0 && col + row - rowIndex < col ? newBoard[rowIndex][col + row - rowIndex] = checkBoardLines[7][rowIndex - row - 1] : {};
            });
            newBoard[row][col] = player;
            return newBoard;
            
        }else{
            return null;
        }
    }
}
/**
 * 置けるかどうかチェックする関数
 * @param board ボード情報
 * @param player 色
 * @returns 置けるかどうかのBoolean
 */
export const checkPut = (board: BoardState, player: Player): Boolean => {
    for(let rowIndex = 0; rowIndex < 8; rowIndex++){
        for(let colIndex = 0; colIndex < 8; colIndex++){
            if(makeBoard(board, colIndex, rowIndex, player)){
                return true;
            }
        }
    }
    return false;
}

/**
 * 特定のセルでおけるかどうかを判定する関数
 * @param board 
 * @param row 
 * @param col 
 * @param player 
 * @returns 
 */
export const checkPutRowCol = (board: BoardState, row: number, col: number, player: Player): Boolean => {
    if(makeBoard(board, col, row, player)){
        return true;
    }
    return false;
}


/**
 * 駒の数を黒、白ごとに数える関数
 * @param board ボード情報
 * @returns 黒と白のそれぞれの個数
 */
export const countPiece = (board: BoardState): {countBlack: number, countWhite: number} => {
    let countBlack = 0, countWhite = 0;
    board.map((rows, rowIndex) => {
        rows.map((cell, colIndex) => {
            if(cell !== null){
                cell === 'black' ? countBlack++ : countWhite++;
            }
        })
    })
    return {countBlack, countWhite};
}
/**
 * 勝者を判定する関数
 * @param board ボード情報
 * @param skip スキップしているかどうか
 * @returns 試合結果
 */
export const checkWinner = (board: BoardState): Winner => {
    const {countBlack, countWhite} = countPiece(board);
    if(countBlack + countWhite === 64 || countBlack === 0 || countWhite === 0 || (!checkPut(board, 'black') && !checkPut(board, 'white'))){
        if(countBlack === countWhite){
            return 'draw';
        }else if(countBlack > countWhite){
            return 'black';
        }else{
            return 'white';
        }
    }
    return null;
}