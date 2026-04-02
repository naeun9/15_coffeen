
const TARGET_CAFE_ID = 1;

const JSON_FILE_PATH = "./15_coffeen_detail.json";

//*********************************************************** */
//
//                      데이터 불러오기
//
//*********************************************************** */
// 1. Local Storage 키
const STORAGE_KEY = "allCafes";

// 2. 정규화
function normalizeCafes(list) {
    // 배열이 아닐 경우 빈 배열로 처리-> 에러 방지
    if (!Array.isArray(list)) return []; 
    
    // explore과 동일
    return list.map((cafe) => ({
        ...cafe,
        liked: typeof cafe.liked === "boolean" ? cafe.liked : false, 
        saves: typeof cafe.saves === "number" ? cafe.saves : 0,
    }));
}
// 3. 로컬 스토리지에서 데이터 fetch
async function loadCafeData() {
    try {
        // 1. Local Storage에서 데이터 읽기
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const cafes = JSON.parse(stored);
            return cafes; 
        }

        // 2. Local Storage에 데이터 없을 때
        const response = await fetch('./15_coffeen_detail.json'); 
        
        if (!response.ok) {
            throw new Error(`응답 오류: ${response.status}`);
        }
        const rawData = await response.json(); 
        const normalizedData = normalizeCafes(rawData); 
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedData));

        return normalizedData;
        
    } catch (error) {
        console.error("오류 발생:", error);
        return []; 
    }
}

//*********************************************************** */
//
//              1. 상세페이지 상단 부분(공통 블록)
//
//*********************************************************** */

//---------------------------------------------
//          0. 뒤로가기 버튼
//---------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.getElementById('back-btn'); 
    
    if (backBtn) {
        // 2. 클릭 이벤트 리스너를 추가합니다.
        backBtn.addEventListener('click', () => {
            window.history.back(); 
        });
    }
});

//---------------------------------------------
//          1. 사진 렌더링
//---------------------------------------------

async function renderCafePhotos() {
    try {
        const allCafes = await loadCafeData();
        const targetCafe = allCafes.find(item => item.id === TARGET_CAFE_ID);
        
        if (!allCafes || allCafes.length === 0) {
            console.error("데이터 로드 실패");
            return;
        }

        if (!targetCafe) {
            console.error('카페를 찾을 수 없습니다.');
            return;
        }

        // 메인 사진 렌더링
        const mainPhotoContainer = document.getElementById('mainImage');

        if (mainPhotoContainer && targetCafe.image) {
            const mainImgElement = document.createElement('img');
            mainImgElement.className = 'main-photo';
            mainImgElement.src = targetCafe.image;
            mainImgElement.alt = '카페 메인 설명 사진';

            mainPhotoContainer.appendChild(mainImgElement);

        } else {
            console.error('메인 사진을 찾을 수 없습니다.')
        }

        // 서브 사진 렌더링
        const subPhotoContainer = document.getElementById('subImage');
    
        if (subPhotoContainer) {
            subPhotoContainer.innerHTML = ''; 
        }

        if (subPhotoContainer && Array.isArray(targetCafe.subImage) && targetCafe.subImage.length > 0) {
        
            targetCafe.subImage.forEach(imagePath => {
                const imgElement = document.createElement('img');
                imgElement.className = 'sub-photo';
                imgElement.src = imagePath;
                imgElement.alt = '카페 서브 설명 사진';
                
                subPhotoContainer.appendChild(imgElement);
            });
        
        } else if (subPhotoContainer) {
            console.warn("서브 이미지를 찾을 수 없습니다.");
        }

    } catch(error) {
        console.error("카페 정보 처리 중 오류 발생:", error);
    }
}
//---------------------------------------------
//          2. 카페 정보 로드
//---------------------------------------------

