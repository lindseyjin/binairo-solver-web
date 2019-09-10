import React from 'react';
import './App.css';
const axios = require('axios');


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // default grid
      data: [
        [1, 2, 0, 2, 2, 2],
        [2, 2, 2, 2, 0, 0],
        [2, 2, 0, 2, 2, 2],
        [0, 2, 0, 2, 0, 2],
        [2, 2, 2, 2, 2, 2],
        [2, 2, 2, 1, 2, 2]
      ],
      gridSize: 6,
      dark: false  // dark theme
    };
    this.clickCell = this.clickCell.bind(this);
    this.toggleDark = this.toggleDark.bind(this);
    this.clearGrid = this.clearGrid.bind(this);
    this.changeGridSize = this.changeGridSize.bind(this);
    this.solvePuzzle = this.solvePuzzle.bind(this);
  }

  // Event Handlers
  clickCell(e, i, j, cell) {
    let newData = this.state.data;
    if (e.type === 'click') {
      if (cell > 0) newData[i][j] = cell - 1;
      else newData[i][j] = 2;
    } else newData[i][j] = (cell + 1) % 3;

    this.setState({ data: newData })
  };

  toggleDark() {
    this.setState({ dark: !this.state.dark })
  }

  clearGrid() {
    let len = this.state.gridSize;
    let newData = Array.from(Array(len), _ => Array(len).fill(2));

    this.setState({ data: newData })
  }

  changeGridSize(value) {
    let len = parseInt(value);
    // todo: get data for random grids? 
    let newData = Array.from(Array(len), _ => Array(len).fill(2));

    this.setState({ gridSize: len });
    this.setState({ data: newData })
  }

  solvePuzzle() {
    var self = this;
    let es = new EventSource('http://localhost:5000/solve');
    es.onmessage = e => {
      self.setState({ data: e.data.board })
    }
    axios.post('http://localhost:5000/solve', {
      board_values: self.state.data
    })
      .then(function (response) {
        // handle success
        console.log(response.data);
        self.setState({ data: response.data.board })
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }


  render() {
    return (
      <div className={"main " + (this.state.dark ? "main-dark" : "")}>
        <div className="togglebox">
          <span className="switchLabel"><i className="fas fa-moon"></i></span>
          <label className="switch">
            <input type="checkbox" onChange={this.toggleDark}/>
            <span className="slider round"></span>
          </label>
        </div>
        <h1 className="title"> BINAIRO SOLVER</h1>
        <div className="line"></div>
        <div className="board">
          {/* error highlighting, dark theme*/}
          <button className="btnSecondary" onClick={this.clearGrid}>clear</button>
          <button className="btnSecondary">shuffle</button>
          <label className="selectlabel">Grid Size: </label>
          <select className="selectbox" value={this.state.gridSize}
            onChange={(e) => this.changeGridSize(e.target.value)}>
            <option value="6">6 x 6</option>
            <option value="8">8 x 8</option>
            <option value="10">10 x 10</option>
            <option value="14">14 x 14</option>
            <option value="20">20 x 20</option>
            <option value="24">24 x 24</option>
          </select>
          <table>
            <tbody onContextMenu={(e) => e.preventDefault()}>
              {this.state.data.map((row, i) =>
                <tr key={i}>
                  {row.map((cell, j) =>
                    <td key={j} className={"cell " + (this.state.gridSize > 10 ? "cell-small" : "")} onClick={(e) => this.clickCell(e, i, j, cell)}
                      onContextMenu={(e) => this.clickCell(e, i, j, cell)}>
                      <div className={cell === 2 ? "" : (this.state.gridSize > 10 ? "circle circle-small " : "circle ") + 
                      (cell === 1 ? "black-circle" : "white-circle")}></div>
                    </td>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button className="btnSolve" onClick={this.solvePuzzle}>SOLVE</button>
      </div>
    );
  }
}

export default App;
