class YearButton {
  constructor(x, y, width, height, label, onClick) {
    this.x = x; // 버튼 중심의 X 좌표
    this.y = y; // 버튼 중심의 Y 좌표
    this.width = width; // 버튼의 너비
    this.height = height; // 버튼의 높이
    this.label = label; // 버튼 텍스트
    this.onClick = onClick; // 클릭 시 실행할 함수
    this.isHovered = false; // 마우스 호버 상태
  }

  // 버튼 그리기
  draw() {
    rectMode(CENTER); // 중심 기준으로 사각형 그리기
    this.isHovered = this.isMouseOver(); // 마우스 오버 여부 확인

    // 버튼 스타일
    fill(80); // 호버 시 색상 변경
    rect(this.x, this.y, this.width, this.height);

    // 텍스트 스타일
    noStroke(); // 텍스트 테두리 제거
    fill(this.isHovered ? color(255,215,0) : 255); // 호버 시 색상 변경
    textAlign(CENTER, CENTER); // 텍스트 정렬
    textSize(32); // 텍스트 크기
    text(this.label, this.x, this.y-2); // 버튼 텍스트 렌더링
  }

  // 마우스가 버튼 위에 있는지 확인
  isMouseOver() {
    // 중심 기준으로 계산
    let isOver =
      mouseX > this.x - this.width / 2 &&
      mouseX < this.x + this.width / 2 &&
      mouseY > this.y - this.height / 2 &&
      mouseY < this.y + this.height / 2;
    return isOver;
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
