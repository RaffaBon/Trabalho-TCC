const startBtn = document.getElementById("startQuiz");
const themeToggle = document.getElementById("themeToggle");

// Vai para o quiz
startBtn.addEventListener("click", () => {
  window.location.href = "index.html"; // coloque o nome correto do arquivo do quiz
});

// Troca de tema
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("quizTheme", document.body.classList.contains("dark") ? "dark" : "light");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Carrega tema salvo
if (localStorage.getItem("quizTheme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}
