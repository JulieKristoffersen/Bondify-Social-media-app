import { login, register } from './api.js';

export async function onAuth(event) {
    event.preventDefault();

    const form = event.target;
    const isLogin = event.submitter.dataset.auth === "login";
    const email = form.email.value;
    const password = form.password.value;
    const name = !isLogin ? form.name?.value : "";

    const bio = form.bio?.value || "";
    const avatarUrl = form.avatarUrl?.value || "";
    const avatarAlt = form.avatarAlt?.value || "";
    const bannerUrl = form.bannerUrl?.value || "";
    const bannerAlt = form.bannerAlt?.value || "";
    const venueManager = form.venueManager?.checked || false;

    const submitButton = form.querySelector("button[type='submit']");
    const originalText = submitButton.textContent;
    const errorMsg = document.getElementById("errorMsg");

    if (errorMsg) errorMsg.textContent = "";
    submitButton.disabled = true;
    submitButton.textContent = "Please wait...";

    try {
        if (isLogin) {
            await login(email, password);
        } else {
            await register(name, email, password, bio, avatarUrl, avatarAlt, bannerUrl, bannerAlt, venueManager);
            await login(email, password);
        }

        window.location.href = "/profile";
    } catch (error) {
        console.error("Authentication failed:", error.message);
        if (errorMsg) {
            errorMsg.textContent = error.message;
        } else {
            alert(error.message);
        }
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

export function setAuthListener() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm) {
        loginForm.insertAdjacentHTML("beforeend", `<p id="errorMsg" class="text-red-500 text-sm text-center mt-2"></p>`);
        loginForm.addEventListener("submit", onAuth);
    } else {
        console.error('Login form not found');
    }

    if (registerForm) {
        registerForm.insertAdjacentHTML("beforeend", `<p id="errorMsg" class="text-red-500 text-sm text-center mt-2"></p>`);
        registerForm.addEventListener("submit", onAuth);
    } else {
        console.error('Register form not found');
    }

    // Optional logging if neither form is found
    if (!loginForm && !registerForm) {
        console.error('No login or register form found.');
    }
}

document.addEventListener("DOMContentLoaded", function() {
    setAuthListener();
});

