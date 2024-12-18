class IconTextButton {
  constructor(x, y, width, height, label, onClick) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.onClick = onClick;
    this.isHovered = false;
  }

  draw() {
    this.isHovered = this.isMouseOver();

    fill(this.isHovered ? 240 : 255);
    stroke(80);
    strokeWeight(4);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height, 20);

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    // let textX = this.x - this.width / 2 + 20;
    text(this.label, this.x, this.y);

    // let iconX = this.x + this.width / 2 - 20;
    // let iconSize = 10;
    // triangle(iconX - iconSize, this.y - iconSize / 2, iconX - iconSize, this.y + iconSize / 2, iconX, this.y);
  }

  isMouseOver() {
    return mouseX > this.x - this.width / 2 && mouseX < this.x + this.width / 2 && mouseY > this.y - this.height / 2 && mouseY < this.y + this.height / 2;
  }

  handleClick() {
    if (this.isHovered && this.onClick) {
      this.onClick();
    }
  }

  updatePosition(newX, newY) {
    this.x = newX;
    this.y = newY;
  }
}
