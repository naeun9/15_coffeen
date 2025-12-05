document.addEventListener('DOMContentLoaded', () => {
    initBannerCarousel();
    initPopularCarousel();
    initSaveBadges();
    initInfiniteScroll();
});

// 1. 배너 캐러셀
const bannerCarousel = {
    slides: null, dots: null, currentSlide: 0, slideInterval: null, intervalDuration: 3000
};

function initBannerCarousel() {
    bannerCarousel.slides = document.querySelectorAll('.banner-slide');
    bannerCarousel.dots = document.querySelectorAll('.dot');
    const bannerContainer = document.querySelector('.banner-carousel');
    
    if (!bannerCarousel.slides.length || !bannerCarousel.dots.length) return;
    
    bannerCarousel.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showBannerSlide(index);
            resetBannerAutoSlide();
        });
    });
    
    if (bannerContainer) {
        bannerContainer.addEventListener('mouseenter', stopBannerAutoSlide);
        bannerContainer.addEventListener('mouseleave', startBannerAutoSlide);
    }
    startBannerAutoSlide();
}

function showBannerSlide(index) {
    if (!bannerCarousel.slides || !bannerCarousel.dots) return;
    bannerCarousel.slides[bannerCarousel.currentSlide].classList.remove('active');
    bannerCarousel.dots[bannerCarousel.currentSlide].classList.remove('active');
    
    if (index >= bannerCarousel.slides.length) bannerCarousel.currentSlide = 0;
    else if (index < 0) bannerCarousel.currentSlide = bannerCarousel.slides.length - 1;
    else bannerCarousel.currentSlide = index;
    
    bannerCarousel.slides[bannerCarousel.currentSlide].classList.add('active');
    bannerCarousel.dots[bannerCarousel.currentSlide].classList.add('active');
}

function nextBannerSlide() { showBannerSlide(bannerCarousel.currentSlide + 1); }
function startBannerAutoSlide() { stopBannerAutoSlide(); bannerCarousel.slideInterval = setInterval(nextBannerSlide, bannerCarousel.intervalDuration); }
function stopBannerAutoSlide() { if (bannerCarousel.slideInterval) clearInterval(bannerCarousel.slideInterval); }
function resetBannerAutoSlide() { stopBannerAutoSlide(); startBannerAutoSlide(); }

// 2. 인기 카페 캐러셀
function initPopularCarousel() {
    const containers = document.querySelectorAll('.popular-carousel-container');
    containers.forEach(container => {
        const slides = container.querySelectorAll('.popular-slide');
        const track = container.querySelector('.popular-track');
        const prevBtn = container.querySelector('.carousel-nav.prev');
        const nextBtn = container.querySelector('.carousel-nav.next');
        const totalSlides = slides.length;
        let currentSlide = 0;

        if (!slides.length || !track) return;

        const moveSlide = (direction) => {
            slides[currentSlide].classList.remove('active');
            if (direction === 'next') currentSlide = (currentSlide + 1) % totalSlides;
            else currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            slides[currentSlide].classList.add('active');
        };

        if (prevBtn) prevBtn.addEventListener('click', () => moveSlide('prev'));
        if (nextBtn) nextBtn.addEventListener('click', () => moveSlide('next'));
    });
}

// 3. 하트 버튼 기능
function initSaveBadges() {
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.save-badge');
        if (!btn) return;

        // 링크 이동 막기
        e.preventDefault();
        e.stopPropagation();

        const isActive = btn.classList.contains('active');
        const countSpan = btn.querySelector('.save-count');
        
        btn.classList.toggle('active');

        // 숫자 변경 로직
        if (countSpan) {
            let text = countSpan.innerText;
            let num = 0;
            
            if (text.includes('k')) num = parseFloat(text) * 1000;
            else num = parseInt(text.replace(/,/g, ''));

            if (!isActive) num++; 
            else num--; 

            // 다시 k 단위로 포맷팅하거나 그냥 숫자로 표시
            countSpan.innerText = num >= 1000 
                ? (num / 1000).toFixed(1) + 'k' 
                : num.toLocaleString();
        }
    });
}

// 4. 무한 스크롤 기능

function initInfiniteScroll() {
    const grid = document.querySelector('.masonry-grid');
    const sentinel = document.getElementById('observer-sentinel');
    const loader = document.getElementById('loading-indicator');
    
    if (!grid || !sentinel) return;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadMoreCards();
        }
    }, {
        rootMargin: '200px'
    });

    observer.observe(sentinel);

    function loadMoreCards() {
        if (loader) loader.classList.add('show');

        // JSON 파일 불러오기
        fetch('15_coffeen_homeData.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('네트워크 응답에 문제가 있습니다.');
                }
                return response.json(); 
            })
            .then(data => {
                setTimeout(() => {
                    const items = data.infiniteScrollData; 

                    items.forEach(item => {
                        const link = document.createElement('a');
                        link.href = '../detail/15_coffeen_detailMenu.html';
                        link.className = `masonry-item fade-in ${item.tall ? 'tall' : ''}`;
                        
                        link.innerHTML = `
                            <img src="${item.img}" alt="추가된 카페">
                            <div class="masonry-overlay">
                                <div class="masonry-title">${item.tag}</div>
                            </div>
                        `;
                        grid.appendChild(link);
                    });

                    if (loader) loader.classList.remove('show');
                }, 800); 
            })
            .catch(error => {
                console.error('데이터를 불러오는 중 오류 발생:', error);
                if (loader) loader.classList.remove('show');
            });
    }
}