from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Simulated data for articles with more content
articles = [
    {
        "id": 1, 
        "title": "10 Daily Exercises for a Healthier You", 
        "content": "Discover simple exercises you can do every day to boost your energy and improve your well-being.",
        "full_content": """
        <h3>Daily Exercise Routine</h3>
        <ol>
            <li><strong>Morning Stretch (5 min):</strong> Start your day with full-body stretching.</li>
            <li><strong>Walking (30 min):</strong> Brisk walking improves cardiovascular health.</li>
            <li><strong>Bodyweight Squats (3 sets of 15):</strong> Strengthen legs and core.</li>
            <li><strong>Push-ups (3 sets of 10):</strong> Build upper body strength.</li>
            <li><strong>Plank (1 min):</strong> Excellent for core stability.</li>
            <li><strong>Jumping Jacks (3 sets of 30):</strong> Great cardio exercise.</li>
            <li><strong>Yoga Poses (10 min):</strong> Improve flexibility and reduce stress.</li>
            <li><strong>Deep Breathing (5 min):</strong> Enhances lung capacity and relaxation.</li>
            <li><strong>Evening Walk (20 min):</strong> Aids digestion and sleep.</li>
            <li><strong>Light Stretching Before Bed (5 min):</strong> Promotes better sleep.</li>
        </ol>
        """
    },
    {
        "id": 2, 
        "title": "Nutrition Tips for Athletes", 
        "content": "Learn about the best foods to fuel your body before, during, and after workouts.",
        "full_content": """
        <h3>Optimal Nutrition for Athletes</h3>
        <h4>Pre-Workout (2-3 hours before):</h4>
        <ul>
            <li>Complex carbs: Oatmeal, brown rice, whole grain bread</li>
            <li>Lean protein: Chicken breast, tofu, Greek yogurt</li>
            <li>Healthy fats: Avocado, nuts, olive oil</li>
        </ul>
        
        <h4>During Workout:</h4>
        <ul>
            <li>Hydration: Water with electrolytes</li>
            <li>Quick energy: Banana, energy gels (for intense/long sessions)</li>
        </ul>
        
        <h4>Post-Workout (within 45 minutes):</h4>
        <ul>
            <li>Protein shake or chocolate milk</li>
            <li>Grilled salmon with sweet potato</li>
            <li>Quinoa salad with vegetables</li>
        </ul>
        """
    },
    {
        "id": 3, 
        "title": "Mental Health and Physical Activity", 
        "content": "Understand how regular sport can reduce stress and enhance your mental clarity.",
        "full_content": """
        <h3>The Mind-Body Connection</h3>
        <p>Physical activity has profound effects on mental health:</p>
        
        <h4>Immediate Benefits:</h4>
        <ul>
            <li><strong>Endorphin Release:</strong> Natural mood elevators</li>
            <li><strong>Stress Reduction:</strong> Lowers cortisol levels</li>
            <li><strong>Improved Sleep:</strong> Better sleep quality and duration</li>
        </ul>
        
        <h4>Long-Term Benefits:</h4>
        <ul>
            <li><strong>Reduced Anxiety:</strong> 30% lower risk with regular exercise</li>
            <li><strong>Improved Self-Esteem:</strong> Achievement and body confidence</li>
            <li><strong>Social Connection:</strong> Team sports and group activities</li>
            <li><strong>Cognitive Function:</strong> Better memory and concentration</li>
        </ul>
        
        <h4>Recommended Activities:</h4>
        <ul>
            <li>Yoga and meditation</li>
            <li>Nature walks (forest bathing)</li>
            <li>Swimming (relaxing and rhythmic)</li>
            <li>Dance classes (fun and social)</li>
        </ul>
        """
    }
]

# Workout plans data
workout_plans = [
    {"id": 1, "name": "Beginner Full Body", "duration": "30 min", "level": "Easy", "calories": "200-300"},
    {"id": 2, "name": "Cardio Blast", "duration": "45 min", "level": "Medium", "calories": "400-500"},
    {"id": 3, "name": "Strength Training", "duration": "60 min", "level": "Hard", "calories": "500-600"},
]

@app.route('/')
def index():
    return render_template('index.html', articles=articles, workout_plans=workout_plans)

@app.route('/get_tip', methods=['GET'])
def get_tip():
    tips = [
        "Stay hydrated throughout the day, especially during workouts.",
        "Always warm up before exercising to prevent injuries.",
        "Combine cardio and strength training for balanced fitness.",
        "Listen to your body and rest when needed.",
        "Set realistic goals to stay motivated.",
        "Incorporate flexibility exercises into your routine.",
        "Track your progress to see improvements over time.",
        "Eat protein within 30 minutes after intense workouts.",
        "Vary your workouts to prevent boredom and plateaus.",
        "Get at least 7-8 hours of quality sleep for recovery."
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

@app.route('/get_article/<int:article_id>', methods=['GET'])
def get_article(article_id):
    article = next((a for a in articles if a['id'] == article_id), None)
    if article:
        return jsonify({
            "title": article["title"],
            "content": article["full_content"]
        })
    return jsonify({"error": "Article not found"}), 404

@app.route('/calculate_bmi', methods=['POST'])
def calculate_bmi():
    data = request.json
    try:
        weight = float(data.get('weight', 0))
        height = float(data.get('height', 0)) / 100  # convert cm to meters
        
        if weight <= 0 or height <= 0:
            return jsonify({"error": "Invalid input values"}), 400
            
        bmi = weight / (height * height)
        
        # Determine category
        if bmi < 18.5:
            category = "Underweight"
            advice = "Consider increasing calorie intake with nutritious foods."
        elif bmi < 25:
            category = "Normal weight"
            advice = "Great! Maintain your healthy lifestyle."
        elif bmi < 30:
            category = "Overweight"
            advice = "Regular exercise and balanced diet recommended."
        else:
            category = "Obese"
            advice = "Consult with a healthcare professional for guidance."
        
        return jsonify({
            "bmi": round(bmi, 1),
            "category": category,
            "advice": advice
        })
    except:
        return jsonify({"error": "Please enter valid numbers"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
