import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const accessCode = document.getElementById('access-code').value.trim();
    const pin = document.getElementById('pin').value.trim();
    
    // Convert access code to email format for Firebase Auth
    const email = accessCode.includes('@') ? accessCode : `${accessCode}@ocbc.bank`;
    
    try {
        // Show loading state
        const loginBtn = document.getElementById('login-btn');
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';
        
        // Sign in with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, pin);
        const user = userCredential.user;
        
        console.log('Login successful:', user.uid);
        
        // Store user info in session
        sessionStorage.setItem('userAccessCode', accessCode);
        sessionStorage.setItem('userId', user.uid);
        
        // Redirect to dashboard or home page
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Login error:', error);
        
        // Display error message
        let errorMessage = 'Login failed. Please try again.';
        
        switch (error.code) {
            case 'auth/invalid-credential':
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                errorMessage = 'Invalid Access Code or PIN.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Please try again later.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your connection.';
                break;
        }
        
        showError(errorMessage);
        
        // Reset button
        const loginBtn = document.getElementById('login-btn');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
});

// Show error message
function showError(message) {
    let errorDiv = document.getElementById('error-message');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.style.cssText = `
            background-color: #fee;
            color: #c00;
            padding: 12px;
            border-radius: 5px;
            margin-bottom: 20px;
            border: 1px solid #fcc;
        `;
        document.getElementById('login-form').insertBefore(
            errorDiv, 
            document.getElementById('login-form').firstChild
        );
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Hide error after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}
