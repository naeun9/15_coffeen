// 15_coffeen_중간과제/mypage/15_coffeen_detail_board.js
// 보드 상세 탭 이동 + 보드별 카페 목록 렌더링

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

  // 쿼리스트링에서 제목/카운트 가져오기
  const params = new URLSearchParams(window.location.search);
  const title = params.get("title") || "보드";
  const titleEl = document.getElementById("board-detail-title");
  const countEl = document.getElementById("board-detail-count");
  const listEl = document.querySelector(".board-detail-list");

  if (titleEl) {
    titleEl.textContent = title;
  }

  // 보드별 카페 데이터
  const boardCafes = {
    "데이트하기 좋은 카페": [
      {
        src: "../assets/images/15_cafe1.jpeg",
        name: "더 베이커리",
        meta: "용산구 · 브런치가 맛있는 감성 카페",
      },
      {
        src: "../assets/images/15_cafe2.jpeg",
        name: "선샤인 테라스",
        meta: "마포구 · 햇살 좋은 우드톤 카페",
      },
      {
        src: "../assets/images/15_cafe3.jpeg",
        name: "모노브루 라운지",
        meta: "성동구 · 커피가 맛있는 조용한 카페",
      },
      {
        src: "../assets/images/15_cafe4.jpeg",
        name: "라이트웨이 커피바",
        meta: "중구 · 주황색 인테리어의 트렌디한 카페",
      },
    ],
    "작업하기 좋은 카페": [
      {
        src: "../assets/images/15_cafe4.jpeg",
        name: "라이트웨이 커피바",
        meta: "중구 · 주황색 인테리어의 트렌디한 카페",
      },
      {
        src: "../assets/images/15_cafe6.jpeg",
        name: "코지 코너",
        meta: "용산구 · 다양한 종류의 베이커리가 있는 카페",
      },
      {
        src: "../assets/images/15_cafe2.jpeg",
        name: "선샤인 테라스",
        meta: "성동구 · 커피가 맛있는 조용한 카페",
      },
    ],
  };

  // 기본 보드(정의 안 된 보드용)
  const defaultCafes = [
    {
      src: "../assets/images/15_cafe1.jpeg",
      name: "라이트웨이 커피바",
      meta: "중구 · 커피가 맛있는 감성 카페",
    },
    {
      src: "../assets/images/15_cafe2.jpeg",
      name: "선샤인 테라스",
      meta: "마포구 · 햇살 좋은 테라스 좌석",
    },
    {
      src: "../assets/images/15_cafe3.jpeg",
      name: "모노브루 라운지",
      meta: "성동구 · 여유로운 워크 스폿",
    },
  ];

  const cafes = boardCafes[title] || defaultCafes;

  // 카운트 텍스트 갱신
  if (countEl) {
    countEl.textContent = cafes.length + "개 카페";
  }

  // 리스트 렌더링
  if (listEl) {
    listEl.innerHTML = "";

    cafes.forEach(function (cafe) {
      const card = document.createElement("article");
      card.className = "board-detail-card";

      const img = document.createElement("img");
      img.className = "board-detail-thumb";
      img.src = cafe.src;
      img.alt = cafe.name;

      const info = document.createElement("div");
      info.className = "board-detail-info";

      const nameEl = document.createElement("h3");
      nameEl.className = "board-detail-cafe-name";
      nameEl.textContent = cafe.name;

      const metaEl = document.createElement("p");
      metaEl.className = "board-detail-meta";
      metaEl.textContent = cafe.meta;

      info.appendChild(nameEl);
      info.appendChild(metaEl);

      card.appendChild(img);
      card.appendChild(info);

      listEl.appendChild(card);
    });
  }

  // 보드 목록으로 버튼
  const backBtn = document.getElementById("board-back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.location.href = "15_coffeen_board.html";
    });
  }
});
