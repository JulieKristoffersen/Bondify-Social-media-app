function applyInitialTheme() {
    const userPreference = localStorage.getItem("theme");
  
    const systemPreferenceIsDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
  
    const isDarkMode =
      userPreference === "dark" || (!userPreference && systemPreferenceIsDark);
  
    document.documentElement.classList.toggle("dark", isDarkMode);
  
    document.querySelector("#sun").classList.toggle("hidden", isDarkMode);
    document.querySelector("#moon").classList.toggle("hidden", !isDarkMode);
  }
  
  applyInitialTheme();
  
  function toggleTheme() {
    const isDarkMode = document.documentElement.classList.toggle("dark");
  
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  
    document.querySelector("#sun").classList.toggle("hidden", isDarkMode);
    document.querySelector("#moon").classList.toggle("hidden", !isDarkMode);
  }
  
  const themeToggle = document.querySelector("#theme-toggle");
  themeToggle.addEventListener("click", toggleTheme);