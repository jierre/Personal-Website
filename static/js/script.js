
// Initialize Pusher Client (Use your Pusher Key and Cluster)
const pusher = new Pusher('8823898587590159aaf2', {
    cluster: 'ap1'
});

// Subscribe to the chat channel
const channel = pusher.subscribe('chat-channel');

// Listen for 'new-message' event broadcasted from Flask
channel.bind('new-message', function(data) {
    const chatBox = document.getElementById('chat-box');
    const msgElement = document.createElement('p');
    msgElement.innerHTML = `<strong>${data.sender_name}:</strong> ${data.message}`;
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

// Send message function
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const usernameInput = document.getElementById('username');
    const messageText = input.value.trim();
    const sender = usernameInput.value.trim() || 'Anonymous';

    if (!messageText) return;

    // 1. Reset input INSTANTLY before network call
    input.value = ''; 

    try {
        // 2. Send request in background
        const response = await fetch('/api/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender: sender, message: messageText })
        });

        if (!response.ok) {
            console.error('Failed to send message to server');
        }
    } catch (error) {
        console.error('Network error:', error);
        // Optional: restore text if sending failed
        // input.value = messageText; 
    }
}

// 1. Prevent the default anchor jump and URL update

document.querySelectorAll('.redirect').forEach(link => {
    link.addEventListener('click', function (e) {
        // 1. Prevent the default anchor jump and URL update
        e.preventDefault();

        // 2. Get the target section ID from the href attribute (e.g., "#home")
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        // 3. Smoothly scroll to the target section
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// TOGGLE NAV SECTION
function toggleNav() {
    const navBar = document.getElementById('nav-bar-container');
    const overlay = document.getElementById('nav-overlay');
    
    navBar.classList.toggle('active');
    overlay.classList.toggle('active');
}


document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
            document.getElementById('nav-bar-container').classList.remove('active');
            document.getElementById('nav-overlay').classList.remove('active');
        }
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth <= 1024) {
        document.getElementById('nav-bar-container').classList.remove('active');
        document.getElementById('nav-overlay').classList.remove('active');
    }
    else {
        document.getElementById('nav-bar-container').classList.add('active');
    }
}) 


// TOGGLE CHAT SECTION
function toggleChat(event) {
    const chatContainer = document.getElementById('chat-container');
    const navBar = document.getElementById('nav-bar-container');
    const overlay = document.getElementById('nav-overlay');

    if (event && event.currentTarget === chatContainer && event.target !== chatContainer) {
        return;
    }

    if (event && event.currentTarget) {
        const rect = event.currentTarget.getBoundingClientRect();
        const originX = rect.left + (rect.width / 2);
        const originY = rect.top + (rect.height / 2);

        chatContainer.style.transformOrigin = `${originX}px ${originY}px`;
    }

    // 3. Toggle active state
    const isActive = chatContainer.classList.toggle('chat-reveal');
    document.body.classList.toggle('no-scroll', isActive)
    
    if (window.innerWidth <= 1024) {
        navBar.classList.toggle('active', !isActive);
        overlay.classList.toggle('active', !isActive);
    }

    if (isActive) {
    setTimeout(() => {
        const chatBox = document.getElementById('chat-box');
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 50); 
}

}