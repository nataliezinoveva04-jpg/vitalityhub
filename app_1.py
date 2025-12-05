# app_1.py
from flask import Flask, render_template

app = Flask(__name__, template_folder='templates_1')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True, port=5001)