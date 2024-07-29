
import { BoardState, Player, makeBoard, checkPutRowCol } from './gameSetting';



//AIの置けるところごとに置いたときのプレイヤーの置けるところをリスト化する関数
export const listCanPutPlayerPerAI = (board: BoardState, canPutAI: number[], AI: Player): number[][] => {
    //const canPutPlayerPerAI = new Array(canPutAI.length).fill(null).map(() => Array(0));
    const canPutPlayerPerAI = new Array();
    canPutAI.map((cellIndex, index) => {
        const checkMakeBoard = makeBoard(board, Math.trunc(cellIndex % 8), Math.trunc(cellIndex / 8), AI);
        if(checkMakeBoard){
            const provisionalBoard = checkMakeBoard;
            const canPutPlayer = listCanPutCell(provisionalBoard, AI === 'black' ? 'white' : 'black');
            canPutPlayerPerAI.push(canPutPlayer);
        }else{
            canPutPlayerPerAI.push([null]);
        }
    });
    return canPutPlayerPerAI;
}

//プレイヤー(AIも)の置けるところをリスト化する関数
export const listCanPutCell = (board: BoardState | null, player: Player): number[] => {
    const canPutAI = new Array(0);
    if(board){
        board.map((rows, rowIndex) => {
            rows.map((cell, colIndex) => {
                if(cell === null){
                    if(checkPutRowCol(board, rowIndex, colIndex, player)){
                        canPutAI.push(rowIndex * 8 + colIndex);
                    }                    
                }
            })
        });
    }
    return canPutAI;
}

//次絶対に角に置かれてしまうか判定する関数
export const isPlacedCorner = (canPutPlayerPerAI: number[][]): Boolean => {
    for(let i = 0; i < canPutPlayerPerAI.length; i++){
        let canPutCorner = false;
        for(let j = 0; j < canPutPlayerPerAI[i].length; j++){
            if(canPutPlayerPerAI[i][j] === 0
                    || canPutPlayerPerAI[i][j] === 7
                    || canPutPlayerPerAI[i][j] === 56
                    || canPutPlayerPerAI[i][j] === 63){
                canPutCorner = true;
            }
        }
        if(!canPutCorner){
            return false;
        }
    }
    return true;
} 

//相手が置ける手数が最も少ない自分の一手を配列で返す
export const minOpponentPut = (canPutPlayerPerAI: number[][], canPutAI: number[]): number[] => {
    const minOpponentAIPut = new Array();
    let numberOfMoves = canPutPlayerPerAI.map((canPutPlayer) => canPutPlayer.length);
    numberOfMoves = numberOfMoves.sort();
    for(let i = 0; i < canPutPlayerPerAI.length; i++){
        if(canPutPlayerPerAI[i].length === numberOfMoves[0]){
            minOpponentAIPut.push(canPutAI[i]);
        }
    }
    return minOpponentAIPut;
}