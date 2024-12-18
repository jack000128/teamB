/*================= 지도 변수 =================*/
/* 1. Mapbox API 키 (외부 공유 금지) */
const key = "pk.eyJ1IjoibXc3NTM5IiwiYSI6ImNtMzVqenZsMzBjMjcya3B5Z2J1cTZuZjMifQ.c36naruoOs3tRcfkHnVKiA";

/* 2. Mapbox 기본 옵션 (위치, 시점, 지도 스타일) */
const options = {
  lat: 37.5665,
  lng: 126.978,
  zoom: 10,
  style: "mapbox://styles/mw7539/cm49ca4k200wd01sl1uke6f5a",
};

/* 3. Mappa.js 정의 (P5.js에 Mapbox 업로드) */
const mappa = new Mappa("MapboxGL", key);
let myMap;
let canvas;

/*============== 모드 및 공통 변수 ==============*/
/* 0 = 시작 화면, 1 = 보기형식1, 2 = 보기형식2 */
let mode = 0;
let resizeTimeout; // 윈도우 크기 조정 타이머
let inactivityTimeout; // 비활성 타이머
let inactivityDuration = 150000; // 30초
let alignButton;
let helpButton;
let modeImages = {}; // 각 모드에 대응하는 이미지 저장

/*=============== 시작 화면 변수 ===============*/
let view1Button;
let view2Button;
let isProcessing = false;

/*=========== 보기형식1 (연대기) 변수 ===========*/
let currentRangeIndex = 0; // 현재 구간 인덱스
let yearRanges = [
  "from0000to1974",
  "from1975to1984",
  "from1985to1994",
  "from1995to2004",
  "from2005to2014",
  "from2015to2024"
];
let buildingData = {}; // 모든 건축물 데이터를 저장
let loadingIndex = 0;
let loadingTimer;
let prevButton, nextButton; // 버튼 객체
let miniMapImages = [];
let descriptionImages = [];
let newsImages = [];
let miniMapX, miniMapY, miniMapWidth, miniMapHeight;
let hoverButton;



/*========== 보기형식2 (자유 체험) 변수 ==========*/
let stationData;
let lineData;
let circleSize;
let stationMap = {};
let popup;
let searchBar;
let toggleButtons = [];
let clickedStation = null; // 클릭된 역을 저장
let labels = ["역사적 인물", "한자와 줄임말", "지명과 랜드마크", "사회상 및 구전전래", "최근 변경"];
let toggleButtonStartX; // 버튼 시작 X 좌표
let toggleButtonStartY; // 버튼 시작 Y 좌표
let toggleButtonWidth; // 버튼 너비
let toggleButtonHeight; // 버튼 높이
let toggleButtonSpacing; // 버튼 간격
let iconsBlack = [];
let iconsWhite = []; 
let iconsMouse = [];
let iconsAction = [];
let popupX;
let popupY;
let popupWidth = 600;
let popupHeight = 0; // 동적으로 계산
let popupPaddingTop = 20;
let popupPaddingBottom = 12;
let popupPaddingSides = 20;
let icon; // 선택 시 아이콘
let emphasisCategory = null; // 강조할 범주
let offsetLng = 0.022; // 오른쪽으로 이동할 경도 값 (값은 조정 가능)
let stationTextX, stationTextY, stationTextWidth, stationTextHeight;



