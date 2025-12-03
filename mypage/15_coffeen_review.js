// 15_coffeen_중간과제/mypage/15_coffeen_review.js
// 마이페이지 탭 클릭 시 페이지 이동

document.addEventListener("DOMContentLoaded", function () {
  // 프로필 이름을 세션에서 불러와 표시
  const profileName = sessionStorage.getItem("signupProfileName");
  if (profileName) {
    const nameEl = document.querySelector(".profile-name");
    if (nameEl) {
      nameEl.textContent = profileName;
    }
    // 한 번 사용 후 필요 시 제거
    sessionStorage.removeItem("signupProfileName");
  }

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
