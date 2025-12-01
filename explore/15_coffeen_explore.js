/* -----------------------------
   0. 초기 데이터 + Web Storage
------------------------------ */

const initialCafes = [
  {
    id: 1,
    image: "../assets/images/15_cafe1.jpeg",
    name: "더 베이커리",
    location: "용산구",
    rating: 4.7,
    reviews: 245,
    tags: ["#베이커리", "#감성"],
    distance: "0.5km",
    saves: 1234,
    category: "all",
  },
  {
    id: 2,
    image: "../assets/images/15_cafe2.jpeg",
    name: "선샤인 테라스",
    location: "마포구",
    rating: 4.6,
    reviews: 198,
    tags: ["#자연", "#루프탑"],
    distance: "1.1km",
    saves: 1120,
    category: "all",
  },
  {
    id: 3,
    image: "../assets/images/15_cafe3.jpeg",
    name: "모노브루 라운지",
    location: "성동구",
    rating: 4.8,
    reviews: 234,
    tags: ["#모던", "#공부"],
    distance: "2.0km",
    saves: 1890,
    category: "work",
  },
  {
    id: 4,
    image: "../assets/images/15_cafe4.jpeg",
    name: "라이트웨이 커피바",
    location: "중구",
    rating: 4.6,
    reviews: 189,
    tags: ["#빈티지", "#맛집"],
    distance: "1.8km",
    saves: 980,
    category: "dessert",
  },
  {
    id: 5,
    image: "../assets/images/15_cafe5.jpeg",
    name: "루프탑 라운지",
    location: "동작구",
    rating: 4.9,
    reviews: 312,
    tags: ["#루프탑", "#힐링"],
    distance: "3.1km",
    saves: 1567,
    category: "rooftop",
  },
  {
    id: 6,
    image: "../assets/images/15_cafe6.jpeg",
    name: "코지 코너",
    location: "용산구",
    rating: 4.5,
    reviews: 167,
    tags: ["#아늑한", "#감성"],
    distance: "0.9km",
    saves: 876,
    category: "quiet",
  },
];

// Web Storage에 기본 데이터 저장 
const STORAGE_KEY = "coffeen_explore_cafes";

try {
  const stored = localStorage.getItem(STORAGE_KEY);
  const parsed = stored ? JSON.parse(stored) : null;
  if (!parsed || !Array.isArray(parsed) || parsed.length !== initialCafes.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCafes));
  }
} catch (e) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCafes));
}

/* -----------------------------
   1. 해시태그/지역 목록
------------------------------ */

const HASHTAGS = [
  "공부",
  "모던",
  "아늑한",
  "자연",
  "맛집",
  "빈티지",
  "힐링",
  "루프탑",
  "베이커리",
  "감성",
];

const REGIONS = ["용산구", "마포구", "성동구", "중구", "동작구"];

/* -----------------------------
   2. 상태값 
------------------------------ */

let searchQuery = "";
let selectedTags = [];
let selectedRegions = [];
let sortBy = "rating"; // 'rating' | 'likes' | 'distance'
let viewMode = "grid"; // 'masonry' | 'grid'
let filtersOpen = true;

/* -----------------------------
   3. DOM 요소
------------------------------ */

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const filterToggleBtn = document.getElementById("filterToggleBtn");
const filterBody = document.getElementById("filterBody");
const tagContainer = document.getElementById("tagContainer");
const regionContainer = document.getElementById("regionContainer");
const clearTagsBtn = document.getElementById("clearTagsBtn");
const clearRegionsBtn = document.getElementById("clearRegionsBtn");
const selectedFilterBar = document.getElementById("selectedFilterBar");
const selectedFilterList = document.getElementById("selectedFilterList");
const clearAllFiltersBtn = document.getElementById("clearAllFilters");
const sortSelect = document.getElementById("sortSelect");
const sortDropdownToggle = document.getElementById("sortDropdownToggle");
const sortDropdownList = document.getElementById("sortDropdownList");
const sortDropdownLabel = document.getElementById("sortDropdownLabel");
const gridBtn = document.getElementById("gridBtn");
const masonryBtn = document.getElementById("masonryBtn");
const cafeGrid = document.getElementById("cafeGrid");
const resultCountText = document.getElementById("resultCountText");
const emptyState = document.getElementById("emptyState");
const resetBtn = document.getElementById("resetBtn");
let masonryRaf = null;

/* -----------------------------
   4. Fetch + JSON (데이터 불러오기)
------------------------------ */

