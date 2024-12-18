class HelpButton {
  constructor(x, y, radius, modeImages) {
    this.x = x; // 버튼 중심 x 좌표
    this.y = y; // 버튼 중심 y 좌표
    this.radius = radius; // 버튼 반지름
    this.modeImages = modeImages; // 각 mode에 해당하는 이미지 객체
    this.isHovered = false; // hover 상태
    this.mode = 1; // 기본 mode
  }

  updatePosition(x, y, r) {
    this.x = x;
    this.y = y;
    this.radius = r;
  }

  // 버튼 그리기
  draw(currentMode) {
    this.mode = currentMode; // 현재 mode 업데이트

    // hover 상태 확인
    this.isHovered = this.isMouseOver();

    // hover 상태라면 현재 mode에 해당하는 이미지 표시
    if (this.isHovered && this.modeImages[this.mode]) {
      let img = this.modeImages[this.mode];
      imageMode(CENTER); // 이미지 중앙 정렬
      image(img, width / 2, height / 2, width, height); // 버튼 위에 이미지 표시
    }

    // 원형 버튼 그리기
    fill(this.isHovered ? "#7D765F" : "#F7F7F7");
    stroke(this.isHovered ? "#7D765F" : 0);
    strokeWeight(1.5);
    ellipse(this.x, this.y, this.radius * 2);

    // 물음표 아이콘 그리기
    fill(this.isHovered ? 255 : 0);
    noStroke();
    textSize(this.radius * 1.2);
    textFont(fontDefault);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("?", this.x, this.y - 1);
  }

  // 마우스가 버튼 위에 있는지 확인
  isMouseOver() {
    const distance = dist(mouseX, mouseY, this.x, this.y);
    return distance < this.radius;
  }
}