/*======= Preload 영역 (데이터, 이미지, 폰트 등) =======*/
function preload() {
  /* >>>>>>>> 지하철 및 호선 데이터 <<<<<<<< */
  stationData = loadJSON("assets/stations.json");
  lineData = loadJSON("assets/lines.json");

  /* >>>>> 건물 multi-polygon 데이터 <<<<< */
  for (let range of yearRanges) {
    buildingData[range] = loadJSON(`assets/${range}.geojson`);
  }

  modeImages[1] = loadImage("assets/helpImages/mode1.png"); // mode = 1에서 표시할 이미지
  modeImages[2] = loadImage("assets/helpImages/mode2.png"); // mode = 2에서 표시할 이미지

  /* >>>>>>>>>> 보기형식1 이미지 <<<<<<<<<< */
  // 미니맵
  miniMapImages[0] = loadImage("assets/mini_map/map1974.png");
  miniMapImages[1] = loadImage("assets/mini_map/map1984.png");
  miniMapImages[2] = loadImage("assets/mini_map/map1994.png");
  miniMapImages[3] = loadImage("assets/mini_map/map2004.png");
  miniMapImages[4] = loadImage("assets/mini_map/map2014.png");
  miniMapImages[5] = loadImage("assets/mini_map/map2024.png");

  // 노선 설명창
  descriptionImages[0] = loadImage("assets/description/description1974.png");
  descriptionImages[1] = loadImage("assets/description/description1984.png");
  descriptionImages[2] = loadImage("assets/description/description1994.png");
  descriptionImages[3] = loadImage("assets/description/description2004.png");
  descriptionImages[4] = loadImage("assets/description/description2014.png");
  descriptionImages[5] = loadImage("assets/description/description2024.png");

  // 뉴스
  for (let i = 0; i < 6; i++) {
    let set = [];
    for (let j = 0; j < 4; j++) {
      set.push(loadImage(`assets/newsImages/${i}_${j}.png`)); // 이미지 경로
    }
    newsImages.push(set);
  }

  /* >>>>>>>>>> 보기형식2 이미지 <<<<<<<<<< */
  // 역 선택(깃발) 아이콘
  icon = loadImage("assets/icon/flag-solid.svg");

  // 카테고리 Default 아이콘
  iconsWhite[0] = loadImage("assets/icon/user-solid-white.svg");
  iconsWhite[1] = loadImage("assets/icon/language-solid-white.svg");
  iconsWhite[2] = loadImage("assets/icon/landmark-solid-white.svg");
  iconsWhite[3] = loadImage("assets/icon/comments-solid-white.svg");
  iconsWhite[4] = loadImage("assets/icon/clock-solid-white.svg");

  // 카테고리 Clicked 아이콘
  iconsBlack[0] = loadImage("assets/icon/user-solid.svg");
  iconsBlack[1] = loadImage("assets/icon/language-solid.svg");
  iconsBlack[2] = loadImage("assets/icon/landmark-solid.svg");
  iconsBlack[3] = loadImage("assets/icon/comments-solid.svg");
  iconsBlack[4] = loadImage("assets/icon/clock-solid.svg");

  // 마우스 조작 아이콘
  iconsMouse[0] = loadImage("assets/icon_mouse/scroll_mouse.png");
  iconsMouse[1] = loadImage("assets/icon_mouse/pan_mouse.png");
  iconsMouse[2] = loadImage("assets/icon_mouse/drag_mouse.png");
  iconsAction[0] = loadImage("assets/icon_mouse/scroll_action.png");
  iconsAction[1] = loadImage("assets/icon_mouse/pan_action.png");
  iconsAction[2] = loadImage("assets/icon_mouse/drag_action.png");

  /* >>>>>>>>>>>>>> 폰트 <<<<<<<<<<<<<< */
  fontDefault = loadFont("assets/font/Pretendard-Regular.otf");
  fontTitle = loadFont("assets/font/신지하철체.ttf");
  fontNamsanEB = loadFont("assets/font/서울남산 장체EB.ttf");
  fontNamsanB = loadFont("assets/font/서울남산 장체B.ttf");
  fontNamsanM = loadFont("assets/font/서울남산 장체M.ttf");
  fontNumber = loadFont("assets/font/신지하철체.ttf");

  test = loadImage("assets/test1218.png");
}


/*===== Setup 영역 (지도, 캔버스, 레이어, 버튼, 팝업 등) =====*/
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  resetInactivityTimer();

  waitForMapInitialization(() => {
    console.log("Map is loaded!");

    myMap.map.doubleClickZoom.disable();

    myMap.map.scrollZoom.setWheelZoomRate(1 / 400);
    
    myMap.map.dragRotate.disable(); // 기본 동작 비활성화 후 재설정
    myMap.map.dragRotate.enable({
      threshold: 30, // 드래그 시작 민감도 (기본값: 10)
      pitchWithRotate: false, // 드래그 시 pitch를 고정
      bearingSnap: 7, // 회전 각도 스냅 민감도
    });

    // pitch 범위 제한 설정
    myMap.map.setMinPitch(10); // 최소 pitch
    myMap.map.setMaxPitch(70); // 최대 pitch


    // Mapbox에서 건축물 데이터를 위한 기본 레이어 설정
    setupRangeLayers();
    updateYearButtonLabels();

    // 첫 번째 구간 데이터 로드
    // updateMapWithNewRange(currentRangeIndex);

    /*
    myMap.map.setLight({
      anchor: "viewport",
      color: "white",
      intensity: 0.7,
    });
    */
  });

  // 이전 버튼 생성
  prevButton = new YearButton(width * 0.25, height / 10, 200, 40, "10년 전", () => {
    if (currentRangeIndex > 0) {
      console.log("이전 클릭");
      currentRangeIndex--;
      updateMapWithNewRange(currentRangeIndex);
      updateYearButtonLabels();
    }

    
  });

  // 다음 버튼 생성
  nextButton = new YearButton(width * 0.75, height / 10, 200, 40, "10년 후", () => {
    if (currentRangeIndex < yearRanges.length - 1) {
      console.log("다음 클릭");
      currentRangeIndex++;
      updateMapWithNewRange(currentRangeIndex);
      updateYearButtonLabels();
      setTimeout(() => {
        myMap.map.flyTo({
          center: [126.98936, 37.55458],
          zoom: 11,
          bearing: 0,
          pitch: 60,
          speed: 0.6,
          curve: 2,
        });
      }, 1000); 
    } else {
      // 마지막 구간에서 자유 모드로 전환
      mode = 2; 
      currentRangeIndex = yearRanges.length - 1
      updateMapWithNewRange(currentRangeIndex);
      moveToSelectedView2Center(); 
    }
  });

  createScreenButtons();
  createToggleButtons();

  alignButton = new AlignButton(
    width - toggleButtonWidth - toggleButtonStartX, // 버튼 X 위치
    toggleButtonStartY + 4 * (toggleButtonHeight + toggleButtonSpacing), // 버튼 Y 위치
    toggleButtonWidth, // 버튼 너비
    toggleButtonHeight, // 버튼 높이
    "지도 시점 정렬하기", // 버튼 텍스트
    () => {
      // Mapbox 지도 정렬
      myMap.map.easeTo({
        center: [126.98936, 37.55458],
        pitch: 0, // pitch 초기화
        bearing: 0, // bearing 초기화
        duration: 1000, // 애니메이션 시간(ms)
        zoom: 11.5,
      });
    }
  );

  hoverButton = new HoverImageButton(0, 0, 80, 30, "뉴스 보기", newsImages);

  helpButton = new HelpButton(
    width / 2,
    height / 2,
    10, // 버튼 반지름
    modeImages
  );

  createStationMap();
  popup = new Popup();
}


