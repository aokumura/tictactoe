/* React Tic Tact Toe - 
   Task 4: Add a toggle button that lets you sort the moves in either ascending or descending order.
*/

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
          key={'square'+i}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
    
    render() {
      let counter = 0;
      let board = [];
      for (let row = 0; row < 3; row++) {
        let rows = [];
        for (let col = 0; col < 3; col++) {
          rows.push(this.renderSquare(counter));
          counter++;
        }
        board.push(<div key={'row'+row} className="board-row">{rows}</div>);
      }
      
      return (
        <div>
          {board}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null),
            squareLocation: null
          }
        ],
        stepNumber: 0,
        xIsNext: true,
        isAscending: true
      };
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          {
            squares: squares,
            squareLocation: i
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }
  
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }
  
    toggleSort() {
      this.setState({
        isAscending: !this.state.isAscending
      });  
    }
    
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
  
      let moves = history.map((step, move) => {
        const moveCoordinates = getMoveCoordinates(step.squareLocation)
        const desc = move ?
          'Go to move #' + move + ' ' + moveCoordinates:
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              {move == this.state.stepNumber ? <b>{desc}</b> : desc}
            </button>
          </li>
        );
      });
      
      if (!this.state.isAscending) {
        moves.reverse();
      }
      
      let status;
      if (winner) {
        status = "Winner: " + winner;
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <button onClick={i => this.toggleSort()}>{this.state.isAscending ? 'Descending ↓' : 'Ascending ↑'}</button>
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
  }
  
  function getMoveCoordinates(squareLocation) {
    const col = (squareLocation + 1) % 3 ? (squareLocation + 1) % 3 : 3;
    const row = Math.floor(squareLocation / 3) + 1;
    return '[' + col + ',' + row + ']';
  }