function fetchCafes() {
  const stored = localStorage.getItem(STORAGE_KEY);
  const cafes = stored ? JSON.parse(stored) : initialCafes;

  cafes.forEach((cafe) => {
    if (typeof cafe.liked === "undefined") {
      cafe.liked = false;
    }
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cafes));

  // data: URL을 사용해 fetch + JSON 패턴을 과제 요구조건대로 사용
  const dataUrl =
    "data:application/json," + encodeURIComponent(JSON.stringify(cafes));

  return fetch(dataUrl).then((response) => response.json());
}

/* -----------------------------
   5. 필터 chip 렌더링
------------------------------ */

function renderFilterChips() {
  // 해시태그
  tagContainer.innerHTML = "";
  HASHTAGS.forEach((tag) => {
    const button = document.createElement("button");
    button.className = "chip-tag";
    button.textContent = "#" + tag;
    button.addEventListener("click", () => toggleTag(tag, button));
    tagContainer.appendChild(button);
  });

  // 지역
  regionContainer.innerHTML = "";
  REGIONS.forEach((region) => {
    const button = document.createElement("button");
    button.className = "chip-region";
    const iconSpan = document.createElement("span");
    iconSpan.className = "chip-region-icon";
    const labelSpan = document.createElement("span");
    labelSpan.textContent = region;

    button.appendChild(iconSpan);
    button.appendChild(labelSpan);

    button.addEventListener("click", () => toggleRegion(region, button));
    regionContainer.appendChild(button);
  });
}

/* -----------------------------
   6. 태그 / 지역 토글
------------------------------ */

function toggleTag(tag, btn) {
  if (selectedTags.includes(tag)) {
    selectedTags = selectedTags.filter((t) => t !== tag);
    btn.classList.remove("active");
  } else {
    selectedTags.push(tag);
    btn.classList.add("active");
  }
  updateFilterUI();
  refreshCafes();
}

function toggleRegion(region, btn) {
  if (selectedRegions.includes(region)) {
    selectedRegions = selectedRegions.filter((r) => r !== region);
    btn.classList.remove("active");
  } else {
    selectedRegions.push(region);
    btn.classList.add("active");
  }
  updateFilterUI();
  refreshCafes();
}

/* -----------------------------
   7. 선택된 필터 UI 갱신
------------------------------ */

function updateFilterUI() {
  const totalCount = selectedTags.length + selectedRegions.length;

  // 상단 선택된 필터 바 표시 여부
  if (totalCount === 0) {
    selectedFilterBar.classList.add("hidden");
    selectedFilterList.innerHTML = "";
  } else {
    selectedFilterBar.classList.remove("hidden");
    selectedFilterList.innerHTML = "";

    selectedTags.forEach((tag) => {
      const chip = document.createElement("div");
      chip.className = "selected-chip selected-chip-tag";
      chip.innerHTML = `#${tag} <span class="chip-x">×</span>`;
      chip.addEventListener("click", () => {
        selectedTags = selectedTags.filter((t) => t !== tag);
        Array.from(tagContainer.children).forEach((btn) => {
          if (btn.textContent.replace("#", "") === tag) {
            btn.classList.remove("active");
          }
        });
        updateFilterUI();
        refreshCafes();
      });
      selectedFilterList.appendChild(chip);
    });

    selectedRegions.forEach((region) => {
      const chip = document.createElement("div");
      chip.className = "selected-chip selected-chip-region";
      chip.innerHTML = `${region} <span class="chip-x">×</span>`;
      chip.addEventListener("click", () => {
        selectedRegions = selectedRegions.filter((r) => r !== region);
        Array.from(regionContainer.children).forEach((btn) => {
          if (btn.innerText.trim().endsWith(region)) {
            btn.classList.remove("active");
          }
        });
        updateFilterUI();
        refreshCafes();
      });
      selectedFilterList.appendChild(chip);
    });
  }

  // 부분 선택 해제 버튼
  clearTagsBtn.classList.toggle("hidden", selectedTags.length === 0);
  clearRegionsBtn.classList.toggle("hidden", selectedRegions.length === 0);
}

/* -----------------------------
   8. 필터 전체 / 부분 초기화
------------------------------ */

function clearAllFilters() {
  selectedTags = [];
  selectedRegions = [];
  searchQuery = "";
  searchInput.value = "";

  // 모든 chip active 제거
  Array.from(tagContainer.children).forEach((btn) =>
    btn.classList.remove("active")
  );
  Array.from(regionContainer.children).forEach((btn) =>
    btn.classList.remove("active")
  );

  updateFilterUI();
  refreshCafes();
}

function clearTagsOnly() {
  selectedTags = [];
  Array.from(tagContainer.children).forEach((btn) =>
    btn.classList.remove("active")
  );
  updateFilterUI();
  refreshCafes();
}

function clearRegionsOnly() {
  selectedRegions = [];
  Array.from(regionContainer.children).forEach((btn) =>
    btn.classList.remove("active")
  );
  updateFilterUI();
  refreshCafes();
}

