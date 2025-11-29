// 15_coffeen_중간과제/mypage/15_coffeen_collection.js
// 저장한 카페 탭 전환 스크립트
document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".mypage-tabs .tab-button");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      if (tab === "reviews") {
        window.location.href = "15_coffeen_review.html";
      } else if (tab === "saved") {
      } else if (tab === "board") {
        window.location.href = "15_coffeen_board.html";
      }
    });
  });
});
