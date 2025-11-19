import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc, runTransaction, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Fund prices for auto-investment (matching investments.js structure)
const FUND_BASE_PRICES = {
    'lion-global': 2.85,
    'nikko-asia': 1.92,
    'abf-singapore': 1.15,
    'schroder-asian': 3.45,
    'fsm-global': 2.10,
    'eastspring-dragon': 1.78
};

let currentUser = null;
let currentBalance = 0;

// AI Chat variables
let chatSessionId = null;
let awaitingConfirmation = false;
let pendingTransferData = null;

// Speech Recognition variables
let recognition = null;
let isListening = false;
let finalTranscript = '';
let shouldBeRecording = false; // Track if button is being held

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = '/';
        return;
    }
    
    currentUser = user;
    await loadBalance(user.uid);
});

// Load current user balance
async function loadBalance(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        const balance = userDoc.exists() ? (userDoc.data().balance || 0) : 0;
        currentBalance = balance;
        document.getElementById('current-balance').textContent = `$${balance.toFixed(2)}`;
    } catch (error) {
        console.error('Error loading balance:', error);
    }
}

// Initialize chat session
function initChatSession() {
    chatSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

initChatSession();

// AI Chat functionality - Get DOM elements first
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat-btn');
const chatMessages = document.getElementById('chat-messages');

// Initialize Speech Recognition
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.warn('Speech recognition not supported in this browser');
        return;
    }
    
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
        console.log('Recognition actually started');
        isListening = true;
        micBtn.innerHTML = '🔴 Recording...';
        micBtn.style.background = '#dc3545';
        chatInput.placeholder = 'Speak now... (release to send)';
    };
    
    recognition.onend = () => {
        console.log('Recognition ended. shouldBeRecording:', shouldBeRecording, 'finalTranscript:', finalTranscript);
        isListening = false;
        
        // If button is still being held, restart
        if (shouldBeRecording) {
            console.log('Restarting because button still held...');
            try {
                recognition.start();
            } catch (err) {
                console.log('Restart failed:', err);
                shouldBeRecording = false;
            }
            return;
        }
        
        // Button released - finalize
        micBtn.innerHTML = '🎤 Hold to Talk';
        micBtn.style.background = '#ED1C24';
        chatInput.placeholder = 'Type your message here...';
        
        // Send the message if we have text
        const textToSend = finalTranscript.trim();
        if (textToSend) {
            chatInput.value = textToSend;
            setTimeout(() => {
                sendChatMessage();
                finalTranscript = ''; // Reset for next time
            }, 100);
        } else {
            chatInput.value = '';
            finalTranscript = '';
        }
    };
    
    recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
                console.log('Final transcript:', transcript);
            } else {
                interimTranscript += transcript;
                console.log('Interim transcript:', transcript);
            }
        }
        
        // Show both final and interim results
        const displayText = (finalTranscript + interimTranscript).trim();
        chatInput.value = displayText;
        console.log('Current display:', displayText);
    };
    
    recognition.onspeechend = () => {
        // Don't auto-stop anymore - let user control with button release
        console.log('Speech ended, waiting for button release...');
    };
    
    recognition.onerror = (event) => {
        console.log('Speech recognition error:', event.error);
        
        // Only handle critical errors, ignore benign ones
        if (event.error === 'network' || event.error === 'aborted') {
            // These are normal, don't stop or show error
            console.log('Ignoring benign error:', event.error);
            return;
        }
        
        if (event.error === 'no-speech') {
            // No speech is also normal when holding button silently
            console.log('No speech detected (normal)');
            return;
        }
        
        // Only for actual errors, update the UI
        isListening = false;
        micBtn.innerHTML = '🎤 Hold to Talk';
        micBtn.style.background = '#ED1C24';
        chatInput.placeholder = 'Type your message here...';
        
        if (event.error === 'audio-capture') {
            alert('No microphone detected. Please check:\n- Microphone is plugged in\n- Microphone is selected in Windows settings\n- No other app is blocking it');
        } else if (event.error === 'not-allowed') {
            alert('Microphone permission issue. Please:\n1. Check browser microphone permissions\n2. Check Windows microphone privacy settings\n3. Refresh the page');
        } else {
            console.warn('Unhandled speech error:', event.error);
        }
    };
}