async function renderCafe() {
    // DOM
    const cafeName = document.getElementById('cafe-name');
    const cafeRate = document.getElementById('rating');
    const cafeReview = document.getElementById('reviews');
    const cafeLocation = document.getElementById('location');
    const cafeTime = document.getElementById('hours');
    const cafeTel = document.getElementById('tel');

    // 데이터 로드
    try {
        const allCafes = await loadCafeData();
        
        if (!allCafes || allCafes.length === 0) {
            console.error("데이터 로드 실패");
            return;
        }

        const targetCafe = allCafes.find(item => item.id === TARGET_CAFE_ID);

        // 정보 렌더링
        if (targetCafe && targetCafe.name) {
            if (cafeName) cafeName.textContent = targetCafe.name;
            if (cafeRate) cafeRate.textContent = targetCafe.rating || 0;
            if (cafeReview) {
                const reviewCount = targetCafe.reviews || 0;
                cafeReview.textContent = `(${reviewCount} 리뷰)`;
            }
            if (cafeLocation) cafeLocation.textContent = targetCafe.detailedLocation || '정보 없음';
            if (cafeTime) cafeTime.textContent = targetCafe.time || '정보 없음';
            if (cafeTel) cafeTel.textContent = targetCafe.tel || '정보 없음';
            
        } else {
            console.error(`ID ${TARGET_CAFE_ID}를 가진 카페를 찾을 수 없습니다.`);
        }
        
    } catch (error) {
        console.error("카페 정보 처리 중 오류 발생:", error);
    }
}

document.addEventListener('DOMContentLoaded', renderCafe);

//---------------------------------------------
//          3. 좋아요 버튼 클릭 시
//---------------------------------------------

function LikeState(data) { 
    if (!data || data.length === 0) { console.error("데이터 처리 중 오류 발생") }
    
    try {
        const targetCafe = data.find(item => item.id === TARGET_CAFE_ID);

        const likeBtn = document.querySelector('.like-btn');
        const likeCountElement = document.getElementById('like-count');
        
        if (likeCountElement && likeBtn) {
            likeCountElement.textContent = targetCafe.saves;
            if (targetCafe.liked) { likeBtn.classList.add('liked'); } 
            else { likeBtn.classList.remove('liked'); }
        }
    } catch (error) {
        console.error("데이터 처리 중 오류 발생", error);
    }
}
//하트 색상 변화+숫자 및 숫자 색상 변화
document.addEventListener('DOMContentLoaded', async () => {
    const initialData = await loadCafeData();
    LikeState(initialData); 

    const likeBtn = document.querySelector('.like-btn');
    if (likeBtn) {
        const likeCount = likeBtn.querySelector('#like-count');
        
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            const isCurrentlyLiked = likeBtn.classList.contains('liked');
            const nextLiked = !isCurrentlyLiked;
            likeBtn.classList.toggle('liked', nextLiked);

            if (likeCount) {
                const currentSaves = parseInt(likeCount.textContent);
                const newSaves = currentSaves + (nextLiked ? 1 : -1);
                likeCount.textContent = newSaves;
                
                // Local Storage 데이터 업데이트
                const rawData = localStorage.getItem(STORAGE_KEY);
                if (!rawData) return;
                
                let allCafes = JSON.parse(rawData); 

                const targetIndex = allCafes.findIndex(cafe => cafe.id === TARGET_CAFE_ID);
                
                if (targetIndex !== -1) {
                    allCafes[targetIndex].liked = nextLiked;
                    allCafes[targetIndex].saves = newSaves;

                    localStorage.setItem(STORAGE_KEY, JSON.stringify(allCafes));
                }
            }
        });
    }
});

//------------------------------------------------------------
//                  4. 태그 json에서 불러오기
//------------------------------------------------------------

// 태그 렌더링 function
function renderTags(tagsArray) {
    const tagContainer = document.getElementById('tag-cluster-container');

    tagContainer.innerHTML = ''; 

    tagsArray.forEach(tagText => {
        const tagDiv = document.createElement('div');
        tagDiv.className = 'tag'; 
        
        tagDiv.textContent = tagText;
        tagContainer.appendChild(tagDiv);
    });
}
// 데이터 불러오기 function
async function processTagData() {
    const tagContainer = document.getElementById('tag-cluster-container');
    
    try {
        const allCafeData = await loadCafeData();
        
        if (!allCafeData || allCafeData.length === 0) {
            console.error('데이터 로드 실패');
            if (tagContainer) tagContainer.innerHTML = '데이터 로드 실패';
            return;
        }
        const targetCafe = allCafeData.find(item => item.id === TARGET_CAFE_ID);

        if (!targetCafe || !targetCafe.tags || !Array.isArray(targetCafe.tags)) {
            console.error('카페/태그 오류');
            if (tagContainer) tagContainer.innerHTML = '태그 정보를 찾을 수 없습니다.';
            return;
        }

        const tagsToRender = targetCafe.tags;
        renderTags(tagsToRender);


    } catch (error) {
        console.error('태그 데이터 처리 중 오류 발생:', error);
        if (tagContainer) tagContainer.innerHTML = '처리 중 오류 발생';
    }
}
document.addEventListener('DOMContentLoaded', processTagData);

