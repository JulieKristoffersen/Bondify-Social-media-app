import { login, register } from './api.js';

export async function onAuth(event) {
    event.preventDefault();

    const form = event.target;
    const isLogin = event.submitter.dataset.auth === "login";
    const email = form.email.value.trim();
    const password = form.password.value;
    const name = !isLogin ? form.name?.value.trim() : "";

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
        if (!email.endsWith("@noroff.no") && !email.endsWith("@stud.noroff.no")) {
            throw new Error("Only @noroff.no or @stud.noroff.no emails are allowed.");
        }

        let loginData;

        if (isLogin) {
            loginData = await login(email, password);
        } else {
            await register(name, email, password, bio, avatarUrl, avatarAlt, bannerUrl, bannerAlt, venueManager);
            loginData = await login(email, password);
        }

        localStorage.setItem("token", loginData.accessToken);
        localStorage.setItem("apiKey", loginData.apiKey);
        localStorage.setItem("userName", loginData.profile.name);

        window.location.href = "../feed/index.html";
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
    }

    if (registerForm) {
        registerForm.insertAdjacentHTML("beforeend", `<p id="errorMsg" class="text-red-500 text-sm text-center mt-2"></p>`);
        registerForm.addEventListener("submit", onAuth);
    }

    if (!loginForm && !registerForm) {
        console.error("No login or register form found.");
    }
}

document.addEventListener("DOMContentLoaded", setAuthListener);
