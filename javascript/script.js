function showQuiz() {
    document.getElementById("investment-quiz").style.display = "block";
}

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById("login-btn");

    const userId = sessionStorage.getItem('userId');
    const accessCode = sessionStorage.getItem('userAccessCode');

    if (userId && accessCode) {
        loginBtn.textContent = "Logout";
        loginBtn.href = "#";

        loginBtn.addEventListener("click", () => {
            sessionStorage.clear();
            window.location.href = "/";
        })
    } else {
        loginBtn.textContent = "Login";
        loginBtn.href = "/html/login.html"
    }
});
