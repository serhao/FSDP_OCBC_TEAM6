document.addEventListener('DOMContentLoaded', () => {
    const options = document.querySelectorAll('.guidance-option');
    const optionsList = document.getElementById('guidance-options-list');
    const dynamicImage = document.getElementById('dynamic-image');

// --- Authentication Logic: Dashboard/Login/Logout Toggle ---
const authButton = document.getElementById('auth-btn'); 
const dashboardButton = document.getElementById('dashboard-btn'); 

const updateAuthButtons = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
        // LOGGED IN STATE: Show Logout and Dashboard
        authButton.textContent = 'Logout';
        dashboardButton.style.display = 'flex';
    } else {
        // LOGGED OUT STATE: Show Login and Hide Dashboard
        authButton.textContent = 'Login';
        dashboardButton.style.display = 'none';
    }
};

// Function to handle the click (either login or logout)
const handleAuthClick = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
        // **LOGOUT FUNCTIONALITY**
        localStorage.removeItem('isLoggedIn'); 
        window.location.reload(); 
    } else {
        // **LOGIN FUNCTIONALITY**
        window.location.href = './login.html';
    }
};

const handleDashboardClick = () => {
    // Navigates the user to the dashboard page
    window.location.href = './dashboard.html'; 
};

if (authButton && dashboardButton) {
    updateAuthButtons(); // Set initial state
    authButton.addEventListener('click', handleAuthClick);
    dashboardButton.addEventListener('click', handleDashboardClick);

} else if (authButton) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    authButton.textContent = isLoggedIn ? 'Logout' : 'Login';
    authButton.addEventListener('click', handleAuthClick);
}

    // Function to set the image source from a link's data-attribute
    const setImageSource = (link) => {
        const imageSource = link.getAttribute('data-image');
        dynamicImage.style.opacity = 0;

        setTimeout(() => {
            dynamicImage.src = imageSource;
            dynamicImage.style.opacity = 1;
        }, 100);
    };

    const permanentActiveLink = document.querySelector('.guidance-option.active-link');

    // 1. Set the initial image source based on the active link
    if (permanentActiveLink) {
        setImageSource(permanentActiveLink);
    }

    // 2. Add event listeners to all guidance options
    options.forEach(option => {
        
        // --- Hover In (mouseenter) ---
        option.addEventListener('mouseenter', () => {
            // A. Dimming: Add class to parent to enable CSS dimming of others
            optionsList.classList.add('is-hovering');

            // B. Focus: Remove 'active-hover' from all
            options.forEach(o => o.classList.remove('active-hover'));
            option.classList.add('active-hover');

            // C. Image Swap: Set the new image source
            setImageSource(option);
        });

        // --- Hover Out ---
        option.addEventListener('mouseleave', () => {
            // A. Dimming: Remove dimming class
            optionsList.classList.remove('is-hovering');

            // B. Focus: Remove the hover class from all
            options.forEach(o => o.classList.remove('active-hover'));

            // C. Image Reset: Reset to the default image
            if (permanentActiveLink) {
                setImageSource(permanentActiveLink);
            }
        });
    });
});