// 15_coffeen_중간과제/common/15_coffeen_common.js

document.addEventListener("DOMContentLoaded", function () {
  const current = document.body.dataset.currentPage;
  if (!current) return;

  // 마이페이지끼리 이동이면 밑줄 애니메이션 끄기
  if (current === "mypage") {
    const ref = document.referrer || "";

    const fromMyPage =
      ref.includes("15_coffeen_review.html") ||
      ref.includes("15_coffeen_collection.html") ||
      ref.includes("15_coffeen_board.html");

    if (fromMyPage) {
      document.body.classList.add("mypage-no-nav-anim");
    }
  }

  const navItems = document.querySelectorAll(".coffeen-header .nav-item");
  navItems.forEach((item) => {
    if (item.dataset.page === current) {
      item.classList.add("is-active");
    }
  });
});