//---------------------------------------------
//        5. 공유하기 버튼->모달팝업 기능
//---------------------------------------------
// 필요한 DOM 요소 가져오기
const SHARED_LINK = "https://yourdomain.com/coffeen/link/toShare/webprogramming";

const modal = document.getElementById("shareModal");
const openBtn = document.getElementById("openShareModal");
const closeBtn = document.querySelector(".close_btn");
const blog = document.getElementById("blogShare");
const kakao = document.getElementById("kakaoShare");
const copyInput = document.getElementById('copyLinkInput');

// 오픈/클로즈 기능
openBtn.onclick = function() {
  modal.classList.add('active');
  copyInput.value = SHARED_LINK;
}
closeBtn.onclick = function() {
  modal.classList.remove('active');
}
// 버튼 클릭 시 해당 어플 관련 링크로 이동
blog.onclick = function() {
    const blogUrl = "https://section.blog.naver.com/BlogHome.naver?directoryNo=0&currentPage=1&groupId=0"
    window.location.href = blogUrl;
}
kakao.onclick = function() {
    const kakaoUrl = "https://accounts.kakao.com/login/?continue=https%3A%2F%2Fsharer.kakao.com%2Fpicker%2Flink%3Fapp_key%3D4e0f02e43248fed6c5850431ea527a61%26short_key%3D12f1ebe5-8e77-47ae-990b-0ee5f8076220#login";
    window.location.href = kakaoUrl;
}

// 링크 복사 기능
document.getElementById('copyLink').onclick = function() {
    const linkToCopy = copyInput.value;
    copyInput.select();
    
    navigator.clipboard.writeText(linkToCopy).then(() => {
    alert("링크가 클립보드에 복사되었습니다!");
  }).catch(error => {
    console.error('링크 복사에 실패했습니다.', error);
  });
}


//*********************************************************** */
//
//         2. Detail 모든 페이지 - 하단 nav 관련
//
//*********************************************************** */

async function renderDetailNav() {
    try {
        const allCafes = await loadCafeData();
        const targetCafe = allCafes.find(item => item.id === TARGET_CAFE_ID);
        
        if (!allCafes || allCafes.length === 0 || !targetCafe) {
            console.error("데이터 로드 실패 또는 카페를 찾을 수 없습니다.");
            return;
        }

        // --- ⭐️ 카운트 할당 로직 추가 시작 ⭐️ ---
        
        const photoCountElement = document.getElementById('photo-count');
        const reviewCountElement = document.getElementById('review-count');

        if (photoCountElement && targetCafe.photos !== undefined) {
            // targetCafe.photos 값 (예: 6)을 할당
            photoCountElement.textContent = `(${targetCafe.photos})`; 
        }

        if (reviewCountElement && targetCafe.reviews !== undefined) {
            // targetCafe.reviews 값 (예: 308)을 할당
            reviewCountElement.textContent = `(${targetCafe.reviews})`;
        }
        
    } catch(error) {
        console.error("카페 정보 처리 중 오류 발생:", error);
    }
}
document.addEventListener('DOMContentLoaded', renderDetailNav);


//*********************************************************** */
//
//                3. Detail - Photo 페이지
//
//*********************************************************** */

// 전역 변수
let photos = null;
let prevBtn = null;
let nextBtn = null;
let firstImage = null;
let currentIndex = 0;
let totalItems = 0;

