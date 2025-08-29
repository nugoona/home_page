from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='../', static_url_path='')

@app.route('/')
def index():
    return send_from_directory('../', 'index.html')

@app.route('/about')
def about():
    return send_from_directory('../', 'about.html')

@app.route('/services')
def services():
    return send_from_directory('../', 'services.html')

@app.route('/portfolio')
def portfolio():
    return send_from_directory('../', 'portfolio.html')

@app.route('/technology')
def technology():
    return send_from_directory('../', 'technology.html')

@app.route('/proposal')
def proposal():
    return send_from_directory('../', 'proposal.html')

@app.route('/survey')
def survey():
    return send_from_directory('../', 'survey.html')

@app.route('/contact')
def contact():
    return send_from_directory('../', 'contact.html')

# 건강 체크 엔드포인트 (Cloud Run용)
@app.route('/health')
def health():
    return {'status': 'healthy'}, 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port) 