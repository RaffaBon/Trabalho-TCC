// Sons
const soundCorrect = new Audio("sounds/acerto.mp3");
const soundWrong = new Audio("sounds/erro.mp3");
const soundFinish = new Audio("sounds/fim.mp3");

const questions = [
  { question: "Qual destas é uma senha segura?",
    answers: ["123456", "meunome123", "C@n3c0$2025!", "Data de aniversário"],
    correctIndex: 2 },
  { question: "Você recebe um e-mail pedindo para clicar em um link e atualizar seus dados bancários. O que fazer?",
    answers: ["Clicar e seguir as instruções", "Responder com suas informações", "Ignorar e excluir o e-mail", "Encaminhar para todos os contatos"],
    correctIndex: 2 },
  { question: "O que significa 'phishing'?",
    answers: ["Vírus que formata o computador", "Roubo de informações se passando por algo confiável", "Programa de segurança", "Erro no sistema"],
    correctIndex: 1 },
  { question: "Por que é importante manter aplicativos atualizados?",
    answers: ["Para ter novas cores", "Para corrigir falhas de segurança", "Para gastar mais internet", "Para ocupar mais espaço no celular"],
    correctIndex: 1 },
  { question: "Qual é o sinal de que um site é seguro?",
    answers: ["Tem cadeado na barra de endereço", "Tem muitas propagandas", "Abre várias janelas pop-up", "Pede senha logo ao entrar"],
    correctIndex: 0 }
];

const questionTitle = document.getElementById("questionTitle");
const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const ttsBtn = document.getElementById("ttsBtn");
const scoreValue = document.getElementById("scoreValue");
const progressBar = document.getElementById("progressBar");
const correctAnswersSpan = document.getElementById("correctAnswers");
const restartBtn = document.getElementById("restartQuiz");
const themeToggle = document.getElementById("themeToggle");

let currentQuestion = 0;
let score = 0;
let wrongAnswers = [];

function loadQuestion() {
  const q = questions[currentQuestion];
  questionTitle.textContent = `Pergunta ${currentQuestion + 1}`;
  questionText.textContent = q.question;

  answersContainer.innerHTML = "";
  q.answers.forEach((answer, i) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = answer;
    btn.onclick = () => selectAnswer(i);
    answersContainer.appendChild(btn);
  });

  progressBar.value = currentQuestion;
}

function selectAnswer(index) {
  const q = questions[currentQuestion];
  const buttons = answersContainer.querySelectorAll("button");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctIndex) btn.classList.add("correct");
    if (i === index && i !== q.correctIndex) btn.classList.add("incorrect");
  });

  if (index === q.correctIndex) {
    score++;
    soundCorrect.play();
    speak("Resposta correta!");
  } else {
    wrongAnswers.push({ pergunta: q.question, correta: q.answers[q.correctIndex] });
    soundWrong.play();
    speak("Resposta incorreta.");
  }

  scoreValue.textContent = `${score} pts`;
  correctAnswersSpan.textContent = score;
  progressBar.value = currentQuestion + 1;

  currentQuestion++;
  if (currentQuestion < questions.length) {
    setTimeout(loadQuestion, 1000);
  } else {
    setTimeout(showResults, 1000);
  }
}

function showResults() {
  questionTitle.textContent = "Fim do Quiz!";
  questionText.textContent = `Você acertou ${score} de ${questions.length} perguntas.`;
  answersContainer.innerHTML = "";
  soundFinish.play();

  if (wrongAnswers.length > 0) {
    const gabarito = document.createElement("div");
    gabarito.innerHTML = "<h3>Respostas corretas:</h3>";
    wrongAnswers.forEach(item => {
      const p = document.createElement("p");
      p.textContent = `${item.pergunta} — Correta: ${item.correta}`;
      gabarito.appendChild(p);
    });
    answersContainer.appendChild(gabarito);
  }

  ttsBtn.style.display = "none";
}

restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  wrongAnswers = [];
  ttsBtn.style.display = "inline-block";
  scoreValue.textContent = "0 pts";
  correctAnswersSpan.textContent = "0";
  progressBar.value = 0;
  loadQuestion();
  speak("Quiz reiniciado.");
});

ttsBtn.addEventListener("click", () => {
  if (currentQuestion < questions.length) {
    speak(questions[currentQuestion].question);
  }
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

function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }
}

loadQuestion();
