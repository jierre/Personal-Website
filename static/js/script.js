// Initialize Pusher Client (Use your Pusher Key and Cluster)
const pusher = new Pusher('8af230300b27d50ac58e', {
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

    await fetch('/api/send-message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: sender, message: messageText })
    });

    input.value = ''; // Reset input
}

function toggleNav() {
    const navBar = document.getElementById('nav-bar');
    const overlay = document.getElementById('nav-overlay');
    
    navBar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Auto-close sidebar when clicking any nav item on mobile
document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
            document.getElementById('nav-bar').classList.remove('active');
            document.getElementById('nav-overlay').classList.remove('active');
        }
    });
});