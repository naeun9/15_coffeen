// 15_coffeen_중간과제/mypage/15_coffeen_review.js
// 마이페이지 내 후기 탭 이동 + 좋아요 localStorage 저장

const REVIEW_LIKES_KEY = "coffeen_review_likes";

function loadReviewLikes() {
  try {
    const raw = localStorage.getItem(REVIEW_LIKES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveReviewLikes(map) {
  try {
    localStorage.setItem(REVIEW_LIKES_KEY, JSON.stringify(map));
  } catch (e) {}
}

function parseLikeCount(text) {
  const trimmed = text.trim().toLowerCase();
  const kMatch = trimmed.match(/^([\d.]+)k$/);
  if (kMatch) {
    return Math.round(parseFloat(kMatch[1]) * 1000);
  }
  const num = parseInt(trimmed.replace(/[^0-9]/g, ""), 10);
  return Number.isNaN(num) ? 0 : num;
}

function formatLikeCount(value) {
  if (value >= 1000) {
    const compact = (value / 1000).toFixed(1).replace(/\.0$/, "");
    return `${compact}k`;
  }
  return String(value);
}

document.addEventListener("DOMContentLoaded", function () {
  // 탭 버튼 페이지 이동
  const tabButtons = document.querySelectorAll(".mypage-tabs .tab-button");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;

      if (target === "reviews") {
        window.location.href = "15_coffeen_review.html";
      } else if (target === "saved") {
        window.location.href = "15_coffeen_collection.html";
      } else if (target === "board") {
        window.location.href = "15_coffeen_board.html";
      }
    });
  });

  // 후기 카드 좋아요
  const likeMap = loadReviewLikes();
  const reviewCards = document.querySelectorAll(".review-list .cafe-card");

  reviewCards.forEach((card) => {
    const reviewId = card.dataset.reviewId;
    if (!reviewId) return;

    // 카드 클릭 시 상세 페이지 이동 (하트 영역 제외)
    card.addEventListener("click", (event) => {
      if (event.target.closest(".like-badge")) return;
      window.location.href = `15_coffeen_detail_review.html?reviewId=${encodeURIComponent(
        reviewId
      )}`;
    });

    const likeBadge = card.querySelector(".like-badge");
    const iconEl = likeBadge?.querySelector(".like-icon");
    const countSpan =
      likeBadge?.querySelector(".like-count") ||
      likeBadge?.querySelector(".like-count-saved");

    if (!likeBadge || !iconEl || !countSpan) return;

    const stored = likeMap[reviewId];
    let liked;
    let baseCount;

    if (stored && typeof stored.base === "number") {
      liked = !!stored.liked;
      baseCount = stored.base;
    } else {
      const src = iconEl.getAttribute("src") || "";
      const initialLiked = src.includes("filled_heart");
      const displayCount = parseLikeCount(countSpan.textContent);

      baseCount = initialLiked ? displayCount - 1 : displayCount;
      liked = initialLiked;
    }

    function getDisplayCount() {
      return Math.max(0, baseCount + (liked ? 1 : 0));
    }

    function syncUI() {
      countSpan.textContent = formatLikeCount(getDisplayCount());

      if (liked) {
        iconEl.src = "../assets/icons/15_icon_filled_heart.svg";
        countSpan.classList.remove("like-count");
        countSpan.classList.add("like-count-saved");
      } else {
        iconEl.src = "../assets/icons/15_icon_heart.svg";
        countSpan.classList.remove("like-count-saved");
        countSpan.classList.add("like-count");
      }
    }

    syncUI();

    likeBadge.addEventListener("click", (event) => {
      event.stopPropagation();

      liked = !liked;
      likeMap[reviewId] = { liked, base: baseCount };
      saveReviewLikes(likeMap);
      syncUI();
    });
  });
});
