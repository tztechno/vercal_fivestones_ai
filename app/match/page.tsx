"use client"
import Board from '@/components/Board';
import WinnerAnnouncePop from '@/components/WinnerAnnouncePop';
import { Button } from '@/components/ui/button';
import Link from 'next/link'
import { BoardState, checkPut, checkWinner, countPiece, initBoard, makeBoard, Player, Winner } from "@/utils/gameSetting";
import { useEffect, useState } from 'react';


export default function Match() {
    const [board, setBoard] = useState<BoardState>(initBoard());
    const [nowPlayer, setNowPlayer] = useState<Player>('black');
    const [winner, setWinner] = useState<Winner>(null);
    const [message, setMessage] = useState<string>("");
    let skip = false;

    /**
     * セルを押した時に処理する関数
     * @param row 置いたマスの縦
     * @param col 置いたマスの横
     */
    const cellClick = (row: number, col: number) => {
        //盤面変える
        const newBoard = makeBoard(board, col, row, nowPlayer);
        if(newBoard){
            setBoard(newBoard);
            setMessage('');
            skip = false;
            const winner = checkWinner(newBoard);
            if(winner){
                setWinner(winner);
            }else{
                //プレイヤーチェンジ
                setNowPlayer(nowPlayer === 'black' ? 'white' : 'black');
            }
            //プレイヤーチェンジ
            setNowPlayer(nowPlayer === 'black' ? 'white' : 'black');            
        }else{
            setMessage('そこには置けません。')
        }
    };
    /**
     * ゲームを最初からにする関数
     */
    const handleWinnerDismiss = () => {
        skip = false;
        setWinner(null);
        setBoard(initBoard()); // ゲームをリセット
        setNowPlayer('black'); // 初期プレイヤーをセット
        setMessage('');
    };
    /**
     * 打つところがなかったときの処理
     */
    const onClickSkipButton = () => {
        if(!checkPut(board, nowPlayer)){
            if(skip){
                skip = false;
                const winner = checkWinner(board);
                if(winner){
                    setWinner(winner);
                }
            }else{
                setMessage('スキップします。');
                skip = true;
                setNowPlayer(nowPlayer === 'black' ? 'white' : 'black');
            }
        }else{
            setMessage('置けるところがあります。');
        }
    };
    return(
        <div className='flex flex-col items-center'>
            <h2 className='font-bold' style={{fontSize: `25px`}}>二人で対戦する</h2>
            <Board board={board} onCellClick={cellClick}/>
            {!winner && <p>{nowPlayer}のターン</p>}
            {!winner && <p>黒：{countPiece(board).countBlack}　　白：{countPiece(board).countWhite}</p>}
            <Button variant="destructive" asChild onClick={onClickSkipButton}>
                <p>スキップ</p>
            </Button>
            <p>{message}</p>
            {winner && <WinnerAnnouncePop winner={winner} onDismiss={handleWinnerDismiss} />}
            
        </div>
    );
}