function waitForMapInitialization(callback) {
  const interval = setInterval(() => {
    if (myMap.map) {
      clearInterval(interval);
      myMap.map.on("load", callback); // 맵 로드 완료 후 콜백 실행
    }
  }, 100);
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimeout); // 기존 타이머 초기화
  inactivityTimeout = setTimeout(() => {
    // 비활성 상태가 지속되면 시작 화면으로 전환
    mode = 0;
    console.log("유저 비활성 상태: 시작 화면으로 돌아갑니다.");
  }, inactivityDuration);
}

/*==== Draw 영역 (시작화면 - 보기1 - 보기2) ====*/
function draw() {
  clear();
  if (mode === 0) {
    drawStartScreen();
  } else if (mode === 1) {
    drawView1();
  } else if (mode === 2) {
    drawView2();
  }
}

/*============== 시작화면 영역 ==============*/
function drawStartScreen() {
  clear();
  background(220);

  // 메인 텍스트
  textFont(fontTitle);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  fill(0);
  textSize(32);
  // text("서울교통공사", width / 2, height / 7 * 3 - 100);
  textSize(56);
  textStyle(BOLD)
  text("한눈에 보는", width / 2, height / 7 * 3 - 100);
  text("서울 지하철 역사", width / 2, (height / 7) * 3 - 40);

  // 하단의 시각적 요소 (필름 스타일)
  textFont(fontDefault);
  textStyle(NORMAL);
  drawFilmStrip();

  // 버튼 그리기
  view1Button.draw();
  view2Button.draw();

  if (searchBar) {
    searchBar.hide();
  }
}


// 하단의 시각적 요소 (필름 스타일)
function drawFilmStrip() {
  fill(50);
  rectMode(CENTER);

  // 필름 스트립 위치와 크기
  let filmY = height / 7 * 4; // 필름의 세로 위치
  let filmHeight = 70; // 필름 높이
  rect(width / 2, filmY, width, filmHeight); // 긴 필름 줄

  // 필름 구멍 계산
  let dotSize = 40; // 구멍 크기
  let availableWidth = width; // 구멍을 배치할 가로 공간 (양옆 10% 여백)
  let dotSpacing = dotSize * 1.5; // 구멍 간의 간격
  let numDots = Math.floor(availableWidth / dotSpacing); // 필름 구멍 개수

  // 필름 구멍 그리기
  fill(80);
  for (let i = 0; i < numDots; i++) {
    let x = width / 2 - availableWidth / 2 + i * dotSpacing + dotSpacing / 2;
    rect(x, filmY, dotSize, dotSize * 0.8, 3); // 필름 구멍
  }
}

function createScreenButtons() {
  // 보기 형식1 (원형 버튼)
  view1Button = new CircleButton(
    width / 2, // 중앙
    height / 7 * 4, // 버튼 위치
    70, // 반지름
    null, // 텍스트 없음
    () => {
      isProcessing = true; // 처리 시작
      console.log("보기형식1 선택됨. currentRangeIndex 초기화 중...");

      // 초기화 로직
      currentRangeIndex = 0; // 항상 0으로 초기화
      moveToSelectedView1Center();
      updateMapWithNewRange(currentRangeIndex);

      // 상태 초기화 딜레이
      setTimeout(() => {
        if (currentRangeIndex !== 0) {
          console.warn("currentRangeIndex가 0이 아님, 다시 초기화...");
          currentRangeIndex = 0;
        }
        isProcessing = false; // 처리 완료
      }, 300); // 500ms 대기

      mode = 1;
      console.log("보기형식1 선택 완료. currentRangeIndex:", currentRangeIndex);
    }
  );

  // 보기 형식2 (텍스트 버튼)
  view2Button = new IconTextButton(
    width / 2, // 중앙
    height / 7 * 4 + 150, // 버튼 위치
    200, // 너비
    50, // 높이
    "자유 양식으로 바로 가기", // 텍스트
    () => {
      currentRangeIndex = 5;
      updateMapWithNewRange(currentRangeIndex);
      moveToSelectedView2Center();
      mode = 2;
      emphasisCategory = null;
      console.log("보기형식2 선택됨");
    }
  );
}


