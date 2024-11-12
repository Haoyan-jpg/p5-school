let boardSizeInput, winLengthInput, startButton, playPlayerButton, playAIButton;
let boardSize = 12;
let winLength = 5;
let cellSize, isAIMode = false;
let board = [];
let currentPlayer = 1;
let boardOffsetX, boardOffsetY;

function setup() {
  createCanvas(600, 600);
  boardSizeInput = select('#boardSizeInput');
  winLengthInput = select('#winLengthInput');
  startButton = select('#startButton');
  startButton.mousePressed(setupBoard);

  playPlayerButton = select('#playPlayerButton');
  playAIButton = select('#playAIButton');
  playPlayerButton.mousePressed(() => {
    isAIMode = false;
    setupBoard();
    console.log("Playing with another player.");
  });
  playAIButton.mousePressed(() => {
    isAIMode = true;
    setupBoard();
    console.log("Playing with Computer.");
  });
}

function setupBoard() {
  boardSize = int(boardSizeInput.value());
  winLength = int(winLengthInput.value());
  cellSize = min(width, height) / (boardSize + 2);
  boardOffsetX = (width - (boardSize * cellSize)) / 2;
  boardOffsetY = (height - (boardSize * cellSize)) / 2;

  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
  currentPlayer = 1;
  console.log("Board initialized:", board);
  console.log(`Board size: ${boardSize}, Win length: ${winLength}`);
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
    console.log(`Player ${currentPlayer} placed on (${i}, ${j}).`);
    currentPlayer = 3 - currentPlayer;
    redraw();

    if (isAIMode && currentPlayer === 2) {
      console.log("Computer's turn to play.");
      getMathBasedMove();
    }
  }
}

function getMathBasedMove() {
  console.log("Calculating move based on board analysis.");
  let bestMove = null;
  let maxScore = -1;

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === 0) {
        board[i][j] = 2;
        if (checkWinnerForPlayer(2)) {
          board[i][j] = 0;
          board[i][j] = 2;
          currentPlayer = 1;
          console.log(`Computer placed on (${i}, ${j}) to win.`);
          redraw();
          return;
        }
        board[i][j] = 0;
      }
    }
  }

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === 0) {
        board[i][j] = 1;
        if (checkWinnerForPlayer(1)) {
          board[i][j] = 0;
          board[i][j] = 2;
          currentPlayer = 1;
          console.log(`Computer placed on (${i}, ${j}) to block player.`);
          redraw();
          return;
        }
        board[i][j] = 0;
      }
    }
  }

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === 0) {
        let score = evaluatePosition(i, j, 2) + evaluatePosition(i, j, 1) * 0.8;
        if (score > maxScore) {
          maxScore = score;
          bestMove = { x: i, y: j };
        }
      }
    }
  }

  if (bestMove) {
    board[bestMove.x][bestMove.y] = 2;
    currentPlayer = 1;
    console.log(`Computer placed on (${bestMove.x}, ${bestMove.y}) strategically with score ${maxScore}.`);
    redraw();
  }
}

function checkWinnerForPlayer(player) {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === player) {
        if (checkDirectionForPlayer(i, j, 1, 0, player) || checkDirectionForPlayer(i, j, 0, 1, player) || checkDirectionForPlayer(i, j, 1, 1, player) || checkDirectionForPlayer(i, j, 1, -1, player)) {
          return true;
        }
      }
    }
  }
  return false;
}

function checkDirectionForPlayer(x, y, dx, dy, player) {
  let count = 1;

  for (let step = 1; step < winLength; step++) {
    let nx = x + step * dx;
    let ny = y + step * dy;
    if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize && board[nx][ny] === player) {
      count++;
    } else {
      break;
    }
  }

  for (let step = 1; step < winLength; step++) {
    let nx = x - step * dx;
    let ny = y - step * dy;
    if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize && board[nx][ny] === player) {
      count++;
    } else {
      break;
    }
  }

  return count >= winLength;
}

function evaluatePosition(x, y, player) {
  let score = 0;

  score += countInDirection(x, y, 1, 0, player);
  score += countInDirection(x, y, 0, 1, player);
  score += countInDirection(x, y, 1, 1, player);
  score += countInDirection(x, y, 1, -1, player);

  return score;
}

function countInDirection(x, y, dx, dy, player) {
  let count = 1;
  let openEnds = 0;

  for (let step = 1; step < winLength; step++) {
    let nx = x + step * dx;
    let ny = y + step * dy;
    if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize) {
      if (board[nx][ny] === player) {
        count++;
      } else if (board[nx][ny] === 0) {
        openEnds++;
        break;
      } else {
        break;
      }
    }
  }

  for (let step = 1; step < winLength; step++) {
    let nx = x - step * dx;
    let ny = y - step * dy;
    if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize) {
      if (board[nx][ny] === player) {
        count++;
      } else if (board[nx][ny] === 0) {
        openEnds++;
        break;
      } else {
        break;
      }
    }
  }

  if (count >= winLength - 1 && openEnds > 0) return 100;
  if (count === winLength - 2 && openEnds > 0) return 50;
  if (count === winLength - 3 && openEnds > 0) return 10;
  return count;
}

function checkWinner() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] !== 0) {
        const player = board[i][j];
        if (checkDirection(i, j, 1, 0, player) || checkDirection(i, j, 0, 1, player) || checkDirection(i, j, 1, 1, player) || checkDirection(i, j, 1, -1, player)) {
          noLoop();
          const winnerText = player === 1 ? "Black wins!" : "White wins!";
          textSize(32);
          fill(0);
          textAlign(CENTER, CENTER);
          text(winnerText, width / 2, height / 2);
          console.log(winnerText);
          return true;
        }
      }
    }
  }
  return false;
}

function checkDirection(x, y, dx, dy, player) {
  let count = 1;

  for (let step = 1; step < winLength; step++) {
    const nx = x + step * dx;
    const ny = y + step * dy;
    if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize && board[nx][ny] === player) {
      count++;
    } else {
      break;
    }
  }

  for (let step = 1; step < winLength; step++) {
    const nx = x - step * dx;
    const ny = y - step * dy;
    if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize && board[nx][ny] === player) {
      count++;
    } else {
      break;
    }
  }

  return count >= winLength;
}
