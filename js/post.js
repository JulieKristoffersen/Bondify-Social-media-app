const postContainer = document.getElementById("post-details");

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

const token = localStorage.getItem("accessToken");
const apiKey = localStorage.getItem("apiKey");

if (!token || !apiKey) {
  alert("Du må være innlogget for å se innlegg.");
  window.location.href = "../index.html";
}

async function fetchPost(id) {
  const url = `https://v2.api.noroff.dev/social/posts/${id}?_author=true&_comments=true&_reactions=true`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    const { data } = await response.json();
    displayPost(data);
  } catch (error) {
    postContainer.innerHTML = `<p class="text-red-500">Kunne ikke hente innlegget.</p>`;
    console.error(error);
  }
}

function displayPost(post) {
  const {
    title,
    body,
    media,
    created,
    author,
    comments,
    reactions,
    _count,
  } = post;

  postContainer.innerHTML = `
    <article class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-2">${title}</h2>
      <p class="text-sm text-gray-500">Skrevet av ${author.name} – ${new Date(created).toLocaleString()}</p>
      ${media?.url ? `<img src="${media.url}" alt="${media.alt || "bilde"}" class="w-full rounded mt-4" />` : ""}
      <p class="mt-4">${body}</p>

      <div class="mt-4">
        <h3 class="font-semibold">Reaksjoner (${_count.reactions}):</h3>
        <div class="flex space-x-2 mt-1">
          ${reactions.map(r => `<span>${r.symbol} (${r.count})</span>`).join("") || "Ingen reaksjoner"}
        </div>
      </div>

      <div class="mt-6">
        <h3 class="font-semibold">Kommentarer (${_count.comments}):</h3>
        <ul class="space-y-2 mt-2">
          ${comments.map(c => `
            <li class="border p-2 rounded">
              <p><strong>${c.author.name}</strong>: ${c.body}</p>
              <p class="text-sm text-gray-500">${new Date(c.created).toLocaleString()}</p>
            </li>`).join("") || "<li>Ingen kommentarer enda.</li>"}
        </ul>
      </div>
    </article>
  `;
}

fetchPost(postId);
