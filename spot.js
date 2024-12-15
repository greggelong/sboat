const diam = [
  4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8, 8, 8, 8, 8, 8, 8, 16, 16,
  16, 16, 32,
];
// power of 2 distribution to set sizes of spots
class Spot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.d = random(diam);
    this.speedx = 2;
    this.speedy = 1;
  }

  move() {
    this.x += random(-this.speedx, this.speedx);
    this.y += random(-this.speedy, this.speedy);
  }
  display() {
    //fill(0,0,255)
    fill(0);

    ellipse(this.x, this.y, this.d, this.d);
  }
}