/* -----------------------------
   9. 검색 / 정렬 / 뷰모드 이벤트
------------------------------ */

function handleSearchSubmit() {
  searchQuery = searchInput.value.trim();
  refreshCafes();
}

function updateSortDropdownUI() {
  const currentOption = Array.from(sortDropdownList.children).find(
    (li) => li.dataset.value === sortBy
  );
  if (currentOption) {
    sortDropdownLabel.textContent = currentOption.textContent;
  }
  Array.from(sortDropdownList.children).forEach((li) => {
    li.classList.toggle("selected", li.dataset.value === sortBy);
  });
  sortDropdownToggle.setAttribute("aria-expanded", "false");
  sortDropdownList.classList.add("hidden");
}

function setSort(value) {
  sortBy = value;
  sortSelect.value = value;
  updateSortDropdownUI();
  refreshCafes();
}

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  refreshCafes();
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleSearchSubmit();
  }
});

searchBtn.addEventListener("click", handleSearchSubmit);

sortSelect.addEventListener("change", (e) => {
  sortBy = e.target.value;
  refreshCafes();
});

sortDropdownToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = !sortDropdownList.classList.contains("hidden");
  sortDropdownList.classList.toggle("hidden", isOpen);
  sortDropdownToggle.setAttribute("aria-expanded", String(!isOpen));
});

Array.from(sortDropdownList.children).forEach((li) => {
  li.addEventListener("click", (e) => {
    e.stopPropagation();
    setSort(li.dataset.value);
  });
});

document.addEventListener("click", (e) => {
  if (!sortDropdownList.classList.contains("hidden")) {
    if (
      !sortDropdownToggle.contains(e.target) &&
      !sortDropdownList.contains(e.target)
    ) {
      sortDropdownList.classList.add("hidden");
      sortDropdownToggle.setAttribute("aria-expanded", "false");
    }
  }
});

function applyMasonryLayout() {
  const grid = cafeGrid;
  if (!grid) return;
  const rowHeight = parseInt(
    getComputedStyle(grid).getPropertyValue("grid-auto-rows")
  );
  const rowGap = parseInt(
    getComputedStyle(grid).getPropertyValue("row-gap")
  );
  Array.from(grid.children).forEach((item) => {
    const card = item.querySelector(".cafe-card");
    if (!card) return;
    item.style.gridRowEnd = "span 1";
    const contentHeight = card.getBoundingClientRect().height;
    const rowSpan = Math.ceil(
      (contentHeight + rowGap) / (rowHeight + rowGap)
    );
    item.style.gridRowEnd = `span ${rowSpan}`;
  });
}

function scheduleMasonryLayout() {
  if (masonryRaf) cancelAnimationFrame(masonryRaf);
  masonryRaf = requestAnimationFrame(() => {
    masonryRaf = null;
    applyMasonryLayout();
  });
}

window.addEventListener("resize", scheduleMasonryLayout);

gridBtn.addEventListener("click", () => {
  viewMode = "grid";
  gridBtn.classList.add("active");
  masonryBtn.classList.remove("active");
  cafeGrid.classList.remove("masonry-mode");
  cafeGrid.classList.add("grid-mode");
  refreshCafes();
});

masonryBtn.addEventListener("click", () => {
  viewMode = "masonry";
  masonryBtn.classList.add("active");
  gridBtn.classList.remove("active");
  cafeGrid.classList.add("masonry-mode");
  cafeGrid.classList.remove("grid-mode");
  refreshCafes();
});

filterToggleBtn.addEventListener("click", () => {
  filtersOpen = !filtersOpen;
  if (filtersOpen) {
    filterBody.classList.remove("hidden");
  } else {
    filterBody.classList.add("hidden");
  }
});

clearAllFiltersBtn.addEventListener("click", clearAllFilters);
clearTagsBtn.addEventListener("click", clearTagsOnly);
clearRegionsBtn.addEventListener("click", clearRegionsOnly);
resetBtn.addEventListener("click", clearAllFilters);

/* -----------------------------
   10. 카페 카드 생성
------------------------------ */

function persistCafeLike(id, liked) {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;
  const cafes = JSON.parse(stored).map((cafe) => {
    if (cafe.id === id) {
      const delta = liked ? 1 : -1;
      const nextSaves = Math.max(0, (cafe.saves || 0) + delta);
      return { ...cafe, liked, saves: nextSaves };
    }
    return cafe;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cafes));
}