/*============== 보기형식1 영역 ==============*/
function drawView1() {
  drawLinesByRange(currentRangeIndex);

  let curCenter = myMap.map.getCenter(); // 중심 위치 (위도, 경도)
  let curZoom = myMap.map.getZoom(); // 줌 레벨
  let curPitch = myMap.map.getPitch(); // 피치
  let curBearing = myMap.map.getBearing(); // 베어링

  /* 연도 구간 */
  // 슬라이드 바
  rectMode(CENTER);
  noStroke();
  fill(80);
  rect(width / 2, height / 10, width, 50);

  // 연도 표시 Main - 도형
  stroke(80);
  strokeWeight(8);
  fill(255);
  rect(width / 2, height / 10, 427, 84, 60);

  // 연도 표시 Main - 텍스트
  noStroke();
  fill(0);
  textSize(32);
  textFont(fontNamsanEB);
  textAlign(CENTER, CENTER);
  text(`${yearRanges[currentRangeIndex].slice(-4)}`, width / 2, height / 10 - 17);

  textSize(14);
  textFont(fontNamsanB);
  textAlign(CENTER, CENTER);
  text("스크롤해서 확대해 보세요! 다 보면 10년 후를 누르세요", width / 2, height / 10 + 20);

  /* 미니맵 */
  miniMapX = toggleButtonStartX - 13;
  miniMapY = toggleButtonStartY - 94 - (toggleButtonWidth + 26) * 0.732 - 5;
  miniMapWidth = toggleButtonWidth + 26;
  miniMapHeight = (toggleButtonWidth + 26) * 0.732;
  imageMode(CORNER);
  image(miniMapImages[currentRangeIndex], miniMapX, miniMapY, miniMapWidth, miniMapHeight);

  /* 설명 판넬 */
  image(descriptionImages[currentRangeIndex], toggleButtonStartX - 13, toggleButtonStartY - 94, toggleButtonWidth + 26, labels.length * (toggleButtonHeight + toggleButtonSpacing) + 108);

  // 카메라 옵션 표시
  /*
  textSize(14);
  textAlign(LEFT, TOP);
  fill(50);
  let cameraInfo = `
    중심: (${curCenter.lat.toFixed(5)}, ${curCenter.lng.toFixed(5)})
    줌 레벨: ${curZoom.toFixed(2)}
    피치: ${curPitch.toFixed(1)}°
    베어링: ${curBearing.toFixed(1)}°
  `;
  text(cameraInfo, width - 200, 20); // 우측 상단에 표시
  */

  prevButton.draw();
  nextButton.draw();

  drawRangeIndicator(width / 2, 140, yearRanges.length, currentRangeIndex);

  /* 지도 조작 판넬 */
  // 판넬
  fill(255);
  stroke(0);
  strokeWeight(1.5);
  rectMode(CORNER);
  rect(width - toggleButtonWidth - 13 - toggleButtonStartX, toggleButtonStartY - 94, toggleButtonWidth + 26, labels.length * (toggleButtonHeight + toggleButtonSpacing) + 108);

  // 제목 및 부제목
  fill(color("#231F20"));
  noStroke();
  textAlign(LEFT, CENTER);
  textFont(fontNamsanB);
  textSize(26);
  text("지도 조작 가이드", width - toggleButtonWidth - toggleButtonStartX + 2, toggleButtonStartY - 60);

  textSize(14);
  text("마우스를 이용해 위치와 각도를 조정하세요", width - toggleButtonWidth - toggleButtonStartX + 2, toggleButtonStartY - 30);

  imageMode(CORNER);
  image(iconsMouse[0], width - toggleButtonWidth - toggleButtonStartX, toggleButtonStartY - 8, 45, 60);
  image(iconsAction[0], width - toggleButtonWidth - toggleButtonStartX + 48, toggleButtonStartY - 8 + 20, 20, 20);

  image(iconsMouse[1], width - toggleButtonWidth - toggleButtonStartX, toggleButtonStartY - 8 + 56, 45, 60);
  image(iconsAction[1], width - toggleButtonWidth - toggleButtonStartX + 48, toggleButtonStartY - 8 + 20 + 56, 20, 20);

  image(iconsMouse[2], width - toggleButtonWidth - toggleButtonStartX, toggleButtonStartY - 8 + 112, 45, 60);
  image(iconsAction[2], width - toggleButtonWidth - toggleButtonStartX + 48, toggleButtonStartY - 8 + 20 + 112, 20, 20);

  textSize(16);
  text("지도 확대 및 축소", width - toggleButtonWidth - toggleButtonStartX + 48 + 34, toggleButtonStartY - 8 + 29);
  text("지도 위치 이동", width - toggleButtonWidth - toggleButtonStartX + 48 + 34, toggleButtonStartY - 8 + 56 + 29);
  text("지도 상하좌우 각도 회전", width - toggleButtonWidth - toggleButtonStartX + 48 + 34, toggleButtonStartY - 8 + 112 + 29);

  /* 지도 정렬 버튼 영역 */
  alignButton.draw();


  let buttonX = miniMapX + miniMapWidth - 76.5; // 버튼 여백 포함
  let buttonY = miniMapY + miniMapHeight - 36;
  hoverButton.updatePosition(buttonX, buttonY, 60, 20);
  hoverButton.draw();

  helpButton.updatePosition(width - 35, toggleButtonStartY - 114, 10);
  helpButton.draw(1);
  fill(0, 120)
  rectMode(CENTER)
  // rect(width / 2, height / 2, width, height);
  imageMode(CENTER);
  // image(test, width / 2, height / 2, 750, 390);

}


