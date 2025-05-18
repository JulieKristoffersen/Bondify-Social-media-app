const API_BASE = "https://v2.api.noroff.dev/social/posts";
const PROFILE_API = "https://v2.api.noroff.dev/social/profiles/me";

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
const usernameElement = document.getElementById("username");
const emailElement = document.getElementById("email");
const profileImg = document.getElementById("profileImg");
const noResults = document.getElementById("noResults");
const logoutBtn = document.getElementById("logout-btn");

let editingPostId = null;
// Change from "loggedInUserId" to loggedInUserEmail, to match filtering by email
let loggedInUserEmail = null;

async function fetchProfile() {
  try {
    const res = await fetch(PROFILE_API, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch user profile: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    console.log("Profile API response:", json);

    const profile = json.data;
    if (!profile) throw new Error("Profile data is empty");

    // Use email for filtering posts, fallback to name if email missing (usually email is present)
    loggedInUserEmail = profile.email || profile.name;

    usernameElement.textContent = profile.name || "User";
    emailElement.textContent = profile.email || "";
    profileImg.src = profile.avatar?.url || "../images/profile.png";
    profileImg.alt = profile.avatar?.alt || "Profile Image";

    // Fetch user posts filtering by email
    const userPosts = await fetchUserPosts(loggedInUserEmail);

    if (Array.isArray(userPosts) && userPosts.length > 0) {
      renderUserPosts(userPosts);
      noResults.style.display = "none";
    } else {
      userPostsContainer.innerHTML = "";
      noResults.style.display = "block";
    }
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}

async function fetchUserPosts(userEmail) {
  try {
    // Filter posts by author=email
    const res = await fetch(`${API_BASE}?author=${encodeURIComponent(userEmail)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch posts for user ${userEmail}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

function renderUserPosts(posts) {
  userPostsContainer.innerHTML = posts.map(post => `
    <div class="border rounded shadow p-3 mb-4">
      ${post.media?.url ? `<img src="${post.media.url}" alt="Post media" class="w-full h-40 object-cover mb-2 rounded" />` : ""}
      <h4 class="font-semibold">${post.title}</h4>
      <p>${post.body}</p>
      <div class="mt-2 flex gap-2">
        <button onclick="startEdit('${post.id}')" class="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
        <button onclick="deletePost('${post.id}')" class="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
      </div>
    </div>
  `).join("");
}

async function startEdit(postId) {
  try {
    const res = await fetch(`${API_BASE}/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch post for editing");
    const json = await res.json();
    const post = json.data;

    editingPostId = postId;
    titleInput.value = post.title;
    bodyInput.value = post.body;
    mediaInput.value = post.media?.url || "";
    formTitle.textContent = "Edit Post";
    form.style.display = "block";
    cancelBtn.style.display = "inline-block";
    showPostFormBtn.textContent = "Close form";

  } catch (err) {
    alert(err.message);
  }
}

async function deletePost(postId) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const res = await fetch(`${API_BASE}/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    });
    if (!res.ok) throw new Error("Failed to delete post");

    const userPosts = await fetchUserPosts(loggedInUserEmail);
    if (userPosts.length > 0) {
      renderUserPosts(userPosts);
      noResults.style.display = "none";
    } else {
      userPostsContainer.innerHTML = "";
      noResults.style.display = "block";
    }
  } catch (err) {
    alert(err.message);
  }
}

cancelBtn.onclick = () => {
  editingPostId = null;
  form.reset();
  form.style.display = "none";
  cancelBtn.style.display = "none";
  formTitle.textContent = "Create New Post";
  showPostFormBtn.textContent = "+ Add a new post";
};

showPostFormBtn.onclick = () => {
  if (form.style.display === "block") {
    cancelBtn.click();
  } else {
    form.style.display = "block";
    cancelBtn.style.display = "inline-block";
    showPostFormBtn.textContent = "Close form";
  }
};

form.addEventListener("submit", async e => {
  e.preventDefault();

  const newPost = {
    title: titleInput.value.trim(),
    body: bodyInput.value.trim(),
  };

  if (mediaInput.value.trim()) {
    newPost.media = {
      url: mediaInput.value.trim(),
      alt: "Post image",
    };
  }

  try {
    let res;
    if (editingPostId) {
      res = await fetch(`${API_BASE}/${editingPostId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });
    } else {
      res = await fetch(API_BASE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });
    }

    if (!res.ok) throw new Error("Failed to save post");

    editingPostId = null;
    form.reset();
    form.style.display = "none";
    cancelBtn.style.display = "none";
    formTitle.textContent = "Create New Post";
    showPostFormBtn.textContent = "+ Add a new post";

    const userPosts = await fetchUserPosts(loggedInUserEmail);
    if (userPosts.length > 0) {
      renderUserPosts(userPosts);
      noResults.style.display = "none";
    } else {
      userPostsContainer.innerHTML = "";
      noResults.style.display = "block";
    }
  } catch (err) {
    alert(err.message);
  }
});

logoutBtn.onclick = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("apiKey");
  window.location.href = "../index.html";
};

async function init() {
  if (!token) {
    alert("You must be logged in.");
    window.location.href = "../index.html";
    return;
  }
  await fetchProfile();
}

window.startEdit = startEdit;
window.deletePost = deletePost;

init();
