const btn = document.querySelector("#menu-btn");
const menu = document.querySelector("#mobile-menu");

btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
});