function updateYearButtonLabels() {
  // 이전 버튼 라벨 업데이트
  if (currentRangeIndex === 0) {
    prevButton.label = ""; // 첫 번째 구간에서는 라벨 제거
  } else {
    prevButton.label = "10년 전";
  }

  // 다음 버튼 라벨 업데이트
  if (currentRangeIndex === 5) {
    nextButton.label = "자유모드 가기";
    nextButton.x += 40;
  } else {
    nextButton.label = "10년 후";
    nextButton.x = width * 0.75
  }
}


function setupRangeLayers() {
  const map = myMap.map;

  for (let range of yearRanges) {
    if (!map.getSource(range)) {
      map.addSource(range, {
        type: "geojson",
        data: buildingData[range],
      });

      map.addLayer({
        id: `${range}-layer`,
        type: "fill-extrusion",
        source: range,
        paint: {
          "fill-extrusion-color": "#BBBBBB",
          "fill-extrusion-height": ["get", "A16"],
          "fill-extrusion-base": 0,
          "fill-extrusion-opacity": 0.6,
        },
      });
    }
  }
}


function updateMapWithNewRange(index) {
  const map = myMap.map;

  for (let i = 0; i < yearRanges.length; i++) {
    const range = yearRanges[i];
    const visibility = i <= index ? "visible" : "none";

    if (map.getLayer(`${range}-layer`)) {
      map.setLayoutProperty(`${range}-layer`, "visibility", visibility);
    }
  }
}


function drawLinesByRange(index) {
  let rangeKey = yearRanges[index]; // 현재 선택된 구간의 키 가져오기
  let zoomLevel = myMap.zoom(); // 줌 레벨 가져오기

  for (let line of lineData.lines) {
    if (line[rangeKey]) {
      // 해당 구간에 포함된 데이터가 있는 경우
      // 선 그리기
      for (let route of line[rangeKey]) {
        beginShape();
        noFill();
        stroke(color(line.color));
        strokeWeight(4);

        for (let stationId of route) {
          let station = stationMap[stationId];
          if (station) {
            let pos = myMap.latLngToPixel(station.lat, station.lng); // 역 위치를 픽셀로 변환
            vertex(pos.x, pos.y); // 선 연결
          }
        }
        endShape();
      }

      // 역 원과 이름 그리기
      for (let route of line[rangeKey]) {
        for (let stationId of route) {
          let station = stationMap[stationId];
          if (station) {
            let pos = myMap.latLngToPixel(station.lat, station.lng); // 역 위치를 픽셀로 변환
            drawStationMarker(pos, station, rangeKey, zoomLevel); // 역 원과 이름 표시
          }
        }
      }
    }
  }
}

function drawStationMarker(pos, station, rangeKey, zoomLevel) {
  let circleSize = map(zoomLevel, 10, 20, 5, 20); // 원 크기
  let strokeValue = circleSize / 6; // 테두리 두께
  let txtSize = map(zoomLevel, 10, 20, 7, 28); // 텍스트 크기

  // 역의 색상 설정 (현재 rangeKey와 비교)
  fill(240);
  stroke(0);
  strokeWeight(strokeValue); // 테두리 두께
  ellipse(pos.x, pos.y, circleSize);

  fill(150); // 텍스트 색
  stroke(255);

  if (station.addedInRange && station.addedInRange.includes(rangeKey)) {
    fill(0)
    strokeValue *= 1.5
    txtSize *= 1.4
  }
  // 역 이름 표시
  
  strokeWeight(strokeValue * 1.5);
  textSize(txtSize); // 텍스트 크기
  textAlign(CENTER, CENTER); // 텍스트 정렬
  if (zoomLevel >= 12 && zoomLevel <= 14) {
    push(); // 현재 스타일 저장
    translate(pos.x + 10, pos.y + 10); // 텍스트의 기준점 이동
    rotate(radians(-45)); // 45도 회전 (음수로 하면 아래로 기울어짐)
    text(station.name, 0, 0); // 이동 및 회전된 위치에 텍스트 표시
    pop(); // 이전 스타일로 복원
  }
}

function drawRangeIndicator(x, y, total, current) {
  let spacing = 40; // 점 간 간격
  let inactiveSize = 10; // 비활성 점 크기
  let activeSize = 15; // 활성 점 크기

  for (let i = 0; i < total; i++) {
    let dotX = x - ((total - 1) * spacing) / 2 + i * spacing; // 각 점의 X 좌표
    let dotSize = i === current ? activeSize : inactiveSize; // 활성/비활성 크기
    let dotColor = i === current ? color("#FDD72C") : color("#383839"); // 활성/비활성 색상
    stroke(color("#383839"));
    i === current ? strokeWeight(1.5) : noStroke()
    fill(dotColor);
    ellipse(dotX, y, dotSize, dotSize); // 점 그리기
  }
}


