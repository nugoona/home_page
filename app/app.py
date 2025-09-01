from flask import Flask, render_template, url_for, redirect
import os

app = Flask(__name__, template_folder='../', static_folder='../static')

# 정적 자산 버전 및 CDN 설정 - Cloud Run 환경변수에서 읽어오기
app.config['STATIC_VERSION'] = os.environ.get('STATIC_VERSION', '1.0.0')
app.config['STATIC_CDN_URL'] = os.environ.get('STATIC_CDN_URL')  # Cloud Run 환경변수 사용

# 템플릿 전역 함수 등록
@app.template_global()
def asset(path):
    """정적 자산 경로 생성 함수"""
    static_url = app.config.get('STATIC_CDN_URL') or '/static'
    version = app.config.get('STATIC_VERSION', '')
    
    # GCS 버킷 사용시 버전 파라미터 완전 제거
    if static_url.startswith('https://storage.googleapis.com'):
        return f"{static_url.rstrip('/')}/{path.lstrip('/')}"
    else:
        # 로컬 개발환경에서만 버전 파라미터 사용
        if version and version.strip():
            return f"{static_url.rstrip('/')}/{path.lstrip('/')}?v={version}"
        else:
            return f"{static_url.rstrip('/')}/{path.lstrip('/')}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/ads')
def ads():
    return render_template('services.html')

@app.route('/contents')
def contents():
    return render_template('portfolio.html')

@app.route('/dashboard')
def dashboard():
    return render_template('technology.html')

@app.route('/proposal')
def proposal():
    return render_template('proposal.html')

@app.route('/survey')
def survey():
    return render_template('survey.html')

@app.route('/contact')
def contact():
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
