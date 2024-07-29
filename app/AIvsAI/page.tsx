"use client"
import Board from '@/components/Board';
import WinnerAnnouncePop from '@/components/WinnerAnnouncePop';
import { Button } from '@/components/ui/button';
import { isPlacedCorner, listCanPutCell, listCanPutPlayerPerAI, minOpponentPut } from '@/utils/AILogic';
import { BoardState, checkPut, checkWinner, countPiece, initAI, initBoard, makeBoard, Player, Winner } from "@/utils/gameSetting";
import { useEffect, useState } from 'react';

export default function AIvsAI() {
    const [board, setBoard] = useState<BoardState>(initBoard());
    const [AI1, setAI1] = useState<Player>('black'); // Player型が文字列リテラル型
    const [AI2, setAI2] = useState<Player>('white'); // Player型が文字列リテラル型
    const [winner, setWinner] = useState<Winner>(null);
    const [currentPlayer, setCurrentPlayer] = useState<'AI1' | 'AI2'>('AI1');
    const [gameStatus, setGameStatus] = useState<'ready' | 'playing' | 'paused' | 'finished'>('ready');

    useEffect(() => {
        if (gameStatus === 'playing' && !winner) {
            const currentAI = currentPlayer === 'AI1' ? AI1 : AI2;
            const opponent = currentPlayer === 'AI1' ? AI2 : AI1;
            AIMove(currentAI, opponent);
        }
    }, [gameStatus, currentPlayer, winner]);

    const AIMove = (AI: Player, opponent: Player) => {
        if (checkPut(board, AI)) {
            const canPutAI = listCanPutCell(board, AI);
            const canPutOpponentPerAI = listCanPutPlayerPerAI(board, canPutAI, AI);
            const countPieces = countPiece(board);

            let selectedMove: number;
            if (countPieces.countBlack + countPieces.countWhite <= 48) {
                if (!isPlacedCorner(canPutOpponentPerAI)) {
                    const cornerAIPut = canPutAI.filter(move => [0, 7, 56, 63].includes(move));
                    if (cornerAIPut.length > 0) {
                        selectedMove = cornerAIPut[Math.floor(Math.random() * cornerAIPut.length)];
                    } else {
                        const safeMoves = canPutAI.filter(move => ![9, 14, 49, 54].includes(move));
                        const minOpponentMoves = minOpponentPut(
                            safeMoves.map(move => listCanPutCell(makeBoard(board, move % 8, Math.floor(move / 8), AI) as BoardState, opponent)),
                            safeMoves
                        );
                        selectedMove = minOpponentMoves[Math.floor(Math.random() * minOpponentMoves.length)];
                    }
                } else {
                    const minOpponentMoves = minOpponentPut(canPutOpponentPerAI, canPutAI);
                    selectedMove = minOpponentMoves[Math.floor(Math.random() * minOpponentMoves.length)];
                }
            } else {
                const movesWithCounts = canPutAI.map(move => {
                    const newBoard = makeBoard(board, move % 8, Math.floor(move / 8), AI);
                    return {
                        move,
                        count: newBoard ? countPiece(newBoard)[AI === 'black' ? 'countBlack' : 'countWhite'] : 0
                    };
                });
                const maxCount = Math.max(...movesWithCounts.map(m => m.count));
                const bestMoves = movesWithCounts.filter(m => m.count === maxCount).map(m => m.move);
                selectedMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
            }

            const newBoard = makeBoard(board, selectedMove % 8, Math.floor(selectedMove / 8), AI);
            if (newBoard) {
                setTimeout(() => {
                    setBoard(newBoard);
                    const newWinner = checkWinner(newBoard);
                    if (newWinner) {
                        setWinner(newWinner);
                        setGameStatus('finished');
                    } else {
                        setCurrentPlayer(currentPlayer === 'AI1' ? 'AI2' : 'AI1');
                    }
                }, 500);
            }
        } else {
            setCurrentPlayer(currentPlayer === 'AI1' ? 'AI2' : 'AI1');
        }
    }

    const startGame = () => {
        setBoard(initBoard());
        setAI1('black'); // プレイヤーは文字列リテラル型
        setAI2('white'); // プレイヤーは文字列リテラル型
        setWinner(null);
        setCurrentPlayer('AI1');
        setGameStatus('playing');
    };

    const pauseGame = () => setGameStatus('paused');
    const resumeGame = () => setGameStatus('playing');

    const handleWinnerDismiss = () => {
        setGameStatus('ready');
    };

    return (
        <div className='flex flex-col items-center'>
            <h2 className='font-bold' style={{ fontSize: `25px` }}>AI vs AI</h2>
            <Board board={board} onCellClick={() => { }} />
            {!winner && <p>{currentPlayer}のターン</p>}
            {!winner && <p>黒：{countPiece(board).countBlack}　　白：{countPiece(board).countWhite}</p>}

            {gameStatus === 'ready' && (
                <Button onClick={startGame}>ゲーム開始</Button>
            )}
            {gameStatus === 'playing' && (
                <Button onClick={pauseGame}>一時停止</Button>
            )}
            {gameStatus === 'paused' && (
                <Button onClick={resumeGame}>再開</Button>
            )}

            {winner && <WinnerAnnouncePop winner={winner} onDismiss={handleWinnerDismiss} />}
        </div>
    );
}