function drawView2() {
  /* 지도 영역 */
  // 호선 연결 (선)
  drawLines();
  // 지하철역 표시 (원 및 아이콘)
  drawStations();

  /* 연도 구간 */
  // 슬라이드 바
  rectMode(CENTER);
  noStroke();
  fill(80);
  rect(width / 2, height / 10, width, 50);

  // 테마 표시 Main - 도형
  stroke(80);
  strokeWeight(8);
  fill(255);
  rect(width / 2, height / 10, 427, 84, 60);

  // 테마 표시 Main - 텍스트
  noStroke();
  fill(0);
  textSize(32);
  textFont(fontNamsanEB);
  textAlign(CENTER, CENTER);
  text(`${emphasisCategory == null ? "역을 자유롭게 탐색해봐요" : emphasisCategory}`, width / 2, height / 10 - 17);

  textSize(14);
  textFont(fontNamsanB);
  textAlign(CENTER, CENTER);
  text(emphasisCategory == null ? "죄측 하단의 편의 기능과 우측의 지도 조작법을 참고해주세요" : "아이콘 있는 노란색 역을 클릭해보세요.", width / 2, height / 10 + 20);

  /* 토글 버튼 영역 */
  // 판넬
  fill(255);
  stroke(0);
  strokeWeight(1.5);
  rectMode(CORNER);
  rect(toggleButtonStartX - 13, toggleButtonStartY - 94, toggleButtonWidth + 26, labels.length * (toggleButtonHeight + toggleButtonSpacing) + 108);

  // 제목 및 부제목
  fill(color("#231F20"));
  noStroke();
  textAlign(LEFT, CENTER);
  textFont(fontNamsanB);
  textSize(26);
  text("지하철 역명 유래", toggleButtonStartX + 2, toggleButtonStartY - 60);

  textSize(14);
  text("버튼을 눌러 재미있는 일화를 확인해보세요!", toggleButtonStartX + 2, toggleButtonStartY - 30);

  // 버튼
  for (let button of toggleButtons) {
    button.draw();
  }

  /* 검색창 영역 */
  if (!searchBar) {
    searchBar = new SearchBar(toggleButtonStartX - 13 - 1, toggleButtonStartY - 153, toggleButtonWidth - 5, 20, myMap);
  } else {
    searchBar.show();
    searchBar.displayResults();
  }

  let selectedStation = searchBar.getSelectedStation();
  if (selectedStation) {
    searchBar.focusOnStation(selectedStation);
    searchBar.reset();
  }

  /* 지도 조작 판넬 */
  // 판넬
  fill(255);
  stroke(0);
  strokeWeight(1.5);
  rectMode(CORNER);
  rect(
    width - toggleButtonWidth - 13 - toggleButtonStartX,
    toggleButtonStartY - 94,
    toggleButtonWidth + 26,
    labels.length * (toggleButtonHeight + toggleButtonSpacing) + 108
  );

  
  // 제목 및 부제목
  fill(color("#231F20"));
  noStroke();
  textAlign(LEFT, CENTER);
  textFont(fontNamsanB);
  textSize(26);
  text("지도 조작 가이드", width - toggleButtonWidth - toggleButtonStartX + 2, toggleButtonStartY - 60);

  textSize(14);
  text("마우스를 이용해 위치와 각도를 조정하세요", width - toggleButtonWidth - toggleButtonStartX + 2, toggleButtonStartY - 30);
  
  imageMode(CORNER);
  image(iconsMouse[0], width - toggleButtonWidth - toggleButtonStartX, toggleButtonStartY - 8, 45, 60);
  image(iconsAction[0], width - toggleButtonWidth - toggleButtonStartX + 48, toggleButtonStartY - 8 + 20, 20, 20);

  image(iconsMouse[1], width - toggleButtonWidth - toggleButtonStartX, toggleButtonStartY - 8 + 56, 45, 60);
  image(iconsAction[1], width - toggleButtonWidth - toggleButtonStartX + 48, toggleButtonStartY - 8 + 20 + 56, 20, 20);

  image(iconsMouse[2], width - toggleButtonWidth - toggleButtonStartX, toggleButtonStartY - 8 + 112, 45, 60);
  image(iconsAction[2], width - toggleButtonWidth - toggleButtonStartX + 48, toggleButtonStartY - 8 + 20 + 112, 20, 20);

  textSize(16);
  text("지도 확대 및 축소", width - toggleButtonWidth - toggleButtonStartX + 48 + 34, toggleButtonStartY - 8 + 29);
  text("지도 위치 이동", width - toggleButtonWidth - toggleButtonStartX + 48 + 34, toggleButtonStartY - 8 + 56 + 29);
  text("지도 상하좌우 각도 회전", width - toggleButtonWidth - toggleButtonStartX + 48 + 34, toggleButtonStartY - 8 + 112 + 29);



  /* 지도 정렬 버튼 영역 */
  alignButton.draw();
  

  /* 팝업창 영역 */
  popup.draw();



  /* 설명창 영역 */

  let curCenter = myMap.map.getCenter(); // 중심 위치 (위도, 경도)
  let curZoom = myMap.map.getZoom(); // 줌 레벨
  let curPitch = myMap.map.getPitch(); // 피치
  let curBearing = myMap.map.getBearing(); // 베어링

  // 카메라 옵션 표시
  /*
  textSize(14);
  textAlign(LEFT, TOP);
  fill(50);
  let cameraInfo = `
    중심: (${curCenter.lat.toFixed(5)}, ${curCenter.lng.toFixed(5)})
    줌 레벨: ${curZoom.toFixed(2)}
    피치: ${curPitch.toFixed(1)}°
    베어링: ${curBearing.toFixed(1)}°
  `;
  text(cameraInfo, width - 200, 20); // 우측 상단에 표시
  */
  
  helpButton.updatePosition(width - 35, toggleButtonStartY - 114, 10);
  helpButton.draw(2);
}


