// API base endpoints
export const API_BASE = "https://v2.api.noroff.dev";
export const API_AUTH = "/auth";
export const API_REGISTER = "/register";
export const API_LOGIN = "/login";
export const API_KEY_URL = "/create-api-key";

// LocalStorage utilities
export function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function load(key) {
    return JSON.parse(localStorage.getItem(key));
}

// Fetch posts (requires login + API key)
export async function getPosts() {
    const token = load("token");
    const apiKey = load("apiKey");

    if (!token || !apiKey) {
        throw new Error("Missing authentication token or API key");
    }

    const response = await fetch(`${API_BASE}/social/posts`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "X-API-Key": apiKey,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }

    return await response.json();
}

// Get or create API key (after login)
export async function getAPIKey() {
    const existingKey = load("apiKey");
    if (existingKey) return existingKey;

    const token = load("token");
    if (!token) throw new Error("Token is missing.");

    const response = await fetch(API_BASE + API_AUTH + API_KEY_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.ok) {
        const result = await response.json();
        const apiKey = result.data.key;
        save("apiKey", apiKey);
        return apiKey;
    }

    console.error(await response.json());
    throw new Error("Could not register for an API key!");
}

// Register user (with optional fields)
export async function register(name, email, password, bio = "", avatarUrl = "", avatarAlt = "", bannerUrl = "", bannerAlt = "", venueManager = false) {
    const payload = {
        name,
        email,
        password,
        bio,
        avatar: avatarUrl ? { url: avatarUrl, alt: avatarAlt || "" } : undefined,
        banner: bannerUrl ? { url: bannerUrl, alt: bannerAlt || "" } : undefined,
        venueManager,
    };

    const response = await fetch(API_BASE + API_AUTH + API_REGISTER, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(payload)
    });

    if (response.ok) {
        return await response.json();
    }

    const error = await response.json();
    console.error("Registration error:", error);
    throw new Error("Could not register the account");
}

// Login user (with optional holidaze param)
export async function login(email, password) {
    const response = await fetch(`${API_BASE + API_AUTH + API_LOGIN}?_holidaze=true`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const { accessToken, ...profile } = (await response.json()).data;
        save("token", accessToken);
        save("profile", profile);

        const apiKey = await getAPIKey();
        return profile;
    }

    const error = await response.json();
    console.error("Login error:", error);
    throw new Error("Could not login to the account");
}

// Auth handler (used by form)
export async function onAuth(event) {
    event.preventDefault();

    const form = event.target;
    const name = form.name?.value;
    const email = form.email.value;
    const password = form.password.value;
    const bio = form.bio?.value || "";
    const avatarUrl = form.avatarUrl?.value || "";
    const avatarAlt = form.avatarAlt?.value || "";
    const bannerUrl = form.bannerUrl?.value || "";
    const bannerAlt = form.bannerAlt?.value || "";
    const venueManager = form.venueManager?.checked || false;

    try {
        if (event.submitter.dataset.auth === "login") {
            await login(email, password);
        } else {
            await register(name, email, password, bio, avatarUrl, avatarAlt, bannerUrl, bannerAlt, venueManager);
            await login(email, password);
        }

        // Success – redirect
        const posts = await getPosts();
        console.log("Posts after login:", posts);
        window.location.href = "/profile";
    } catch (error) {
        console.error("Authentication failed:", error.message);
        alert(error.message);
    }
}

// Attach listener to login/register form
export function setAuthListener() {
    const form = document.getElementById("loginForm");
    if (form) {
        form.addEventListener("submit", onAuth);
    } else {
        console.error('Login form with id "loginForm" not found.');
    }
}
