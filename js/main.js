// NGN 홈페이지 공통 요소 로더
// 깔끔하고 간단한 네비게이션과 푸터 관리

class CommonElementsLoader {
    constructor() {
        this.navLoaded = false;
        this.footerLoaded = false;
        this.init();
    }

    init() {
        // DOM 로드 완료 후 실행
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadElements());
        } else {
            this.loadElements();
        }
    }

    loadElements() {
        // 네비게이션은 각 페이지의 인라인에서 처리하므로 JavaScript에서는 제외
        this.setActivePage();
        this.loadFooter();
        this.loadFavicon();
        this.adjustPageMargins();
    }

    // loadNavigation 함수 완전 제거 - 각 페이지에서 인라인으로 처리

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                
                // 현재 페이지와 같은 링크는 클릭하지 않음
                if (href === currentPage) {
                    e.preventDefault();
                    return;
                }
                
                // 부드러운 페이지 전환
                this.smoothPageTransition(href);
            });
        });
    }

    smoothPageTransition(href) {
        // 페이지 전환 시 깜박임 방지
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.style.pointerEvents = 'none';
        });
        
        // 스크롤 방지
        document.body.classList.add('transitioning');
        
        // 부드러운 페이드 아웃
        document.body.style.opacity = '0.95';
        document.body.style.transition = 'opacity 0.15s ease';
        
        setTimeout(() => {
            window.location.href = href;
        }, 50);
    }

    setActivePage() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            // 홈페이지 처리
            if ((currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('index.html')) && linkHref === '/') {
                link.classList.add('active');
            }
            // 다른 페이지들 처리
            else if (linkHref !== '/' && currentPath.includes(linkHref.substring(1))) {
                link.classList.add('active');
            }
        });
    }

    loadFooter() {
        if (this.footerLoaded || document.querySelector('.site-footer')) {
            return;
        }

        const footerHTML = `
            <footer class="site-footer">
                <div class="footer-container">
                    <div class="footer-section">
                        <h5>누구나컴퍼니</h5>
                        <p>대표 최우현</p>
                        <p>주소 : 서울시 노원구 공릉로34길 62</p>
                    </div>
                    <div class="footer-section">
                        <h5>사업 정보</h5>
                        <p>사업자등록번호 : 544-02-02671</p>
                        <p>통신판매업신고번호 : 2023-서울노원-1648</p>
                    </div>
                    <div class="footer-section">
                        <h5>연락처</h5>
                        <p>이메일 : info@ngn.kr</p>
                        <p>전화 : 02-6952-0777</p>
                    </div>
                </div>
            </footer>
        `;

        document.body.insertAdjacentHTML('beforeend', footerHTML);
        this.footerLoaded = true;
    }

    loadFavicon() {
        const faviconData = [
            { rel: 'icon', type: 'image/x-icon', href: "{{ asset('img/favicons/favicon.ico') }}" },
            { rel: 'icon', type: 'image/png', sizes: '32x32', href: "{{ asset('img/favicons/favicon-32x32.png') }}" },
            { rel: 'icon', type: 'image/png', sizes: '16x16', href: "{{ asset('img/favicons/favicon-16x16.png') }}" },
            { rel: 'apple-touch-icon', sizes: '180x180', href: "{{ asset('img/favicons/apple-touch-icon.png') }}" }
        ];

        faviconData.forEach(data => {
            const link = document.createElement('link');
            Object.keys(data).forEach(key => link.setAttribute(key, data[key]));
            document.head.appendChild(link);
        });
    }

    adjustPageMargins() {
        // 네비게이션이 로드된 후 즉시 페이지 콘텐츠 마진 조정
        const checkNav = () => {
            const nav = document.querySelector('.site-nav');
            if (nav) {
                const navHeight = nav.offsetHeight;
                
                // index.html의 hero 섹션 높이 조정 (body padding으로 인해 겹치지 않도록)
                const heroSection = document.querySelector('.index-hero-section');
                if (heroSection) {
                    heroSection.style.height = `calc(100vh - ${navHeight}px)`;
                }
                
                // index.html의 hero video container 높이 조정
                const heroVideoContainer = document.querySelector('.index-hero-video-container');
                if (heroVideoContainer) {
                    heroVideoContainer.style.height = `calc(100vh - ${navHeight}px)`;
                }
            } else {
                // 네비게이션이 아직 로드되지 않았다면 다시 시도
                setTimeout(checkNav, 10);
            }
        };
        
        checkNav();
    }
}















