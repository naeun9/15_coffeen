
document.addEventListener('DOMContentLoaded', () => {

    
    let originalData = [];

    
    async function init() {
        const cafeListContainer = document.querySelector('.cafe_list');
        
        let cafeData = localStorage.getItem('myCafeData');

        if (!cafeData) {
            try {
                const response = await fetch('15_coffeen_mapData.json'); 
                const json = await response.json();
                
                localStorage.setItem('myCafeData', JSON.stringify(json.cafes));
                cafeData = json.cafes;
            } catch (error) {
                console.error("데이터 로드 실패:", error);
                return;
            }
        } else {
            cafeData = JSON.parse(cafeData);
        }

        originalData = cafeData; // 원본 백업

        renderCafeList(cafeData, cafeListContainer);
        runMyCode(); 
    }

    // HTML 함수
    function renderCafeList(cafes, container) {
        container.innerHTML = ''; 

        if (cafes.length === 0) {
            container.innerHTML = '<div style="padding:20px; text-align:center; color:#888;">검색 결과가 없습니다.</div>';
            return;
        }

        cafes.forEach(cafe => {
            const html = `
                <article class="cafe_card" data-id="${cafe.id}">
                    <div class="card_images">
                        <img src="${cafe.image}" alt="${cafe.name}" class="card_img">
                    </div>
                    <div class="card_info">
                        <h3 class="cafe_name">${cafe.name}</h3>
                        <p class="cafe_icon">
                            <img src="../assets/icons/15_icon_location.svg" alt="위치" class="where_icon_1"> 
                            ${cafe.location} • 
                            <img src="../assets/icons/15_icon_heart.svg" alt="하트" class="where_icon heart"> 
                            <span class="like_text">${cafe.likes}</span>
                        </p>
                        <div class="rating_tag">
                            <img src="../assets/icons/15_icon_star.svg" alt="별점" class="rating">
                            <span class="rating_text">${cafe.rating}</span>
                            <span class="tag">${cafe.tag}</span>
                        </div>
                    </div>
                </article>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    }


    
    function runMyCode() {
        const cafeListContainer = document.querySelector('.cafe_list');

        
        // 검색 기능
        
        const searchInput = document.querySelector('.search_input');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const word = e.target.value.trim().toLowerCase();
                
                // 원본 데이터에서 필터링
                const filterData = originalData.filter(cafe => {
                    return cafe.name.toLowerCase().includes(word) ||

                    cafe.location.toLowerCase().includes(word);
                });

                renderCafeList(filterData, cafeListContainer);
                
                
                bindCardAndPinEvents(); 
            });
        }

        


        
        // 리스트버튼튼
        const listBtn = document.querySelector('.control_btn[aria-label="list"]');
        const mapContainer = document.querySelector('.map_container');

        if (listBtn && mapContainer) {
            listBtn.addEventListener('click', () => {
                
                mapContainer.classList.toggle('full-mode');
                
            });
        }
        const stackBtn=document.querySelector('.control_btn[aria-label="layer"]');
        const mapGround=document.querySelector('.map_area');
        if(stackBtn&&mapGround) {
            stackBtn.addEventListener('click', () => {
                mapGround.classList.toggle('hide_pins');
                
            });
        }


        
        //  드롭다운 정렬 기능
        
        const CafeSort = document.getElementById('sort'); 
        const CafeCard = document.querySelector('.cafe_list');    
        const sortList = document.getElementById('sort_options');  
        const sortItems = document.querySelectorAll('.sort_item'); 
        let currentSort = '인기순'; 

        if (CafeSort && sortList) {
            CafeSort.addEventListener('click', (e) => {
                e.stopPropagation(); 
                sortList.classList.toggle('show'); 
            });

            sortItems.forEach(item => {
                item.addEventListener('click', () => {
                    const selectedText = item.innerText; 
                    if (currentSort === selectedText) {
                        sortList.classList.remove('show');
                        return;
                    }
                    currentSort = selectedText;
                    CafeSort.innerHTML = `${selectedText} <span class="material-symbols-outlined">unfold_more</span>`;
                    
                    reverseList(CafeCard);
                    sortList.classList.remove('show');
                });
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.sort_dropdown')) {
                    sortList.classList.remove('show');
                }
            });
        }

        function reverseList(list) {
            if (!list) return;
            const cards = Array.from(list.children);
            list.innerHTML = '';
            cards.reverse().forEach(card => list.appendChild(card));
            list.scrollTop = 0;
        }


        
        const mapArea = document.querySelector('.map_area');
        const mapImg = document.querySelector('.map_img');
        let isZoomedOut = false; 

        if (mapArea && mapImg) {
            mapArea.addEventListener('click', (e) => {
                if (e.target.closest('button') || e.target.closest('.map_pin') || e.target.closest('.search_bar')) {
                    return;
                }
                isZoomedOut = !isZoomedOut; 
                if (isZoomedOut) {
                    mapImg.classList.add('zoomed-out'); 
                } else {
                    mapImg.classList.remove('zoomed-out'); 
                }
            });
        }
    


        //연동 
        bindCardAndPinEvents();


        //내 위치버튼
        const myLocationBtn = document.querySelector('.location_btn');
    
        const myPin = document.getElementById('my_pin') || Array.from(document.querySelectorAll('.map_pin')).find(pin => pin.innerHTML.includes('adjust'));

        if (myLocationBtn && myPin) {
            myLocationBtn.addEventListener('click', () => {
                myPin.classList.add('active');
                setTimeout(() => {
                    myPin.classList.remove('active');
                }, 1000);
                console.log("내 위치");
            });
        }
    }


    
    // 카드와 핀 클릭 이벤트 연결
    
    function bindCardAndPinEvents() {
        /*
        const cards = document.querySelectorAll('.cafe_card');
        const pins = document.querySelectorAll('.map_pin');

        // 1) 핀 클릭
        pins.forEach(pin => {
            const newPin = pin.cloneNode(true);
            pin.parentNode.replaceChild(newPin, pin);

            newPin.addEventListener('click', (e) => {
                e.stopPropagation(); 

                document.querySelectorAll('.map_pin').forEach(p => p.classList.remove('active'));
                cards.forEach(c => c.classList.remove('selected'));

                newPin.classList.add('active');
                
                const pinId = newPin.getAttribute('data-id');
                const targetCard = document.querySelector(`.cafe_card[data-id="${pinId}"]`);

                if (targetCard) {
                    targetCard.classList.add('selected');
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });

        //카드 클릭
        cards.forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.map_pin').forEach(p => p.classList.remove('active'));
                cards.forEach(c => c.classList.remove('selected'));

                card.classList.add('selected');
                const cardId = card.getAttribute('data-id');
                const targetPin = document.querySelector(`.map_pin[data-id="${cardId}"]`);
                
                if (targetPin) {
                    targetPin.classList.add('active');
                }
            });
        });*/
        const cards = document.querySelectorAll('.cafe_card');
        const pins = document.querySelectorAll('.map_pin');
        //const popup = document.getElementById('map_popup');
        
        
        const PIN_BROWN = "../assets/icons/15_pin_brown.svg"; 
        const PIN_RED = "../assets/icons/15_pin_red.svg";     

        //핀 클릭
        pins.forEach(pin => {
            const newPin = pin.cloneNode(true);
            pin.parentNode.replaceChild(newPin, pin);

            newPin.addEventListener('click', (e) => {
                e.stopPropagation(); 

                
                document.querySelectorAll('.map_pin img').forEach(img => {
                    img.src = PIN_BROWN; // 갈색으로
                    img.parentElement.classList.remove('active');
                });
                cards.forEach(c => c.classList.remove('selected'));

                
                const pinImg = newPin.querySelector('img');
                pinImg.src = PIN_RED; // 빨간색 이미지
                
                newPin.classList.add('active');
                
                
                const pinId = newPin.getAttribute('data-id');
                const targetCard = document.querySelector(`.cafe_card[data-id="${pinId}"]`);

                if (targetCard) {
                    targetCard.classList.add('selected');
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });

        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                
                document.querySelectorAll('.map_pin img').forEach(img => {
                    img.src = PIN_BROWN;
                    img.parentElement.classList.remove('active');
                });
                cards.forEach(c => c.classList.remove('selected'));

                
                card.classList.add('selected');
                
                
                const cardId = card.getAttribute('data-id');
                const targetPin = document.querySelector(`.map_pin[data-id="${cardId}"]`);
                
                if (targetPin) {
                    targetPin.classList.add('active');
                    // 이미지 교체
                    targetPin.querySelector('img').src = PIN_RED;
                }
            });
        });
    }

    
    init();
});
