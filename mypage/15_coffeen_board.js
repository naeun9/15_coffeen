// 15_coffeen_중간과제/mypage/15_coffeen_board.js
// 마이페이지 탭 이동 + 새 보드 팝업 열기/닫기

document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".mypage-tabs .tab-button");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      if (tab === "reviews") {
        window.location.href = "15_coffeen_review.html";
      } else if (tab === "saved") {
        window.location.href = "15_coffeen_collection.html";
      } 
    });
  });

  const popupOverlay = document.getElementById("popup-overlay");
  const openCreateBoard = document.getElementById("open-create-board");
  const closePopup = document.getElementById("close-popup");
  const cancelBtn = document.getElementById("cancel-btn");

  if (openCreateBoard && popupOverlay) {
    openCreateBoard.addEventListener("click", () => {
      popupOverlay.style.display = "flex";
    });
  }

  function hidePopup() {
    if (popupOverlay) popupOverlay.style.display = "none";
  }

  if (closePopup) closePopup.addEventListener("click", hidePopup);
  if (cancelBtn) cancelBtn.addEventListener("click", hidePopup);
});
