function toggleAIChat() {
    const chatWindow = document.getElementById('ai-chat-window');
    chatWindow.classList.toggle('ai-chat-hidden');
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        askAssistant();
    }
}

async function askAssistant() {
    const queryInput = document.getElementById('aiQuery');
    const messagesContainer = document.getElementById('ai-chat-messages');
    const question = queryInput.value.trim();

    if (!question) return;

    // 1. Append User Message (Left)
    appendMessage(question, 'user');
    queryInput.value = '';

    // 2. Append Temporary Loading Indicator
    const loadingMessage = appendMessage('Thinking...', 'ai');

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question })
        });

        const data = await res.json();
        
        // 3. Update loading message with final response
        loadingMessage.innerHTML = marked.parse(data.answer) || 'No response received.';
    } catch (err) {
        loadingMessage.innerHTML = 'Error getting response.';
    }

    scrollToBottom();
}

function appendMessage(text, sender) {
    const messagesContainer = document.getElementById('ai-chat-messages');
    const messageElement = document.createElement('div');
    
    messageElement.classList.add('ai-message', sender);
    messageElement.innerText = text;
    
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
    
    return messageElement;
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('ai-chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}