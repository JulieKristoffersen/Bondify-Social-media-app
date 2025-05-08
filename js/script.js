const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", function () {
    const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", !isExpanded);
    mobileMenu.classList.toggle("hidden");
    mobileMenu.setAttribute("aria-hidden", isExpanded ? "true" : "false");
});

const login = async (email, password) => {
    try {
        const response = await fetch("https://v2.api.noroff.dev/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const { token } = await response.json();
        localStorage.setItem("token", token);
        console.log("Logged in successfully, token saved!");
        return token;
    } catch (error) {
        console.error("Login failed:", error.message);
    }
};

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();  

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email.endsWith('@noroff.no') && !email.endsWith('@stud.noroff.no')) {
        alert('Please use a valid @noroff.no or @stud.noroff.no email address.');
        return;
    }

    const token = await login(email, password);
    
    if (token) {
        alert("Login successful! Redirecting to feed...");
        window.location.href = 'feed.html';  
    } else {
        alert("Login failed. Please check your credentials.");
    }
});

  
