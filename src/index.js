import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Componente Square
function Square(props) { 
  return (
    <button
      className={`square ${props.posicionActual === props.posicion ? 'cuadrado' : ''}`}  
      onClick={props.onClick}       
    >
      {props.value}
    </button>
  );
}

// move === this.state.stepNumber? "negrita" : ''

// class Square extends React.Component {  
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => this.props.onClick()}
//       >
//        {this.props.value}
//       </button>
//     );
//   }
// }

// Funcion para calcular el ganador
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
    const [a, b, c] = lines[i]; // Destructuring
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// Componente Board
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        posicionActual={this.props.posicionActual}
        posicion={i}
      />
    );
  }

  render() {
    const drawSquare = [];  
    for(let i=0; i< this.props.squares.length ; i++){
      drawSquare.push(<div key={i}>{this.renderSquare(i)}</div>);
    }        
    return (
      <div>         
        <div className="board-row">
          {drawSquare}        
        </div>
      </div>
    );
  }
}

//     return (      
//       <div>         
//         <div className="board-row">
//           {this.renderSquare(0)}
//           {this.renderSquare(1)}
//           {this.renderSquare(2)}       
//           {this.renderSquare(3)}
//           {this.renderSquare(4)}
//           {this.renderSquare(5)}
//           {this.renderSquare(6)}
//           {this.renderSquare(7)}
//           {this.renderSquare(8)}          
//         </div>
//       </div>
//     );
//   }
// }

// Componente Game
class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      history: [{ // 
      squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  
  handleClick(i){ // i es el indice de la casilla que se ha pulsado (0,1,2,3,4,5,6,7,8)
    const history = this.state.history.slice(0, this.state.stepNumber + 1); 
    // const current = history[history.length -1];
    const current = history[this.state.stepNumber]; // current is the ultimo objeto del array
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = (this.state.xIsNext && 'X') || 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        // Store the index of the latest moved square
        latestMovedSquare: i,
      }]),
      // history: [...history, {squares: squares}],
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history; // Array de objetos
    const current = history[this.state.stepNumber]; // current es el ultimo objeto del array
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => { // moves es un array de objetos 
      const posicion = step.latestMovedSquare;
      const row = Math.floor(posicion / 3) + 1;
      const column = posicion % 3 + 1;
      const desc = move ? 
        // 'Go to move #' + move :
        `Go to move # ${move} (${row},${column})` :      
        'Go to game start';

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={ move === this.state.stepNumber? "negrita" : ''}>{desc}</button>
          {/* <button onClick={this.jumpTo.bind(this,move)}>{desc}</button>  */}
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: Gamer ${winner}`; 
    } else if (current.squares[0] && current.squares[1] && current.squares[2] && current.squares[3] && current.squares[4] && current.squares[5] && current.squares[6] && current.squares[7] && current.squares[8]) {
      status = 'Empate: Nadie gana';
    } else {
      status = `Next player: Gamer ${this.state.xIsNext ? 'X': 'O'}`;
    }
 
    return (
      <div className="game"> 
        <div className="game-board">
          <Board            
            squares={current.squares}            
            // onClick={(i) => this.handleClick(i)}
            onClick={this.handleClick.bind(this)}
            posicionActual={current.latestMovedSquare}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

function App() {
  return ( 
    <>
      <Game />   
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

