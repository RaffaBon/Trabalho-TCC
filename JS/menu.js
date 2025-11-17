const startBtn = document.getElementById("startQuiz");
const themeToggle = document.getElementById("themeToggle");

// Vai para o quiz
startBtn.addEventListener("click", () => {
  window.location.href = "../index.html"; // Altere o caminho se necessário
});

// Troca de tema
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("quizTheme", isDark ? "dark" : "light");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
});

// Carrega tema salvo
if (localStorage.getItem("quizTheme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}
