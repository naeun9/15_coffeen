document.addEventListener("DOMContentLoaded", () => {
    // 스크롤 애니메이션
    const options = { threshold: 0.15 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 페이지 2
                if(entry.target.classList.contains('gallery-section')) {
                    const items = document.querySelectorAll('.bento-item');
                    items.forEach((item, index) => {
                        setTimeout(() => item.classList.add('visible'), index * 100);
                    });
                }
                // 페이지 3
                if(entry.target.classList.contains('text-section')) {
                    entry.target.classList.add('active');
                }
            }
        });
    }, options);
    
    const gallerySection = document.querySelector('.gallery-section');
    const textSection = document.querySelector('.text-section');
    
    if(gallerySection) observer.observe(gallerySection);
    if(textSection) observer.observe(textSection);

    // 스크롤 시 네비게이션 색상 변경
    const snapContainer = document.querySelector('.snap-container');
    const nav = document.querySelector('nav');
    
    snapContainer.addEventListener('scroll', () => {
        const scrolled = snapContainer.scrollTop > window.innerHeight * 0.5;
        if (scrolled) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
});