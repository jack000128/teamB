class SearchBar {
  constructor(x, y, width, height, mapInstance) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.input = createInput(); // 검색 입력창
    this.input.position(this.x, this.y);
    this.input.size(this.width, this.height);
    this.input.attribute("placeholder", "역 이름 검색...");
    this.filteredStations = []; // 필터링된 역 리스트
    this.selectedStation = null; // 선택된 역
    this.maxResults = 5; // 표시할 최대 검색 결과
    this.resultHeight = 40; // 각 결과 항목의 높이
    this.mapInstance = mapInstance; // Mapbox 객체 전달

    // 입력 이벤트 연결
    this.input.addClass("search-bar");
    this.input.input(() => this.filterStations());

    this.input.elt.addEventListener("keydown", (event) => this.handleKeyPress(event));
  }

  hide() {
    this.input.style("display", "none"); // 검색창 숨김
  }

  show() {
    this.input.style("display", "block"); // 검색창 보임
  }

  // 역 이름 필터링
  filterStations() {
    const query = this.input.value().trim().toLowerCase();

    if (!query) {
      this.filteredStations = [];
      return;
    }
    this.filteredStations = stationData.stations.filter((station) => station.name.toLowerCase().includes(query));
  }

  reset() {
    this.input.value(""); // 검색창 입력값 초기화
    this.filteredStations = []; // 검색 결과 초기화
    this.selectedStation = null; // 선택된 역 초기화
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // 기본 동작 방지

      if (this.filteredStations.length > 0) {
        const query = this.input.value().trim().toLowerCase();

        // 검색어와 이름이 완전히 일치하는 역 찾기
        const exactMatch = this.filteredStations.find((station) => station.name.toLowerCase() === query);

        if (exactMatch) {
          console.log("Exact Match Found:", exactMatch); // 디버깅용
          this.focusOnStation(exactMatch); // 선택된 역으로 시점 이동
        } else {
          console.log("No exact match found for:", query); // 디버깅용
        }
      }

      this.reset(); // 검색창 초기화
    }
  }

  // 검색 결과 그리기
  displayResults() {
    push(); // 좌표계 저장
    resetMatrix(); // 좌표계를 초기화 (translate의 영향을 없앰)

    for (let i = 0; i < Math.min(this.filteredStations.length, this.maxResults); i++) {
      const station = this.filteredStations[i];
      const resultY = this.y - (i + 1) * this.resultHeight - 3;

      // 검색 결과 항목 배경
      rectMode(CORNER);
      fill(255);
      noStroke();
      rect(this.x, resultY, toggleButtonWidth + 26, this.resultHeight);

      // 검색 결과 텍스트
      fill(0);
      noStroke();
      textSize(14);
      textAlign(LEFT, CENTER);
      text(station.name, this.x + 13, resultY + this.resultHeight / 2);

      // 마우스가 항목 위에 있을 경우 강조
      if (mouseX > this.x && mouseX < this.x + this.width && mouseY > resultY && mouseY < resultY + this.resultHeight) {
        fill(color("#F7F7F7"));
        rect(this.x, resultY, toggleButtonWidth + 26, this.resultHeight);
        fill(0);
        text(station.name, this.x + 13, resultY + this.resultHeight / 2);

        // 클릭 시 역 선택
        if (mouseIsPressed) {
          this.selectedStation = station; // 선택된 역 저장
          this.filteredStations = []; // 검색 결과 초기화
        }
      }
    }

    pop(); // 좌표계 복원
  }

  // 선택된 역 반환
  getSelectedStation() {
    const station = this.selectedStation;
    this.selectedStation = null; // 선택 후 초기화
    return station;
  }

  focusOnStation(station) {
    popup.show(station);
    clickedStation = station; 

    // Mapbox `flyTo` 호출
    this.mapInstance.map.flyTo({
      center: [station.lng + offsetLng, station.lat],
      zoom : 12,
      // bearing: 60,
      // pitch: 60,
      speed: 0.6,
      curve: 2,
    });
  }
}