function createToggleButtons() {
  toggleButtons = []; // 기존 버튼 배열 초기화

  toggleButtonStartX = 40; // 버튼 시작 X 좌표
  toggleButtonStartY = height * 0.67; // 버튼 시작 Y 좌표
  // toggleButtonStartY = height * 0.64; // 버튼 시작 Y 좌표
  toggleButtonWidth = 230; // 버튼 너비
  toggleButtonHeight = 40; // 버튼 높이
  toggleButtonSpacing = 2; // 버튼 간격

  for (let i = 0; i < labels.length; i++) {
    let x = toggleButtonStartX;
    let y = toggleButtonStartY + i * (toggleButtonHeight + toggleButtonSpacing);

    // 버튼 생성 및 배열에 추가
    toggleButtons.push(
      new ToggleButton(
        x,
        y,
        toggleButtonWidth,
        toggleButtonHeight,
        labels[i],
        iconsWhite[i], // 기본 아이콘
        iconsBlack[i], // 클릭 상태 아이콘
        () => {
          updateEmphasisCategory(labels[i]);
          console.log(`${labels[i]} 버튼 클릭됨`);
        }
      )
    );
  }
}


// 카테고리 업데이트 함수
function updateEmphasisCategory(newCategory) {
  if (emphasisCategory === newCategory) {
    emphasisCategory = null; // 선택 해제
    toggleButtons.forEach(button => button.isClicked = false);
  } else {
    emphasisCategory = newCategory; // 새 선택
    toggleButtons.forEach(button => {
      button.isClicked = (button.label === newCategory);
    });
  }
}


// station과 line 데이터 연결하기
function createStationMap() {
  for (let station of stationData.stations) {
    // console.log(station.id)
    for (let id of station.id) {
      stationMap[id] = station;
    }
  }
}


function drawStations() {
  let zoomLevel = myMap.zoom(); // 현재 줌 레벨 가져오기

  for (let station of stationData.stations) {
    let circleSize = map(zoomLevel, 10, 20, 6.2, 50); // 줌 레벨에 따라 원 크기 계산
    let strokeValue = circleSize / 6;
    let txtSize = map(zoomLevel, 10, 20, 9, 30);
    let pos = myMap.latLngToPixel(station.lat, station.lng);

    // 기본 스타일
    fill(240);
    stroke(0);
    strokeWeight(strokeValue);

    // 조건 1. emphasisCategory에 해당하는 역은 아이콘 그리기
    rectMode(CENTER);
    imageMode(CENTER);
    let categoryIndex = labels.indexOf(emphasisCategory);
    if (station.category === emphasisCategory) {
      strokeWeight(strokeValue * 0.9);
      ellipse(pos.x, pos.y, circleSize * 1.2, circleSize * 1.2);
      image(iconsBlack[categoryIndex], pos.x, pos.y, circleSize * 0.7, circleSize * 0.7);
      if (station.is_important) {
        fill(255, 215, 0); // 조건 2: 중요 역은 노란색
        ellipse(pos.x, pos.y, circleSize * 1.8, circleSize * 1.8);
        image(iconsBlack[categoryIndex], pos.x, pos.y, circleSize, circleSize);
      }
    } else {
      // 기본 원
      ellipse(pos.x, pos.y, circleSize, circleSize);
    }

    // 조건 4. 클릭된 역일 경우 아이콘 표시
    if (clickedStation === station) {
      image(icon, pos.x + circleSize / 2, pos.y - (circleSize / 3) * 2, circleSize, circleSize * 1.4); // 아이콘 표시
    }

    fill(0);
    stroke(255);
    strokeWeight(strokeValue * 3);
    textSize(txtSize);
    textAlign(RIGHT, CENTER);
    textFont(fontNamsanM);

    // 텍스트 관련 전역 변수 업데이트
    textSize(txtSize);
    stationTextX = pos.x - 13; // 텍스트 X 위치
    stationTextY = pos.y; // 텍스트 Y 위치
    stationTextWidth = textWidth(station.name); // 텍스트 너비
    stationTextHeight = txtSize; // 텍스트 높이

    let isMouseOver =
      mouseX > stationTextX - stationTextWidth &&
      mouseX < pos.x &&
      mouseY > stationTextY - stationTextHeight / 2 &&
      mouseY < stationTextY + stationTextHeight / 2;
    
    // 조건 3. Hover된 역 이름 표시 및 색상 변경
    if ((isMouseOver) && zoomLevel >= 10.8) {
      fill(255, 69, 0); // Hover 상태에서는 빨간색
      text(station.name, stationTextX, stationTextY);
    } else if (zoomLevel >= 10.8) {
      fill(0);
      text(station.name, stationTextX, stationTextY);
    }
  }
}


// 호선 그리기 (=선 연결하기)
function drawLines() {
  for (let line of lineData.lines) {
    for (let route of line.routes) {
      beginShape();
      noFill();
      stroke(color(line.color));
      strokeWeight(4);

      for (let stationId of route) {
        let station = stationMap[stationId];

        if (station) {
          let pos = myMap.latLngToPixel(station.lat, station.lng);
          vertex(pos.x, pos.y);
        } else {
          console.warn(`Station ID ${stationId} not found in stationMap.`);
        }
      }
      endShape();
    }
  }
}


