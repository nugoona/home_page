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
        this.loadNavigation();
        this.loadFooter();
        this.loadFavicon();
        this.adjustPageMargins();
    }

    loadNavigation() {
        if (this.navLoaded || document.querySelector('.site-nav')) {
            return;
        }

        const navHTML = `
            <nav class="site-nav" style="position: fixed; top: 0; left: 0; width: 100%; height: 70px; background: #eaeaea; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); z-index: 9999; transform: none;">
                <div class="nav-container" style="max-width: 1920px; margin: 0 auto; padding: 0 40px; height: 100%; display: flex; align-items: center; justify-content: space-between; transform: none;">
                    <div class="nav-brand">
                        <a href="index.html">
                            <span class="brand-text">NGN</span>
                        </a>
                    </div>
                    
                    <div class="nav-menu">
                        <a href="index.html" class="nav-link" data-page="home">HOME</a>
                        <a href="services.html" class="nav-link" data-page="services">SNS광고</a>
                        <a href="technology.html" class="nav-link" data-page="technology">대시보드</a>
                        <a href="portfolio.html" class="nav-link" data-page="portfolio">콘텐츠</a>
                        <a href="about.html" class="nav-link" data-page="about">팀소개</a>
                    </div>
                    
                    <div class="nav-logo">
                        <img src="{{ asset('videos/누구나타이틀.gif') }}" alt="NUGUNA">
                    </div>
                </div>
            </nav>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', navHTML);
        
        // 즉시 위치 고정
        const nav = document.querySelector('.site-nav');
        if (nav) {
            nav.style.position = 'fixed';
            nav.style.top = '0';
            nav.style.left = '0';
            nav.style.transform = 'none';
        }
        
        this.setupNavigation();
        this.setActivePage();
        this.navLoaded = true;
    }

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
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('href');
            
            if (linkPage === currentPage) {
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
                
                // body에 padding-top 추가하여 네비게이션과 겹치지 않도록
                document.body.style.paddingTop = `${navHeight}px`;
                
                // 페이지별 첫 번째 섹션 마진 조정
                const firstSection = document.querySelector('section, .services-advantages-section, .index-hero-section');
                if (firstSection) {
                    // 이미 padding-top이 있는 경우 제거
                    if (firstSection.style.paddingTop) {
                        firstSection.style.paddingTop = '0';
                    }
                    // margin-top도 0으로 설정
                    firstSection.style.marginTop = '0';
                }
                
                // index.html의 hero 섹션 높이 조정
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















