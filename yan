let ttt;
let teleportCount = 0;
let maxTeleports = 10;
let radius = 50;
let imageVisible = true;
let bgColor;
let imgX, imgY;
let score = 0;
let gameOver = false;
let timer = 30; 
let imgSize = 100; 
let difficultyIncrease = 0.95;

function setup() {
  createCanvas(400, 400);
  bgColor = color(240, 240, 240);
  imgX = random(width - imgSize);
  imgY = random(height - imgSize);
  textSize(32);
  textAlign(CENTER, CENTER);
  setInterval(decreaseTimer, 1000);
}

function preload() {
  ttt = loadImage("https://static.vecteezy.com/system/resources/previews/019/773/127/original/isolated-trees-on-without-background-png.png");
}

function mouseClicked(event) {
  if (!gameOver && imageVisible) {
    let d = dist(mouseX, mouseY, imgX + imgSize / 2, imgY + imgSize / 2);
    if (d < imgSize / 2) {
      score++;
      imgSize *= difficultyIncrease;
      imgX = random(width - imgSize);
      imgY = random(height - imgSize);
    }
  }
}

function keyPressed() {
  if (key === 'c') {
    bgColor = color(random(255), random(255), random(255));
  }
}

function decreaseTimer() {
  if (timer > 0 && !gameOver) {
    timer--;
  } else if (timer === 0) {
    gameOver = true;
  }
}

function draw() {
  background(bgColor);

  if (gameOver) {
    fill(0);
    text("Game Over!", width / 2, height / 2 - 20);
    text("Score: " + score, width / 2, height / 2 + 20);
    return;
  }

  fill(0);
  text("Time: " + timer, width / 2, 30);
  text("Score: " + score, width / 2, 70);

  if (imageVisible) {
    image(ttt, imgX, imgY, imgSize, imgSize);
  }
}
