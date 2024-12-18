class HoverImageButton {
  constructor(x, y, w, h, label, imageSet) {
    this.x = x; // 버튼의 x 좌표
    this.y = y; // 버튼의 y 좌표
    this.w = w; // 버튼의 폭
    this.h = h; // 버튼의 높이
    this.defaultLabel = label; // 기본 라벨
    this.label = label; // 현재 표시할 라벨
    this.imageSet = imageSet; // 전체 이미지 세트 (2차원 배열)
    this.currentImageIndex = 0; // 현재 이미지 인덱스
    this.timer = null; // 타이머 변수
    this.isHovering = false; // hover 상태
  }

  updatePosition(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  // 버튼 그리기
  draw() {
    // hover 상태 확인
    this.checkHover();

    // hover 상태라면 이미지 표시
    if (this.isHovering && this.imageSet[currentRangeIndex].length > 0) {
      let img = this.imageSet[currentRangeIndex][this.currentImageIndex];
      image(img, miniMapX, miniMapY, miniMapWidth - 1, miniMapHeight); // 이미지 표시 위치
    }

    // 버튼 그리기
    fill(this.isHovering ? "#7D765F" : "#F7F7F7");
    rect(this.x, this.y, this.w, this.h); // 버튼 모양
    fill(this.isHovering ? 255 : 0);
    textAlign(CENTER, CENTER);
    textSize(14);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2 - 2);
  }

  // hover 상태 체크
  checkHover() {
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
      if (!this.isHovering) {
        this.onHoverStart();
      }
    } else {
      if (this.isHovering) {
        this.onHoverEnd();
      }
    }
  }

  // hover 시작
  onHoverStart() {
    this.isHovering = true;
    this.currentImageIndex = 0; // 첫 이미지부터 시작
    this.updateLabel();

    // 1초 간격으로 이미지 변경
    this.timer = setInterval(() => {
      this.currentImageIndex++;
      if (this.currentImageIndex >= this.imageSet[currentRangeIndex].length) {
        this.currentImageIndex = this.imageSet[currentRangeIndex].length - 1; // 마지막 이미지 유지
      }
      this.updateLabel();
    }, 1000);
  }

  // hover 해제
  onHoverEnd() {
    this.isHovering = false;
    this.currentImageIndex = 0; // 이미지 초기화
    clearInterval(this.timer); // 타이머 중단
    this.label = this.defaultLabel; // 라벨 초기화
  }

  // 라벨 업데이트
  updateLabel() {
    this.label = `${this.currentImageIndex + 1}/${this.imageSet[currentRangeIndex].length}`; // 진행 상황 표시
  }
}