// Create microphone button
const micBtn = document.createElement('button');
micBtn.id = 'mic-btn';
micBtn.innerHTML = '🎤 Hold to Talk';
micBtn.style.cssText = 'background-color: #ED1C24; color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer; font-weight: 600; font-size: 14px; transition: background-color 0.2s; margin-right: 10px; user-select: none;';

// Hold-to-talk functionality (works with both mouse and touch)
micBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    console.log('Mouse down - starting recording');
    
    if (!recognition) {
        alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
        return;
    }
    
    shouldBeRecording = true;
    finalTranscript = '';
    chatInput.value = '';
    
    if (!isListening) {
        try {
            recognition.start();
            console.log('Recognition start called');
        } catch (err) {
            console.error('Failed to start recognition:', err);
            if (!err.message || !err.message.includes('already started')) {
                shouldBeRecording = false;
            }
        }
    }
});

micBtn.addEventListener('mouseup', () => {
    console.log('Mouse up - stopping recording');
    shouldBeRecording = false;
    
    if (recognition && isListening) {
        try {
            recognition.stop();
            console.log('Recognition stop called');
        } catch (err) {
            console.log('Stop failed:', err);
        }
    }
});

micBtn.addEventListener('mouseleave', () => {
    console.log('Mouse left button');
    shouldBeRecording = false;
    
    if (recognition && isListening) {
        try {
            recognition.stop();
            console.log('Recognition stopped (mouse left)');
        } catch (err) {
            console.log('Stop failed:', err);
        }
    }
});

// Touch support for mobile
micBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!recognition) {
        alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
        return;
    }
    
    if (!isListening) {
        try {
            recognition.start();
        } catch (err) {
            console.error('Failed to start recognition:', err);
        }
    }
});

micBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (isListening && recognition) {
        recognition.stop();
    }
});

micBtn.addEventListener('touchcancel', (e) => {
    e.preventDefault();
    if (isListening && recognition) {
        recognition.stop();
    }
});

// Add mic button to chat input container
const chatInputContainer = document.querySelector('.chat-input-container');
chatInputContainer.insertBefore(micBtn, chatInput);

// Initialize speech recognition after DOM is ready
initSpeechRecognition();

// Send message on button click
sendChatBtn.addEventListener('click', () => {
    sendChatMessage();
});

// Send message on Enter key
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
});

async function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Check if we're awaiting confirmation
    if (awaitingConfirmation) {
        handleConfirmationResponse(message);
        return;
    }

    // Disable input
    chatInput.disabled = true;
    sendChatBtn.disabled = true;

    // Add user message to chat
    addMessageToChat(message, 'user');
    chatInput.value = '';

    // Show typing indicator
    const typingDiv = addTypingIndicator();

    try {
        // Send to backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                sessionId: chatSessionId,
                userBalance: currentBalance
            })
        });

        const data = await response.json();

        // Remove typing indicator
        typingDiv.remove();

        if (data.error) {
            addMessageToChat('Sorry, I encountered an error. Please try again.', 'bot');
        } else {
            // Add bot response
            if (data.isConfirmation) {
                addMessageToChat(data.message, 'bot', true);
                awaitingConfirmation = true;
                pendingTransferData = data.transferData;
                
                // Add confirmation buttons
                addConfirmationButtons();
            } else {
                addMessageToChat(data.message, 'bot');
            }
        }
    } catch (error) {
        console.error('Chat error:', error);
        typingDiv.remove();
        const errorMsg = 'Sorry, I encountered an error. Please try again or use the manual form below.';
        addMessageToChat(errorMsg, 'bot');
        speak(errorMsg);
    }

    // Re-enable input
    chatInput.disabled = false;
    sendChatBtn.disabled = false;
    chatInput.focus();
}

