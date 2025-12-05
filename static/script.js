document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing scripts...');
    
    // Initialize all features
    initDailyTips();
    initFeedbackForm();
    initBMICalculator();
    initNavigation();
    initProgressTracker();
    initAchievements();
    
    // Initialize Read More buttons - FIXED
    initReadMoreButtons();
    
    // Load initial tip
    loadInitialTip();
});

// ========== DAILY TIPS ==========
function initDailyTips() {
    const tipButton = document.getElementById('getTipBtn');
    const tipDisplay = document.getElementById('dailyTip');

    if (!tipButton || !tipDisplay) return;

    tipButton.addEventListener('click', async function() {
        console.log('Getting daily tip...');
        tipButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        tipButton.disabled = true;
        
        try {
            const response = await fetch('/get_tip');
            if (!response.ok) throw new Error('Network error');
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
            console.error('Error loading tip:', error);
            tipDisplay.textContent = "Tip: Consistency is the key to success in fitness!";
            tipDisplay.style.color = '#e74c3c';
        } finally {
            tipButton.innerHTML = '<i class="fas fa-lightbulb"></i> Get New Tip';
            tipButton.disabled = false;
        }
    });
}

function loadInitialTip() {
    const tipDisplay = document.getElementById('dailyTip');
    if (tipDisplay && tipDisplay.textContent.includes('Click the button')) {
        const initialTips = [
            "Start your day with a glass of water to boost metabolism.",
            "A 30-minute walk daily can improve heart health by 40%.",
            "Strength training 2-3 times per week builds muscle and bone density.",
            "Sleep 7-8 hours nightly for optimal recovery and performance."
        ];
        const randomTip = initialTips[Math.floor(Math.random() * initialTips.length)];
        tipDisplay.textContent = randomTip;
    }
}

