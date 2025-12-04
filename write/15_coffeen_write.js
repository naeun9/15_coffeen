document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('myCafeData')) {
        fetch('../map/15_coffeen_mapData.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('myCafeData', JSON.stringify(data.cafes));
                console.log("초기 데이터 로드 완료");
            })
            .catch(error => console.error("데이터 로드 실패"));
    }
    /*

    const tagBtns = document.querySelectorAll('.tag_btn');
    const MAX_TAGS = 2; 

    tagBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 이미 선택된 상태면 해제
            if (btn.classList.contains('selected')) {
                btn.classList.remove('selected');
            } 
            
            else {
                //몇 개가 선택되었는지
                const currentSelected = document.querySelectorAll('.tag_btn.selected').length;
                
                if (currentSelected < MAX_TAGS) {
                    btn.classList.add('selected');
                } else {
                    alert("해시태그는 최대 2개까지만 선택 가능합니다.");
                }
            }
        });
    });
    */
    const tagBtns = document.querySelectorAll('.tag_btn');
    const MAX_TAGS = 2; 

    if (tagBtns) {
        tagBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // (안전장치) 폼 전송 방지
                const tagText = btn.innerText; // 태그 글자 가져오기 (#공부 등)

                // 1. 이미 선택된 상태면 -> 해제
                if (btn.classList.contains('selected')) {
                    btn.classList.remove('selected');
                    
                    // ★ [추가됨] 배열에서도 삭제해야 저장될 때 빠집니다!
                    selectedTags = selectedTags.filter(t => t !== tagText);
                } 
                
                // 2. 선택 안 된 상태면 -> 추가
                else {
                    // 개수 체크 (selectedTags 배열 길이로 확인하는 게 더 정확함)
                    if (selectedTags.length >= MAX_TAGS) {
                        alert("해시태그는 최대 2개까지만 선택 가능합니다.");
                        return; // 멈춤
                    }
                    
                    btn.classList.add('selected');
                    
                    // ★ [추가됨] 배열에 태그 글자를 담습니다! (이게 있어야 저장됨)
                    selectedTags.push(tagText);
                }
            });
        });
    }


    const starContainer = document.getElementById('star_container');
    const stars = starContainer.querySelectorAll('.star');
    const rateInput = document.getElementById('rate_result'); 

    let currentRating = 0; 

    stars.forEach(star => {
        star.addEventListener('click', () => {
            
            const clickedValue = parseInt(star.getAttribute('data-value'));

            
            
            if (currentRating === clickedValue) {
                currentRating = 0;
            } else {
                
                currentRating = clickedValue;
            }

            
            updateStars(currentRating);
        });
    });

    // 별 색깔을 칠해주기기
    function updateStars(rating) {
        
        rateInput.value = rating;

        
        stars.forEach(s => {
            const starValue = parseInt(s.getAttribute('data-value'));
            
            if (starValue <= rating) {
                
                s.classList.add('active');
            } else {
                
                s.classList.remove('active');
            }
        });
    }
    const realUpload = document.getElementById('real-upload');
    const customUploadBtn = document.getElementById('custom-upload-btn');
    const previewContainer = document.getElementById('preview-container');
    
    
    let selectedFiles = [];

    if(customUploadBtn && realUpload) {
        
        customUploadBtn.addEventListener('click', () => {
            realUpload.click();
        });

        // 파일이 선택되었을 때
        realUpload.addEventListener('change', (e) => {
            
            const newFiles = Array.from(e.target.files);
            
            
            if (selectedFiles.length + newFiles.length > 4) {
                alert("사진은 최대 4장까지만 업로드 가능합니다.");
                
                realUpload.value = ""; 
                return;
            }

            
            selectedFiles = selectedFiles.concat(newFiles);

            
            updatePreview();
            
            
            realUpload.value = ""; 
        });
    }

    
    function updatePreview() {
        
        previewContainer.innerHTML = '';

        
        selectedFiles.forEach((file) => {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.classList.add('preview_img');
                
                

                previewContainer.appendChild(img);
            };
            
            reader.readAsDataURL(file);
        });
    }

    const submitBtn=document.querySelector('.first_btn');
    const nameInput=document.getElementById('name');
    const locationInput=document.getElementById('where');
    const reviewInput=document.getElementById('review_text');
    let selectedTags = []; 
    let nowRating=3.8;
    
    
    
    
    
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (!nameInput.value.trim()) {
                alert("카페 이름을 입력해주세요");return;
            }
            if (!locationInput.value.trim()) {
                alert("주소를 입력해주세요");return;
            }
            
            let storedData=JSON.parse(localStorage.getItem('myCafeData')) || [];
            const newId=storedData.length> 0 ? storedData[storedData.length-1].id+1:1;

            let mainImage="../assets/images/15_cafe6.jpeg";

            const newCafe={
                id: newId,
                name: nameInput.value,
                location: locationInput.value,
                likes: 0,
                rating: nowRating,
                tag:selectedTags.length > 0 ? selectedTags.join(' ') : "#신규", 
                image: mainImage,
                review: reviewInput.value 
            };
            storedData.push(newCafe);
            localStorage.setItem('myCafeData', JSON.stringify(storedData));
            alert("후기가 등록되었습니다.");
            window.location.href='../mypage/15_coffeen_review.html';
        })
    }

    

});
    
    // 요소들 가져오기
    
    

