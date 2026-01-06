from flask import Flask, render_template, url_for, redirect, request, jsonify
import os
import sys
from pathlib import Path

# 프로젝트 루트 경로를 Python 경로에 추가
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

# .env 파일 로드 (여러 위치에서 시도)
from dotenv import load_dotenv
env_paths = [
    os.path.join(project_root, '.env'),
    os.path.expanduser('~/ngn_homepage/.env'),
    os.path.expanduser('~/.env'),
]
for env_path in env_paths:
    if os.path.exists(env_path):
        print(f".env 파일 로드: {env_path}")
        load_dotenv(env_path)
        break
else:
    print("경고: .env 파일을 찾을 수 없습니다. 환경 변수를 직접 설정하세요.")

from slack_utils import send_survey_notification

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

# SEO 관련 파일들
@app.route('/sitemap.xml')
def sitemap():
    try:
        # 여러 경로에서 시도
        possible_paths = [
            os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'sitemap.xml'),
            os.path.join(os.getcwd(), 'sitemap.xml'),
            'sitemap.xml'
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                with open(path, 'r', encoding='utf-8') as f:
                    return f.read(), 200, {'Content-Type': 'application/xml'}
        
        return "Sitemap not found", 404
    except Exception as e:
        return f"Error loading sitemap: {str(e)}", 500

@app.route('/robots.txt')
def robots():
    try:
        # 여러 경로에서 시도
        possible_paths = [
            os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'robots.txt'),
            os.path.join(os.getcwd(), 'robots.txt'),
            'robots.txt'
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                with open(path, 'r', encoding='utf-8') as f:
                    return f.read(), 200, {'Content-Type': 'text/plain'}
        
        return "Robots.txt not found", 404
    except Exception as e:
        return f"Error loading robots.txt: {str(e)}", 500

# 건강 체크 엔드포인트 (Cloud Run용)
@app.route('/health')
def health():
    return {'status': 'healthy'}, 200

# 테스트 엔드포인트 - 슬랙 설정 확인
@app.route('/api/test-slack', methods=['GET'])
def test_slack():
    """슬랙 웹훅 설정을 테스트하는 엔드포인트"""
    from slack_utils import get_slack_webhook_url
    webhook_url = get_slack_webhook_url()
    
    if webhook_url:
        return jsonify({
            'success': True,
            'message': '슬랙 웹훅 URL이 설정되어 있습니다.',
            'url_preview': webhook_url[:50] + '...' if len(webhook_url) > 50 else webhook_url
        }), 200
    else:
        return jsonify({
            'success': False,
            'message': '슬랙 웹훅 URL이 설정되지 않았습니다. .env 파일을 확인하세요.'
        }), 500

# 설문 제출 엔드포인트
@app.route('/api/submit-survey', methods=['POST', 'OPTIONS'])
def submit_survey():
    """
    설문 제출을 받아 슬랙으로 전송하는 API 엔드포인트
    """
    # CORS preflight 요청 처리
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    
    try:
        print("=== 설문 제출 요청 받음 ===")
        print(f"요청 메서드: {request.method}")
        print(f"Content-Type: {request.content_type}")
        print(f"요청 데이터 (raw): {request.data}")
        
        # JSON 데이터 받기
        data = request.get_json(force=True)  # force=True로 content-type 무시하고 파싱 시도
        
        if not data:
            # FormData로 전송된 경우 처리
            if request.form:
                data = dict(request.form)
                print(f"FormData로 받은 데이터: {data}")
            else:
                print("오류: 데이터가 없습니다.")
                return jsonify({'success': False, 'error': '데이터가 없습니다.'}), 400
        
        print(f"처리할 데이터: {data}")
        
        # 슬랙으로 알림 전송
        print("슬랙으로 알림 전송 시도...")
        success = send_survey_notification(data)
        print(f"슬랙 전송 결과: {success}")
        
        if success:
            print("설문 제출 성공!")
            response = jsonify({'success': True, 'message': '설문이 성공적으로 제출되었습니다.'})
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 200
        else:
            print("슬랙 알림 전송 실패")
            response = jsonify({'success': False, 'error': '슬랙 알림 전송에 실패했습니다.'})
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 500
            
    except Exception as e:
        print(f"설문 제출 처리 중 오류: {str(e)}")
        import traceback
        traceback.print_exc()
        response = jsonify({'success': False, 'error': f'서버 오류: {str(e)}'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
