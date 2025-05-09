import { login, register, getPosts } from './api.js';

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

    try {
        if (isLogin) {
            await login(email, password);
        } else {
            await register(name, email, password, bio, avatarUrl, avatarAlt, bannerUrl, bannerAlt, venueManager);
            await login(email, password);
        }

        const posts = await getPosts();
        console.log("Posts after login:", posts);
        window.location.href = "/profile";
    } catch (error) {
        console.error("Authentication failed:", error.message);
        alert(error.message);
    }
}

export function setAuthListener() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm) {
        loginForm.addEventListener("submit", onAuth);
    }

    if (registerForm) {
        registerForm.addEventListener("submit", onAuth);
    }

    if (!loginForm && !registerForm) {
        console.error('No login or register form found.');
    }
}
