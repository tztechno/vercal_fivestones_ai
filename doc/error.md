---

Failed to compile.
./app/AIvsAI/page.tsx:52:78
Type error: Property 'color' does not exist on type 'Player'.
  Property 'color' does not exist on type '"black"'.
  50 |                 const movesWithCounts = canPutAI.map(move => {
  51 |                     const newBoard = makeBoard(board, move % 8, Math.floor(move / 8), AI);
> 52 |                     return { move, count: newBoard ? countPiece(newBoard)[AI.color === 'black' ? 'countBlack' : 'countWhite'] : 0 };
     |                                                                              ^
  53 |                 });
  54 |                 const maxCount = Math.max(...movesWithCounts.map(m => m.count));
  55 |                 const bestMoves = movesWithCounts.filter(m => m.count === maxCount).map(m => m.move);
Error: Command "npm run build" exited with 1


---