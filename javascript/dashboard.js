import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = '/';
        return;
    }
    
    // Display user info
    const accessCode = sessionStorage.getItem('userAccessCode') || 'N/A';
    document.getElementById('access-code').textContent = accessCode;
    
    // Load user data from Firestore
    await loadUserData(user.uid);
});

// Load user data
async function loadUserData(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const balance = userData.balance || 0;
            document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;

            const rewards = userData.Reward_Points || 0;
            document.getElementById("rewards").textContent = rewards;
        } else {
            // User doesn't have a Firestore document yet
            document.getElementById('balance').textContent = '$0.00';
            document.getElementById('rewards').textContent = '0';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        document.getElementById('balance').textContent = 'Error loading balance';
        document.getElementById("rewards").textContent = "Error loading rewards";
    }
}

// Transfer button
document.getElementById('transfer-btn').addEventListener('click', () => {
    window.location.href = '/transfer';
});

// Logout button
document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        await signOut(auth);
        sessionStorage.clear();
        window.location.href = '/';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out');
    }
});
