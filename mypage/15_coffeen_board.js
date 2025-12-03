// 15_coffeen_중간과제/mypage/15_coffeen_board.js
// 마이페이지 보드 탭 + 보드 생성/삭제/상세 + 편집모드

document.addEventListener("DOMContentLoaded", function () {
  // 탭 이동
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

  // 팝업 관련 요소
  const popupOverlay = document.getElementById("popup-overlay");
  const openCreateBoard = document.getElementById("open-create-board");
  const closePopup = document.getElementById("close-popup");
  const cancelBtn = document.getElementById("cancel-btn");
  const createBoardBtn = document.getElementById("create-board-btn");

  // 보드/체크박스 관련 요소
  const boardSection = document.querySelector(".board-section");
  const boardList = document.querySelector(".board-list");
  const createBoardCard = document.querySelector(".create-board-card");
  const boardTitleInput = document.getElementById("board-title");
  const cafeCheckboxes = document.querySelectorAll(".popup-cafe-checkbox");
  const selectedCountText = document.getElementById("selected-count");

  // 편집모드 토글 버튼
  const editToggle = document.getElementById("board-edit-toggle");

  // 팝업 열기
  if (openCreateBoard && popupOverlay) {
    openCreateBoard.addEventListener("click", function () {
      popupOverlay.style.display = "flex";
    });
  }

  // 팝업 닫기
  function hidePopup() {
    if (popupOverlay) popupOverlay.style.display = "none";
  }

  if (closePopup) {
    closePopup.addEventListener("click", hidePopup);
  }
  if (cancelBtn) {
    cancelBtn.addEventListener("click", hidePopup);
  }

  // 선택 개수 업데이트
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

  // 삭제 버튼 붙이기
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

  // 초기 보드 카드에 삭제 버튼 추가
  document
    .querySelectorAll(".board-card:not(.create-board-card)")
    .forEach(function (card) {
      attachDeleteButton(card);
    });

  // 편집모드 토글
  if (boardSection && editToggle) {
    let isEditing = false;

    editToggle.addEventListener("click", function () {
      isEditing = !isEditing;
      boardSection.classList.toggle("is-editing", isEditing);
      editToggle.textContent = isEditing ? "편집 완료" : "편집모드";
    });
  }

  // 보드 카드 클릭 (삭제 / 상세 이동)
  if (boardList) {
    boardList.addEventListener("click", function (event) {
      // 삭제 버튼 처리
      const deleteBtn = event.target.closest(".board-delete-btn");
      if (deleteBtn) {
        const card = deleteBtn.closest(".board-card");
        if (!card || card.classList.contains("create-board-card")) return;

        const name =
          (card.querySelector(".board-name") &&
            card.querySelector(".board-name").textContent.trim()) ||
          "보드";

        const ok = confirm("'" + name + "' 보드를 삭제할까요?");
        if (!ok) return;

        card.remove();
        return;
      }

      // 카드 전체 클릭 → 상세 페이지 이동
      const card = event.target.closest(".board-card");
      if (!card || card.classList.contains("create-board-card")) return;

      const nameEl = card.querySelector(".board-name");
      const countEl = card.querySelector(".board-count");

      const title = encodeURIComponent(
        (nameEl && nameEl.textContent.trim()) || "보드"
      );
      const count = encodeURIComponent(
        (countEl && countEl.textContent.trim()) || ""
      );

      // 파일 이름은 네가 만든 상세 페이지 이름에 맞춰서 사용
      window.location.href =
        "15_coffeen_detail_board.html?title=" + title + "&count=" + count;
    });
  }

  // 보드 생성
  if (createBoardBtn && boardList) {
    createBoardBtn.addEventListener("click", function () {
      const selectedCafes = [];

      cafeCheckboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
          const row = checkbox.closest(".popup-cafe-row");
          const card = row ? row.querySelector(".popup-cafe-card") : null;
          if (!card) return;

          const imgEl = card.querySelector(".popup-cafe-thumb");
          const nameEl = card.querySelector(".popup-cafe-name");

          selectedCafes.push({
            src: imgEl ? imgEl.getAttribute("src") : "",
            alt:
              (imgEl && imgEl.getAttribute("alt")) ||
              (nameEl ? nameEl.textContent : "보드 이미지"),
          });
        }
      });

      if (selectedCafes.length === 0) {
        alert("보드에 담을 카페를 한 개 이상 선택해 주세요.");
        return;
      }

      const boardTitle =
        boardTitleInput && boardTitleInput.value.trim()
          ? boardTitleInput.value.trim()
          : "새 보드";

      const newCard = document.createElement("article");
      newCard.className = "board-card";

      const imagesWrapper = document.createElement("div");
      imagesWrapper.className = "board-images";

      const mainImageWrapper = document.createElement("div");
      mainImageWrapper.className = "board-main-image";

      const mainImg = document.createElement("img");
      mainImg.className = "board-image main";

      const firstCafe = selectedCafes[0];
      mainImg.src = firstCafe.src;
      mainImg.alt = firstCafe.alt;

      mainImageWrapper.appendChild(mainImg);
      imagesWrapper.appendChild(mainImageWrapper);

      const subWrapper = document.createElement("div");
      subWrapper.className = "board-sub-images";

      const subCafes = selectedCafes.slice(1, 3);
      subCafes.forEach(function (cafe) {
        const subImg = document.createElement("img");
        subImg.className = "board-image sub";
        subImg.src = cafe.src;
        subImg.alt = cafe.alt;
        subWrapper.appendChild(subImg);
      });

      imagesWrapper.appendChild(subWrapper);
      newCard.appendChild(imagesWrapper);

      const content = document.createElement("div");
      content.className = "board-content";

      const nameEl = document.createElement("h3");
      nameEl.className = "board-name";
      nameEl.textContent = boardTitle;

      const countEl = document.createElement("span");
      countEl.className = "board-count";
      countEl.textContent = selectedCafes.length + "개 카페";

      content.appendChild(nameEl);
      content.appendChild(countEl);
      newCard.appendChild(content);

      attachDeleteButton(newCard);

      if (createBoardCard) {
        boardList.insertBefore(newCard, createBoardCard);
      } else {
        boardList.appendChild(newCard);
      }

      if (boardTitleInput) boardTitleInput.value = "";
      cafeCheckboxes.forEach(function (checkbox) {
        checkbox.checked = false;
      });
      updateSelectedCount();
      hidePopup();
    });
  }
});
