let ttt;
let teleportCount = 0;
let maxTeleports = 10;
let angle = 0;
let radius = 50;
let imageVisible = true;
let bgColor;
let imgX, imgY;

function setup() {
  createCanvas(400, 400);
  bgColor = color(240, 240, 240)
  imgX = -20;
  imgY = 70;
}

function preload() {
  ttt = loadImage("https://static.vecteezy.com/system/resources/previews/019/773/127/original/isolated-trees-on-without-background-png.png");
}

function mouseClicked(event) {
  if (teleportCount < maxTeleports) {
    print("I have just clicked my mouse key!");

    imgX = width / 2 + radius * cos(angle);
    imgY = height / 2 + radius * sin(angle);

    angle += TWO_PI / maxTeleports;
    teleportCount++;
  } else {
    imageVisible = false;
  }
}

function keyPressed() {
  if (key === 'c') {
    print("pressed key C");
    bgColor = color(random(255), random(255), random(255));
  }
}

function draw() {
  background(bgColor);


  fill(255, 204, 0);
  ellipse(50, 50, 60, 60);

  fill(139, 69, 19);
  rect(300, 220, 20, 80);

  fill(0, 128, 0);
  triangle(270, 220, 310, 150, 350, 220);

  fill(255, 105, 180);
  rect(150, 250, 100, 100);

  fill(255, 0, 0);
  triangle(150, 250, 200, 200, 250, 250);

  fill(255);
  ellipse(100, 100, 50, 40);
  ellipse(130, 90, 50, 40);
  ellipse(160, 100, 50, 40);

  fill(255, 0, 255);
  ellipse(50, 350, 10, 10);
  ellipse(70, 370, 10, 10);
  ellipse(90, 360, 10, 10);

  stroke(0, 128, 0);
  line(50, 350, 50, 380);
  line(70, 370, 70, 400);
  line(90, 360, 90, 390);

  noFill();
  stroke(0);
  beginShape();
  vertex(200, 50);
  bezierVertex(220, 70, 250, 20, 270, 70);
  endShape();

  beginShape();
  vertex(50, 300);
  bezierVertex(70, 320, 90, 280, 110, 320);
  endShape();

  if (imageVisible) {
    image(ttt, imgX, imgY, 100, 100);
  }
}
