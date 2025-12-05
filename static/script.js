document.addEventListener('DOMContentLoaded', function() {
    // Daily tip functionality
    const tipButton = document.getElementById('getTipBtn');
    const tipDisplay = document.getElementById('dailyTip');

    tipButton.addEventListener('click', async function() {
        try {
            const response = await fetch('/get_tip');
            const data = await response.json();
            tipDisplay.textContent = data.tip;
        } catch (error) {
            tipDisplay.textContent = "Unable to load tip. Please try again.";
        }
    });

    // Feedback form submission
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackMessage = document.getElementById('feedbackMessage');

    feedbackForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;

        try {
            const response = await fetch('/submit_feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, message })
            });
            const data = await response.json();
            feedbackMessage.textContent = data.message;
            feedbackMessage.style.color = 'green';
            feedbackForm.reset();
        } catch (error) {
            feedbackMessage.textContent = "Error submitting feedback.";
            feedbackMessage.style.color = 'red';
        }
    });

    // Navigation button interactions
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.dataset.target;
            sections.forEach(section => {
                if (section.id === target) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    });
});
