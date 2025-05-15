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
    <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
      <h4>${post.title}</h4>
      <p>${post.body}</p>
      <img src="${post.media?.url || ''}" alt="" style="max-width:100%; max-height:150px; display:block; margin-bottom:10px;">
      <button onclick="editPost('${post.id}')">Rediger</button>
      <button onclick="deletePost('${post.id}')">Slett</button>
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

    const post = await res.json();

    editingPostId = id;
    formTitle.textContent = "Rediger innlegg";
    titleInput.value = post.title;
    bodyInput.value = post.body;
    mediaInput.value = post.media?.url || "";
    cancelBtn.style.display = "inline-block";
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
};

form.onsubmit = async (e) => {
  e.preventDefault();

  const postData = {
    title: titleInput.value.trim(),
    body: bodyInput.value.trim(),
    media: mediaInput.value.trim() ? { url: mediaInput.value.trim(), alt: "Bilde" } : null
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
      throw new Error(err.errors?.[0] || "Noe gikk galt");
    }

    editingPostId = null;
    formTitle.textContent = "Lag nytt innlegg";
    form.reset();
    cancelBtn.style.display = "none";
    fetchUserPosts();

  } catch (error) {
    alert(error.message);
  }
};

fetchUserPosts();

window.editPost = editPost;
window.deletePost = deletePost;
