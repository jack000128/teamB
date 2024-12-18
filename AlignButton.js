class AlignButton {
  constructor(x, y, width, height, label, onClick) {
    this.x = x; // 버튼 X 위치
    this.y = y; // 버튼 Y 위치
    this.width = width; // 버튼 너비
    this.height = height; // 버튼 높이
    this.label = label; // 버튼 텍스트
    this.onClick = onClick; // 클릭 이벤트
    this.isHovered = false; // 마우스 오버 여부
    this.isClicked = false; // 클릭 여부
  }

  // 버튼 그리기
  draw() {
    this.isHovered = this.isMouseOver();

    // 버튼 스타일
    // 버튼 스타일
    if (this.isClicked) {
      fill("#FDD72C");
      // stroke("#FDD72C");
    } else if (this.isHovered) {
      fill("#7D765F");
      // stroke("#7D765F");
    } else {
      fill("#F7F7F7"); // 기본 색상
      stroke(0);
    }

    // strokeWeight(1);
    noStroke();
    rectMode(CORNER);
    rect(this.x, this.y, this.width, this.height);

    // 텍스트 스타일
    noStroke();
    if (this.isClicked) {
      fill(0); // 클릭 시 색상 (토마토색)
    } else if (this.isHovered) {
      fill(255); // 호버 시 색상 (노란색)
    } else {
      fill(0); // 기본 색상
    }
    textAlign(CENTER, CENTER);
    textSize(20);
    text(this.label, this.x + this.width / 2, this.y + this.height / 2 - 2);
  }

  // 마우스 오버 여부 확인
  // 마우스 오버 여부 확인
  isMouseOver() {
    return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
  }

  // 클릭 이벤트 처리
  handleMousePressed() {
    if (this.isHovered && this.onClick) {
      this.isClicked = true; // 클릭 상태로 전환
      this.onClick(); // 클릭 이벤트 실행

      // 일정 시간 후 클릭 상태 해제
      setTimeout(() => {
        this.isClicked = false; // 기본 상태로 복구
      }, 300); // 300ms 후 복구
    }
  }

  updatePosition(newX, newY) {
    this.x = newX;
    this.y = newY;
  }
}
