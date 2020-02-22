import React from "react";
import "./App.css";

const SQUARE_STATUS = {
  NONE: 0,
  NO: 1,
  YES: 2
};

const REGION = {
  CENTER: 0,
  LEFT: 1,
  BOTTOM: 2
};

class Square extends React.Component {
  render() {
    return (
      <button
        className={"square grid " + this.props.value}
        onClick={this.props.onClick}
      ></button>
    );
  }
}

const HintList = ({ list }) => (
  <ul>
    {list.map(item => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

class Board extends React.Component {
  constructor(props) {
    super(props);
    let hints = [
      "Mrs. Mueller's student isn't Shelley.",
      "Mr. French's student has the 10:00am class.",
      "The trainee with the 11:00am class is either Willard or Mr. French's student.",
      "Of the student with the 12 noon class and Tricia, one is Mr. Duke's student and the other is Mr. Keller's trainee.",
      "Of the trainee with the 9:00am class and the student with the 12 noon class, one is Mr. Keller's trainee and the other is Casey.",
      "Mrs. Mueller's trainee has the 1:00pm class."
    ]; //hints should be read from database/file

    let answers = [
      [2, 3, 17],
      [6, 7, 11],
      [14, 14, 24],
      [15, 15, 0],
      [23, 21, 8]
    ]; //answers should be read from database/file

    let topLabels = [
      "Mr Duke",
      "Mr French",
      "Mr Keller",
      "Mrs Mueller",
      "Mr Underwood",
      "Casey",
      "Nettie",
      "Shelley",
      "Tricia",
      "Willard"
    ];

    let sideLabels = [
      "9:00am",
      "10:00am",
      "11:00am",
      "12 noon",
      "1:00pm",
      "Casey",
      "Nettie",
      "Shelley",
      "Tricia",
      "Willard"
    ];

    this.state = {
      squares: Array(25).fill(SQUARE_STATUS.NONE),
      squaresLeft: Array(25).fill(SQUARE_STATUS.NONE),
      squaresBottom: Array(25).fill(SQUARE_STATUS.NONE),
      lastClickedSquare: 0,
      lastClickedRegion: REGION.CENTER,
      prevSquares: Array(25).fill(SQUARE_STATUS.NONE),
      prevSquaresLeft: Array(25).fill(SQUARE_STATUS.NONE),
      prevSquaresBottom: Array(25).fill(SQUARE_STATUS.NONE),
      topLabels: topLabels,
      sideLabels: sideLabels,
      status: "",
      hints: hints,
      answers: answers,
      solved: false
    };
  }

  checkAnswers() {
    let solved = true;

    for (let i = 0; i < this.state.answers.length; i++) {
      let answer = this.state.answers[i];
      if (
        this.state.squares[answer[0]] !== SQUARE_STATUS.YES ||
        (this.state.squaresLeft[answer[1]] !== SQUARE_STATUS.YES &&
          this.state.squaresBottom[answer[2]] !== SQUARE_STATUS.YES) ||
        (this.state.squaresLeft[answer[1]] === SQUARE_STATUS.YES &&
          this.state.squaresBottom[answer[2]] === SQUARE_STATUS.NO) ||
        (this.state.squaresLeft[answer[1]] === SQUARE_STATUS.NO &&
          this.state.squaresBottom[answer[2]] === SQUARE_STATUS.YES)
      ) {
        solved = false;
        break;
      }
    }
    return solved;
  }

  handleClick(i, region) {
    const squares =
      region === REGION.CENTER
        ? this.state.squares.slice()
        : region === REGION.LEFT
        ? this.state.squaresLeft.slice()
        : this.state.squaresBottom.slice();

    const prevSquares =
      region === REGION.CENTER
        ? this.state.prevSquares.slice()
        : region === REGION.LEFT
        ? this.state.prevSquaresLeft.slice()
        : this.state.prevSquaresBottom.slice();

    if (
      i === this.state.lastClickedSquare &&
      region === this.state.lastClickedRegion &&
      squares[i] === SQUARE_STATUS.YES
    ) {
      prevSquares[i] = (squares[i] + 1) % 3;
      switch (region) {
        case REGION.CENTER:
          this.setState({
            squares: prevSquares,
            status: ""
          });
          break;
        case REGION.LEFT:
          this.setState({
            squaresLeft: prevSquares,
            status: ""
          });
          break;
        case REGION.BOTTOM:
          this.setState({
            squaresBottom: prevSquares,
            status: ""
          });
          break;
        default:
          break;
      }
      return;
    }
    const LastSquares = squares.slice();

    squares[i] = (squares[i] + 1) % 3;

    if (squares[i] === SQUARE_STATUS.YES) {
      let otherGreen = false;
      let startRow = Math.floor(i / 5) * 5;

      for (let k = startRow; k < startRow + 5; k++) {
        if (k !== i && squares[k] === SQUARE_STATUS.NONE) {
          squares[k] = SQUARE_STATUS.NO;
        } else if (k !== i && squares[k] === SQUARE_STATUS.YES) {
          otherGreen = true;
        }
      }

      if (!otherGreen) {
        let offset = i - startRow;
        for (let j = 0; j < 5; j++) {
          let k = j * 5 + offset;
          if (k !== i && squares[k] === SQUARE_STATUS.NONE) {
            squares[k] = SQUARE_STATUS.NO;
          } else if (k !== i && squares[k] === SQUARE_STATUS.YES) {
            otherGreen = true;
          }
        }
      }

      if (otherGreen) {
        let status =
          "only one square can be selected in each row/column. Unselect the previously selected square before setting a new one.";
        this.setState({ status: status });
        return;
      }
    }
    switch (region) {
      case REGION.CENTER:
        this.setState({
          squares: squares,
          lastClickedSquare: i,
          lastClickedRegion: region,
          prevSquares: LastSquares,
          status: ""
        });
        break;
      case REGION.LEFT:
        this.setState({
          squaresLeft: squares,
          lastClickedSquare: i,
          lastClickedRegion: region,
          prevSquaresLeft: LastSquares,
          status: ""
        });
        break;
      case REGION.BOTTOM:
        this.setState({
          squaresBottom: squares,
          lastClickedSquare: i,
          lastClickedRegion: region,
          prevSquaresBottom: LastSquares,
          status: ""
        });
        break;
      default:
        break;
    }
  }

  renderSquare(i, region) {
    let square =
      region === REGION.CENTER
        ? this.state.squares[i]
        : region === REGION.LEFT
        ? this.state.squaresLeft[i]
        : this.state.squaresBottom[i];

    return (
      <Square
        value={
          square === SQUARE_STATUS.YES
            ? "green"
            : square === SQUARE_STATUS.NO
            ? "red"
            : "white"
        }
        onClick={() => this.handleClick(i, region)}
      />
    );
  }

  renderTopLabels() {
    var labelList = [];
    labelList.push(<div className="label grid side" />);
    for (let i = 0; i < this.state.topLabels.length; i++) {
      labelList.push(
        <span className="label grid top">{this.state.topLabels[i]}</span>
      );
    }

    return <div className="topLabels">{labelList}</div>;
  }

  renderSideLabels() {
    var labelList = [];
    for (let i = 0; i < this.state.sideLabels.length; i++) {
      labelList.push(
        <span className="label grid side">{this.state.sideLabels[i]}</span>
      );
    }

    return <div className="sideLabels">{labelList}</div>;
  }

  //labels should be pulled from state/props and read from database/file
  render() {
    return (
      <div className="gameBox">
        <div className="gameList">
          <div>
            {this.renderTopLabels()}
            <div className="rows">
              {this.renderSideLabels()}
              <div>
                <div className="SquareSegment">
                  <div className="board-row">
                    {this.renderSquare(0, REGION.CENTER)}
                    {this.renderSquare(1, REGION.CENTER)}
                    {this.renderSquare(2, REGION.CENTER)}
                    {this.renderSquare(3, REGION.CENTER)}
                    {this.renderSquare(4, REGION.CENTER)}
                  </div>
                  <div className="board-row">
                    {this.renderSquare(5, REGION.CENTER)}
                    {this.renderSquare(6, REGION.CENTER)}
                    {this.renderSquare(7, REGION.CENTER)}
                    {this.renderSquare(8, REGION.CENTER)}
                    {this.renderSquare(9, REGION.CENTER)}
                  </div>
                  <div className="board-row">
                    {this.renderSquare(10, REGION.CENTER)}
                    {this.renderSquare(11, REGION.CENTER)}
                    {this.renderSquare(12, REGION.CENTER)}
                    {this.renderSquare(13, REGION.CENTER)}
                    {this.renderSquare(14, REGION.CENTER)}
                  </div>
                  <div className="board-row">
                    {this.renderSquare(15, REGION.CENTER)}
                    {this.renderSquare(16, REGION.CENTER)}
                    {this.renderSquare(17, REGION.CENTER)}
                    {this.renderSquare(18, REGION.CENTER)}
                    {this.renderSquare(19, REGION.CENTER)}
                  </div>
                  <div className="board-row">
                    {this.renderSquare(20, REGION.CENTER)}
                    {this.renderSquare(21, REGION.CENTER)}
                    {this.renderSquare(22, REGION.CENTER)}
                    {this.renderSquare(23, REGION.CENTER)}
                    {this.renderSquare(24, REGION.CENTER)}
                  </div>
                </div>
                <div className="SquareSegment">
                  <div className="board-row">
                    {this.renderSquare(0, REGION.BOTTOM)}
                    {this.renderSquare(1, REGION.BOTTOM)}
                    {this.renderSquare(2, REGION.BOTTOM)}
                    {this.renderSquare(3, REGION.BOTTOM)}
                    {this.renderSquare(4, REGION.BOTTOM)}
                  </div>
                  <div className="board-row">
                    {this.renderSquare(5, REGION.BOTTOM)}
                    {this.renderSquare(6, REGION.BOTTOM)}
                    {this.renderSquare(7, REGION.BOTTOM)}
                    {this.renderSquare(8, REGION.BOTTOM)}
                    {this.renderSquare(9, REGION.BOTTOM)}
                  </div>
                  <div className="board-row">
                    {this.renderSquare(10, REGION.BOTTOM)}
                    {this.renderSquare(11, REGION.BOTTOM)}
                    {this.renderSquare(12, REGION.BOTTOM)}
                    {this.renderSquare(13, REGION.BOTTOM)}
                    {this.renderSquare(14, REGION.BOTTOM)}
                  </div>
                  <div className="board-row">
                    {this.renderSquare(15, REGION.BOTTOM)}
                    {this.renderSquare(16, REGION.BOTTOM)}
                    {this.renderSquare(17, REGION.BOTTOM)}
                    {this.renderSquare(18, REGION.BOTTOM)}
                    {this.renderSquare(19, REGION.BOTTOM)}
                  </div>
                  <div className="board-row">
                    {this.renderSquare(20, REGION.BOTTOM)}
                    {this.renderSquare(21, REGION.BOTTOM)}
                    {this.renderSquare(22, REGION.BOTTOM)}
                    {this.renderSquare(23, REGION.BOTTOM)}
                    {this.renderSquare(24, REGION.BOTTOM)}
                  </div>
                </div>
              </div>
              <div className="SquareSegment">
                <div className="board-row">
                  {this.renderSquare(0, REGION.LEFT)}
                  {this.renderSquare(1, REGION.LEFT)}
                  {this.renderSquare(2, REGION.LEFT)}
                  {this.renderSquare(3, REGION.LEFT)}
                  {this.renderSquare(4, REGION.LEFT)}
                </div>
                <div className="board-row">
                  {this.renderSquare(5, REGION.LEFT)}
                  {this.renderSquare(6, REGION.LEFT)}
                  {this.renderSquare(7, REGION.LEFT)}
                  {this.renderSquare(8, REGION.LEFT)}
                  {this.renderSquare(9, REGION.LEFT)}
                </div>
                <div className="board-row">
                  {this.renderSquare(10, REGION.LEFT)}
                  {this.renderSquare(11, REGION.LEFT)}
                  {this.renderSquare(12, REGION.LEFT)}
                  {this.renderSquare(13, REGION.LEFT)}
                  {this.renderSquare(14, REGION.LEFT)}
                </div>
                <div className="board-row">
                  {this.renderSquare(15, REGION.LEFT)}
                  {this.renderSquare(16, REGION.LEFT)}
                  {this.renderSquare(17, REGION.LEFT)}
                  {this.renderSquare(18, REGION.LEFT)}
                  {this.renderSquare(19, REGION.LEFT)}
                </div>
                <div className="board-row">
                  {this.renderSquare(20, REGION.LEFT)}
                  {this.renderSquare(21, REGION.LEFT)}
                  {this.renderSquare(22, REGION.LEFT)}
                  {this.renderSquare(23, REGION.LEFT)}
                  {this.renderSquare(24, REGION.LEFT)}
                </div>
              </div>
            </div>
          </div>
          <div className="hints">
            <div className={this.checkAnswers() ? "CorrectText" : ""}>
              <span>{this.checkAnswers() ? "Solution Correct!" : "HELLO"}</span>
            </div>

            <div className="border">
              <span>Hints:</span>
              <HintList list={this.state.hints} />
            </div>
          </div>
        </div>

        <span className="errorText">{this.state.status}</span>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

export default Game;
//ReactDOM.render(<Game />, document.getElementById("root"));
