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

@app.route('/contact')
def contact():
    return send_from_directory('../', 'contact.html')

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000) 