function createCafeCard(cafe) {
  const wrapper = document.createElement("div");
  wrapper.className = "cafe-card-wrapper";

  const card = document.createElement("div");
  card.className = "cafe-card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "cafe-image-wrap";

  const img = document.createElement("img");
  img.className = "cafe-image";
  img.src = cafe.image;
  img.alt = cafe.name;

  const saveBadge = document.createElement("button");
  saveBadge.type = "button";
  saveBadge.className = "save-badge";
  const heartIcon = document.createElement("span");
  heartIcon.className = "icon-heart";
  heartIcon.textContent = "";
  const saveCount = document.createElement("span");
  saveCount.textContent = formatSaves(cafe.saves || 0);
  saveBadge.appendChild(heartIcon);
  saveBadge.appendChild(saveCount);
  if (cafe.liked) {
    saveBadge.classList.add("active");
  }

  saveBadge.addEventListener("click", (e) => {
    e.stopPropagation();
    const nextLiked = !saveBadge.classList.contains("active");
    saveBadge.classList.toggle("active", nextLiked);
    persistCafeLike(cafe.id, nextLiked);
    cafe.liked = nextLiked;
    cafe.saves = Math.max(
      0,
      (cafe.saves || 0) + (nextLiked ? 1 : -1)
    );
    saveCount.textContent = formatSaves(cafe.saves);
  });

  imageWrap.appendChild(img);
  imageWrap.appendChild(saveBadge);
  img.addEventListener("load", scheduleMasonryLayout);

  const info = document.createElement("div");
  info.className = "cafe-info";

  const nameEl = document.createElement("div");
  nameEl.className = "cafe-name";
  nameEl.textContent = cafe.name;

  const metaRow = document.createElement("div");
  metaRow.className = "cafe-meta-row";

  const locationItem = document.createElement("div");
  locationItem.className = "meta-item";
  const pinIcon = document.createElement("span");
  pinIcon.className = "icon-pin";
  pinIcon.setAttribute("aria-hidden", "true");
  pinIcon.textContent = "";
  const locationText = document.createElement("span");
  locationText.textContent = cafe.location;
  locationItem.appendChild(pinIcon);
  locationItem.appendChild(locationText);

  const ratingItem = document.createElement("div");
  ratingItem.className = "meta-item";
  const starIcon = document.createElement("span");
  starIcon.className = "icon-star";
  starIcon.textContent = "★";
  const ratingText = document.createElement("span");
  ratingText.textContent = cafe.rating.toFixed(1);
  ratingItem.appendChild(starIcon);
  ratingItem.appendChild(ratingText);

  metaRow.appendChild(locationItem);
  metaRow.appendChild(ratingItem);

  const tagRow = document.createElement("div");
  tagRow.className = "tag-row";
  cafe.tags.forEach((tag) => {
    const tagEl = document.createElement("span");
    tagEl.className = "tag-chip";
    tagEl.textContent = tag;
    tagRow.appendChild(tagEl);
  });

  info.appendChild(nameEl);
  info.appendChild(metaRow);
  info.appendChild(tagRow);

  card.appendChild(imageWrap);
  card.appendChild(info);
  wrapper.appendChild(card);

  card.addEventListener("click", () => {
    window.location.href = "../detail/15_coffeen_detailMenu.html";
  });

  return wrapper;
}

/* -----------------------------
   11. 필터 적용 + 렌더링
------------------------------ */

function formatSaves(value) {
  if (value >= 1000) {
    const compact = (value / 1000).toFixed(1).replace(/\.0$/, "");
    return `${compact}k`;
  }
  return value.toString();
}

async function refreshCafes() {
  const cafes = await fetchCafes();
  let filtered = cafes.slice();

  // 검색 필터 (이름 + 위치)
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
    );
  }

  // 해시태그 필터
  if (selectedTags.length > 0) {
    filtered = filtered.filter((cafe) =>
      selectedTags.some((t) =>
        cafe.tags.some((ct) =>
          ct.toLowerCase().includes(t.toLowerCase())
        )
      )
    );
  }

  // 지역 필터 
  if (selectedRegions.length > 0) {
    filtered = filtered.filter((cafe) =>
      selectedRegions.includes(cafe.location)
    );
  }

  // 정렬
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "likes":
        return b.saves - a.saves;
      case "distance":
        return parseFloat(a.distance) - parseFloat(b.distance);
      default:
        return b.rating - a.rating;
    }
  });

  // 렌더링
  cafeGrid.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    resultCountText.textContent = "0개의 카페";
    return;
  }

  emptyState.classList.add("hidden");
  resultCountText.textContent = `${filtered.length}개의 카페`;

  filtered.forEach((cafe) => {
    cafeGrid.appendChild(createCafeCard(cafe));
  });

  scheduleMasonryLayout();
}

/* -----------------------------
   12. 초기 실행
------------------------------ */

renderFilterChips();
updateFilterUI();
refreshCafes();
updateSortDropdownUI();
