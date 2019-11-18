import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = ({ value, onClick }) => {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
};

const Board = ({ squares, onClick }) => {
  const renderSquare = i => {
    return <Square value={squares[i]} onClick={() => onClick(i)} />;
  };

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

const Game = () => {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [status, setStatus] = useState('');

  const xIsNext = useCallback(() => {
    return stepNumber % 2 === 0;
  }, [stepNumber]);

  const current = useCallback(() => {
    return history[stepNumber].squares.slice();
  }, [history, stepNumber]);

  useEffect(() => {
    const squares = current();
    const winner = calculateWinner(squares);
    setStatus(
      winner ? 'Winner: ' + winner : 'Next player: ' + (xIsNext() ? 'X' : 'O')
    );
  }, [history, stepNumber, xIsNext, current]);

  const moves = history.map((_step, move) => {
    const desc = move ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  const onClick = i => {
    const squares = current();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext() ? 'X' : 'O';

    setHistory(
      history.slice(0, stepNumber + 1).concat([
        {
          squares: squares
        }
      ])
    );
    setStepNumber(stepNumber + 1);
  };

  const jumpTo = step => {
    setStepNumber(step);
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={history[stepNumber].squares}
          onClick={i => onClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

const calculateWinner = squares => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
