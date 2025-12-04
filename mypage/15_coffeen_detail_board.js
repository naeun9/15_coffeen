// 15_coffeen_중간과제/mypage/15_coffeen_detail_board.js
// 보드 상세 편집 및 카페 추가/삭제

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

const POPUP_CAFE_CANDIDATES = {
  "데이트하기 좋은 카페": ["cafe-1", "cafe-2", "cafe-3", "cafe-4", "cafe-5"],
  "작업하기 좋은 카페": ["cafe-4", "cafe-5", "cafe-2", "cafe-1", "cafe-3"],
};

function cloneCafe(cafe) {
  if (!cafe) return null;
  return {
    id: cafe.id,
    name: cafe.name,
    meta: cafe.meta,
    src: cafe.src,
  };
}

function findCafeByName(name) {
  return CAFE_MASTER.find((c) => c.name === name) || null;
}

function findCafeById(id) {
  return CAFE_MASTER.find((c) => c.id === id) || null;
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
        cloneCafe(findCafeByName("더 베이커리")),
        cloneCafe(findCafeByName("선샤인 테라스")),
        cloneCafe(findCafeByName("모노브루 라운지")),
        cloneCafe(findCafeByName("라이트웨이 커피바")),
      ].filter(Boolean),
    },
    {
      id: "board-2",
      title: "작업하기 좋은 카페",
      cafes: [
        cloneCafe(findCafeByName("라이트웨이 커피바")),
        cloneCafe(findCafeByName("코지 코너")),
        cloneCafe(findCafeByName("선샤인 테라스")),
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

  const boardDetailSection = document.querySelector(".board-detail");
  const titleEl = document.getElementById("board-detail-title");
  const countEl = document.getElementById("board-detail-count");
  const listEl = document.querySelector(".board-detail-list");
  const backBtn = document.getElementById("board-back-btn");
  const editBtn = document.getElementById("board-edit-toggle");
  const addBtn = document.getElementById("board-add-cafe-btn");

  const popupOverlay = document.getElementById("detail-board-popup-overlay");
  const popupClose = document.getElementById("detail-popup-close");
  const popupCancel = document.getElementById("detail-popup-cancel");
  const popupAdd = document.getElementById("detail-popup-add");
  const popupSelectedCount = document.getElementById("detail-popup-selected-count");
  const popupList = document.getElementById("detail-popup-cafe-list");

  const params = new URLSearchParams(window.location.search);
  const boardIdParam = params.get("boardId");
  const queryTitle = params.get("title");

  let boards = loadBoards();
  let currentBoardIndex = -1;

  if (boardIdParam) {
    currentBoardIndex = boards.findIndex((b) => b.id === boardIdParam);
  }

  if (currentBoardIndex === -1 && queryTitle) {
    const decodedTitle = decodeURIComponent(queryTitle).trim();
    currentBoardIndex = boards.findIndex(
      (b) => (b.title || "").trim() === decodedTitle
    );
  }

  if (currentBoardIndex === -1 && boards.length > 0) {
    currentBoardIndex = 0;
  }

  let currentBoard =
    currentBoardIndex !== -1
      ? boards[currentBoardIndex]
      : { id: null, title: "보드", cafes: [] };

  if (!Array.isArray(currentBoard.cafes)) {
    currentBoard.cafes = [];
  }

  let cafes = currentBoard.cafes;
  let isEditing = false;

  const originalTitle =
    (currentBoard.title && currentBoard.title.trim()) || "보드";

  if (titleEl) {
    titleEl.textContent = originalTitle;
  }

  function updateCountText() {
    if (!countEl) return;
    countEl.textContent = cafes.length + "개 카페";
  }

  function renderList() {
    if (!listEl) return;
    listEl.innerHTML = "";

    cafes.forEach(function (cafe, index) {
      const card = document.createElement("article");
      card.className = "board-detail-card";
      card.dataset.index = String(index);

      const img = document.createElement("img");
      img.className = "board-detail-thumb";
      img.src = cafe.src;
      img.alt = cafe.name;

      const info = document.createElement("div");
      info.className = "board-detail-info";

      const nameEl = document.createElement("h3");
      nameEl.className = "board-detail-cafe-name";
      nameEl.textContent = cafe.name;

      const metaEl = document.createElement("p");
      metaEl.className = "board-detail-meta";
      metaEl.textContent = cafe.meta;

      info.appendChild(nameEl);
      info.appendChild(metaEl);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "board-detail-delete-btn";
      deleteBtn.setAttribute("aria-label", "카페 삭제");
      deleteBtn.textContent = "✕";

      card.appendChild(img);
      card.appendChild(info);
      card.appendChild(deleteBtn);

      listEl.appendChild(card);
    });

    updateCountText();
  }

  function setEditingMode(on) {
    isEditing = on;

    if (boardDetailSection) {
      boardDetailSection.classList.toggle("is-editing", isEditing);
    }

    if (editBtn) {
      editBtn.textContent = isEditing ? "저장" : "편집";
    }

    if (titleEl) {
      titleEl.contentEditable = isEditing ? "true" : "false";
      titleEl.classList.toggle("is-editing", isEditing);

      if (isEditing) {
        titleEl.focus();
        const range = document.createRange();
        range.selectNodeContents(titleEl);
        range.collapse(false);
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } else {
        const newTitle = titleEl.textContent.trim();
        if (!newTitle) {
          titleEl.textContent = originalTitle;
        } else if (currentBoardIndex !== -1) {
          boards[currentBoardIndex].title = newTitle;
          saveBoards(boards);
        }
      }
    }
  }

  function updatePopupSelectedCount() {
    if (!popupSelectedCount || !popupList) return;
    const checkboxes = popupList.querySelectorAll(".popup-cafe-checkbox");
    let count = 0;
    checkboxes.forEach(function (cb) {
      if (cb.checked && cb.closest(".popup-cafe-item")?.style.display !== "none") {
        count++;
      }
    });
    popupSelectedCount.textContent = count + "개 선택됨";
  }

  function buildPopupListForBoard(title) {
    if (!popupList) return;

    popupList.innerHTML = "";

    const ids =
      POPUP_CAFE_CANDIDATES[title] ||
      CAFE_MASTER.map(function (c) {
        return c.id;
      });

    ids.forEach(function (id) {
      const cafe = findCafeById(id);
      if (!cafe) return;

      const li = document.createElement("li");
      li.className = "popup-cafe-item";

      const label = document.createElement("label");
      label.className = "popup-cafe-row";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "popup-cafe-checkbox";

      const card = document.createElement("div");
      card.className = "popup-cafe-card";

      const img = document.createElement("img");
      img.className = "popup-cafe-thumb";
      img.src = cafe.src;
      img.alt = cafe.name;

      const info = document.createElement("div");
      info.className = "popup-cafe-info";

      const nameEl = document.createElement("p");
      nameEl.className = "popup-cafe-name";
      nameEl.textContent = cafe.name;

      const addrEl = document.createElement("p");
      addrEl.className = "popup-cafe-address";
      addrEl.textContent = cafe.meta;

      info.appendChild(nameEl);
      info.appendChild(addrEl);

      card.appendChild(img);
      card.appendChild(info);

      label.appendChild(checkbox);
      label.appendChild(card);
      li.appendChild(label);
      popupList.appendChild(li);
    });

    updatePopupSelectedCount();
  }

  function openPopup() {
    if (!popupOverlay || !popupList) return;

    const items = popupList.querySelectorAll(".popup-cafe-item");
    items.forEach(function (item) {
      const nameEl = item.querySelector(".popup-cafe-name");
      const name = nameEl ? nameEl.textContent.trim() : "";
      const exists = cafes.some((c) => c.name === name);

      item.style.display = exists ? "none" : "";
      const cb = item.querySelector(".popup-cafe-checkbox");
      if (cb) cb.checked = false;
    });

    updatePopupSelectedCount();
    popupOverlay.style.display = "flex";
  }

  function closePopup() {
    if (!popupOverlay) return;
    popupOverlay.style.display = "none";
  }

  buildPopupListForBoard(originalTitle);
  renderList();

  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.location.href = "15_coffeen_board.html";
    });
  }

  if (editBtn) {
    editBtn.addEventListener("click", function () {
      if (!isEditing) {
        setEditingMode(true);
      } else {
        setEditingMode(false);
      }
    });
  }

  if (listEl) {
    listEl.addEventListener("click", function (event) {
      const deleteBtn = event.target.closest(".board-detail-delete-btn");
      if (deleteBtn) {
        if (!isEditing) return;

        const card = deleteBtn.closest(".board-detail-card");
        const nameNode = card
          ? card.querySelector(".board-detail-cafe-name")
          : null;
        const cafeName = nameNode ? nameNode.textContent.trim() : "이 카페";

        const ok = confirm("'" + cafeName + "'을(를) 보드에서 삭제할까요?");
        if (!ok) return;

        const idx =
          card && card.dataset.index != null
            ? parseInt(card.dataset.index, 10)
            : -1;

        if (idx >= 0 && idx < cafes.length) {
          cafes.splice(idx, 1);
          if (currentBoardIndex !== -1) {
            boards[currentBoardIndex].cafes = cafes;
            saveBoards(boards);
          }
          renderList();
        }
        return;
      }
    });
  }

  if (addBtn) {
    addBtn.addEventListener("click", function () {
      if (!isEditing) return;
      openPopup();
    });
  }

  if (popupList) {
    popupList.addEventListener("change", function (event) {
      if (event.target.matches(".popup-cafe-checkbox")) {
        updatePopupSelectedCount();
      }
    });
  }

  if (popupClose) {
    popupClose.addEventListener("click", function () {
      closePopup();
    });
  }

  if (popupCancel) {
    popupCancel.addEventListener("click", function () {
      closePopup();
    });
  }

  if (popupAdd) {
    popupAdd.addEventListener("click", function () {
      if (!popupList || !isEditing) {
        closePopup();
        return;
      }

      const checkboxes = popupList.querySelectorAll(".popup-cafe-checkbox");
      const toAdd = [];

      checkboxes.forEach(function (cb, index) {
        if (!cb.checked) return;
        const item = cb.closest(".popup-cafe-item");
        if (!item || item.style.display === "none") return;

        const row = cb.closest(".popup-cafe-row");
        const card = row ? row.querySelector(".popup-cafe-card") : null;
        if (!card) return;

        const imgEl = card.querySelector(".popup-cafe-thumb");
        const nameEl = card.querySelector(".popup-cafe-name");
        const metaEl = card.querySelector(".popup-cafe-address");

        const src = imgEl ? imgEl.getAttribute("src") || "" : "";
        const alt = imgEl ? imgEl.getAttribute("alt") || "" : "";
        const name = nameEl ? nameEl.textContent.trim() : alt || "새 카페";
        const meta = metaEl ? metaEl.textContent.trim() : "";

        const exists = cafes.some(function (c) {
          return c.name === name;
        });
        if (exists) return;

        const matched = findCafeByName(name);
        if (matched) {
          toAdd.push(cloneCafe(matched));
        } else {
          toAdd.push({
            id: "cafe-" + Date.now() + "-" + index,
            name: name,
            meta: meta,
            src: src,
          });
        }
      });

      if (toAdd.length > 0) {
        toAdd.forEach(function (c) {
          cafes.push(c);
        });
        if (currentBoardIndex !== -1) {
          boards[currentBoardIndex].cafes = cafes;
          saveBoards(boards);
        }
        renderList();
      }

      closePopup();
    });
  }
});