function addMessageToChat(message, type, isConfirmation = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    if (isConfirmation) {
        messageDiv.classList.add('confirmation-message');
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = message;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageDiv;
}

function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}

function addConfirmationButtons() {
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'confirmation-buttons';
    buttonsDiv.style.cssText = 'display: flex; gap: 10px; margin: 10px 0; justify-content: center;';
    
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Yes, Send Money';
    confirmBtn.style.cssText = 'background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: 600;';
    confirmBtn.onclick = () => handleConfirmationResponse('yes');
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = 'background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: 600;';
    cancelBtn.onclick = () => handleConfirmationResponse('no');
    
    buttonsDiv.appendChild(confirmBtn);
    buttonsDiv.appendChild(cancelBtn);
    chatMessages.appendChild(buttonsDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleConfirmationResponse(response) {
    const confirmed = response.toLowerCase().includes('yes') || response.toLowerCase().includes('confirm');
    
    // Remove confirmation buttons
    const buttons = chatMessages.querySelector('.confirmation-buttons');
    if (buttons) buttons.remove();
    
    if (confirmed && pendingTransferData) {
        // Add user confirmation message
        addMessageToChat('Yes, send the money', 'user');
        
        // Show processing message
        addMessageToChat('Processing your transfer...', 'bot');
        
        // Execute the transfer
        await executeAITransfer(pendingTransferData.recipient, pendingTransferData.amount);
    } else {
        // User cancelled
        addMessageToChat('Cancel', 'user');
        addMessageToChat('Transfer cancelled. How else can I help you?', 'bot');
    }
    
    // Reset confirmation state
    awaitingConfirmation = false;
    pendingTransferData = null;
}

async function executeAITransfer(recipientAccessCode, amount) {
    try {
        // Use existing transfer logic
        const usersRef = collection(db, 'users');
        let querySnapshot;
        
        const isPhoneNumber = /^[\d\s\+\-]+$/.test(recipientAccessCode);
        
        if (isPhoneNumber) {
            const cleanPhone = recipientAccessCode.replace(/[\s\-]/g, '');
            const q = query(usersRef, where('phone', '==', cleanPhone));
            querySnapshot = await getDocs(q);
        } else {
            const recipientEmail = recipientAccessCode.includes('@') ? recipientAccessCode : `${recipientAccessCode}@ocbc.bank`;
            const q = query(usersRef, where('email', '==', recipientEmail));
            querySnapshot = await getDocs(q);
        }
        
        if (querySnapshot.empty) {
            addMessageToChat('❌ Recipient not found. Please check the details and try again.', 'bot');
            return;
        }
        
        const recipientDoc = querySnapshot.docs[0];
        const recipientId = recipientDoc.id;
        
        if (recipientId === currentUser.uid) {
            addMessageToChat('❌ Cannot transfer to yourself.', 'bot');
            return;
        }

        // Get sender's phone number for auto-investment check
        const senderDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const senderPhone = senderDoc.data().phone;
        
        // Perform transaction
        await runTransaction(db, async (transaction) => {
            const senderRef = doc(db, 'users', currentUser.uid);
            const recipientRef = doc(db, 'users', recipientId);
            
            const senderDocTx = await transaction.get(senderRef);
            const recipientDocData = await transaction.get(recipientRef);
            
            const senderBalance = senderDocTx.exists() ? (senderDocTx.data().balance || 0) : 0;
            const recipientBalance = recipientDocData.exists() ? (recipientDocData.data().balance || 0) : 0;
            const recipientData = recipientDocData.data();
            
            if (senderBalance < amount) {
                throw new Error('Insufficient funds');
            }
            
            // Check for auto-investment rules
            const autoInvestRules = recipientData.autoInvestmentRules || [];
            const matchingRule = autoInvestRules.find(rule => rule.sourcePhone === senderPhone);
            
            let balanceAmount = amount;
            let investmentAmount = 0;
            
            if (matchingRule) {
                investmentAmount = (amount * matchingRule.percentage) / 100;
                balanceAmount = amount - investmentAmount;
                
                const fundPrice = await getCurrentFundPrice(matchingRule.fundId);
                const units = investmentAmount / fundPrice;
                
                const existingInvestments = recipientData.investments || [];
                const existingInvestmentIndex = existingInvestments.findIndex(inv => inv.fundId === matchingRule.fundId);
                
                if (existingInvestmentIndex >= 0) {
                    const existing = existingInvestments[existingInvestmentIndex];
                    existingInvestments[existingInvestmentIndex] = {
                        ...existing,
                        units: existing.units + units,
                        invested: existing.invested + investmentAmount,
                        lastUpdated: new Date().toISOString()
                    };
                } else {
                    existingInvestments.push({
                        fundId: matchingRule.fundId,
                        units: units,
                        invested: investmentAmount,
                        purchaseDate: new Date().toISOString(),
                        lastUpdated: new Date().toISOString()
                    });
                }
                
                transaction.update(recipientRef, {
                    balance: recipientBalance + balanceAmount,
                    investments: existingInvestments
                });
            } else {
                transaction.update(recipientRef, { balance: recipientBalance + amount });
            }
            
            transaction.update(senderRef, { balance: senderBalance - amount });
            
            return { autoInvestApplied: false };
        });
        
        // Success!
        addMessageToChat(`✅ Transfer successful! $${amount.toFixed(2)} has been sent to ${recipientAccessCode}.`, 'bot');
        
        // Reload balance
        await loadBalance(currentUser.uid);
        
        // Reset chat session for new conversation
        setTimeout(() => {
            addMessageToChat('Is there anything else I can help you with?', 'bot');
        }, 1000);
        
    } catch (error) {
        console.error('AI Transfer error:', error);
        addMessageToChat(`❌ Transfer failed: ${error.message}. Please try again or use the manual form below.`, 'bot');
    }
}

// Back button
document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = '/dashboard';
});

