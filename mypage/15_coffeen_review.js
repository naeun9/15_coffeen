// 15_coffeen_중간과제/mypage/15_coffeen_review.js
// 마이페이지 탭 클릭 시 페이지 이동

document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".mypage-tabs .tab-button");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;

      if (target === "reviews") {
        return;
      }
      if (target === "saved") {
        window.location.href = "15_coffeen_collection.html";
      } else if (target === "board") {
        window.location.href = "15_coffeen_board.html";
      }
    });
  });
});
