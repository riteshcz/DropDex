// Gemini AI Chat Application
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const newChatBtn = document.querySelector('.new-chat-btn');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const settingsBtn = document.querySelector('.settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModal = document.querySelector('.close-modal');
    const saveSettings = document.querySelector('.save-settings');
    const regenerateBtn = document.querySelector('.regenerate-btn');
    const microphoneBtn = document.querySelector('.microphone-btn');
    const themeSelect = document.getElementById('theme-select');
    const apiKeyInput = document.getElementById('api-key');
    const modelSelect = document.getElementById('model-select');
    const deleteModal = document.getElementById('delete-modal');
    const cancelDelete = document.querySelector('.cancel-delete');
    const confirmDelete = document.querySelector('.confirm-delete');
    
    // Configuration
    const GEMINI_API_KEY = "AIzaSyAFsWzfDNb-OE9DM7ucb4Nwx2rgr_5Horg";
    const DEFAULT_MODEL = "gemini-2.0-flash";
    
    // State
    let currentChatId = generateId();
    let chats = JSON.parse(localStorage.getItem('gemini-chats')) || {};
    let settings = JSON.parse(localStorage.getItem('gemini-settings')) || {
        apiKey: GEMINI_API_KEY,
        theme: 'system',
        model: DEFAULT_MODEL
    };
    let chatToDelete = null;
    let isTyping = false;
    
    // Initialize
    initTheme();
    loadSettings();
    loadChatHistory();
    displayWelcomeMessage();
    
    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    newChatBtn.addEventListener('click', startNewChat);
    sidebarToggle.addEventListener('click', toggleSidebar);
    menuToggle.addEventListener('click', toggleSidebar);
    settingsBtn.addEventListener('click', openSettings);
    closeModal.addEventListener('click', closeSettings);
    saveSettings.addEventListener('click', saveSettingsToLocalStorage);
    regenerateBtn.addEventListener('click', regenerateResponse);
    microphoneBtn.addEventListener('click', toggleVoiceInput);
    themeSelect.addEventListener('change', changeTheme);
    cancelDelete.addEventListener('click', () => deleteModal.style.display = 'none');
    confirmDelete.addEventListener('click', deleteSelectedChat);
    
    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Functions
    function initTheme() {
        if (settings.theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', settings.theme);
        }
    }
    
    function loadSettings() {
        themeSelect.value = settings.theme;
        apiKeyInput.value = settings.apiKey;
        modelSelect.value = settings.model;
    }
    
    function loadChatHistory() {
        const chatHistory = document.querySelector('.chat-history');
        chatHistory.innerHTML = '';
        
        Object.keys(chats).forEach(chatId => {
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            if (chatId === currentChatId) {
                chatItem.classList.add('active');
            }
            
            // Get first message content as title (or "New Chat" if empty)
            const firstMessage = chats[chatId].messages.find(m => m.role === 'user');
            const title = firstMessage ? firstMessage.content.substring(0, 30) + (firstMessage.content.length > 30 ? '...' : '') : 'New Chat';
            
            chatItem.innerHTML = `
                <div class="chat-item-content">${title}</div>
                <button class="delete-chat-btn" data-chat-id="${chatId}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            chatItem.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-chat-btn')) {
                    loadChat(chatId);
                }
            });
            
            const deleteBtn = chatItem.querySelector('.delete-chat-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showDeleteModal(chatId);
            });
            
            chatHistory.appendChild(chatItem);
        });
    }
    
    function showDeleteModal(chatId) {
        chatToDelete = chatId;
        deleteModal.style.display = 'flex';
    }
    
    function deleteSelectedChat() {
        if (chatToDelete) {
            delete chats[chatToDelete];
            saveChatsToLocalStorage();
            
            if (currentChatId === chatToDelete) {
                startNewChat();
            } else {
                loadChatHistory();
            }
            
            deleteModal.style.display = 'none';
            chatToDelete = null;
        }
    }
    

// Display centered welcome message
function displayWelcomeMessage() {
    if (!chats[currentChatId] || chats[currentChatId].messages.length === 0) {
        // Clear any existing messages first
        chatMessages.innerHTML = '';
        
        // Create welcome container
        const welcomeContainer = document.createElement('div');
        welcomeContainer.className = 'welcome-container';
        welcomeContainer.id = 'welcome-container';
        
        // Create welcome message content
        const welcomeContent = document.createElement('div');
        welcomeContent.className = 'welcome-message';
        
        // Formatted welcome text
        welcomeContent.innerHTML = `
            <h1>Welcome to DexAI</h1>
            <p>How can I help you today?</p>
        `;
        
        welcomeContainer.appendChild(welcomeContent);
        chatMessages.appendChild(welcomeContainer);
    }
}

// Modified sendMessage function to handle welcome message removal
async function sendMessage() {
    if (isTyping) return;
    const message = userInput.value.trim();
    if (!message) return;
    
    // Remove welcome message with animation
    const welcomeContainer = document.getElementById('welcome-container');
    if (welcomeContainer) {
        const welcomeMessage = welcomeContainer.querySelector('.welcome-message');
        welcomeMessage.classList.add('fade-out');
        
        // Wait for animation to complete before removing
        await new Promise(resolve => {
            welcomeMessage.addEventListener('animationend', resolve, { once: true });
        });
        
        welcomeContainer.remove();
    }
    
    // Rest of your existing sendMessage code
    addMessage('user', message, true, false);
    userInput.value = '';
    userInput.style.height = 'auto';
    
    if (!chats[currentChatId]) {
        chats[currentChatId] = { messages: [] };
    }
    chats[currentChatId].messages.push({ role: 'user', content: message });
    saveChatsToLocalStorage();
    loadChatHistory();
    
    sendMessageToAPI(message);
}
    
    
    function startNewChat() {
        currentChatId = generateId();
        if (!chats[currentChatId]) {
            chats[currentChatId] = { messages: [] };
            saveChatsToLocalStorage();
            loadChatHistory();
            clearChatMessages();
            displayWelcomeMessage();
        }
    }
    
    function loadChat(chatId) {
        currentChatId = chatId;
        loadChatHistory();
        clearChatMessages();
        
        if (chats[chatId] && chats[chatId].messages.length > 0) {
            chats[chatId].messages.forEach(message => {
                addMessage(message.role, message.content, false, false);
            });
        } else {
            displayWelcomeMessage();
        }
    }
    
    function clearChatMessages() {
        chatMessages.innerHTML = '';
    }
    
    function toggleSidebar() {
        sidebar.classList.toggle('visible');
    }
    
    function openSettings() {
        settingsModal.style.display = 'flex';
    }
    
    function closeSettings() {
        settingsModal.style.display = 'none';
    }
    
    function saveSettingsToLocalStorage() {
        settings = {
            apiKey: apiKeyInput.value,
            theme: themeSelect.value,
            model: modelSelect.value
        };
        
        localStorage.setItem('gemini-settings', JSON.stringify(settings));
        initTheme();
        closeSettings();
    }
    
    function changeTheme() {
        settings.theme = themeSelect.value;
        initTheme();
    }
    
    function toggleVoiceInput() {
        if (!('webkitSpeechRecognition' in window)) {
            addMessage('assistant', 'Speech recognition is not supported in your browser.', false, true);
            return;
        }
        
        if (microphoneBtn.classList.contains('listening')) {
            // Stop listening
            microphoneBtn.classList.remove('listening');
            recognition.stop();
        } else {
            // Start listening
            microphoneBtn.classList.add('listening');
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            
            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                userInput.value = transcript;
                microphoneBtn.classList.remove('listening');
            };
            
            recognition.onerror = function(event) {
                addMessage('assistant', `Speech recognition error: ${event.error}`, false, true);
                microphoneBtn.classList.remove('listening');
            };
            
            recognition.start();
        }
    }
    
    function regenerateResponse() {
        if (isTyping) return;
        if (!chats[currentChatId] || chats[currentChatId].messages.length === 0) return;
        
        // Get the last user message
        const userMessages = chats[currentChatId].messages.filter(m => m.role === 'user');
        if (userMessages.length === 0) return;
        
        const lastUserMessage = userMessages[userMessages.length - 1];
        
        // Remove the last assistant message (if exists)
        const lastMessage = chats[currentChatId].messages[chats[currentChatId].messages.length - 1];
        if (lastMessage.role === 'assistant') {
            chats[currentChatId].messages.pop();
        }
        
        // Clear chat and re-add all messages except the last assistant message
        clearChatMessages();
        chats[currentChatId].messages.forEach(msg => {
            addMessage(msg.role, msg.content, false, false);
        });
        
        // Send the last user message again
        sendMessageToAPI(lastUserMessage.content);
    }
    
    function sendMessage() {
        if (isTyping) return;
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage('user', message, true, false);
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // Save to chat history
        if (!chats[currentChatId]) {
            chats[currentChatId] = { messages: [] };
        }
        chats[currentChatId].messages.push({ role: 'user', content: message });
        saveChatsToLocalStorage();
        loadChatHistory();
        
        // Send to API
        sendMessageToAPI(message);
    }
    
    // Add this to your existing script.js, replacing the sendMessageToAPI function

async function sendMessageToAPI(message) {
    isTyping = true;
    showTypingIndicator();

    try {
        if (!settings.apiKey) {
            throw new Error('API key is not set. Please configure it in settings.');
        }

        // Get the current chat history
        const chatHistory = chats[currentChatId]?.messages || [];
        
        // Prepare the conversation history for the API
        const contents = chatHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));
        
        // Add the new user message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${settings.model}:generateContent?key=${settings.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: contents,
                // Optional: Add safety settings if needed
                safetySettings: [
                    {
                        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ],
                // Optional: Add generation config for better responses
                generationConfig: {
                    "temperature": 0.9,
                    "topP": 1,
                    "topK": 1,
                    "maxOutputTokens": 2048
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        // Extract the response
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            
            // Hide typing indicator and show the response character by character
            hideTypingIndicator();
            await typeMessage('assistant', aiResponse);
            
            // Save to chat history
            if (!chats[currentChatId]) {
                chats[currentChatId] = { messages: [] };
            }
            chats[currentChatId].messages.push(
                { role: 'user', content: message },
                { role: 'assistant', content: aiResponse }
            );
            saveChatsToLocalStorage();
            loadChatHistory();
        } else {
            throw new Error('Unexpected response format from API');
        }
    } catch (error) {
        hideTypingIndicator();
        addMessage('assistant', `Sorry, I encountered an error: ${error.message}`, true, true);
        console.error('Error:', error);
    } finally {
        isTyping = false;
    }
}

// Also update the regenerateResponse function to use the same context-aware approach
async function regenerateResponse() {
    if (isTyping) return;
    if (!chats[currentChatId] || chats[currentChatId].messages.length === 0) return;

    // Get all messages except the last assistant message (if exists)
    const messages = [...chats[currentChatId].messages];
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage.role === 'assistant') {
        messages.pop();
    }

    // Find the last user message
    const lastUserMessage = messages.reverse().find(m => m.role === 'user');
    if (!lastUserMessage) return;

    // Clear chat and re-add all messages except the last assistant message
    clearChatMessages();
    messages.forEach(msg => {
        addMessage(msg.role, msg.content, false, false);
    });

    // Send the last user message again with full context
    await sendMessageToAPI(lastUserMessage.content);
}

// Replace your existing typeMessage and related functions with this:

let isFirstMessage = true;

async function typeMessage(role, content) {
    return new Promise((resolve) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = `message-avatar ${role}-avatar`;
        avatarDiv.textContent = role === 'user' ? 'U' : 'G';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        contentDiv.appendChild(textDiv);
        chatMessages.appendChild(messageDiv);
        
        // Process the content for formatting
        const formattedContent = formatResponse(content);
        
        if (isFirstMessage) {
            // For first message, show typing animation
            isFirstMessage = false;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = formattedContent;
            
            let userScrolled = false;
            let lastScrollPos = chatMessages.scrollTop;
            
            // Add scroll event listener
            const scrollHandler = () => {
                if (chatMessages.scrollTop < lastScrollPos) {
                    userScrolled = true;
                }
                lastScrollPos = chatMessages.scrollTop;
            };
            
            chatMessages.addEventListener('scroll', scrollHandler);
            
            typeNode(tempDiv, textDiv, () => {
                if (!userScrolled) {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            }).then(() => {
                chatMessages.removeEventListener('scroll', scrollHandler);
                addCodeCopyButtons(textDiv);
                addMessageActions(contentDiv, content);
                resolve();
            });
        } else {
            // For subsequent messages, show immediately
            textDiv.innerHTML = formattedContent;
            addCodeCopyButtons(textDiv);
            addMessageActions(contentDiv, content);
            resolve();
        }
    });
}

function addMessageActions(contentDiv, content) {
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'message-actions';
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'action-btn';
    copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(content);
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
        }, 2000);
    });
    
    actionsDiv.appendChild(copyBtn);
    contentDiv.appendChild(actionsDiv);
}

async function typeNode(sourceNode, targetNode, onUpdate) {
    const nodes = Array.from(sourceNode.childNodes);
    
    for (const node of nodes) {
        if (node.nodeType === Node.TEXT_NODE) {
            await typeText(node.textContent, targetNode, onUpdate);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const clone = node.cloneNode(false);
            targetNode.appendChild(clone);
            
            if (node.tagName === 'PRE') {
                // Show code blocks immediately
                const codeContainer = document.createElement('div');
                codeContainer.className = 'code-container';
                const pre = document.createElement('pre');
                const code = document.createElement('code');
                code.textContent = node.textContent;
                pre.appendChild(code);
                codeContainer.appendChild(pre);
                clone.appendChild(codeContainer);
                addCodeCopyButtons(clone);
                if (onUpdate) onUpdate();
            } else {
                await typeNode(node, clone, onUpdate);
            }
        }
    }
}

async function typeText(text, element, onUpdate) {
    return new Promise((resolve) => {
        let i = 0;
        const speed = 5; // Faster typing speed
        
        function typeWriter() {
            if (i < text.length) {
                const char = text.charAt(i);
                element.appendChild(document.createTextNode(char));
                i++;
                if (onUpdate) onUpdate();
                setTimeout(typeWriter, speed);
            } else {
                resolve();
            }
        }
        
        typeWriter();
    });
}
    
    
    async function typeText(text, element) {
        return new Promise((resolve) => {
            let i = 0;
            const speed = 10; // milliseconds per character
            
            function typeWriter() {
                if (i < text.length) {
                    const char = text.charAt(i);
                    element.appendChild(document.createTextNode(char));
                    i++;
                    
                    // Scroll to bottom as we type
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    // Random delay to make it more natural
                    const delay = char.match(/[.,;!?]/) ? speed * 3 : speed;
                    setTimeout(typeWriter, delay);
                } else {
                    resolve();
                }
            }
            
            typeWriter();
        });
    }
    
    function addCodeCopyButtons(container) {
        const codeContainers = container.querySelectorAll('.code-container');
        
        codeContainers.forEach(container => {
            if (!container.querySelector('.copy-code-btn')) {
                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-code-btn';
                copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
                copyBtn.addEventListener('click', () => {
                    const code = container.querySelector('code').textContent;
                    navigator.clipboard.writeText(code);
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
                    }, 2000);
                });
                container.appendChild(copyBtn);
            }
        });
    }
    
    function addMessage(role, content, scroll = true, instant = false) {
        if (instant) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${role}-message`;
            
            const avatarDiv = document.createElement('div');
            avatarDiv.className = `message-avatar ${role}-avatar`;
            avatarDiv.textContent = role === 'user' ? 'U' : 'G';
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            
            const textDiv = document.createElement('div');
            textDiv.className = 'message-text';
            textDiv.innerHTML = formatResponse(content);
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'message-actions';
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'action-btn';
            copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(content);
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
                }, 2000);
            });
            
            actionsDiv.appendChild(copyBtn);
            contentDiv.appendChild(textDiv);
            contentDiv.appendChild(actionsDiv);
            messageDiv.appendChild(avatarDiv);
            messageDiv.appendChild(contentDiv);
            chatMessages.appendChild(messageDiv);
            
            // Add copy buttons for code blocks
            addCodeCopyButtons(textDiv);
            
            if (scroll) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        } else {
            typeMessage(role, content);
        }
    }
    
    function formatResponse(text) {
        // Process headings
        text = text.replace(/^#\s+(.*$)/gm, '<h1>$1</h1>');
        text = text.replace(/^##\s+(.*$)/gm, '<h2>$1</h2>');
        text = text.replace(/^###\s+(.*$)/gm, '<h3>$1</h3>');
        
        // Process bold and italic
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Process lists
        text = text.replace(/^\*\s+(.*$)/gm, '<li>$1</li>');
        text = text.replace(/^-\s+(.*$)/gm, '<li>$1</li>');
        text = text.replace(/^\d\.\s+(.*$)/gm, '<li>$1</li>');
        
        // Group list items
        text = text.replace(/(<li>.*<\/li>)+/g, function(match) {
            if (match.match(/^\d/)) {
                return '<ol>' + match + '</ol>';
            } else {
                return '<ul>' + match + '</ul>';
            }
        });
        
        // Process code blocks with proper container
        text = text.replace(/```(\w*)\n([^`]+)```/gs, function(match, lang, code) {
            return `<div class="code-container"><pre><code>${code.trim()}</code></pre></div>`;
        });
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Process blockquotes
        text = text.replace(/^>\s+(.*$)/gm, '<blockquote>$1</blockquote>');
        
        // Process horizontal rules
        text = text.replace(/^---$/gm, '<hr>');
        
        // Process paragraphs (text between two newlines)
        let paragraphs = text.split('\n\n');
        let processedText = '';
        
        paragraphs.forEach(para => {
            if (para.trim() === '') return;
            if (!para.startsWith('<') || para.startsWith('<li>') || para.startsWith('<blockquote>') || 
                para.startsWith('<div') || para.startsWith('<h') || para.startsWith('<hr') || para.startsWith('<ul') || para.startsWith('<ol')) {
                processedText += '<p>' + para + '</p>';
            } else {
                processedText += para;
            }
        });
        
        return processedText;
    }
    
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar ai-avatar';
        avatarDiv.textContent = 'G';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingIndicator.appendChild(dot);
        }
        
        contentDiv.appendChild(typingIndicator);
        typingDiv.appendChild(avatarDiv);
        typingDiv.appendChild(contentDiv);
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.parentElement.parentElement.remove();
        }
    }
    
    function saveChatsToLocalStorage() {
        localStorage.setItem('gemini-chats', JSON.stringify(chats));
    }
    
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeSettings();
        }
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
    });
});