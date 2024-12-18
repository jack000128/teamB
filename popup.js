/*class Popup {
  constructor(width = 600, paddingTop = 20, paddingBottom = 20, paddingSides = 20) {
    this.width = width; // 고정된 너비
    this.paddingTop = paddingTop; // 상단 패딩
    this.paddingBottom = paddingBottom; // 하단 패딩
    this.paddingSides = paddingSides; // 좌우 패딩
    this.height = 0; // 초기 높이 (내용에 따라 동적으로 계산)
    this.isVisible = false; // 팝업 표시 여부
    this.station = null; // 현재 표시 중인 역 정보
  }

  // 팝업 창 표시
  show(station) {
    this.station = station; // 역 정보 저장
    this.isVisible = true; // 팝업 표시
    this.adjustSize(); // 내용에 따라 크기 조정
  }

  // 팝업 창 숨기기
  hide() {
    this.isVisible = false;
    this.station = null; // 역 정보 초기화
  }

  // 내용에 따른 팝업 크기 조정
  adjustSize() {
    if (!this.station) return;

    // 줄바꿈 처리
    const descriptionLines = this.wrapText(this.station.description, this.width - this.paddingSides * 2);

    const lineHeight = 20; // 한 줄 높이
    const totalLines = descriptionLines.length + 1; // 설명 줄 포함 (역명과 호선 제외)
    this.height = this.paddingTop + this.paddingBottom + totalLines * lineHeight + 20; // 호선 라인의 추가 높이 포함
  }

  // 텍스트 줄바꿈 처리
  wrapText(text, maxWidth) {
    let words = text.split(" ");
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + " " + word;
      const testWidth = textWidth(testLine);

      if (testWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine); // 마지막 줄 추가
    return lines;
  }

  // 팝업 창 그리기
  draw() {
    if (!this.isVisible || !this.station) return;

    rectMode(CORNER); // 왼쪽 위 모서리를 기준으로 사각형 그리기

    // 팝업의 좌표 계산
    const popupX = (width * 2) / 3 - this.width / 2; // 화면의 2/3 위치
    const popupY = height / 2 - this.height / 2; // 화면 세로 중앙

    // 팝업 배경
    fill(255);
    stroke(0);
    strokeWeight(1);
    rect(popupX, popupY, this.width, this.height, 10);

    // 닫기 버튼
    const closeButtonX = popupX + this.width - 30;
    const closeButtonY = popupY + 10;
    fill(200, 0, 0);
    rect(closeButtonX, closeButtonY, 20, 20, 5);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    text("X", closeButtonX + 10, closeButtonY + 10);

    // 내용 시작 좌표
    const contentX = popupX + this.paddingSides;
    let contentY = popupY + this.paddingTop;

    // 역명과 호선 한 줄로 표시
    fill(0);
    textSize(14);
    textAlign(LEFT, CENTER);
    const lineHeight = 30; // 호선 라인 높이 포함
    text(`${this.station.name}`, contentX, contentY + lineHeight / 2);

    let offsetX = contentX + textWidth(this.station.name) + 10; // 역명 오른쪽에 호선 표시
    this.station.lines.forEach((line) => {
      const circleSize = 20;
      fill(this.getLineColor(line)); // 호선별 색상
      noStroke();
      ellipse(offsetX + circleSize / 2, contentY + lineHeight / 2, circleSize);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(12);
      text(line, offsetX + circleSize / 2, contentY + lineHeight / 2);
      offsetX += circleSize + 10; // 다음 원으로 간격 추가
    });

    // 줄바꿈된 설명 텍스트 출력
    contentY += lineHeight + 10; // 호선 라인 아래로 이동
    const descriptionLines = this.wrapText(this.station.description, this.width - this.paddingSides * 2);

    textAlign(LEFT, TOP); // 좌측 정렬
    fill(0);
    descriptionLines.forEach((line) => {
      text(line, contentX, contentY);
      contentY += 20; // 줄 간격
    });
  }

  // 호선별 색상 지정
  getLineColor(line) {
    const lineColors = {
      1: color("#0032A0"), // 파랑
      2: color("#00B140"), // 초록
      3: color("#FC4C02"), // 주황
      4: color("#00A9E0"), // 보라
      5: color("#A05EB5"),
      6: color("#A9431E"),
      7: color("#67823A"),
      8: color("#E31C79"),
    };
    return lineColors[line] || color(100); // 기본 색상
  }

  // 마우스 클릭 처리
  handleMousePressed() {
    if (!this.isVisible) return;

    const popupX = (width * 2) / 3 - this.width / 2; // 화면의 2/3 위치
    const popupY = height / 2 - this.height / 2; // 화면 세로 중앙

    const closeButtonX = popupX + this.width - 30;
    const closeButtonY = popupY + 10;

    // 닫기 버튼 클릭 여부
    if (mouseX > closeButtonX && mouseX < closeButtonX + 20 && mouseY > closeButtonY && mouseY < closeButtonY + 20) {
      this.hide();
      return; // 닫기 버튼이 클릭되면 창 닫고 종료
    }

    // 팝업창 영역 계산
    const isInsidePopup = mouseX > popupX && mouseX < popupX + this.width && mouseY > popupY && mouseY < popupY + this.height;

    // 팝업창 외부 클릭 시 창 닫기
    if (!isInsidePopup) {
      this.hide();
    }
  }
}*/