// 클릭시 넘어갈 크기 지정
function calculateScroll() {
    const gapPx = window.innerWidth * 0.02; 
    
    if (!firstImage) {
        console.error("첫 번째 이미지 요소를 찾을 수 없습니다.");
        return 0;
    }
    return firstImage.offsetWidth + gapPx; 
}
// 캐러셀 위치 업데이트
function updateCarousel() {
    const scrollAmount = calculateScroll();
    const offset = -currentIndex * scrollAmount;

    if (photos) {
        photos.style.transform = `translateX(${offset}px)`; 
    }
}
// 렌더링
async function renderPhotosPage() {
    try {
        const allCafes = await loadCafeData();
        const targetCafe = allCafes.find(item => item.id === TARGET_CAFE_ID);
        
        if (!allCafes || allCafes.length === 0) {
            console.error("데이터 로드 실패");
            return;
        }
        if (!targetCafe) {
            console.error('카페를 찾을 수 없습니다.');
            return;
        }

        const PhotoContainer = document.getElementById('reviewPhoto');
    
        if (PhotoContainer) {
            PhotoContainer.innerHTML = '';
        }

        if (PhotoContainer && Array.isArray(targetCafe.reviewImage) && targetCafe.reviewImage.length > 0) {
            
            targetCafe.reviewImage.forEach(imagePath => {
                const imgElement = document.createElement('img');
                imgElement.src = imagePath;
                imgElement.alt = '카페 리뷰 사진';
                imgElement.className = 'rendered-review-photo';
                
                PhotoContainer.appendChild(imgElement);
            });
        } 
        
    } catch(error) {
        console.error("카페 정보 처리 중 오류 발생:", error);
    }
}
// 실행
document.addEventListener('DOMContentLoaded', async () => {
    
    prevBtn = document.querySelector('.prev');
    nextBtn = document.querySelector('.next');
    
    await renderPhotosPage(); 
    
    photos = document.getElementById('reviewPhoto');
    
    if (!photos) {
        console.error("초기화 오류");
        return;
    }
    firstImage = photos.querySelector('img'); 
    totalItems = photos.children.length;

    if (totalItems === 0 || !firstImage) {
        console.warn("이미지 없음");
        return;
    }
    // 버튼 이벤트 리스너
    prevBtn.addEventListener('click', () => {
        if (currentIndex === 0) {
            currentIndex = totalItems - 1; 
        } else {
        currentIndex--; 
        }
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex === totalItems - 1) {
            currentIndex = 0; 
        } else {
            currentIndex++; 
        }
        updateCarousel();
    });
    updateCarousel(); 
});


//*********************************************************** */
//
//             4. Detail - Review 페이지
//
//*********************************************************** */

// 상세메뉴 - 메뉴 생성
function createReviewBox(item) {
    // 1. 리뷰 하나 담는 div 생성
    const reviewBox = document.createElement('div');
    reviewBox.className = 'box';

    // 2. 작성자 이름 + 별점 담는 div 생성후 값 추가
    const reviewTop = document.createElement('div');
    reviewTop.className = 'review-top';

    const userName = document.createElement('a');
    userName.className = 'subhead';
    userName.textContent = item.userName;

    reviewTop.appendChild(userName);

    const rate = item.reviewRate;
    for (let i = 0; i < rate; i++) {
        const star = document.createElement('span');
        star.className = 'icon-star';
        reviewTop.appendChild(star);
    }
    reviewBox.appendChild(reviewTop);

    // 3. 날짜 담는 div 생성후 값 추가
    const reviewDate = document.createElement('div');
    reviewDate.className = 'review-date';
    const dateTxt = document.createElement('a');
    dateTxt.className = 'smalltxt';
    dateTxt.textContent = item.reviewDate;

    reviewDate.appendChild(dateTxt);
    reviewBox.appendChild(reviewDate);
    // 4. 리뷰 담는 div 생성후 값 추가
    const reviewArticle = document.createElement('div');
    reviewArticle.className = 'review-article';
    const reviewTxt = document.createElement('a');
    reviewTxt.className = 'text';
    reviewTxt.textContent = item.reviewText;

    reviewArticle.appendChild(reviewTxt);
    reviewBox.appendChild(reviewArticle);
    // 5. 리뷰 사진 담는 div 생성후 값 추가
    const reviewPhoto = document.createElement('div');
    reviewPhoto.className = 'review-photo';

    const photoArray = item.reviewPhoto;
    if (Array.isArray(photoArray) && photoArray.length > 0) {
        photoArray.forEach(url => {
            const img = document.createElement('img');
            img.src = url; 
            img.alt = '리뷰 사진';
            reviewPhoto.appendChild(img);
        });
    } 
    reviewBox.appendChild(reviewPhoto);

    return reviewBox;
}
// 리뷰 렌더링 function
function renderReviews(reviewsArray) {
    const reviewContainer = document.getElementById('review-cluster-container');
    
    if (!reviewContainer) {
        console.error("컨테이너를 찾을 수 없습니다.");
        return;
    }
    reviewContainer.innerHTML = ''; 

    reviewsArray.forEach(reviewItem => {
        const reviewElement = createReviewBox(reviewItem);
        reviewContainer.appendChild(reviewElement);
    });
};
// 데이터 불러오기 function
async function processReviewsData() {
    try {
        const response = await fetch(JSON_FILE_PATH);
        
        if (!response.ok) {
            throw new Error(`파일 로드 실패: ${response.status}`);
        }
        
        const myList = await response.json(); 
        
        const targetCafe = myList.find(item => item.id === TARGET_CAFE_ID);

        const reviewsToRender = targetCafe?.reviewContents; 

        if (!reviewsToRender || reviewsToRender.length === 0) {
            console.warn('카페의 리뷰 정보가 없습니다.');
            const container = document.getElementById('review-cluster-container');
            if (container) container.innerHTML = '등록된 리뷰가 없습니다.';
            return;
        }
        renderReviews(reviewsToRender);

    } catch (error) {
        console.error("리뷰 데이터 로드 중 오류 발생:", error);
        const container = document.getElementById('review-cluster-container');
        if (container) container.innerHTML = '리뷰 데이터 로드 실패.';
    }
}
document.addEventListener('DOMContentLoaded', processReviewsData);


