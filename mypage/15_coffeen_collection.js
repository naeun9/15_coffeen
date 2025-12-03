// 15_coffeen_중간과제/mypage/15_coffeen_collection.js
// 저장한 카페 탭, 좋아요, 페이지네이션

document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".mypage-tabs .tab-button");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;

      if (tab === "reviews") {
        window.location.href = "15_coffeen_review.html";
      } else if (tab === "saved") {
        return;
      } else if (tab === "board") {
        window.location.href = "15_coffeen_board.html";
      }
    });
  });

  const LIKE_STORAGE_KEY = "coffeen_mypage_likes";

  const loadLikeState = () => {
    try {
      const stored = localStorage.getItem(LIKE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  };

  const saveLikeState = (state) => {
    try {
      localStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  };

  const getCafeKey = (button) => {
    const card = button.closest(".cafe-card");
    if (!card) return null;
    const nameEl = card.querySelector(".cafe-name");
    if (!nameEl) return null;
    return nameEl.textContent.trim();
  };

  const parseBaseCount = (text) => {
    const trimmed = text.trim().toLowerCase();
    if (/k$/i.test(trimmed)) return null;
    const num = parseInt(trimmed.replace(/[^0-9]/g, ""), 10);
    return Number.isNaN(num) ? 0 : num;
  };

  const likeButtons = document.querySelectorAll(".like-badge");
  const likeState = loadLikeState();

  likeButtons.forEach((button) => {
    const key = getCafeKey(button);
    const countEl = button.querySelector(".like-count, .like-count-saved");
    const iconEl = button.querySelector(".like-icon");
    if (!key || !countEl || !iconEl) return;

    const originalText = countEl.textContent.trim();
    const isKFormat = /k$/i.test(originalText);
    const baseCount = parseBaseCount(originalText);

    let liked;
    if (typeof likeState[key] === "boolean") {
      liked = likeState[key];
    } else {
      if (key === "라이트웨이 커피바") {
        liked = false;
      } else {
        liked = countEl.classList.contains("like-count-saved");
      }
    }

    const syncUI = () => {
      if (isKFormat) {
        countEl.textContent = originalText;
      } else {
        const displayCount = baseCount + (liked ? 1 : 0);
        countEl.textContent = String(displayCount);
      }

      if (liked) {
        countEl.classList.add("like-count-saved");
        countEl.classList.remove("like-count");
        iconEl.src = "../assets/icons/15_icon_filled_heart.svg";
      } else {
        countEl.classList.add("like-count");
        countEl.classList.remove("like-count-saved");
        iconEl.src = "../assets/icons/15_icon_heart.svg";
      }
    };

    syncUI();

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      liked = !liked;
      likeState[key] = liked;
      saveLikeState(likeState);
      syncUI();
    });
  });

  saveLikeState(likeState);

  const PER_PAGE = 4;
  const listEl = document.querySelector(".collection-list");
  const paginationEl = document.querySelector(".collection-pagination");

  if (listEl && paginationEl) {
    const cards = Array.from(listEl.querySelectorAll(".cafe-card"));

    if (!cards.length) {
      paginationEl.style.display = "none";
    } else {
      const totalPages = Math.ceil(cards.length / PER_PAGE);
      let currentPage = 1;

      const prevBtn = paginationEl.querySelector(".page-prev");
      const nextBtn = paginationEl.querySelector(".page-next");
      const pageNumbersEl = paginationEl.querySelector(".page-numbers");

      function renderPage(page) {
        currentPage = page;

        cards.forEach((card, idx) => {
          const pageIndex = Math.floor(idx / PER_PAGE) + 1;
          if (pageIndex === currentPage) {
            card.classList.add("is-visible");
          } else {
            card.classList.remove("is-visible");
          }
        });

        updateControls();
      }

      function updateControls() {
        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages;

        if (!pageNumbersEl) return;
        pageNumbersEl.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = i;
          btn.className = "page-number" + (i === currentPage ? " is-active" : "");
          btn.addEventListener("click", function () {
            renderPage(i);
          });
          pageNumbersEl.appendChild(btn);
        }

        paginationEl.style.display = totalPages > 1 ? "flex" : "none";
      }

      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
          if (currentPage > 1) renderPage(currentPage - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          if (currentPage < totalPages) renderPage(currentPage + 1);
        });
      }

      renderPage(1);
    }
  }
});