function moveToSelectedView1Center() {
  myMap.map.jumpTo({
    lat: 37.5665,
    lng: 126.978,
    zoom: 10,
    bearing: 0,
    pitch: 0,
  });
}

function moveToSelectedView2Center() {
  myMap.map.jumpTo({
    lat: 37.5665,
    lng: 126.978,
    zoom: 10,
    bearing: 0,
    pitch: 0,
  });
}

function mousePressed() {
  resetInactivityTimer();
  alignButton.handleMousePressed();

  if (mode === 0) {
    view1Button.handleClick();
    view2Button.handleClick();
  } else if (mode === 1) {
    prevButton.handleClick();
    nextButton.handleClick();
  } else if (mode === 2) {
    popup.handleMousePressed();

    for (let button of toggleButtons) {
      button.handleMousePressed();
    }

    let isInsidePopup = mouseX > popupX && mouseX < popupX + popupWidth && mouseY > popupY && mouseY < popupY + popupHeight;

    // 팝업 외부를 클릭했을 때 선택된 역 초기화
    if (!isInsidePopup) {
      clickedStation = null;
    }

    let stationClicked = false; // 역 클릭 상태를 추적

    for (let station of stationData.stations) {
      let zoomLevel = myMap.zoom();
      let pos = myMap.latLngToPixel(station.lat, station.lng);
      let txtSize = map(zoomLevel, 10, 20, 9, 30);
      let stationTextX = pos.x - 13; // 텍스트 X 위치
      let stationTextY = pos.y; // 텍스트 Y 위치
      let stationTextWidth = textWidth(station.name); // 텍스트 너비
      let stationTextHeight = txtSize; // 텍스트 높이

      // 마우스가 영역 안에 있는지 확인
      let isMouseOver =
        mouseX > stationTextX - stationTextWidth &&
        mouseX < pos.x &&
        mouseY > stationTextY - stationTextHeight / 2 &&
        mouseY < stationTextY + stationTextHeight / 2;

      if (isMouseOver) {
        if (zoomLevel <= 11) {
          myMap.map.easeTo({
            center: [station.lng + offsetLng * 1.9, station.lat],
            zoom: zoomLevel,
          });
        }
        else if (zoomLevel <= 12) {
          myMap.map.easeTo({
            center: [station.lng + offsetLng, station.lat],
            zoom: zoomLevel,
          });
        } else if (zoomLevel <= 13) {
          myMap.map.easeTo({
            center: [station.lng + offsetLng * 0.5, station.lat],
            zoom: 13,
          });
        } else {
          myMap.map.easeTo({
            center: [station.lng + offsetLng * 0.25, station.lat],
            zoom: 14,
          });
        }
        
        popup.show(station); // 팝업 표시
        clickedStation = station; // 클릭된 역 설정
        stationClicked = true; // 역 클릭 상태 설정
        break; // 루프 종료
      }
    }

    // 역 클릭이 발생하지 않았을 경우 초기화
    if (!stationClicked) {
      clickedStation = null;
    }
  }
}


function keyPressed() {
  resetInactivityTimer();
  if (keyCode === 32) {
    // 스페이스바 입력 확인
    setTimeout(() => {
      currentRangeIndex = 0; // 시작 화면 상태 초기화
      mode = 0; // 시작 화면 모드로 전환
      updateYearButtonLabels();
      console.log("시작 화면으로 전환 완료.");
    }, 200); // 200ms 대기

    for (let button of toggleButtons) {
      button.isClicked = false;
    }
    popup.hide();
    clickedStation = null;
  }
}

function mouseMoved() {
  resetInactivityTimer();
}

function mouseDragged() {
  resetInactivityTimer();
}


// 창 크기 조정 시 지도 및 캔버스 크기를 맞추는 함수
function windowResized() {
  // 기존 타이머가 있다면 취소
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }

  // 1초 텀을 두고 창 크기 변경 반영
  resizeTimeout = setTimeout(() => {
    // 캔버스 크기 재조정
    resizeCanvas(windowWidth, windowHeight);

    view1Button.updatePosition(width / 2, height / 7 * 4);
    view2Button.updatePosition(width / 2, (height / 7) * 4 + 150);

    prevButton.updatePosition(width * 0.25, height / 10);
    nextButton.updatePosition(width * 0.75, height / 10);

    alignButton.updatePosition(
      width - toggleButtonWidth - toggleButtonStartX, // 버튼 X 위치
      toggleButtonStartY + 4 * (toggleButtonHeight + toggleButtonSpacing))


    // MapboxGL의 컨테이너 스타일 재조정
    const mapContainer = document.getElementById(myMap.id);
    if (mapContainer) {
      mapContainer.style.width = `${windowWidth}px`;
      mapContainer.style.height = `${windowHeight}px`;
    }

    // MapboxGL 맵 인스턴스 크기 재조정
    if (myMap.map && myMap.map.resize) {
      myMap.map.resize();
    }

    // 캔버스를 다시 맵과 연결 : 200ms 간격
    myMap.overlay(canvas);
  }, 200);
}
