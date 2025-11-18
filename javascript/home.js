document.addEventListener('DOMContentLoaded', () => {
    const options = document.querySelectorAll('.guidance-option');
    const optionsList = document.getElementById('guidance-options-list');
    const dynamicImage = document.getElementById('dynamic-image');

    // Make login button clickable
    const loginButton = document.querySelector('.login-btn');

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            // Navigate the browser to the login page
            window.location.href = './login.html';
        });
    } else {
        console.error('Login button with ID "login-btn" not found.');
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