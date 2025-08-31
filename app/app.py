from flask import Flask, render_template, url_for
import os

app = Flask(__name__, template_folder='../', static_folder='../static')

# 정적 자산 버전 및 CDN 설정
app.config['STATIC_VERSION'] = '1.0.0'
app.config['STATIC_CDN_URL'] = None  # CDN 사용시 URL 설정

# 템플릿 전역 함수 등록
@app.template_global()
def asset(path):
    """정적 자산 경로 생성 함수"""
    static_url = app.config.get('STATIC_CDN_URL') or '/static'
    version = app.config.get('STATIC_VERSION', '1.0.0')
    return f"{static_url}/{path}?v={version}".replace('//', '/')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/portfolio')
def portfolio():
    return render_template('portfolio.html')

@app.route('/technology')
def technology():
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

# 건강 체크 엔드포인트 (Cloud Run용)
@app.route('/health')
def health():
    return {'status': 'healthy'}, 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)