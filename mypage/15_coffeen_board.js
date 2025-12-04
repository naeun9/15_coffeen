// 15_coffeen_중간과제/mypage/15_coffeen_board.js
// 마이페이지 보드 탭 + 공통 보드 데이터 + 보드 생성/삭제/상세

const BOARD_STORAGE_KEY = "coffeen_boards";

const CAFE_MASTER = [
  {
    id: "cafe-1",
    name: "더 베이커리",
    meta: "용산구 · 브런치가 맛있는 감성 카페",
    src: "../assets/images/15_cafe1.jpeg",
  },
  {
    id: "cafe-2",
    name: "선샤인 테라스",
    meta: "마포구 · 햇살 좋은 우드톤 카페",
    src: "../assets/images/15_cafe2.jpeg",
  },
  {
    id: "cafe-3",
    name: "모노브루 라운지",
    meta: "성동구 · 커피가 맛있는 조용한 카페",
    src: "../assets/images/15_cafe3.jpeg",
  },
  {
    id: "cafe-4",
    name: "라이트웨이 커피바",
    meta: "중구 · 주황색 인테리어의 트렌디한 카페",
    src: "../assets/images/15_cafe4.jpeg",
  },
  {
    id: "cafe-5",
    name: "코지 코너",
    meta: "용산구 · 다양한 종류의 베이커리가 있는 카페",
    src: "../assets/images/15_cafe6.jpeg",
  },
];

function cloneCafe(cafe) {
  if (!cafe) return null;
  return {
    id: cafe.id,
    name: cafe.name,
    meta: cafe.meta,
    src: cafe.src,
  };
}

function findCafeById(id) {
  return CAFE_MASTER.find((c) => c.id === id) || null;
}

function findCafeByName(name) {
  return CAFE_MASTER.find((c) => c.name === name) || null;
}

function loadBoards() {
  try {
    const raw = localStorage.getItem(BOARD_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}

  const initialBoards = [
    {
      id: "board-1",
      title: "데이트하기 좋은 카페",
      cafes: [
        cloneCafe(findCafeById("cafe-1")),
        cloneCafe(findCafeById("cafe-2")),
        cloneCafe(findCafeById("cafe-3")),
        cloneCafe(findCafeById("cafe-4")),
      ].filter(Boolean),
    },
    {
      id: "board-2",
      title: "작업하기 좋은 카페",
      cafes: [
        cloneCafe(findCafeById("cafe-4")),
        cloneCafe(findCafeById("cafe-5")),
        cloneCafe(findCafeById("cafe-2")),
      ].filter(Boolean),
    },
  ];

  saveBoards(initialBoards);
  return initialBoards;
}

function saveBoards(boards) {
  try {
    localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(boards));
  } catch (e) {}
}

