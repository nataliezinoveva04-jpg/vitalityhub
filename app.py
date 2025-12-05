from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Simulated data for articles
articles = [
    {"id": 1, "title": "10 Daily Exercises for a Healthier You", "content": "Discover simple exercises you can do every day to boost your energy and improve your well-being."},
    {"id": 2, "title": "Nutrition Tips for Athletes", "content": "Learn about the best foods to fuel your body before, during, and after workouts."},
    {"id": 3, "title": "Mental Health and Physical Activity", "content": "Understand how regular sport can reduce stress and enhance your mental clarity."}
]

@app.route('/')
def index():
    return render_template('index.html', articles=articles)

@app.route('/get_tip', methods=['GET'])
def get_tip():
    tips = [
        "Stay hydrated throughout the day, especially during workouts.",
        "Always warm up before exercising to prevent injuries.",
        "Combine cardio and strength training for balanced fitness.",
        "Listen to your body and rest when needed.",
        "Set realistic goals to stay motivated."
    ]
    import random
    return jsonify({"tip": random.choice(tips)})

@app.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    name = data.get('name', 'Anonymous')
    message = data.get('message', '')
    # In a real app, you would save this to a database
    return jsonify({"status": "success", "message": f"Thank you, {name}, for your feedback!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
