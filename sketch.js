let circles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(240);
}

function draw() {
  // Optional: Draw a fading background to create a trail effect
  fill(240, 20);
  noStroke();
  rect(0, 0, width, height);

  // Display all circles
  for (let i = 0; i < circles.length; i++) {
    circles[i].display();
    circles[i].move();
  }
}

// Function to create circles on mouse click
function mousePressed() {
  let r = random(10, 50);
  let c = new Circle(mouseX, mouseY, r);
  circles.push(c);
}

// Circle class
class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.col = color(random(255), random(255), random(255));
  }

  display() {
    fill(this.col);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }

  move() {
    this.x += random(-1, 1);
    this.y += random(-1, 1);
  }
}

// Resize canvas on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
