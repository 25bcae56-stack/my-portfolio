// Scroll Reveal Observer
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up').forEach(el => observer.observe(el));

// Form Submission
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.innerText = "TRANSMITTING...";
    
    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            document.getElementById('successPopup').classList.remove('hidden');
            document.getElementById('contactForm').reset();
            btn.innerText = "SEND MESSAGE";
            loadMessages(); // Refresh the feed from database
        } else {
            btn.innerText = "ERROR - RETRY";
        }
    } catch (err) {
        btn.innerText = "ERROR - RETRY";
    }
});


// Load Messages from SQLite
async function loadMessages() {
    try {
        const response = await fetch('/get_contacts'); // MUST MATCH app.py
        const messages = await response.json();
        const feed = document.getElementById('messageFeed');
        
        feed.innerHTML = messages.map(m => `
            <div style="border-bottom: 1px solid #111; padding: 15px 0; margin-bottom: 10px;">
                <p style="color: #00f3ff; font-weight: bold; font-family: 'JetBrains Mono', monospace;">> FROM: ${m.name.toUpperCase()}</p>
                <p style="color: #444; font-size: 0.6rem; margin-bottom: 5px;">[${m.timestamp}]</p>
                <p style="color: #888; line-height: 1.4; font-family: 'JetBrains Mono', monospace;">${m.message}</p>
            </div>
        `).join('');
    } catch (e) {
        console.log("Feed offline");
    }
}

loadMessages();