/*
class Popup {
  constructor(width = 600) {
    this.width = width;
    this.paddingTop = popupPaddingTop;
    this.paddingBottom = popupPaddingBottom;
    this.paddingSides = popupPaddingSides;
    this.height = 0;
    this.isVisible = false;
    this.station = null;
  }

  // 팝업 창 표시
  show(station) {
    this.station = station; // 역 정보 저장
    this.isVisible = true; // 팝업 표시
    this.adjustSize(); // 내용에 따라 크기 조정
  }

  // 팝업 창 숨기기
  hide() {
    this.isVisible = false;
    this.station = null; // 역 정보 초기화
  }

  // 내용에 따른 팝업 크기 조정
  adjustSize() {
    if (!this.station) return;

    // 줄바꿈 처리
    const descriptionLines = this.wrapText(this.station.description, this.width - this.paddingSides * 2);

    const lineHeight = 20; // 한 줄 높이
    const totalLines = descriptionLines.length + 1; // 설명 줄 포함 (역명과 호선 제외)
    this.height = this.paddingTop + this.paddingBottom + totalLines * lineHeight + 20; // 호선 라인의 추가 높이 포함
  }

  // 텍스트 줄바꿈 처리
  wrapText(text, maxWidth) {
    let words = text.split(" ");
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + " " + word;
      const testWidth = textWidth(testLine);

      if (testWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine); // 마지막 줄 추가
    return lines;
  }

  // 팝업 창 그리기
  draw() {
    if (!this.isVisible || !this.station) return;

    rectMode(CORNER); // 왼쪽 위 모서리를 기준으로 사각형 그리기

    // 팝업의 좌표 계산
    const popupX = (width * 2) / 3 - this.width / 2; // 화면의 2/3 위치
    const popupY = height / 2 - this.height / 2; // 화면 세로 중앙

    // 팝업 배경
    fill(255);
    stroke(0);
    strokeWeight(1);
    rect(popupX, popupY, this.width, this.height, 10);

    // 닫기 버튼
    const closeButtonX = popupX + this.width - 30;
    const closeButtonY = popupY + 10;
    fill(200, 0, 0);
    rect(closeButtonX, closeButtonY, 20, 20, 5);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    text("X", closeButtonX + 10, closeButtonY + 10);

    // 내용 시작 좌표
    const contentX = popupX + this.paddingSides;
    let contentY = popupY + this.paddingTop;

    // 역명과 호선 한 줄로 표시
    fill(0);
    textSize(14);
    textAlign(LEFT, CENTER);
    const lineHeight = 30; // 호선 라인 높이 포함
    text(`${this.station.name}`, contentX, contentY + lineHeight / 2);

    let offsetX = contentX + textWidth(this.station.name) + 10; // 역명 오른쪽에 호선 표시
    this.station.lines.forEach((line) => {
      const circleSize = 20;
      fill(this.getLineColor(line)); // 호선별 색상
      noStroke();
      ellipse(offsetX + circleSize / 2, contentY + lineHeight / 2, circleSize);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(12);
      text(line, offsetX + circleSize / 2, contentY + lineHeight / 2);
      offsetX += circleSize + 10; // 다음 원으로 간격 추가
    });

    // 줄바꿈된 설명 텍스트 출력
    contentY += lineHeight + 10; // 호선 라인 아래로 이동
    const descriptionLines = this.wrapText(this.station.description, this.width - this.paddingSides * 2);

    textAlign(LEFT, TOP); // 좌측 정렬
    fill(0);
    descriptionLines.forEach((line) => {
      text(line, contentX, contentY);
      contentY += 20; // 줄 간격
    });
  }

  // 호선별 색상 지정
  getLineColor(line) {
    const lineColors = {
      1: color("#0032A0"), // 파랑
      2: color("#00B140"), // 초록
      3: color("#FC4C02"), // 주황
      4: color("#00A9E0"), // 보라
      5: color("#A05EB5"),
      6: color("#A9431E"),
      7: color("#67823A"),
      8: color("#E31C79"),
    };
    return lineColors[line] || color(100); // 기본 색상
  }

  handleMousePressed() {
    if (!this.isVisible) return;

    const closeButtonX = popupX + this.width - 30;
    const closeButtonY = popupY + 10;

    if (mouseX > closeButtonX && mouseX < closeButtonX + 20 && mouseY > closeButtonY && mouseY < closeButtonY + 20) {
      this.hide();
      return;
    }

    const isInsidePopup = mouseX > popupX && mouseX < popupX + this.width && mouseY > popupY && mouseY < popupY + this.height;

    if (!isInsidePopup) {
      this.hide();
    }
  }
}
*/

