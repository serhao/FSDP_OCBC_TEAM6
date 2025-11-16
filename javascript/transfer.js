import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc, runTransaction, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser = null;

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
        document.getElementById('current-balance').textContent = `$${balance.toFixed(2)}`;
    } catch (error) {
        console.error('Error loading balance:', error);
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
        
        // Perform transaction
        await runTransaction(db, async (transaction) => {
            const senderRef = doc(db, 'users', currentUser.uid);
            const recipientRef = doc(db, 'users', recipientId);
            
            const senderDoc = await transaction.get(senderRef);
            const recipientDocData = await transaction.get(recipientRef);
            
            const senderBalance = senderDoc.exists() ? (senderDoc.data().balance || 0) : 0;
            const recipientBalance = recipientDocData.exists() ? (recipientDocData.data().balance || 0) : 0;
            
            if (senderBalance < amount) {
                throw new Error('Insufficient funds');
            }
            
            // Update balances
            transaction.update(senderRef, { balance: senderBalance - amount });
            transaction.update(recipientRef, { balance: recipientBalance + amount });
        });
        
        showSuccess(`Successfully transferred $${amount.toFixed(2)}`);
        
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
