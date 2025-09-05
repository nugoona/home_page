from flask import Flask, render_template, url_for, redirect, request
import os

app = Flask(__name__, template_folder='../', static_folder='../static')

# 정적 자산 버전 및 CDN 설정 - Cloud Run 환경변수에서 읽어오기
app.config['STATIC_VERSION'] = os.environ.get('STATIC_VERSION', '2.0.0')  # 강제 캐시 갱신
app.config['STATIC_CDN_URL'] = os.environ.get('STATIC_CDN_URL')  # Cloud Run 환경변수 사용

# 템플릿 전역 함수 등록
@app.template_global()
def asset(path):
    """정적 자산 경로 생성 함수"""
    static_url = app.config.get('STATIC_CDN_URL') or '/static'
    version = app.config.get('STATIC_VERSION', '')
    
    # GCS 버킷 사용시 버전 파라미터 임시 추가 (캐시 갱신용)
    if static_url.startswith('https://storage.googleapis.com'):
        if version and version.strip():
            return f"{static_url.rstrip('/')}/{path.lstrip('/')}?v={version}"
        else:
            return f"{static_url.rstrip('/')}/{path.lstrip('/')}"
    else:
        # 로컬 개발환경에서만 버전 파라미터 사용
        if version and version.strip():
            return f"{static_url.rstrip('/')}/{path.lstrip('/')}?v={version}"
        else:
            return f"{static_url.rstrip('/')}/{path.lstrip('/')}"

def is_mobile():
    """모바일 디바이스 감지 함수"""
    # URL 파라미터로 강제 모바일 모드 확인
    force_mobile = request.args.get('mobile', '').lower() in ['true', '1', 'yes']
    if force_mobile:
        print("Force mobile mode enabled via URL parameter")
        return True
    
    user_agent = request.headers.get('User-Agent', '').lower()
    mobile_keywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone', 'opera mini', 'iemobile']
    
    # 디버깅을 위한 로그
    print(f"User-Agent: {user_agent}")
    
    is_mobile_device = any(keyword in user_agent for keyword in mobile_keywords)
    print(f"Is Mobile: {is_mobile_device}")
    
    return is_mobile_device

@app.route('/')
def index():
    if is_mobile():
        print("Rendering mobile template: index_mobile.html")
        return render_template('index_mobile.html')
    print("Rendering desktop template: index.html")
    return render_template('index.html')

@app.route('/home')
def home():
    if is_mobile():
        return render_template('index_mobile.html')
    return render_template('index.html')

@app.route('/about')
def about():
    if is_mobile():
        return render_template('about_mobile.html')
    return render_template('about.html')

@app.route('/ads')
def ads():
    if is_mobile():
        return render_template('services_mobile.html')
    return render_template('services.html')

@app.route('/contents')
def contents():
    if is_mobile():
        return render_template('portfolio_mobile.html')
    return render_template('portfolio.html')

@app.route('/dashboard')
def dashboard():
    if is_mobile():
        return render_template('technology_mobile.html')
    return render_template('technology.html')

@app.route('/proposal')
def proposal():
    if is_mobile():
        return render_template('proposal_mobile.html')
    return render_template('proposal.html')

@app.route('/survey')
def survey():
    if is_mobile():
        return render_template('survey_mobile.html')
    return render_template('survey.html')

@app.route('/contact')
def contact():
    if is_mobile():
        return render_template('survey_mobile.html')  # 모바일에서는 설문 페이지로 리다이렉트
    return render_template('contact.html')

# 기존 URL들도 리다이렉트로 유지 (SEO 친화적)
@app.route('/services')
def services_redirect():
    return redirect('/ads')

@app.route('/portfolio')
def portfolio_redirect():
    return redirect('/contents')

@app.route('/technology')
def technology_redirect():
    return redirect('/dashboard')

# HTML 파일명으로도 접근 가능하도록 (리다이렉트)
@app.route('/about.html')
def about_html_redirect():
    return redirect('/about')

@app.route('/services.html')
def services_html_redirect():
    return redirect('/ads')

@app.route('/portfolio.html')
def portfolio_html_redirect():
    return redirect('/contents')

@app.route('/technology.html')
def technology_html_redirect():
    return redirect('/dashboard')

@app.route('/proposal.html')
def proposal_html_redirect():
    return redirect('/proposal')

@app.route('/survey.html')
def survey_html_redirect():
    return redirect('/survey')

@app.route('/contact.html')
def contact_html_redirect():
    return redirect('/contact')

# 건강 체크 엔드포인트 (Cloud Run용)
@app.route('/health')
def health():
    return {'status': 'healthy'}, 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
