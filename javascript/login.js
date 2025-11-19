import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function applyPendingRewards(userId) {
    const pending = Number(sessionStorage.getItem("pendingRewards") || 0);

    if (pending > 0) {
        const userRef = doc(db, "users", userId);

        await updateDoc(userRef, {
            Reward_Points: increment(pending)
        });

        console.log(`Applied ${pending} pending reward points to ${userId}`);

    }
}

    // Make sign up button clickable
    const signupButton = document.querySelector('.signup-btn');

    if (signupButton) {
        signupButton.addEventListener('click', () => {
            // Navigate the browser to the signup page
            window.location.href = './signup.html';
        });
    } else {
        console.error('Sign up button with ID "signup-btn" not found.');
    }

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
        sessionStorage.setItem('userId', user.Reward_Points);

        localStorage.setItem('isLoggedIn', 'true');

        await applyPendingRewards(user.uid);
        
        // Redirect to dashboard or home page
        window.location.href = '/html/dashboard.html';
        
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

// TEST ONLY - Create test account
document.getElementById('create-test-btn').addEventListener('click', async () => {
    const btn = document.getElementById('create-test-btn');
    btn.disabled = true;
    btn.textContent = 'Creating...';
    
    try {
        const email = '676767@ocbc.bank';
        const password = '676767';
        
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email: email,
            username: 'Infinite Money',
            phone: '99999999',
            balance: 100000,
            Reward_Points: 0
        });
        
        alert('Test account created! Access Code: 676767, PIN: 676767');
        btn.textContent = 'Account Created!';
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            alert('Test account already exists! Use Access Code: 676767, PIN: 676767');
        } else {
            alert('Error: ' + error.message);
        }
        btn.disabled = false;
        btn.textContent = 'Create Test Account (676767)';
    }
});
