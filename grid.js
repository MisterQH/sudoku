class Grid {
  constructor(width) {
    this.grid = Array(9)
      .fill()
      .map(() => Array(9).fill(0));
    this.width = width;
  }

  fill(j, i, value) {
    this.grid[i][j] = value;
  }

  setDifficulty(difficulty) {
    for (let i = 0; i < 12 * difficulty; i++) {
      let randI = Math.floor(random(0, 9));
      let randJ = Math.floor(random(0, 9));
      while (this.grid[randI][randJ] === 0) {
        randI = Math.floor(random(0, 9));
        randJ = Math.floor(random(0, 9));
      }
      this.grid[randI][randJ] = 0;
    }
  }

  drawGrid() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        strokeWeight(1);
        line(i * this.width, 0, i * this.width, 9 * this.width);
        line(0, i * this.width, 9 * this.width, i * this.width);
      }
    }
    for (let i = 1; i < 3; i++) {
      strokeWeight(4);
      line(3 * i * this.width, 0, 3 * i * this.width, 9 * this.width);
      line(0, 3 * i * this.width, 9 * this.width, 3 * i * this.width);
    }
  }

  show() {
    this.drawGrid(this.width);
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        stroke(0);
        strokeWeight(1);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(this.width / 2);
        if (this.grid[i][j] !== 0) {
          fill(0);
          text(
            this.grid[i][j],
            j * this.width + this.width / 2,
            i * this.width + this.width / 2
          );
        }
      }
    }
  }

  solve() {
    try {
      this.fillAllObvious();
    } catch (err) {
      return false;
    }

    if (this.isComplete()) {
      return true;
    }

    let iIndex = 0;
    let jIndex = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.grid[i][j] == 0) {
          iIndex = i;
          jIndex = j;
        }
      }
    }

    let possibilities = this.getPossibilities(iIndex, jIndex);
    for (let value of possibilities) {
      let snapshot = this.grid.map(function(arr) {
        return arr.slice();
      });
      this.grid[iIndex][jIndex] = value;
      let result = this.solve();
      if (result == true) {
        return true;
      } else {
        this.grid = snapshot.map(function(arr) {
          return arr.slice();
        });
      }
    }

    return false;
  }

  fillAllObvious() {
    while (true) {
      let somethingChanged = false;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          let possibilities = this.getPossibilities(i, j);
          if (possibilities == false) continue;

          if (possibilities.length == 0) {
            throw "error";
          }
          if (possibilities.length == 1) {
            let answer = possibilities[0];
            this.grid[i][j] = answer;
            somethingChanged = true;
          }
        }
      }

      if (somethingChanged == false) {
        return;
      }
    }
  }

  getPossibilities(i, j) {
    if (this.grid[i][j] != 0) return false;

    let possibilities = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (let cell of this.grid[i]) {
      possibilities.delete(cell);
    }

    for (let idx = 0; idx < 9; idx++) {
      possibilities.delete(this.grid[idx][j]);
    }

    let iStart = Math.floor(i / 3) * 3;
    let jStart = Math.floor(j / 3) * 3;

    let subgrid = [];

    for (let iOffset = 0; iOffset < 3; iOffset += 1) {
      for (let jOffset = 0; jOffset < 3; jOffset += 1) {
        subgrid = [...subgrid, this.grid[iStart + iOffset][jStart + jOffset]];
      }
    }

    for (let cell of subgrid) {
      possibilities.delete(cell);
    }

    let poss = Array.from(possibilities);
    return shuffle(poss);
  }

  isComplete() {
    for (let row of this.grid) {
      for (let cell of row) {
        if (cell == 0) {
          return false;
        }
      }
    }
    return true;
  }
}
