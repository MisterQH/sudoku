const size = 9;
const w = 80;

const STATES = {
  INIT: "INIT",
  GENERATING: "GENERATING",
  FINISHED: "FINISHED"
};

let grid;
let state = STATES.INIT;
let generate;
let difficulty;
let reset;
let solve;
let fillingI;
let fillingJ;

function setup() {
  grid = new Grid(w);
  createCanvas(20 + size * w, 20 + size * w);

  solve = createButton("Résoudre");
  solve.position(this.width / 2 - 150, this.height);
  solve.mousePressed(() => {
    state = STATES.SOLVE;
    loop();
  });

  difficulty = createSelect();
  difficulty.option("1");
  difficulty.option("2");
  difficulty.option("3");
  difficulty.option("4");
  difficulty.option("5");
  difficulty.position(this.width / 2 - 50, this.height);

  generate = createButton("Générer");
  generate.position(this.width / 2 + 50, this.height);
  generate.mousePressed(() => {
    state = STATES.GENERATING;
  });

  reset = createButton("Reset");
  reset.position(this.width / 2, this.height);
  reset.mousePressed(() => {
    grid = new Grid(w);
    state = STATES.INIT;
    loop();
  });

  textAlign(CENTER);
  textSize(50);
}

function mousePressed() {
  if (state === STATES.INIT) {
    fillingI = Math.floor(mouseX / w);
    fillingJ = Math.floor(mouseY / w);
  }
}

function keyPressed() {
  if (
    state === STATES.INIT &&
    fillingI < 9 &&
    fillingI >= 0 &&
    fillingJ < 9 &&
    fillingJ >= 0
  ) {
    const value = keyCode - 48;
    if (value > 0 && value <= 9) {
      grid.fill(fillingI, fillingJ, value);
    }
  }
}

function drawFilling(i, j) {
  if (i < 9 && i >= 0 && j < 9 && j >= 0) {
    fill("rgba(0, 0, 200, 0.5)");
    rect(fillingI * w, fillingJ * w, w, w);
  }
}

function draw() {
  background(255);

  switch (state) {
    case STATES.INIT: {
      reset.hide();
      generate.show();
      difficulty.show();
      solve.show();
      grid.show(w);
      drawFilling(fillingI, fillingJ);
      break;
    }
    case STATES.GENERATING: {
      generate.hide();
      difficulty.hide();
      solve.show();

      if (grid.solve() === true) {
        grid.setDifficulty(difficulty.value());
        state = STATES.FINISHED;
      }

      break;
    }
    case STATES.SOLVE: {
      generate.hide();
      difficulty.hide();
      solve.hide();

      if (grid.solve() === true) {
        state = STATES.FINISHED;
      }

      break;
    }
    case STATES.FINISHED: {
      grid.show(w);
      reset.show();
      noLoop();
      break;
    }
  }
}
