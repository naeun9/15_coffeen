// 15_coffeen_중간과제/mypage/15_coffeen_detail_review.js
// 마이페이지 리뷰 상세 스크립트

document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".mypage-tabs .tab-button");
  let isEditing = false;
  let currentTags = [];

  const ALL_TAGS = [
    "#공부",
    "#모던",
    "#아늑한",
    "#자연",
    "#맛집",
    "#빈티지",
    "#힐링",
    "#루프탑",
    "#베이커리",
    "#감성",
  ];

  const TAG_STORAGE_KEY = "coffeen_my_tags";
  const REVIEW_TEXT_STORAGE_KEY = "coffeen_my_review_text";

  const profileName = sessionStorage.getItem("signupProfileName");
  const profileBio = sessionStorage.getItem("signupProfileBio");
  const nameEl = document.querySelector(".profile-name");
  const bioEl = document.querySelector(".profile-bio");

  if (profileName && nameEl) {
    nameEl.textContent = profileName;
  }
  if (profileBio && bioEl) {
    bioEl.textContent = profileBio;
  }

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

  const backBtn = document.getElementById("back-to-list");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "15_coffeen_review.html";
    });
  }

  const DETAIL_REVIEWS = {
    "1": {
      id: "1",
      title: "라이트웨이 커피바",
      heroImage: "../assets/images/15_cafe4.jpeg",
      rating: "4.6",
      date: "2025.11.29",
      location: "중구 · 서울 중구 을지로 12길 8",
      paragraphs: [
        "중구에 위치한 라이트웨이 커피바에 다녀왔어요. 들어서자마자 힙하고 감각적인 인테리어가 눈길을 사로잡았습니다. 특히 주황색 포인트 가구들과 매장 중앙에 놓인 올리브 나무가 조화롭게 어우러져서 어디서 찍어도 인생 샷을 건질 수 있었어요.",
        "공간이 전체적으로 널찍하고 통유리와 거울 덕분에 개방감이 느껴져서 답답하지 않았습니다. 친구들과 함께 방문해서 커피를 마셨는데, 원두 향이 진하고 고소해서 공간의 분위기만큼이나 맛도 만족스러웠습니다.",
      ],
      hours: "매일 10:00 - 22:00",
      phone: "02-123-5678",
      tags: ["#빈티지", "#맛집"],
    },
    "2": {
      id: "2",
      title: "더 베이커리",
      heroImage: "../assets/images/15_cafe1.jpeg",
      rating: "4.7",
      date: "2025.11.21",
      location: "용산구 · 서울 용산구 한강대로 45길 21",
      paragraphs: [
        "용산에 위치한 더 베이커리에서 행복한 브런치 타임을 가졌어요. 매장에 들어서자마자 느껴지는 따뜻한 우드 톤의 분위기가 정말 아늑했습니다.",
        "플레이팅이 예뻐서 사진 찍기에도 좋고, 주말 오전에 여유롭게 대화 나누기 딱 좋은 곳이었습니다. 용산 근처에서 든든하고 맛있는 브런치를 찾으신다면 꼭 방문해 보세요!",
      ],
      hours: "매일 09:00 - 21:00",
      phone: "02-456-7890",
      tags: ["#베이커리", "#감성"],
    },
    "3": {
      id: "3",
      title: "루프탑 라운지",
      heroImage: "../assets/images/15_cafe5.jpeg",
      rating: "4.9",
      date: "2025.11.15",
      location: "동작구 · 서울 동작구 사당로 15길 9",
      paragraphs: [
        "전체적으로 어두운 톤에 따뜻한 색감의 펜던트 조명이 포인트가 되어, 마치 나만의 아지트에 온 듯한 아늑한 느낌이 듭니다.",
        "매장 중앙에 있는 긴 원목 테이블은 책을 읽거나 가볍게 노트북 작업을 하기에 더할 나위 없이 좋았고, 곳곳에 배치된 식물들이 자칫 무거울 수 있는 분위기에 싱그러움을 더해줍니다. 다만 바람이 조금 세게 부는 날에는 겉옷을 꼭 챙겨가는 걸 추천해요. 야경 좋아하는 사람이라면 꼭 한 번 가봐야 할 루프탑 카페예요.",
      ],
      hours: "평일 12:00 - 23:00 / 주말 11:30 - 23:30",
      phone: "02-987-6543",
      tags: ["#루프탑", "#힐링"],
    },
  };

  function getReviewIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("reviewId");
  }

  function loadStoredTags(reviewId, fallback) {
    let map = {};
    try {
      map = JSON.parse(localStorage.getItem(TAG_STORAGE_KEY)) || {};
    } catch (e) {
      map = {};
    }
    return map[reviewId] || fallback || [];
  }

  function saveStoredTags(reviewId, tags) {
    let map = {};
    try {
      map = JSON.parse(localStorage.getItem(TAG_STORAGE_KEY)) || {};
    } catch (e) {
      map = {};
    }
    map[reviewId] = tags;
    try {
      localStorage.setItem(TAG_STORAGE_KEY, JSON.stringify(map));
    } catch (e) {}
  }

  function loadStoredReviewText(reviewId, fallback) {
    let map = {};
    try {
      map = JSON.parse(localStorage.getItem(REVIEW_TEXT_STORAGE_KEY)) || {};
    } catch (e) {
      map = {};
    }
    return map[reviewId] || fallback || "";
  }

  function saveStoredReviewText(reviewId, text) {
    let map = {};
    try {
      map = JSON.parse(localStorage.getItem(REVIEW_TEXT_STORAGE_KEY)) || {};
    } catch (e) {
      map = {};
    }
    map[reviewId] = text;
    try {
      localStorage.setItem(REVIEW_TEXT_STORAGE_KEY, JSON.stringify(map));
    } catch (e) {}
  }

  function setupMyRating(reviewId, defaultStars) {
    const starsWrap = document.getElementById("myRatingStars");
    if (!starsWrap) return;

    const buttons = Array.from(starsWrap.querySelectorAll(".my-rating-star"));
    if (!buttons.length) return;

    const STORAGE_KEY = "coffeen_my_rating";
    let stored = {};
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      stored = {};
    }

    let current = 0;
    if (stored[reviewId] != null) {
      current = Number(stored[reviewId]) || 0;
    } else if (defaultStars != null) {
      current = Number(defaultStars) || 0;
    }

    function paint(value) {
      buttons.forEach((btn) => {
        const v = Number(btn.dataset.value);
        const img = btn.querySelector("img");
        if (!img) return;

        if (v <= value) {
          img.src = "../assets/icons/15_icon_filled_star.svg";
          btn.classList.add("is-active");
        } else {
          img.src = "../assets/icons/15_icon_star.svg";
          btn.classList.remove("is-active");
        }
      });
    }

    paint(current);

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!isEditing) return;
        const value = Number(btn.dataset.value);
        current = value;
        paint(current);
        stored[reviewId] = current;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
        } catch (e) {}
      });
    });
  }

  function setupTagEditor(reviewId, baseTags) {
    const selectedListEl = document.getElementById("detailTagList");
    const editPanelEl = document.getElementById("detailTagEditPanel");
    const editListEl = document.getElementById("detailTagEditList");

    currentTags = loadStoredTags(reviewId, baseTags);
    const chipMap = new Map();

    function createChip(tag) {
      const span = document.createElement("span");
      span.className = "detail-tag-chip";
      span.textContent = tag;
      return span;
    }

    if (selectedListEl) {
      selectedListEl.innerHTML = "";
      currentTags.forEach((tag) => {
        const chip = createChip(tag);
        selectedListEl.appendChild(chip);
        chipMap.set(tag, chip);
      });
    }

    if (!editListEl) return;
    editListEl.innerHTML = "";

    ALL_TAGS.forEach((tag) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip-tag";
      btn.textContent = tag;

      if (currentTags.includes(tag)) {
        btn.classList.add("active");
      }

      btn.addEventListener("click", () => {
        if (!isEditing) return;

        const idx = currentTags.indexOf(tag);

        if (idx >= 0) {
          currentTags.splice(idx, 1);
          btn.classList.remove("active");

          const chip = chipMap.get(tag);
          if (chip) {
            chip.classList.add("detail-tag-chip-remove");
            chip.addEventListener(
              "animationend",
              () => {
                chip.remove();
                chipMap.delete(tag);
              },
              { once: true }
            );
          }
        } else {
          currentTags.push(tag);
          btn.classList.add("active");

          if (selectedListEl) {
            const chip = createChip(tag);
            chip.classList.add("detail-tag-chip-add");
            selectedListEl.appendChild(chip);
            chipMap.set(tag, chip);
          }
        }
      });

      editListEl.appendChild(btn);
    });

    if (editPanelEl) {
      editPanelEl.style.display = "none";
    }
  }

  function setupEditMode(contentEl, reviewId) {
    const editBtn = document.getElementById("detailEditToggle");
    const myRatingSection = document.querySelector(".detail-my-rating");
    const myRatingTitle = document.querySelector(".detail-my-rating-title");
    const tagEditPanelEl = document.getElementById("detailTagEditPanel");
    const tagsSectionEl = document.querySelector(".detail-tags-section");

    if (!editBtn || !contentEl) return;

    editBtn.addEventListener("click", () => {
      isEditing = !isEditing;

      if (isEditing) {
        editBtn.textContent = "저장";

        if (myRatingTitle) myRatingTitle.style.display = "inline";
        if (myRatingSection) myRatingSection.classList.add("is-editing");
        if (tagsSectionEl) tagsSectionEl.classList.add("is-editing");
        if (tagEditPanelEl) tagEditPanelEl.style.display = "block";

        contentEl.contentEditable = "true";
        contentEl.classList.add("is-editing");
      } else {
        editBtn.textContent = "수정";

        if (myRatingTitle) myRatingTitle.style.display = "none";
        if (myRatingSection) myRatingSection.classList.remove("is-editing");
        if (tagsSectionEl) tagsSectionEl.classList.remove("is-editing");
        if (tagEditPanelEl) tagEditPanelEl.style.display = "none";

        contentEl.contentEditable = "false";
        contentEl.classList.remove("is-editing");

        saveStoredTags(reviewId, currentTags);
        saveStoredReviewText(reviewId, contentEl.textContent.trim());
      }
    });
  }

  function renderDetail(data, reviewId) {
    if (!data) return;

    const heroImageEl = document.getElementById("detailHeroImage");
    const titleEl = document.getElementById("detailTitle");
    const dateEl = document.getElementById("detailDate");
    const locationEl = document.getElementById("detailLocation");
    const contentEl = document.getElementById("detailContent");
    const hoursEl = document.getElementById("detailHours");
    const phoneEl = document.getElementById("detailPhone");

    if (heroImageEl && data.heroImage) {
      heroImageEl.src = data.heroImage;
      heroImageEl.alt = data.title;
    }
    if (titleEl) titleEl.textContent = data.title || "";
    if (dateEl) dateEl.textContent = data.date || "";
    if (locationEl) locationEl.textContent = data.location || "";

    const paragraphs = data.paragraphs || [];
    if (contentEl) {
      const joined = paragraphs.join("\n");
      const storedText = loadStoredReviewText(reviewId, joined);
      contentEl.textContent = storedText;
    }

    if (hoursEl) hoursEl.textContent = data.hours || "";
    if (phoneEl) phoneEl.textContent = data.phone || "";

    setupTagEditor(reviewId, data.tags || []);

    const defaultStars = Math.round(Number(data.rating || 0));
    setupMyRating(reviewId, defaultStars);

    setupEditMode(contentEl, reviewId);
  }

  const reviewId = getReviewIdFromURL() || "1";
  const reviewData = DETAIL_REVIEWS[reviewId] || DETAIL_REVIEWS["1"];
  renderDetail(reviewData, reviewId);
});