// ========== READ MORE BUTTONS - FIXED ==========
function initReadMoreButtons() {
    console.log('Initializing Read More buttons...');
    
    // Get ALL read more buttons on the page
    const readMoreButtons = document.querySelectorAll('.read-more');
    const modal = document.getElementById('articleModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelector('.close-modal');
    
    console.log(`Found ${readMoreButtons.length} Read More buttons`);

    // Add click event to each button
    readMoreButtons.forEach((button, index) => {
        button.addEventListener('click', async function(event) {
            event.preventDefault();
            console.log(`Read More button ${index + 1} clicked`);
            
            // Show loading state
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            button.disabled = true;
            
            try {
                // Get article ID from data attribute or index
                const articleId = this.getAttribute('data-article-id') || (index + 1);
                console.log(`Fetching article ${articleId}...`);
                
                const response = await fetch(`/get_article/${articleId}`);
                if (!response.ok) throw new Error('Article not found');
                
                const data = await response.json();
                console.log('Article data received:', data.title);
                
                // Display article in modal
                modalContent.innerHTML = `
                    <h3 style="color: #1a2980; margin-bottom: 20px;">${data.title}</h3>
                    <div class="article-full-content" style="line-height: 1.8; font-size: 1.1rem;">
                        ${data.content}
                    </div>
                    <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 10px;">
                        <h4 style="color: #26d0ce;">Key Takeaways:</h4>
                        <ul style="margin-top: 10px;">
                            <li>Apply these tips to your daily routine</li>
                            <li>Share with friends and family</li>
                            <li>Track your progress weekly</li>
                        </ul>
                    </div>
                `;
                
                // Show modal with animation
                modal.style.display = 'flex';
                modal.style.animation = 'fadeIn 0.3s';
                
                unlockAchievement('Knowledge Seeker');
            } catch (error) {
                console.error('Error loading article:', error);
                modalContent.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 20px;"></i>
                        <h3>Unable to Load Article</h3>
                        <p>Please check your connection and try again.</p>
                        <button class="btn" onclick="this.parentElement.parentElement.innerHTML=''">Close</button>
                    </div>
                `;
                modal.style.display = 'flex';
            } finally {
                // Reset button state
                button.innerHTML = '<i class="fas fa-book-reader"></i> Read More';
                button.disabled = false;
            }
        });
    });

    // Close modal functionality
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.animation = 'fadeOut 0.3s';
            setTimeout(() => {
                modal.style.display = 'none';
                modalContent.innerHTML = '';
            }, 300);
        });
    }

    // Close modal when clicking outside
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.animation = 'fadeOut 0.3s';
                setTimeout(() => {
                    modal.style.display = 'none';
                    modalContent.innerHTML = '';
                }, 300);
            }
        });
    }
}

// ========== FEEDBACK FORM ==========
function initFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackMessage = document.getElementById('feedbackMessage');

    if (!feedbackForm) return;

    feedbackForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;

        feedbackMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        feedbackMessage.style.color = '#1a2980';

        try {
            const response = await fetch('/submit_feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, message })
            });
            
            if (!response.ok) throw new Error('Submission failed');
            
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
}

// ========== BMI CALCULATOR ==========
function initBMICalculator() {
    const bmiForm = document.getElementById('bmiForm');
    const bmiResult = document.getElementById('bmiResult');

    if (!bmiForm) return;

    bmiForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const weight = document.getElementById('weight').value;
        const height = document.getElementById('height').value;

        bmiResult.innerHTML = '<div style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Calculating...</div>';
        bmiResult.style.display = 'block';

        try {
            const response = await fetch('/calculate_bmi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ weight, height })
            });
            
            const data = await response.json();
            
            if (data.error) {
                bmiResult.innerHTML = `<div style="color: #e74c3c; padding: 15px; background: #ffeaea; border-radius: 10px;">
                    <i class="fas fa-exclamation-triangle"></i> ${data.error}
                </div>`;
            } else {
                // Determine color based on BMI
                let color = '#2ecc71'; // green for normal
                if (data.bmi >= 25) color = '#f39c12'; // orange for overweight
                if (data.bmi >= 30) color = '#e74c3c'; // red for obese
                if (data.bmi < 18.5) color = '#3498db'; // blue for underweight
                
                bmiResult.innerHTML = `
                    <div style="padding: 20px; background: ${color}10; border-left: 5px solid ${color}; border-radius: 10px;">
                        <h4 style="color: ${color}; margin-bottom: 15px;">Your BMI Results:</h4>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
                            <div style="text-align: center;">
                                <div style="font-size: 2rem; font-weight: bold; color: ${color};">${data.bmi}</div>
                                <div style="font-size: 0.9rem; color: #666;">BMI Score</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: bold; color: ${color};">${data.category}</div>
                                <div style="font-size: 0.9rem; color: #666;">Category</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 1.2rem; color: ${color};"><i class="fas fa-heart"></i></div>
                                <div style="font-size: 0.9rem; color: #666;">Health</div>
                            </div>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 8px;">
                            <strong>Advice:</strong> ${data.advice}
                        </div>
                    </div>
                `;
                unlockAchievement('Health Tracker');
            }
        } catch (error) {
            bmiResult.innerHTML = '<div style="color: #e74c3c;">Error calculating BMI. Please try again.</div>';
        }
    });
}

// ========== NAVIGATION ==========
function initNavigation() {
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
}

// ========== PROGRESS TRACKER ==========
function initProgressTracker() {
    const progressFill = document.getElementById('progressFill');
    if (!progressFill) return;
    
    let progress = localStorage.getItem('vitalityhub_progress') || 0;
    progressFill.style.width = `${progress}%`;
    
    // Update progress on various interactions
    const interactiveElements = document.querySelectorAll('.btn, .nav-btn, .read-more');
    interactiveElements.forEach(element => {
        element.addEventListener('click', function() {
            if (Math.random() > 0.6) { // 40% chance to increase progress
                progress = Math.min(100, parseFloat(progress) + Math.random() * 5);
                progressFill.style.width = `${progress}%`;
                localStorage.setItem('vitalityhub_progress', progress);
                
                if (progress >= 100) {
                    unlockAchievement('Fitness Master');
                }
            }
        });
    });
}

// ========== ACHIEVEMENTS SYSTEM ==========
function initAchievements() {
    window.unlockAchievement = function(name) {
        if (!localStorage.getItem('achievement_' + name)) {
            localStorage.setItem('achievement_' + name, 'unlocked');
            showNotification(`Achievement Unlocked: ${name}!`);
            
            // Add to achievements list
            const achievementsList = document.getElementById('achievementsList');
            if (achievementsList) {
                const achievement = document.createElement('div');
                achievement.className = 'achievement';
                achievement.innerHTML = `
                    <i class="fas fa-trophy" style="color: #f39c12;"></i> 
                    <span>${name}</span>
                    <small style="margin-left: auto; color: #666;">Just now</small>
                `;
                achievementsList.appendChild(achievement);
                
                // Add animation
                achievement.style.animation = 'slideIn 0.5s ease';
            }
        }
    };
    
    // Load existing achievements
    const achievementsList = document.getElementById('achievementsList');
    if (achievementsList) {
        const achievements = ['Welcome to VitalityHub!'];
        achievements.forEach(ach => {
            const div = document.createElement('div');
            div.className = 'achievement';
            div.innerHTML = `<i class="fas fa-star" style="color: #26d0ce;"></i> ${ach}`;
            achievementsList.appendChild(div);
        });
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(to right, #1a2980, #26d0ce);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 1001;
        animation: slideInRight 0.5s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 350px;
    `;
    notification.innerHTML = `
        <i class="fas fa-trophy" style="font-size: 1.2rem;"></i>
        <div>${message}</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// Add animation styles
(function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
})();
