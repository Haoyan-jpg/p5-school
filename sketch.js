let boardSizeInput, winLengthInput, startButton;
let boardSize = 12;
let winLength = 5;
let cellSize;
let board = [];
let currentPlayer = 1;
let boardOffsetX, boardOffsetY;

function setup() {
  createCanvas(600, 600);
  boardSizeInput = select('#boardSizeInput');
  winLengthInput = select('#winLengthInput');
  startButton = select('#startButton');
  startButton.mousePressed(setupBoard);
  setupBoard();
}

function setupBoard() {
  boardSize = int(boardSizeInput.value());
  winLength = int(winLengthInput.value());
  cellSize = min(width, height) / (boardSize + 2);
  boardOffsetX = (width - (boardSize * cellSize)) / 2;
  boardOffsetY = (height - (boardSize * cellSize)) / 2;

  board = [];
  for (let i = 0; i < boardSize; i++) {
    board[i] = [];
    for (let j = 0; j < boardSize; j++) {
      board[i][j] = 0;
    }
  }

  currentPlayer = 1;
  redraw();
}

function draw() {
  background(240);
  stroke(0);
  for (let i = 0; i <= boardSize; i++) {
    line(boardOffsetX + i * cellSize, boardOffsetY, boardOffsetX + i * cellSize, boardOffsetY + boardSize * cellSize);
    line(boardOffsetX, boardOffsetY + i * cellSize, boardOffsetX + boardSize * cellSize, boardOffsetY + i * cellSize);
  }

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] == 1) {
        fill(0);
        ellipse(boardOffsetX + i * cellSize + cellSize / 2, boardOffsetY + j * cellSize + cellSize / 2, cellSize * 0.8);
      } else if (board[i][j] == 2) {
        fill(255);
        ellipse(boardOffsetX + i * cellSize + cellSize / 2, boardOffsetY + j * cellSize + cellSize / 2, cellSize * 0.8);
      }
    }
  }

  checkWinner();
}

function mousePressed() {
  let i = floor((mouseX - boardOffsetX) / cellSize);
  let j = floor((mouseY - boardOffsetY) / cellSize);

  if (i >= 0 && j >= 0 && i < boardSize && j < boardSize && board[i][j] == 0) {
    board[i][j] = currentPlayer;
    currentPlayer = 3 - currentPlayer;
  }
  redraw();
}

function checkWinner() {
  let winner = 0;

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] != 0) {
        if (checkDirection(i, j, 1, 0) || checkDirection(i, j, 0, 1) || checkDirection(i, j, 1, 1) || checkDirection(i, j, 1, -1)) {
          winner = board[i][j];
          break;
        }
      }
    }
  }

  if (winner != 0) {
    noLoop();
    let winnerText = winner == 1 ? "Black wins!" : "White wins!";
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text(winnerText, width / 2, height / 2);
  }
}

function checkDirection(x, y, dx, dy) {
  let count = 1;

  for (let step = 1; step < winLength; step++) {
    let nx = x + step * dx;
    let ny = y + step * dy;
    if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize && board[nx][ny] == board[x][y]) {
      count++;
    } else {
      break;
    }
  }

  for (let step = 1; step < winLength; step++) {
    let nx = x - step * dx;
    let ny = y - step * dy;
    if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize && board[nx][ny] == board[x][y]) {
      count++;
    } else {
      break;
    }
  }

  return count >= winLength;
}