// Handle transfer form
document.getElementById('transfer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const recipientAccessCode = document.getElementById('recipient').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    
    if (amount <= 0) {
        showError('Please enter a valid amount');
        return;
    }
    
    const submitBtn = document.getElementById('transfer-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    try {
        // Find recipient by access code or phone number
        const usersRef = collection(db, 'users');
        let querySnapshot;
        
        // Check if input is a phone number (contains only digits, +, -, or spaces)
        const isPhoneNumber = /^[\d\s\+\-]+$/.test(recipientAccessCode);
        
        if (isPhoneNumber) {
            // Search by phone number
            const cleanPhone = recipientAccessCode.replace(/[\s\-]/g, '');
            const q = query(usersRef, where('phone', '==', cleanPhone));
            querySnapshot = await getDocs(q);
        } else {
            // Search by access code (email)
            const recipientEmail = recipientAccessCode.includes('@') ? recipientAccessCode : `${recipientAccessCode}@ocbc.bank`;
            const q = query(usersRef, where('email', '==', recipientEmail));
            querySnapshot = await getDocs(q);
        }
        
        if (querySnapshot.empty) {
            showError('Recipient not found');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Transfer';
            return;
        }
        
        const recipientDoc = querySnapshot.docs[0];
        const recipientId = recipientDoc.id;
        
        if (recipientId === currentUser.uid) {
            showError('Cannot transfer to yourself');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Transfer';
            return;
        }
        
        // Get sender's phone number for auto-investment check
        const senderDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const senderPhone = senderDoc.data().phone;
        
        // Perform transaction
        await runTransaction(db, async (transaction) => {
            const senderRef = doc(db, 'users', currentUser.uid);
            const recipientRef = doc(db, 'users', recipientId);
            
            const senderDocTx = await transaction.get(senderRef);
            const recipientDocData = await transaction.get(recipientRef);
            
            const senderBalance = senderDocTx.exists() ? (senderDocTx.data().balance || 0) : 0;
            const recipientBalance = recipientDocData.exists() ? (recipientDocData.data().balance || 0) : 0;
            const recipientData = recipientDocData.data();
            
            if (senderBalance < amount) {
                throw new Error('Insufficient funds');
            }
            
            // Check for auto-investment rules
            const autoInvestRules = recipientData.autoInvestmentRules || [];
            const matchingRule = autoInvestRules.find(rule => rule.sourcePhone === senderPhone);
            
            let balanceAmount = amount;
            let investmentAmount = 0;
            let autoInvestApplied = false;
            
            if (matchingRule) {
                // Calculate amounts
                investmentAmount = (amount * matchingRule.percentage) / 100;
                balanceAmount = amount - investmentAmount;
                autoInvestApplied = true;
                
                // Get current fund price (using simulated price from investments)
                const fundPrice = await getCurrentFundPrice(matchingRule.fundId);
                const units = investmentAmount / fundPrice;
                
                // Update or create investment
                const existingInvestments = recipientData.investments || [];
                const existingInvestmentIndex = existingInvestments.findIndex(inv => inv.fundId === matchingRule.fundId);
                
                if (existingInvestmentIndex >= 0) {
                    // Add to existing investment
                    const existing = existingInvestments[existingInvestmentIndex];
                    existingInvestments[existingInvestmentIndex] = {
                        ...existing,
                        units: existing.units + units,
                        invested: existing.invested + investmentAmount,
                        lastUpdated: new Date().toISOString()
                    };
                } else {
                    // Create new investment
                    existingInvestments.push({
                        fundId: matchingRule.fundId,
                        units: units,
                        invested: investmentAmount,
                        purchaseDate: new Date().toISOString(),
                        lastUpdated: new Date().toISOString()
                    });
                }
                
                transaction.update(recipientRef, {
                    balance: recipientBalance + balanceAmount,
                    investments: existingInvestments
                });
            } else {
                // No auto-investment rule, just add to balance
                transaction.update(recipientRef, { balance: recipientBalance + amount });
            }
            
            // Update sender balance
            transaction.update(senderRef, { balance: senderBalance - amount });
            
            // Don't return auto-invest info to sender
            return { autoInvestApplied: false };
        }).then((result) => {
            // Always show simple success message regardless of recipient's auto-invest rules
            showSuccess(`Successfully transferred $${amount.toFixed(2)}`);
        });
        
        // Reset form and reload balance
        document.getElementById('transfer-form').reset();
        await loadBalance(currentUser.uid);
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 2000);
        
    } catch (error) {
        console.error('Transfer error:', error);
        showError(error.message || 'Transfer failed. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Transfer';
    }
});

// Get current fund price (simplified version for transfer auto-invest)
async function getCurrentFundPrice(fundId) {
    // Use base price with small random variation to simulate real-time pricing
    const basePrice = FUND_BASE_PRICES[fundId] || 1.0;
    const variation = (Math.random() - 0.5) * 0.04; // ±2% variation
    return basePrice * (1 + variation);
}

// Show error message
function showError(message) {
    let messageDiv = document.getElementById('message');
    
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'message';
        document.getElementById('transfer-form').insertBefore(
            messageDiv,
            document.getElementById('transfer-form').firstChild
        );
    }
    
    messageDiv.className = 'message error';
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Show success message
function showSuccess(message) {
    let messageDiv = document.getElementById('message');
    
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'message';
        document.getElementById('transfer-form').insertBefore(
            messageDiv,
            document.getElementById('transfer-form').firstChild
        );
    }
    
    messageDiv.className = 'message success';
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
}
