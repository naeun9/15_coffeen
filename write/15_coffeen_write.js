document.addEventListener('DOMContentLoaded', () => {
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

        
        selectedFiles.forEach((file, index) => {
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

    

});
    
    // 요소들 가져오기
    