class Popup {
  constructor(width = 450) {
    this.width = width;
    this.paddingTop = popupPaddingTop;
    this.paddingBottom = popupPaddingBottom;
    this.paddingSides = popupPaddingSides;
    this.height = 0;
    this.isVisible = false;
    this.station = null;
  }

  // 팝업 창 표시
  show(station) {
    this.station = station; // 역 정보 저장
    this.isVisible = true; // 팝업 표시
    this.adjustSize(); // 내용에 따라 크기 조정
  }

  // 팝업 창 숨기기
  hide() {
    this.isVisible = false;
    this.station = null; // 역 정보 초기화
  }

  /*
  // 팝업 창 그리기
  draw() {
    if (!this.isVisible || !this.station) return;

    rectMode(CORNER); // 왼쪽 위 모서리를 기준으로 사각형 그리기

    // 팝업의 좌표 계산
    const popupX = (width * 2) / 3 - this.width / 2; // 화면의 2/3 위치
    const popupY = height / 2 - this.height / 2; // 화면 세로 중앙

    // 팝업 배경
    fill(255);
    stroke(0);
    strokeWeight(1);
    rect(popupX, popupY, this.width, this.height, 10);

    // 닫기 버튼
    const closeButtonX = popupX + this.width - 30;
    const closeButtonY = popupY + 10;
    fill(200, 0, 0);
    rect(closeButtonX, closeButtonY, 20, 20, 5);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    text("X", closeButtonX + 10, closeButtonY + 10);

    // 내용 시작 좌표
    const contentX = popupX + this.paddingSides;
    let contentY = popupY + this.paddingTop;

    // 역명과 호선 한 줄로 표시
    fill(0);
    textSize(20);
    textAlign(LEFT, CENTER);
    const lineHeight = 30; // 호선 라인 높이 포함
    text(`${this.station.name}`, contentX, contentY + lineHeight / 2);

    let offsetX = contentX + textWidth(this.station.name) + 10; // 역명 오른쪽에 호선 표시
    this.station.lines.forEach((line) => {
      const circleSize = 20;
      fill(this.getLineColor(line)); // 호선별 색상
      noStroke();
      ellipse(offsetX + circleSize / 2, contentY + lineHeight / 2, circleSize);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(12);
      text(line, offsetX + circleSize / 2, contentY + lineHeight / 2);
      offsetX += circleSize + 10; // 다음 원으로 간격 추가
    });

    // 줄바꿈된 설명 텍스트 출력
    contentY += lineHeight + 10; // 호선 라인 아래로 이동
    const descriptionLines = this.wrapText(this.station.description, this.width - this.paddingSides * 2);

    textAlign(LEFT, TOP); // 좌측 정렬
    textSize(16);
    fill(0);
    descriptionLines.forEach((line) => {
      text(line, contentX, contentY);
      contentY += 20; // 줄 간격
    });
  }
*/

