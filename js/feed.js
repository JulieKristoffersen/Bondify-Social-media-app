const API_BASE = "https://v2.api.noroff.dev";
const POSTS_ENDPOINT = "/social/posts?_author=true&_comments=true&_reactions=true";

const API_KEY = localStorage.getItem("apiKey");
const TOKEN = localStorage.getItem("token");

async function getPosts() {
  const postContainer = document.getElementById("post-container");
  postContainer.innerHTML = "<p>Loading posts...</p>";

  try {
    const response = await fetch(`${API_BASE}${POSTS_ENDPOINT}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    const result = await response.json();

    if (response.ok) {
      postContainer.innerHTML = "";
      result.data.forEach(post => {
        postContainer.innerHTML += `
          <div class="bg-white border rounded-lg shadow p-4 mb-6">
            <img src="${post.media?.url ?? '../images/feed1.JPG'}" alt="${post.media?.alt ?? 'Post image'}" class="w-full h-60 object-cover rounded mb-4">
            <h2 class="text-xl font-bold text-gray-800">${post.title}</h2>
            <p class="text-gray-600 mt-2">${post.body ?? ""}</p>
            <p class="text-sm text-gray-500 mt-2">By ${post.author?.name ?? "Unknown"}</p>
            <div class="mt-3 flex space-x-4 text-sm text-gray-500">
              <span><i class="fas fa-heart text-red-500"></i> ${post._count.reactions ?? 0}</span>
              <span><i class="fas fa-comment"></i> ${post._count.comments ?? 0}</span>
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
