import { useState } from 'react';

const BOARD_SIZE = 3;

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      className={isWinning ? 'square winning':'square'}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const result = calculateWinner(squares);
  const winningLine = result ? result.line:[];
  const isDraw = !result && squares.every((square) => square !== null);

  function handleClick(i) {
    if (squares[i] || result) {
      return;
    }

    // copy squares
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X':'O';
    onPlay(nextSquares, i);
  }

  // updates
  let status;
  if (result) {
    status = 'Winner: '+result.winner;
  } else if (isDraw) {
    status = "It's a draw! No one wins.";
  } else {
    status = 'Next player: '+(xIsNext ? 'X':'O');
  }

  // Building the board structure
  const rows = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    const rowSquares = [];


    for (let col = 0; col < BOARD_SIZE; col++) {


      const index = row * BOARD_SIZE + col;
      rowSquares.push(
        <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} isWinning={winningLine.includes(index)}
        />
      );
    }
    rows.push(
      <div key={row} className="board-row">{rowSquares}</div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  // History and events
  const [history, setHistory] = useState([

    { squares: Array(9).fill(null), location: null },
  ]);

  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);


  const xIsNext = currentMove % 2 == 0;


  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, location) {

    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, location:location },
    ];
    setHistory(nextHistory);

    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSortOrder() {
    setIsAscending(!isAscending);
  }

  const moves = history.map((step, move) => {
    let description;
    if (move > 0) 
    {
      const row = Math.floor(step.location/BOARD_SIZE) + 1;
      const col = (step.location % BOARD_SIZE) + 1;
      description = `move #${move} (${row}, ${col})`;
    }
    else {
      description = 'game start';
    }

    // current move is displayed thorugh this  
    if (move == currentMove) {
      return (
        <li key={move}>
          <span className="current-move">You are at {description}</span>
        </li>
      );
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>Go to {description}</button>
      </li>
    );
  });


  const sortedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button className="sort-toggle" onClick={toggleSortOrder}>
          Sort: {isAscending ? 'Ascending' : 'Descending'}
        </button>
        <ol reversed={!isAscending}>{sortedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
      return { winner:squares[a], line:lines[i]};
    }
  }

  return null;
}
