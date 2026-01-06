document.addEventListener('DOMContentLoaded', function() {
    console.log('설문 페이지 JavaScript 로드됨!');

    // 10번 질문 조건부 표시 함수
    function handleQuestion10Conditional() {
        const communicationRadios = document.querySelectorAll('input[name="communication_method"]');
        const question11Card = document.querySelector('input[name="convenient_time"]').closest('.question-card');
        
        // 초기에는 11번 질문 숨김
        if (question11Card) {
            question11Card.style.display = 'none';
        }
        
        communicationRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'phone' || this.value === 'video_meeting') {
                    // 1번(전화) 또는 2번(화상) 선택 시 11번 질문 표시
                    if (question11Card) {
                        question11Card.style.display = 'block';
                        question11Card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                } else {
                    // 3번(이메일) 또는 4번(직접연락) 선택 시 11번 질문 숨김
                    if (question11Card) {
                        question11Card.style.display = 'none';
                    }
                }
            });
        });
    }

    // 기타 입력 필드 처리 함수
    function handleOtherInputs() {
        // 업종 카테고리 기타 입력
        const industryRadios = document.querySelectorAll('input[name="industry"]');
        const industryOtherInput = document.querySelector('input[name="industry_other"]');
        
        industryRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'other') {
                    industryOtherInput.disabled = false;
                    industryOtherInput.focus();
                } else {
                    industryOtherInput.disabled = true;
                    industryOtherInput.value = '';
                }
            });
        });

        // 문의 목적 기타 입력
        const purposeRadios = document.querySelectorAll('input[name="purpose"]');
        const purposeOtherInput = document.querySelector('input[name="purpose_other"]');
        
        purposeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'other') {
                    purposeOtherInput.disabled = false;
                    purposeOtherInput.focus();
                } else {
                    purposeOtherInput.disabled = true;
                    purposeOtherInput.value = '';
                }
            });
        });

        // 온라인 광고 경험 기타 입력
        const adExperienceRadios = document.querySelectorAll('input[name="ad_experience"]');
        const adExperienceOtherInput = document.querySelector('input[name="ad_experience_other"]');
        
        adExperienceRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'other') {
                    adExperienceOtherInput.disabled = false;
                    adExperienceOtherInput.focus();
                } else {
                    adExperienceOtherInput.disabled = true;
                    adExperienceOtherInput.value = '';
                }
            });
        });

        // 광고 매체 기타 입력
        const adMediaCheckboxes = document.querySelectorAll('input[name="ad_media"]');
        const adMediaOtherInput = document.querySelector('input[name="ad_media_other"]');
        
        adMediaCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.value === 'other') {
                    adMediaOtherInput.disabled = !this.checked;
                    if (this.checked) {
                        adMediaOtherInput.focus();
                    } else {
                        adMediaOtherInput.value = '';
                    }
                }
            });
        });

        // 현재 진행 예정 매체 기타 입력
        const plannedMediaCheckboxes = document.querySelectorAll('input[name="planned_media"]');
        const plannedMediaOtherInput = document.querySelector('input[name="planned_media_other"]');
        
        plannedMediaCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.value === 'other') {
                    plannedMediaOtherInput.disabled = !this.checked;
                    if (this.checked) {
                        plannedMediaOtherInput.focus();
                    } else {
                        plannedMediaOtherInput.value = '';
                    }
                }
            });
        });
    }

    // 매트릭스 질문에서 한 행당 하나만 선택되도록 처리
    function handleMatrixQuestions() {
        const matrixRows = document.querySelectorAll('.matrix-table tbody tr');
        
        matrixRows.forEach(row => {
            const checkboxes = row.querySelectorAll('input[type="checkbox"]');
            
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    if (this.checked) {
                        // 같은 행의 다른 체크박스들 해제
                        checkboxes.forEach(otherCheckbox => {
                            if (otherCheckbox !== this) {
                                otherCheckbox.checked = false;
                            }
                        });
                    }
                });
            });
        });
    }

    // 폼 제출 처리
    function handleFormSubmission() {
        const form = document.querySelector('.survey-form');
        console.log('폼 요소 찾기:', form);
        
        if (form) {
            console.log('폼 제출 이벤트 리스너 등록');
            form.addEventListener('submit', function(event) {
                console.log('폼 제출 이벤트 발생!');
                event.preventDefault();
                console.log('기본 제출 동작 방지 완료');
                
                // 필수 필드만 확인 (선택적 필드는 제외)
                const requiredFieldsFilled = checkRequiredFieldsFilled(form);
                console.log('필수 필드 채워짐:', requiredFieldsFilled);
                
                // 필수 필드가 없으면 경고만 표시하고 제출은 허용
                if (!requiredFieldsFilled) {
                    console.log('일부 필수 필드가 비어있음 - 경고 표시하지만 제출 허용');
                    // 경고는 표시하지만 제출은 계속 진행
                }
                
                console.log('폼 데이터 수집 시작');
                // 폼 데이터 수집
                const formData = new FormData(form);
                const surveyData = {};
                
                for (let [key, value] of formData.entries()) {
                    // 체크박스 그룹 처리
                    if (key.includes('point') || key.includes('ad_media') || key.includes('planned_media') || key.includes('existing_accounts') || key.includes('style')) {
                        if (!surveyData[key]) {
                            surveyData[key] = [];
                        }
                        surveyData[key].push(value);
                    } else {
                        surveyData[key] = value;
                    }
                }
                
                console.log('수집된 설문 데이터:', surveyData);
                
                // 백엔드 API를 통해 슬랙으로 제출
                console.log('백엔드로 전송 시작');
                submitToBackend(form, surveyData);
                
                // 폼 초기화 (선택사항)
                // form.reset();
            });
        } else {
            console.error('폼 요소를 찾을 수 없습니다!');
        }
    }

    // 필수 필드만 확인하는 함수 (선택적 필드는 제외)
    function checkRequiredFieldsFilled(form) {
        // 필수 필드: 업종(industry), 광고 경험(ad_experience), 연락처(contact_info)
        // 나머지는 선택 사항이므로 체크하지 않음
        
        const industrySelected = form.querySelector('input[name="industry"]:checked');
        const adExperienceSelected = form.querySelector('input[name="ad_experience"]:checked');
        const contactInfo = form.querySelector('input[name="contact_info"]')?.value.trim();
        
        console.log('필수 필드 체크:', {
            industry: !!industrySelected,
            ad_experience: !!adExperienceSelected,
            contact_info: !!contactInfo
        });
        
        // 연락처는 선택 사항이므로 필수 체크에서 제외
        // 최소한 업종이나 광고 경험 중 하나라도 선택되었는지 확인
        return !!(industrySelected || adExperienceSelected);
    }
    
    // 모든 필드가 채워졌는지 확인하는 함수 (기존 함수 유지 - 호환성)
    function checkAllFieldsFilled(form) {
        // 이 함수는 더 이상 사용하지 않지만, 호환성을 위해 유지
        return checkRequiredFieldsFilled(form);
    }

    // 미완성 폼 경고 팝업
    function showIncompleteFormWarning() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        const messageBox = document.createElement('div');
        messageBox.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 95%;
        `;
        
        messageBox.innerHTML = `
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 1.5rem;">이대로 제출하시겠습니까?</h2>
            <p style="color: #666; margin-bottom: 30px; line-height: 1.5;">
                
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button id="continueEditing" style="
                    background: #2c3e50;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 4px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background 0.3s ease;
                " onmouseover="this.style.background='#34495e'" onmouseout="this.style.background='#2c3e50'">
                    계속 작성하기
                </button>
                <button id="submitAnyway" style="
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 4px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background 0.3s ease;
                " onmouseover="this.style.background='#c0392b'" onmouseout="this.style.background='#e74c3c'">
                    무시하고 제출
                </button>
            </div>
        `;
        
        modal.appendChild(messageBox);
        document.body.appendChild(modal);
        
        // 버튼 이벤트
        document.getElementById('continueEditing').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        document.getElementById('submitAnyway').addEventListener('click', () => {
            document.body.removeChild(modal);
            // 실제 제출 진행
            proceedWithSubmission();
        });
        
        return modal;
    }

    // 실제 제출 진행 함수
    function proceedWithSubmission() {
        const form = document.querySelector('.survey-form');
        const formData = new FormData(form);
        const surveyData = {};
        
        for (let [key, value] of formData.entries()) {
            // 체크박스 그룹 처리
            if (key.includes('point') || key.includes('ad_media') || key.includes('planned_media') || key.includes('existing_accounts') || key.includes('style')) {
                if (!surveyData[key]) {
                    surveyData[key] = [];
                }
                surveyData[key].push(value);
            } else {
                surveyData[key] = value;
            }
        }
        
        console.log('설문 데이터:', surveyData);
        
        // 백엔드 API를 통해 슬랙으로 제출
        submitToBackend(form, surveyData);
    }

    // 설문 데이터를 이메일용으로 포맷팅하는 함수
    function formatSurveyDataForEmail(surveyData) {
        let emailContent = '=== 새로운 설문지 제출 ===\n\n';
        
        // 각 질문별로 답변 정리
        Object.keys(surveyData).forEach(key => {
            if (key.startsWith('_') || key === 'message') return; // 내부 필드 제외
            
            // HTML에서 실제 질문 텍스트 가져오기
            const questionElement = document.querySelector(`input[name="${key}"]`)?.closest('.question-card')?.querySelector('.question-title');
            const question = questionElement ? questionElement.textContent.trim() : key;
            
            let answer = surveyData[key];
            
            // 배열인 경우 (체크박스)
            if (Array.isArray(answer)) {
                answer = answer.map(val => {
                    // HTML에서 실제 답변 텍스트 가져오기
                    const optionElement = document.querySelector(`input[name="${key}"][value="${val}"]`)?.closest('label');
                    return optionElement ? optionElement.textContent.trim() : val;
                }).join(', ');
            } else {
                // 단일 값인 경우
                const optionElement = document.querySelector(`input[name="${key}"][value="${answer}"]`)?.closest('label');
                answer = optionElement ? optionElement.textContent.trim() : answer;
            }
            
            emailContent += `Q. ${question}\n`;
            emailContent += `A. ${answer}\n\n`;
        });
        
        emailContent += '=== 설문지 제출 완료 ===';
        
        return emailContent;
    }

    // 백엔드 API를 통해 슬랙으로 제출하는 함수
    function submitToBackend(form, surveyData) {
        console.log('백엔드로 설문 데이터 전송 시작:', surveyData);
        
        // JSON 형식으로 데이터 전송
        fetch('/api/submit-survey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(surveyData)
        })
        .then(response => {
            console.log('서버 응답 상태:', response.status, response.statusText);
            
            // 응답이 JSON인지 확인
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                return response.text().then(text => {
                    console.error('JSON이 아닌 응답:', text);
                    throw new Error('서버가 JSON을 반환하지 않았습니다: ' + text);
                });
            }
            
            return response.json().catch(error => {
                console.error('JSON 파싱 오류:', error);
                return response.text().then(text => {
                    console.error('응답 본문:', text);
                    throw new Error('응답을 파싱할 수 없습니다: ' + text);
                });
            });
        })
        .then(data => {
            console.log('서버 응답 데이터:', data);
            if (data && data.success) {
                // 성공 시 커스텀 메시지 표시 후 홈페이지로 이동
                showCustomSuccessMessage();
            } else {
                const errorMsg = data ? (data.error || '제출에 실패했습니다.') : '알 수 없는 오류가 발생했습니다.';
                throw new Error(errorMsg);
            }
        })
        .catch(error => {
            console.error('제출 오류 상세:', error);
            alert('제출 중 오류가 발생했습니다: ' + (error.message || error));
        });
    }

    // 커스텀 성공 메시지 표시
    function showCustomSuccessMessage() {
        // 성공 메시지 모달 생성
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        const messageBox = document.createElement('div');
        messageBox.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 90%;
        `;
        
        messageBox.innerHTML = `
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 1.5rem;">제출이 완료되었습니다!</h2>
            <p style="color: #666; margin-bottom: 30px; line-height: 1.5;">
                소중한 의견 감사합니다.<br>
                빠른 시일 내에 연락드리겠습니다.
            </p>
            <button onclick="window.location.href='/'" style="
                background: #2c3e50;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 4px;
                font-size: 1rem;
                cursor: pointer;
                transition: background 0.3s ease;
            " onmouseover="this.style.background='#34495e'" onmouseout="this.style.background='#2c3e50'">
                홈페이지로 돌아가기
            </button>
        `;
        
        modal.appendChild(messageBox);
        document.body.appendChild(modal);
        
        // 3초 후 자동으로 홈페이지로 이동
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    }

    // 성공 메시지 표시
    function showSuccessMessage() {
        // 기존 메시지가 있다면 제거
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 성공 메시지 생성
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div style="
                background-color: #d4edda;
                color: #155724;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                margin: 20px 0;
                border: 1px solid #c3e6cb;
            ">
                <h3 style="margin-bottom: 10px;">설문이 성공적으로 제출되었습니다!</h3>
                <p>소중한 의견 감사합니다. 빠른 시일 내에 연락드리겠습니다.</p>
            </div>
        `;
        
        // 제출 섹션 앞에 메시지 삽입
        const submitSection = document.querySelector('.submit-section');
        submitSection.parentNode.insertBefore(successMessage, submitSection);
        
        // 5초 후 메시지 자동 제거
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.remove();
            }
        }, 5000);
    }

    // 폼 초기화 처리
    function handleFormReset() {
        const clearButton = document.querySelector('.clear-button');
        if (clearButton) {
            clearButton.addEventListener('click', function() {
                if (confirm('모든 입력 내용을 지우시겠습니까?')) {
                    // 기타 입력 필드들도 초기화
                    const otherInputs = document.querySelectorAll('.other-input');
                    otherInputs.forEach(input => {
                        input.disabled = true;
                        input.value = '';
                    });
                    
                    // 성공 메시지 제거
                    const successMessage = document.querySelector('.success-message');
                    if (successMessage) {
                        successMessage.remove();
                    }
                }
            });
        }
    }

    // 입력 필드 포커스 효과
    function addFocusEffects() {
        const inputs = document.querySelectorAll('input[type="text"], .other-input');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
                this.parentElement.style.transition = 'transform 0.2s ease';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });
    }

    // 스크롤 애니메이션
    function addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        const questionCards = document.querySelectorAll('.question-card');
        questionCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // 새로고침 방지 기능
    function preventRefresh() {
        let formChanged = false;
        
        // 폼 변경 감지
        const form = document.querySelector('.survey-form');
        if (form) {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('change', () => {
                    formChanged = true;
                });
                input.addEventListener('input', () => {
                    formChanged = true;
                });
            });
        }
        
        // 새로고침/페이지 이탈 시 경고
        window.addEventListener('beforeunload', function(event) {
            if (formChanged) {
                event.preventDefault();
                event.returnValue = '';
                return '';
            }
        });
        
        // 제출 완료 시 플래그 리셋
        const submitButton = document.querySelector('.submit-button');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                formChanged = false;
            });
        }
    }

    // 커스텀 새로고침 경고 팝업
    function showRefreshWarning() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        const messageBox = document.createElement('div');
        messageBox.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 90%;
        `;
        
        messageBox.innerHTML = `
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 1.5rem;">⚠️ 작성 중인 내용이 있습니다</h2>
            <p style="color: #666; margin-bottom: 30px; line-height: 1.5;">
                페이지를 새로고침하거나 나가시면<br>
                작성하신 내용이 모두 사라집니다.
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button id="stayOnPage" style="
                    background: #2c3e50;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 4px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background 0.3s ease;
                " onmouseover="this.style.background='#34495e'" onmouseout="this.style.background='#2c3e50'">
                    계속 작성하기
                </button>
                <button id="leavePage" style="
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 4px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background 0.3s ease;
                " onmouseover="this.style.background='#c0392b'" onmouseout="this.style.background='#e74c3c'">
                    나가기
                </button>
            </div>
        `;
        
        modal.appendChild(messageBox);
        document.body.appendChild(modal);
        
        // 버튼 이벤트
        document.getElementById('stayOnPage').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        document.getElementById('leavePage').addEventListener('click', () => {
            document.body.removeChild(modal);
            window.location.href = '/';
        });
        
        return modal;
    }

    // 초기화 함수들 실행
    console.log('=== 설문 페이지 초기화 시작 ===');
    handleQuestion10Conditional();
    handleOtherInputs();
    handleMatrixQuestions();
    handleFormSubmission();
    handleFormReset();
    addFocusEffects();
    addScrollAnimations();
    preventRefresh();
    
    console.log('설문 페이지 초기화 완료!');
    console.log('폼 요소:', document.querySelector('.survey-form'));
    console.log('제출 버튼:', document.querySelector('.submit-button'));
});
