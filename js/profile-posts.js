const API_BASE = "https://v2.api.noroff.dev/social/posts";
const token = localStorage.getItem("token");
const apiKey = localStorage.getItem("apiKey");

const form = document.getElementById("post-form");
const titleInput = document.getElementById("post-title");
const bodyInput = document.getElementById("post-body");
const mediaInput = document.getElementById("post-media");
const userPostsContainer = document.getElementById("user-posts");
const formTitle = document.getElementById("form-title");
const cancelBtn = document.getElementById("cancel-edit");
const showPostFormBtn = document.getElementById("show-post-form-btn");

let editingPostId = null;

async function fetchUserPosts() {
  userPostsContainer.innerHTML = "Laster innlegg...";

  try {
    const res = await fetch(API_BASE, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey
      }
    });

    if (!res.ok) throw new Error("Feil ved henting av innlegg");

    const data = await res.json();
    renderPosts(data.data);
  } catch (error) {
    userPostsContainer.innerHTML = `<p style="color:red">${error.message}</p>`;
  }
}

function renderPosts(posts) {
  if (posts.length === 0) {
    userPostsContainer.innerHTML = "<p>Ingen innlegg funnet.</p>";
    return;
  }

  userPostsContainer.innerHTML = posts.map(post => `
    <div class="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
      <img src="${post.media?.url || '../images/default.jpg'}" alt="Post image"
        class="w-full h-40 object-cover transition-all transform hover:scale-105" />
      <div class="p-4">
        <h4 class="font-semibold text-lg">${post.title}</h4>
        <p class="text-gray-600 text-sm mt-1">${post.body}</p>
        <div class="mt-4 flex justify-between items-center text-gray-500 text-sm">
          <div class="flex items-center space-x-2">
            <button onclick="editPost('${post.id}')" class="text-gray-600 hover:text-gray-800 text-sm">
              <i class="fas fa-edit"></i> Rediger
            </button>
            <button onclick="deletePost('${post.id}')" class="text-red-600 hover:text-red-800 text-sm">
              <i class="fas fa-trash"></i> Slett
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

async function editPost(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey
      }
    });
    if (!res.ok) throw new Error("Kunne ikke hente innlegget");

    const data = await res.json();
    const post = data.data;

    editingPostId = id;
    formTitle.textContent = "Rediger innlegg";
    titleInput.value = post.title;
    bodyInput.value = post.body;
    mediaInput.value = post.media?.url || "";
    cancelBtn.style.display = "inline-block";
    form.style.display = "block";
  } catch (error) {
    alert(error.message);
  }
}

async function deletePost(id) {
  if (!confirm("Er du sikker på at du vil slette innlegget?")) return;

  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey
      }
    });

    if (!res.ok) throw new Error("Kunne ikke slette innlegget");

    fetchUserPosts();
  } catch (error) {
    alert(error.message);
  }
}

cancelBtn.onclick = () => {
  editingPostId = null;
  formTitle.textContent = "Lag nytt innlegg";
  form.reset();
  cancelBtn.style.display = "none";
  form.style.display = "none";
};

form.onsubmit = async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  const mediaUrl = mediaInput.value.trim();

  if (!title || !body) {
    alert("Tittel og innhold kan ikke være tomt.");
    return;
  }

  const postData = {
    title,
    body,
    media: mediaUrl ? { url: mediaUrl, alt: "Bilde" } : undefined
  };

  try {
    let res;
    if (editingPostId) {
      res = await fetch(`${API_BASE}/${editingPostId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
      });
    } else {
      res = await fetch(API_BASE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
      });
    }

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.errors?.[0]?.message || "Noe gikk galt");
    }

    editingPostId = null;
    formTitle.textContent = "Lag nytt innlegg";
    form.reset();
    cancelBtn.style.display = "none";
    form.style.display = "none";
    fetchUserPosts();
  } catch (error) {
    alert(error.message);
  }
};

showPostFormBtn?.addEventListener("click", () => {
  form.style.display = form.style.display === "none" ? "block" : "none";
});

fetchUserPosts();

// Eksponer funksjoner for HTML-knapper
window.editPost = editPost;
window.deletePost = deletePost;
