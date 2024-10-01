let currentItem;
let currentTime;
let itemVisibleDuration = 4000;
let bottleCount = 0;
let score = 0;
let level = 1;
let totalLevels = 3;
let timeLimit = 40;
let remainingTime;
let startTime;
let waterBottleImage, gumboImage, bookImage;
let backgroundImage;

function preload() {
  waterBottleImage = loadImage('https://recollect-images.global.ssl.fastly.net/api/image/500/material.default.plastic_water_bottle.png');
  gumboImage = loadImage('https://www.threeolivesbranch.com/wp-content/uploads/2016/02/chicken-sausage-gumbo-threeolivesbranch-5.jpg');
  bookImage = loadImage('https://cdn.shopify.com/s/files/1/0877/6118/files/footballglovesstickyspray_large.jpg?v=1530560723');
  setBackgroundForLevel();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  startTime = millis();
  remainingTime = timeLimit;
  imageMode(CENTER);
  spawnNewItem();
}

function draw() {
  image(backgroundImage, width / 2, height / 2, windowWidth, windowHeight);

  let elapsedTime = (millis() - startTime) / 1000;
  remainingTime = max(0, timeLimit - elapsedTime);

  if (millis() - currentTime < itemVisibleDuration) {
    displayItem(currentItem);
  } else {
    spawnNewItem();
  }

  textSize(30);
  fill(0);
  text(`Score: ${score}`, 50, 50);
  text(`Time: ${nf(remainingTime, 2, 1)}s`, 50, 100);
  text(`Level: ${level}`, 50, 150);

  if (remainingTime <= 0) {
    textSize(50);
    text("Time's up! Game Over", width / 2 - 150, height / 2);
    noLoop();
  }
}
function spawnNewItem() {
  bottleCount++;

  const itemProbabilities = [
    { level: 1, type: 'bottle' },
    { level: 2, condition: bottleCount % 5 === 0, type: 'gumbo', fallback: 'bottle' },
    { level: 3, condition: bottleCount % 10 === 0, type: 'book', fallbackCondition: bottleCount % 5 === 0, fallbackType: 'gumbo', defaultType: 'bottle' }
  ];


  let itemType = null;

  for (let i = 0; i < itemProbabilities.length; i++) {
    let prob = itemProbabilities[i];
    if (level === prob.level) {
      if (prob.condition) {
        itemType = prob.type;
      } else if (prob.fallbackCondition) {
        itemType = prob.fallbackType;
      } else {
        itemType = prob.defaultType || prob.fallback || 'bottle';
      }
      break;
    }
  }

  currentItem = {
    type: itemType || 'bottle',
    x: random(windowWidth),
    y: random(windowHeight)
  };

  currentTime = millis();
}


function displayItem(item) {
  if (item.type === 'bottle') {
    image(waterBottleImage, item.x, item.y, 50, 50);
  } else if (item.type === 'gumbo') {
    image(gumboImage, item.x, item.y, 60, 60);
  } else if (item.type === 'book') {
    image(bookImage, item.x, item.y, 50, 50);
  }
}

function mouseClicked() {
  if (dist(mouseX, mouseY, currentItem.x, currentItem.y) < 30) {
    if (currentItem.type === 'bottle') {
      score++;
    } else if (currentItem.type === 'gumbo') {
      startTime += 5000;
    } else if (currentItem.type === 'book') {
      score += 5;
    }

    if (score >= 15 && level === 1) {
      level = 2;
      resetTimer();
    } else if (score >= 30 && score <= 40 && level === 2) {
      level = 3;
      resetTimer();
    } else if (score > 40 && level === 3) {
      level = 4;
      resetTimer();
    }

    setBackgroundForLevel();
    spawnNewItem();
  }
}

function setBackgroundForLevel() {
  if (level === 1) {
    backgroundImage = loadImage('https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
    timeLimit = 30;
  } else if (level === 2) {
    backgroundImage = loadImage('https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcQW04r9hD8fYYKs5tXkBbp1IaSvCvJfwy3ZAAR05jM7yd2no4wWVLAvug5hdmQvzgKnUGlhLYF2IlYIkXpKV0aw-mRm9yxPmNk1J9meWw');
    timeLimit = 15;
  } else if (level === 3) {
    backgroundImage = loadImage('https://static.clubs.nfl.com/image/private/t_editorial_landscape_12_desktop/saints/wbyjqae7lzipfckei4b7.jpg');
    timeLimit = 8;
  }
}

function resetTimer() {
  startTime = millis();
  remainingTime = timeLimit;
}