document.addEventListener("DOMContentLoaded", function () {
  let boards = loadBoards();

  const tabButtons = document.querySelectorAll(".mypage-tabs .tab-button");

  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const tab = btn.dataset.tab;

      if (tab === "reviews") {
        window.location.href = "15_coffeen_review.html";
      } else if (tab === "saved") {
        window.location.href = "15_coffeen_collection.html";
      } else if (tab === "board") {
        window.location.href = "15_coffeen_board.html";
      }
    });
  });

  const popupOverlay = document.getElementById("popup-overlay");
  const closePopup = document.getElementById("close-popup");
  const cancelBtn = document.getElementById("cancel-btn");
  const createBoardBtn = document.getElementById("create-board-btn");
  const boardTitleInput = document.getElementById("board-title");
  const cafeCheckboxes = document.querySelectorAll(".popup-cafe-checkbox");
  const selectedCountText = document.getElementById("selected-count");

  const boardSection = document.querySelector(".board-section");
  const boardList = document.querySelector(".board-list");
  const editToggle = document.getElementById("board-edit-toggle");

  function updateSelectedCount() {
    if (!selectedCountText) return;
    let count = 0;
    cafeCheckboxes.forEach(function (checkbox) {
      if (checkbox.checked) count++;
    });
    selectedCountText.textContent = count + "개 선택됨";
  }

  cafeCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", updateSelectedCount);
  });
  updateSelectedCount();

  function attachDeleteButton(card) {
    if (!card || card.classList.contains("create-board-card")) return;
    if (card.querySelector(".board-delete-btn")) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "board-delete-btn";
    btn.setAttribute("aria-label", "보드 삭제");
    btn.textContent = "✕";

    card.appendChild(btn);
  }

  function getCollageImages(cafes) {
    const arr = Array.isArray(cafes) ? cafes.filter((c) => c && c.src) : [];
    const main = arr[0] || null;
    const sub1 = arr[1] || null;
    const sub2 = arr[2] || null;
    return [main, sub1, sub2];
  }

  function createBoardCardElement(board) {
    const card = document.createElement("article");
    card.className = "board-card";
    card.dataset.boardId = board.id;

    const imagesWrapper = document.createElement("div");
    imagesWrapper.className = "board-images";

    const mainWrap = document.createElement("div");
    mainWrap.className = "board-main-image";

    const subWrap = document.createElement("div");
    subWrap.className = "board-sub-images";

    const [mainCafe, subCafe1, subCafe2] = getCollageImages(board.cafes || []);

    // 메인 이미지
    if (mainCafe) {
      const mainImg = document.createElement("img");
      mainImg.className = "board-image main";
      mainImg.src = mainCafe.src;
      mainImg.alt = mainCafe.name;
      mainWrap.appendChild(mainImg);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "board-image-placeholder";
      mainWrap.appendChild(placeholder);
    }

    // 서브 1
    if (subCafe1) {
      const img1 = document.createElement("img");
      img1.className = "board-image sub";
      img1.src = subCafe1.src;
      img1.alt = subCafe1.name;
      subWrap.appendChild(img1);
    } else {
      const placeholder1 = document.createElement("div");
      placeholder1.className = "board-image-placeholder";
      subWrap.appendChild(placeholder1);
    }

    // 서브 2
    if (subCafe2) {
      const img2 = document.createElement("img");
      img2.className = "board-image sub";
      img2.src = subCafe2.src;
      img2.alt = subCafe2.name;
      subWrap.appendChild(img2);
    } else {
      const placeholder2 = document.createElement("div");
      placeholder2.className = "board-image-placeholder";
      subWrap.appendChild(placeholder2);
    }

    imagesWrapper.appendChild(mainWrap);
    imagesWrapper.appendChild(subWrap);
    card.appendChild(imagesWrapper);

    const content = document.createElement("div");
    content.className = "board-content";

    const nameEl = document.createElement("h3");
    nameEl.className = "board-name";
    nameEl.textContent = board.title || "보드";

    const countEl = document.createElement("span");
    countEl.className = "board-count";
    const cafeCount = (board.cafes && board.cafes.length) || 0;
    countEl.textContent = cafeCount + "개 카페";

    content.appendChild(nameEl);
    content.appendChild(countEl);
    card.appendChild(content);

    attachDeleteButton(card);
    return card;
  }

  function renderBoardList() {
    if (!boardList) return;

    boardList.innerHTML = "";

    boards.forEach(function (board) {
      const card = createBoardCardElement(board);
      boardList.appendChild(card);
    });

    const createCard = document.createElement("article");
    createCard.className = "board-card create-board-card";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "create-board-button";
    button.id = "open-create-board";

    const plus = document.createElement("span");
    plus.className = "plus-icon";
    plus.textContent = "+";

    const label = document.createElement("span");
    label.textContent = "새 보드 만들기";

    button.appendChild(plus);
    button.appendChild(label);
    createCard.appendChild(button);
    boardList.appendChild(createCard);

    setupCreateBoardTrigger();
  }

  function openPopup() {
    if (popupOverlay) popupOverlay.style.display = "flex";
  }

  function hidePopup() {
    if (popupOverlay) popupOverlay.style.display = "none";
  }

  function setupCreateBoardTrigger() {
    const openCreateBoard = document.getElementById("open-create-board");
    if (!openCreateBoard || !popupOverlay) return;
    openCreateBoard.onclick = openPopup;
  }

  if (boardList) {
    renderBoardList();
  } else {
    setupCreateBoardTrigger();
  }

  if (closePopup) {
    closePopup.addEventListener("click", hidePopup);
  }
  if (cancelBtn) {
    cancelBtn.addEventListener("click", hidePopup);
  }

  if (createBoardBtn && boardList) {
    createBoardBtn.addEventListener("click", function () {
      const selectedCafes = [];

      cafeCheckboxes.forEach(function (checkbox) {
        if (!checkbox.checked) return;

        const row = checkbox.closest(".popup-cafe-row");
        const card = row ? row.querySelector(".popup-cafe-card") : null;
        if (!card) return;

        const imgEl = card.querySelector(".popup-cafe-thumb");
        const nameEl = card.querySelector(".popup-cafe-name");
        const addrEl = card.querySelector(".popup-cafe-address");

        const name = nameEl ? nameEl.textContent.trim() : "카페";
        const address = addrEl ? addrEl.textContent.trim() : "";
        const matched = findCafeByName(name);

        if (matched) {
          selectedCafes.push(cloneCafe(matched));
        } else {
          selectedCafes.push({
            id: "cafe-" + Date.now() + "-" + selectedCafes.length,
            name: name,
            meta: address,
            src: imgEl ? imgEl.getAttribute("src") || "" : "",
          });
        }
      });

      if (!selectedCafes.length) {
        alert("보드에 담을 카페를 한 개 이상 선택해 주세요.");
        return;
      }

      const title =
        boardTitleInput && boardTitleInput.value.trim()
          ? boardTitleInput.value.trim()
          : "새 보드";

      const newBoard = {
        id: "board-" + Date.now(),
        title: title,
        cafes: selectedCafes,
      };

      boards.push(newBoard);
      saveBoards(boards);

      if (boardTitleInput) boardTitleInput.value = "";
      cafeCheckboxes.forEach(function (checkbox) {
        checkbox.checked = false;
      });
      updateSelectedCount();
      hidePopup();

      renderBoardList();
    });
  }

  if (boardSection && editToggle) {
    let isEditing = false;

    editToggle.addEventListener("click", function () {
      isEditing = !isEditing;
      boardSection.classList.toggle("is-editing", isEditing);
      editToggle.textContent = isEditing ? "삭제 완료" : "보드 삭제";
    });
  }

  if (boardList) {
    boardList.addEventListener("click", function (event) {
      const deleteBtn = event.target.closest(".board-delete-btn");
      if (deleteBtn) {
        const card = deleteBtn.closest(".board-card");
        if (!card || card.classList.contains("create-board-card")) return;

        const boardId = card.dataset.boardId;
        const nameText =
          (card.querySelector(".board-name") &&
            card.querySelector(".board-name").textContent.trim()) || "보드";

        const ok = confirm("'" + nameText + "' 보드를 삭제할까요?");
        if (!ok) return;

        const idx = boards.findIndex((b) => b.id === boardId);
        if (idx !== -1) {
          boards.splice(idx, 1);
          saveBoards(boards);
        }

        renderBoardList();
        return;
      }

      const card = event.target.closest(".board-card");
      if (!card || card.classList.contains("create-board-card")) return;

      const boardId = card.dataset.boardId;
      if (!boardId) return;

      window.location.href =
        "15_coffeen_detail_board.html?boardId=" + encodeURIComponent(boardId);
    });
  }
});
