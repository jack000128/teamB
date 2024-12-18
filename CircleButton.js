class CircleButton {
  constructor(x, y, radius, label, onClick) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.label = label;
    this.onClick = onClick;
    this.isHovered = false;
  }

  // 버튼 그리기
  draw() {
    this.isHovered = this.isMouseOver();

    // 버튼 스타일
    stroke(50);
    strokeWeight(20);
    fill(this.isHovered ? color("#FDD72C") : 255);
    ellipse(this.x, this.y, this.radius * 2); // 원형 버튼

    // 재생 아이콘 (삼각형)
    strokeWeight(15);
    strokeJoin(ROUND);
    fill(50);
    let triangleSize = (this.radius / 5) * 2;
    triangle(this.x - triangleSize / 2, this.y - triangleSize, this.x - triangleSize / 2, this.y + triangleSize, this.x + triangleSize, this.y);

    // 텍스트 표시 (옵션)
    if (this.label) {
      textAlign(CENTER, CENTER);
      textSize(14);
      fill(0);
      text(this.label, this.x, this.y + this.radius + 10); // 버튼 아래 텍스트
    }
  }

  // 마우스가 버튼 위에 있는지 확인
  isMouseOver() {
    const distance = dist(mouseX, mouseY, this.x, this.y);
    return distance < this.radius;
  }

  // 클릭 이벤트 처리
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
