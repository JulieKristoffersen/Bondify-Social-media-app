const API_BASE = "https://v2.api.noroff.dev";
const POSTS_ENDPOINT = "/social/posts?_author=true&_comments=true&_reactions=true";

const API_KEY = localStorage.getItem("apiKey");
const TOKEN = localStorage.getItem("token");

/**
 * Fetch and display all posts
 */
async function getPosts() {
    const postContainer = document.getElementById("post-container");
    postContainer.innerHTML = "<p>Loading posts...</p>";

    try {
        const response = await fetch(`${API_BASE}${POSTS_ENDPOINT}`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "X-Noroff-API-Key": API_KEY,
            }
        });

        const result = await response.json();

        if (response.ok) {
            postContainer.innerHTML = "";
            result.data.forEach(post => {
                postContainer.innerHTML += `
                    <div class="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
                        <img src="${post.media || '../images/feed1.JPG'}" alt="Post Image" class="w-full h-40 object-cover">
                        <div class="p-4">
                            <h3 class="font-bold text-lg text-gray-800">${post.title}</h3>
                            <p class="text-gray-600 text-sm mt-1">${post.body}</p>
                            <div class="mt-4 flex justify-between items-center text-gray-500 text-sm">
                                <div class="flex items-center">
                                    <i class="fas fa-heart text-red-500"></i>
                                    <span class="ml-2">${post._count.reactions}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-comment-dots"></i>
                                    <span class="ml-2">${post._count.comments}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            postContainer.innerHTML = "<p>Failed to load posts.</p>";
        }
    } catch (error) {
        console.error("Error loading posts:", error);
        postContainer.innerHTML = "<p>Error loading posts.</p>";
    }
}

document.addEventListener("DOMContentLoaded", getPosts);
