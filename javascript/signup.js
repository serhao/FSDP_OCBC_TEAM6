import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Handle signup form submission
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim().replace(/[\s\-]/g, '');
    const accessCode = document.getElementById('access-code').value.trim();
    const pin = document.getElementById('pin').value.trim();
    
    // Validate PIN is 6 digits
    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
        showError('PIN must be exactly 6 digits');
        return;
    }
    
    const signupBtn = document.getElementById('signup-btn');
    signupBtn.disabled = true;
    signupBtn.textContent = 'Creating Account...';
    
    try {
        // Check if phone number already exists
        const usersRef = collection(db, 'users');
        const phoneQuery = query(usersRef, where('phone', '==', phone));
        const phoneSnapshot = await getDocs(phoneQuery);
        
        if (!phoneSnapshot.empty) {
            showError('Phone number already registered');
            signupBtn.disabled = false;
            signupBtn.textContent = 'Create Account';
            return;
        }
        
        // Convert access code to email format
        const email = accessCode.includes('@') ? accessCode : `${accessCode}@ocbc.bank`;
        
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, pin);
        const user = userCredential.user;
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email: email,
            username: username,
            phone: phone,
            balance: 0
        });
        
        showSuccess('Account created successfully! Redirecting to login...');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
        
    } catch (error) {
        console.error('Signup error:', error);
        
        let errorMessage = 'Failed to create account. Please try again.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'Access code already taken. Please choose another.';
                break;
            case 'auth/weak-password':
                errorMessage = 'PIN is too weak. Please choose a stronger PIN.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid access code format.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your connection.';
                break;
        }
        
        showError(errorMessage);
        signupBtn.disabled = false;
        signupBtn.textContent = 'Create Account';
    }
});

// Show error message
function showError(message) {
    let messageDiv = document.getElementById('message');
    
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'message';
        document.getElementById('signup-form').insertBefore(
            messageDiv,
            document.getElementById('signup-form').firstChild
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
        document.getElementById('signup-form').insertBefore(
            messageDiv,
            document.getElementById('signup-form').firstChild
        );
    }
    
    messageDiv.className = 'message success';
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
}
