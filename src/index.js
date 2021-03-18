import React from "react";
import ReactDOM from "react-dom";
import "./index.css";


// We replaced the Square class below with a function

// Create class for our square component
// class Square extends React.Component {
//     //We got rid of the Square constructor because the state is now saved in the board

//     // When a Square is clicked, the onClick function provided by the Board is called. Here’s a review of how this is achieved:

//     // 1. The onClick prop on the built-in DOM <button> component tells React to set up a click event listener.
//     // 2. When the button is clicked, React will call the onClick event handler that is defined in Square’s render() method.
//     // 3. This event handler calls this.props.onClick(). The Square’s onClick prop was specified by the Board.
//     // 4. Since the Board passed onClick={() => this.handleClick(i)} to Square, the Square calls this.handleClick(i) when clicked.
//     // 5. We have not defined the handleClick() method yet, so our code crashes. If you click a square now, you should see a red error screen saying something like “this.handleClick is not a function”.

//   render() {
//     return (
//       //Create each button to click on the tictactoefield and detect each button click
//       //Pass in value of X onClick
//       <button 
//         className="square" 
//         onClick={() => this.props.onClick({value: 'X'})}>
          
//         {/* Pass in the prop value to each square */}
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

class Board extends React.Component {

    // React discourages storing the state of each square component individually
    // Use this constructor to set the board to contain an array of 9 nulls for each square
    // This lets us store the board's state in one place
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //       squares: Array(9).fill(null),
    //       // boolean to keep track of turns
    //       xIsNext: true,
    //     };
    //   }

      // In handleClick, we call .slice() to create a copy of the squares 
      // array to modify instead of modifying the existing array. 

      // Moved to GAME
    //   handleClick(i) {
    //     const squares = this.state.squares.slice();
    //     // Ignore click if there is a winner or square is filled
    //     if (calculateWinner(squares) || squares[i]) {
    //         return;
    //       }      
    //     squares[i] = this.state.xIsNext ? 'X' : 'O';
    //     this.setState({
    //         squares: squares,
    //         // Use handleClick to flip the state of the turn tracker
    //         xIsNext: !this.state.xIsNext,
    //     });
    //   }

  // Return each square component with a unique value
  renderSquare(i) {
      // We have already defined the squares array in the Board’s constructor, 
      // and we will modify the Board’s renderSquare method to read from it:
      // Each square now receives either X, O, or null
      return (
        // Now we’re passing down two props from Board to Square: value and 
        // onClick. The onClick prop is a function that Square can call when clicked. We’ll make the following changes to Square:
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

    // Set initial state so that game can control board and then squares
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                  squares: Array(9).fill(null)
                }
              ],
          stepNumber: 0,
          xIsNext: true,
        };
      }

      handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
          return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
          history: history.concat([{
            squares: squares,
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
        });
      }

      //Jump to whatever state of the game we want
      jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
      }

      render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        //Using the map method, we can map our history of moves to React elements 
        // representing buttons on the screen, and display a list of buttons to “jump” to past moves.

        // Let’s map over the history in the Game’s render method:
        const moves = history.map((step, move) => {
            const desc = move ?
              'Go to move #' + move :
              'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
          });

        let status;
        if (winner) {
          status = 'Winner: ' + winner;
        } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
    
        return (
          <div className="game">
            <div className="game-board">
              <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
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

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {

    // Array of winning states
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

    // Iterate through array to calculate existence of winning state
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }