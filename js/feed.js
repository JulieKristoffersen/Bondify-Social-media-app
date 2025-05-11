const API_URL = "https://v2.api.noroff.dev/social/posts?_author=true&_comments=true&_reactions=true";
const TOKEN = localStorage.getItem("token");
const API_KEY = localStorage.getItem("apiKey");
const postContainer = document.getElementById("post-container");

if (!TOKEN || !API_KEY) {
  window.location.href = "../index.html";
}

async function fetchPosts() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Klarte ikke å hente innlegg.");
    }

    const result = await response.json();
    renderPosts(result.data);
  } catch (error) {
    console.error("Feil ved henting av innlegg:", error);
    postContainer.innerHTML = `<p class="text-red-500 text-center mt-4">${error.message}</p>`;
  }
}

function renderPosts(posts) {
  postContainer.innerHTML = "";

  if (posts.length === 0) {
    postContainer.innerHTML = `<p class="text-center text-gray-500">Ingen innlegg funnet.</p>`;
    return;
  }

  posts.forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.className = "bg-white border rounded-lg shadow p-4 mb-6";

    const imageUrl = post.media?.url || "../images/feed1.JPG";
    const imageAlt = post.media?.alt || "Post image";
    const title = post.title || "Uten tittel";
    const body = post.body || "";
    const author = post.author?.name || "Ukjent";
    const createdDate = new Date(post.created).toLocaleDateString();
    const commentsCount = post._count?.comments ?? 0;
    const reactionsCount = post._count?.reactions ?? 0;

    postDiv.innerHTML = `
      <img src="${imageUrl}" alt="${imageAlt}" class="w-full h-60 object-cover rounded mb-4">
      <h2 class="text-xl font-bold text-gray-800">${title}</h2>
      <p class="text-gray-600 mt-2">${body}</p>
      <p class="text-sm text-gray-500 mt-2">Skrevet av ${author} • ${createdDate}</p>
      <div class="mt-3 flex space-x-4 text-sm text-gray-500">
        <span><i class="fas fa-heart text-red-500"></i> ${reactionsCount}</span>
        <span><i class="fas fa-comment"></i> ${commentsCount}</span>
      </div>
      <a href="post.html?id=${post.id}" class="text-blue-600 hover:underline mt-2 inline-block">Se mer</a>
    `;

    postContainer.appendChild(postDiv);
  });
}

fetchPosts();
