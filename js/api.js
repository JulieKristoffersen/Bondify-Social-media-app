export const API_BASE = "https://v2.api.noroff.dev";
export const API_AUTH = "/auth";
export const API_REGISTER = "/register";
export const API_LOGIN = "/login";
export const API_KEY_URL = "/create-api-key";

export function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function load(key) {
    return JSON.parse(localStorage.getItem(key));
}

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

export async function register(
    name,
    email,
    password,
    bio = "",
    avatarUrl = "",
    avatarAlt = "",
    bannerUrl = "",
    bannerAlt = "",
    venueManager = false
) {
    const payload = { name, email, password };

    if (bio) payload.bio = bio;
    if (avatarUrl) payload.avatar = { url: avatarUrl, alt: avatarAlt || "" };
    if (bannerUrl) payload.banner = { url: bannerUrl, alt: bannerAlt || "" };
    if (venueManager) payload.venueManager = true;

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

    if (error.errors && error.errors[0].message.includes("Profile already exists")) {
        throw new Error("This email is already registered. Please log in.");
    }

    throw new Error("Could not register the account: " + (error.errors?.[0]?.message || "Unknown error"));
}

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
    throw new Error("Could not login to the account: " + (error.errors?.[0]?.message || "Unknown error"));
}