//*********************************************************** */
//
//             5. Detail - Menu 페이지
//
//*********************************************************** */

function introContainer(item) {
    const introCafe = document.getElementById('introduce');

    const introduce = document.createElement('a');
    introduce.textContent = item.introduce;
    introduce.className += 'text';

    introCafe.append(introduce);
}
function createMenuChip(item) {
    // 1. menu-chip 생성
    const menuChip = document.createElement('div');
    menuChip.className = 'menu-chip';

    // 2. 아이콘 + 메뉴 이름 div
    const textLeft = document.createElement('div');
    textLeft.className = 'text';

    const iconSpan = document.createElement('span');
    iconSpan.innerHTML = item.menuSvg;
    iconSpan.className += 'menu-icon';

    const menuNameText = document.createElement('a');
    menuNameText.textContent = item.menuName;

    textLeft.appendChild(iconSpan);
    textLeft.appendChild(menuNameText);

    // 3. 가격 div
    const textRight = document.createElement('div');
    textRight.className = 'text';
    textRight.textContent = item.menuPrice;
    
    // menu-chip에 내용 추가
    menuChip.appendChild(textLeft);
    menuChip.appendChild(textRight);
    
    return menuChip;
}
// 메뉴 렌더링 function
function renderMenus(menusArray) {
    const menuContainer = document.getElementById('menu-cluster-container');
    
    if (!menuContainer) {
        console.error("컨테이너를 찾을 수 없습니다.");
        return;
    }
    menuContainer.innerHTML = ''; 

    menusArray.forEach(menuItem => {
        const menuElement = createMenuChip(menuItem);
        menuContainer.appendChild(menuElement);
    });
};

// 데이터 불러오기 function
async function processMenusData() {
    try {
        const response = await fetch(JSON_FILE_PATH);
        
        if (!response.ok) {
            throw new Error(`파일 로드 실패: ${response.status}`);
        }
        
        const myList = await response.json(); 
        
        const targetCafe = myList.find(item => item.id === TARGET_CAFE_ID);
        if (targetCafe) {
            introContainer(targetCafe);
        }

        const menuToRender = targetCafe?.menu; 

        if (!menuToRender || menuToRender.length === 0) {
            console.warn('카페의 메뉴 정보가 없습니다.');
            const container = document.getElementById('menu-cluster-container');
            if (container) container.innerHTML = '등록된 메뉴가 없습니다.';
            return;
        }
        renderMenus(menuToRender);

    } catch (error) {
        console.error("메뉴 데이터 로드 중 오류 발생:", error);
        const container = document.getElementById('menu-cluster-container');
        if (container) container.innerHTML = '데이터 로드 실패.';
    }
}
document.addEventListener('DOMContentLoaded', processMenusData);





























