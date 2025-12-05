document.addEventListener('DOMContentLoaded', function() {
    // Daily tip functionality
    const tipButton = document.getElementById('getTipBtn');
    const tipDisplay = document.getElementById('dailyTip');

    tipButton.addEventListener('click', async function() {
        tipButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        tipButton.disabled = true;
        
        try {
            const response = await fetch('/get_tip');
            const data = await response.json();
            tipDisplay.textContent = data.tip;
            
            // Show animation
            tipDisplay.style.animation = 'none';
            setTimeout(() => {
                tipDisplay.style.animation = 'fadeIn 0.5s';
            }, 10);
            
            // Unlock achievement
            unlockAchievement('Daily Tip Collector');
        } catch (error) {
            tipDisplay.textContent = "Tip of the day: Consistency is key to success!";
        } finally {
            tipButton.innerHTML = '<i class="fas fa-lightbulb"></i> Get New Tip';
            tipButton.disabled = false;
        }
    });

    // Feedback form submission
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackMessage = document.getElementById('feedbackMessage');

    feedbackForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;

        feedbackMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        feedbackMessage.style.color = 'var(--primary)';

        try {
            const response = await fetch('/submit_feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, message })
            });
            const data = await response.json();
            feedbackMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${data.message}`;
            feedbackMessage.style.color = '#2ecc71';
            feedbackForm.reset();
            
            unlockAchievement('Feedback Contributor');
        } catch (error) {
            feedbackMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error submitting feedback.';
            feedbackMessage.style.color = '#e74c3c';
        }
    });

    // BMI Calculator
    const bmiForm = document.getElementById('bmiForm');
    const bmiResult = document.getElementById('bmiResult');

    bmiForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const weight = document.getElementById('weight').value;
        const height = document.getElementById('height').value;

        try {
            const response = await fetch('/calculate_bmi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ weight, height })
            });
            const data = await response.json();
            
            if (data.error) {
                bmiResult.innerHTML = `<div style="color: #e74c3c;">${data.error}</div>`;
            } else {
                bmiResult.innerHTML = `
                    <h4>Your Results:</h4>
                    <p><strong>BMI:</strong> ${data.bmi}</p>
                    <p><strong>Category:</strong> ${data.category}</p>
                    <p><strong>Advice:</strong> ${data.advice}</p>
                `;
                unlockAchievement('Health Tracker');
            }
            bmiResult.style.display = 'block';
        } catch (error) {
            bmiResult.innerHTML = '<div style="color: #e74c3c;">Error calculating BMI</div>';
            bmiResult.style.display = 'block';
        }
    });

    // Read More buttons for articles
    const readMoreButtons = document.querySelectorAll('.read-more');
    const modal = document.getElementById('articleModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelector('.close-modal');

    readMoreButtons.forEach((button, index) => {
        button.addEventListener('click', async function() {
            try {
                const response = await fetch(`/get_article/${index + 1}`);
                const data = await response.json();
                
                modalContent.innerHTML = `
                    <h3>${data.title}</h3>
                    <div class="article-full-content">${data.content}</div>
                `;
                modal.style.display = 'flex';
                unlockAchievement('Knowledge Seeker');
            } catch (error) {
                modalContent.innerHTML = '<p>Error loading article. Please try again.</p>';
                modal.style.display = 'flex';
            }
        });
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Navigation button interactions
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const target = this.dataset.target;
            sections.forEach(section => {
                if (section.id === target) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    });

    // Set first nav button as active
    if (navButtons.length > 0) {
        navButtons[0].classList.add('active');
    }

    // Progress tracker simulation
    const progressFill = document.getElementById('progressFill');
    let progress = 0;
    
    function updateProgress() {
        progress += Math.random() * 10;
        if (progress > 100) {
            progress = 100;
            unlockAchievement('Fitness Master');
        }
        progressFill.style.width = `${progress}%`;
    }
    
    // Simulate progress when buttons are clicked
    const allButtons = document.querySelectorAll('.btn, .nav-btn, .read-more');
    allButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (Math.random() > 0.7) { // 30% chance to update progress
                updateProgress();
            }
        });
    });

    // Achievement system
    const achievements = new Set();
    
    function unlockAchievement(name) {
        if (!achievements.has(name)) {
            achievements.add(name);
            showNotification(`Achievement Unlocked: ${name}!`);
            
            // Add to achievements list
            const achievementsList = document.getElementById('achievementsList');
            if (achievementsList) {
                const div = document.createElement('div');
                div.className = 'achievement';
                div.innerHTML = `<i class="fas fa-trophy"></i> ${name}`;
                achievementsList.appendChild(div);
            }
        }
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(to right, var(--primary), var(--secondary));
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 1001;
            animation: slideIn 0.5s ease;
        `;
        notification.innerHTML = `<i class="fas fa-bell"></i> ${message}`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Initialize with a daily tip
    tipButton.click();
});