  draw() {
    if (!this.isVisible || !this.station) return;

    rectMode(CORNER); // 왼쪽 위 모서리를 기준으로 사각형 그리기

    // 팝업의 좌표 계산
    const popupX = width * 0.6  - this.width / 2; // 화면의 2/3 위치
    const popupY = height / 2 - this.height / 2; // 화면 세로 중앙
    const headerHeight = 50; // 헤더 높이
    const footerHeight = 30; // 푸터 높이
    const bodyHeight = this.height - headerHeight - footerHeight; // 본문 높이

    
    // 그림자 설정
    let shadowBlur = 4; // 그림자 퍼짐 정도
    let shadowColor = color(0, 0.25); // 연한 검은색 그림자

    // 그림자 그리기
    noFill();
    strokeWeight(1); // 선 두께 설정
    for (let i = shadowBlur; i > 0; i--) {
      stroke(red(shadowColor), green(shadowColor), blue(shadowColor), map(i, 0, shadowBlur, 2, 20)); // 투명도 조절
      rect(
        popupX - i / 2, // 왼쪽으로 퍼짐
        popupY - i / 2, // 위로 퍼짐
        this.width + i, // 오른쪽으로 퍼짐
        this.height + i, // 아래로 퍼짐
        10 // 모서리 둥글기
      );
    }
    

    // 팝업 본체
    fill(255); // 흰색
    noStroke();
    rect(popupX, popupY, this.width, this.height, 10);

    // 헤더 배경
    fill(color("#F7F7F7")); // 연한 회색
    noStroke();
    rect(popupX, popupY, this.width, headerHeight, 10, 10, 0, 0); // 상단 두 모서리 둥글게

    // 본문 배경
    fill(255); // 흰색
    noStroke();
    rect(popupX, popupY + headerHeight, this.width, bodyHeight);

    // 푸터 배경
    fill(color("#F7F7F7")); // 연한 회색
    noStroke();
    rect(popupX, popupY + headerHeight + bodyHeight, this.width, footerHeight, 0, 0, 10, 10); // 하단 두 모서리 둥글게

    // 닫기 버튼
    /*
    const closeButtonX = popupX + this.width - 30;
    const closeButtonY = popupY + headerHeight / 2;
    fill(80);
    ellipse(closeButtonX, closeButtonY, 20, 20);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(12);
    text("X", closeButtonX + 10, closeButtonY + 10);
    */

    // 헤더 내용 (역명과 호선)
    const contentX = popupX + this.paddingSides;
    let contentY = popupY + headerHeight / 2;

    fill(0);
    textSize(20);
    textFont(fontNamsanEB);
    textAlign(LEFT, CENTER);
    text(`${this.station.name}`, contentX, contentY);

    let offsetX = contentX + textWidth(this.station.name) + 10; // 역명 오른쪽에 호선 표시
    this.station.lines.forEach((line) => {
      const circleSize = 20;
      fill(this.getLineColor(line)); // 호선별 색상
      noStroke();
      ellipse(offsetX + circleSize / 2, popupY + headerHeight * 0.54, circleSize);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(12);
      textFont(fontNumber);
      text(line, offsetX + circleSize / 2, popupY + headerHeight * 0.54);
      offsetX += circleSize + 7; // 다음 원으로 간격 추가
    });

    // 본문 텍스트 출력
    contentY = popupY + headerHeight + 20; // 본문 시작 위치
    const descriptionLines = this.wrapText(this.station.description, this.width - this.paddingSides * 2);

    textAlign(LEFT, TOP); // 좌측 정렬
    textSize(14);
    textFont(fontNamsanM);
    fill(0);
    descriptionLines.forEach((line) => {
      text(line, contentX, contentY);
      contentY += 25; // 줄 간격
    });

    // 푸터 텍스트
    fill(0);
    textSize(12);
    textAlign(LEFT, CENTER);
    textFont(fontNamsanB)
    text("Tip. 지도 각도를 조정해 건물도 구경해보세요", popupX + this.paddingSides, popupY + headerHeight + bodyHeight + footerHeight / 2);
  }

