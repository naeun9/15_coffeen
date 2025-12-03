// 15_coffeen_중간과제/common/15_coffeen_common.js

document.addEventListener("DOMContentLoaded", function () {
  const current = document.body.dataset.currentPage;
  if (!current) return;

  const navItems = document.querySelectorAll(".coffeen-header .nav-item");
  navItems.forEach((item) => {
    if (item.dataset.page === current) {
      item.classList.add("is-active");
    }
  });
});
