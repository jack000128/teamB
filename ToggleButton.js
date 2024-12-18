/*class ToggleButton {
  constructor(x, y, radius, label, onClick, buttonColor = color(220), activeColor = color(80)) {
    this.x = x; // 버튼의 x 좌표
    this.y = y; // 버튼의 y 좌표
    this.radius = radius; // 버튼의 반지름
    this.label = label; // 버튼의 텍스트
    this.onClick = onClick; // 버튼 클릭 시 실행할 함수
    this.isHovered = false; // 마우스 오버 여부
    this.isClicked = false; // 버튼 클릭 여부 (진한 원 표시)
    this.buttonColor = buttonColor; // 기본 버튼 색상
    this.activeColor = activeColor; // 클릭 시 중심에 표시될 색상
  }

  // 버튼 그리기
  draw() {
    // 마우스가 버튼 위에 있는지 확인
    this.isHovered = this.isMouseOver();

    // 버튼 색상 (마우스 오버 및 클릭 여부에 따라 다르게 설정)
    fill(this.isHovered ? color(120) : this.buttonColor);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2); // 동그란 버튼

    // 클릭 상태일 때 원 안에 진한 색 원 그리기
    if (this.isClicked) {
      fill(this.activeColor); // 진한 색으로 원 그리기
      ellipse(this.x, this.y, this.radius * 1.2, this.radius * 1.2); // 버튼 중앙에 작은 원
    }

    // 라벨 텍스트 그리기 (버튼 오른쪽)
    fill(0);
    noStroke();
    textAlign(LEFT, CENTER); // 텍스트를 왼쪽 정렬
    textSize(12);
    text(this.label, this.x + this.radius + 10, this.y); // 버튼 오른쪽에 텍스트 표시
  }

  // 버튼 클릭 이벤트 처리
  handleMousePressed() {
    if (this.isHovered && this.onClick) {
      this.isClicked = !this.isClicked; // 클릭 시 클릭 상태 토글
      this.onClick(); // 클릭 시 지정된 액션 실행
    }
  }

  // 마우스가 버튼 위에 있는지 확인
  isMouseOver() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < this.radius; // 마우스와 버튼의 거리 비교
  }
}*/

class ToggleButton {
  constructor(x, y, width, height, label, iconWhite, iconBlack, onClick, buttonColor = color("#231F20"), activeColor = color("#FDD72C")) {
    this.x = x; // 버튼의 좌상단 x 좌표
    this.y = y; // 버튼의 좌상단 y 좌표
    this.width = width; // 버튼의 너비
    this.height = height; // 버튼의 높이
    this.label = label; // 버튼의 텍스트
    this.iconWhite = iconWhite; // 기본 상태 아이콘
    this.iconBlack = iconBlack; // 클릭 상태 아이콘
    this.onClick = onClick; // 버튼 클릭 시 실행할 함수
    this.isHovered = false; // 마우스 오버 여부
    this.isClicked = false; // 버튼 클릭 여부
    this.buttonColor = buttonColor; // 기본 버튼 색상
    this.activeColor = activeColor; // 클릭 시 버튼 색상
  }

  // 버튼 그리기
  draw() {
    this.isHovered = this.isMouseOver();

    // 버튼 배경색
    if (this.isClicked) {
      fill(this.activeColor); // 클릭 시 배경색
      noStroke();
    } else if (this.isHovered) {
      fill(color("#7D765F"));
      // stroke(this.activeColor); // 호버 시 노란색 테두리
      // strokeWeight(5);
      noStroke()
    } else {
      fill(this.buttonColor); // 기본 배경색
      noStroke();
    }

    rectMode(CORNER);
    rect(this.x, this.y, this.width, this.height);

    // 아이콘 그리기
    imageMode(CORNER);
    let icon = this.isClicked ? this.iconBlack : this.iconWhite; // 클릭 상태에 따라 아이콘 선택
    image(icon, this.x + 16, this.y + 10, 20, 20);

    // 사이 선 그리기
    stroke(this.isClicked ? this.buttonColor : 255);
    strokeWeight(1);
    line(this.x + 50, this.y + 3, this.x + 50, this.y + this.height - 3)
    

    // 라벨 텍스트 그리기
    fill(this.isClicked ? 0 : 255); // 클릭 시 검은색 텍스트, 기본 흰색
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(20);
    textFont(fontNamsanB);
    text(this.label, this.x + 62, this.y + this.height / 2 - 2); // 텍스트 위치
  }

  // 버튼 클릭 이벤트 처리
  handleMousePressed() {
    if (this.isHovered && this.onClick) {
      this.isClicked = !this.isClicked; // 클릭 시 클릭 상태 토글
      this.onClick();
    }
  }

  // 마우스가 버튼 위에 있는지 확인
  isMouseOver() {
    return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
  }
}