  // 호선별 색상 지정
  getLineColor(line) {
    const lineColors = {
      1: color("#0032A0"), // 파랑
      2: color("#00B140"), // 초록
      3: color("#FC4C02"), // 주황
      4: color("#00A9E0"), // 보라
      5: color("#A05EB5"),
      6: color("#A9431E"),
      7: color("#67823A"),
      8: color("#E31C79"),
    };
    return lineColors[line] || color(100); // 기본 색상
  }

  handleMousePressed() {
    if (!this.isVisible) return;
    
    const closeButtonX = popupX + this.width - 30;
    const closeButtonY = popupY + 10;

    if (mouseX > closeButtonX && mouseX < closeButtonX + 20 && mouseY > closeButtonY && mouseY < closeButtonY + 20) {
      this.hide();
      return;
    }

    const isInsidePopup = mouseX > popupX && mouseX < popupX + this.width && mouseY > popupY && mouseY < popupY + this.height;

    if (!isInsidePopup) {
      this.hide();
    }
  }

  wrapText(text, maxWidth) {
    let words = text.split(" ");
    let lines = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine === "" ? word : `${currentLine} ${word}`;
      textSize(14);
      textFont(fontNamsanM)
      const testWidth = textWidth(testLine);

      if (testWidth > maxWidth) {
        if (currentLine === "") {
          // 현재 줄이 비어있다면 단어 자체를 잘라서 추가
          let splitWord = this.splitWordToFit(word, maxWidth);
          lines.push(...splitWord);
        } else {
          lines.push(currentLine); // 현재 줄을 추가
          currentLine = word; // 다음 줄로 넘어감
        }
      } else {
        currentLine = testLine; // 현재 줄에 단어를 추가
      }
    }

    if (currentLine !== "") {
      lines.push(currentLine); // 마지막 줄 추가
    }

    return lines;
  }

  // 단어 자체가 너무 길 경우 분리
  splitWordToFit(word, maxWidth) {
    let result = [];
    let currentSegment = "";

    for (let char of word) {
      const testSegment = currentSegment + char;
      if (textWidth(testSegment) > maxWidth) {
        result.push(currentSegment); // 현재 세그먼트 추가
        currentSegment = char; // 다음 세그먼트 시작
      } else {
        currentSegment = testSegment;
      }
    }

    if (currentSegment !== "") {
      result.push(currentSegment); // 마지막 세그먼트 추가
    }

    return result;
  }

  /*
  adjustSize() {
    if (!this.station) return;

    textSize(14); // 본문 텍스트 크기
    const descriptionLines = this.wrapText(this.station.description, this.width - this.paddingSides * 2);

    const lineHeight = 20; // 한 줄 높이
    const totalLines = descriptionLines.length + 1; // 설명 줄 포함 (역명과 호선 제외)
    this.height = this.paddingTop + this.paddingBottom + totalLines * lineHeight + 20; // 호선 라인의 추가 높이 포함
  }

  // 위에서 개선된 wrapText, splitWordToFit 함수 포함
  */

  adjustSize() {
    if (!this.station) return;

    textSize(14); // 본문 텍스트 크기
    textFont(fontNamsanM)
    const descriptionLines = this.wrapText(this.station.description, this.width - this.paddingSides * 2);

    const lineHeight = 25; // 한 줄 높이
    const totalLines = descriptionLines.length; // 설명 줄 포함 (역명과 호선 제외)

    const headerHeight = 50; // 헤더 높이
    const footerHeight = 30; // 푸터 높이

    // 전체 높이 계산: 헤더, 본문, 푸터 포함
    this.height = this.paddingTop + this.paddingBottom + totalLines * lineHeight + headerHeight + footerHeight;

  }
}



