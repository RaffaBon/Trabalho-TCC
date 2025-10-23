document.addEventListener("DOMContentLoaded", () => {
  const soundCorrect = new Audio("sounds/certo.mp3");
  const soundWrong = new Audio("sounds/erro.mp3");
  const soundFinish = new Audio("sounds/fim.mp3");

  // Narrador começa desativado por padrão
  let ttsEnabled = false;
  const savedTts = localStorage.getItem("ttsEnabled");
  if (savedTts !== null) ttsEnabled = savedTts === "true";

  const questions = [
    {
      question: "Qual destas é uma senha realmente segura?",
      answers: ["123456", "meunome123", "C@n3c0$2025!", "Data de aniversário"],
      correctIndex: 2,
      explanation: "Senhas fortes usam letras maiúsculas e minúsculas, números e símbolos."
    },
    {
      question: "Você recebe um e-mail pedindo para atualizar seus dados bancários. O que fazer?",
      answers: ["Clicar no link do e-mail", "Responder com suas informações", "Ignorar e excluir o e-mail", "Encaminhar para todos os contatos"],
      correctIndex: 2,
      explanation: "Instituições sérias nunca pedem informações sensíveis por e-mail. Esse tipo de mensagem é golpe (phishing)."
    },
    {
      question: "O que significa 'phishing'?",
      answers: ["Vírus que formata o computador", "Roubo de informações se passando por algo confiável", "Programa de segurança", "Erro no sistema"],
      correctIndex: 1,
      explanation: "Phishing é uma tentativa de enganar o usuário e roubar dados pessoais, fingindo ser algo legítimo."
    },
    {
      question: "Por que é importante manter aplicativos atualizados?",
      answers: ["Para ter novas cores", "Para corrigir falhas de segurança", "Para gastar mais internet", "Para ocupar mais espaço no celular"],
      correctIndex: 1,
      explanation: "Atualizações corrigem vulnerabilidades que podem ser exploradas por hackers."
    },
    {
      question: "Qual é um sinal de que um site é seguro?",
      answers: ["Tem cadeado na barra de endereço", "Tem muitas propagandas", "Abre várias janelas pop-up", "Pede senha logo ao entrar"],
      correctIndex: 0,
      explanation: "O cadeado indica que o site usa HTTPS, protegendo a troca de dados entre você e o servidor."
    },
    {
      question: "O que é autenticação de dois fatores (2FA)?",
      answers: ["Senha que deve ser trocada todo mês", "Verificação com duas etapas para maior segurança", "Pergunta secreta apenas", "Usar dois dispositivos diferentes"],
      correctIndex: 1,
      explanation: "2FA exige uma segunda forma de verificação, como um código no celular, para garantir mais segurança."
    },
    {
      question: "Qual prática ajuda a evitar golpes em redes sociais?",
      answers: ["Aceitar todos pedidos de amizade", "Não clicar em links suspeitos", "Compartilhar senhas com amigos", "Usar a mesma senha em todos sites"],
      correctIndex: 1,
      explanation: "Links suspeitos podem conter vírus ou redirecionar para páginas falsas que roubam informações."
    },
    {
      question: "O que você deve fazer se receber um anexo desconhecido por e-mail?",
      answers: ["Abrir imediatamente", "Responder pedindo confirmação", "Não abrir e excluir o e-mail", "Encaminhar para colegas"],
      correctIndex: 2,
      explanation: "Anexos desconhecidos podem conter vírus. O ideal é apagar o e-mail sem abrir."
    },
    {
      question: "Por que não é seguro usar a mesma senha em vários sites?",
      answers: ["Porque é difícil de lembrar", "Se um site for hackeado, todos os outros estão em risco", "Porque os navegadores não gostam", "Não existe problema"],
      correctIndex: 1,
      explanation: "Se um site for comprometido, os hackers podem tentar usar a mesma senha em outras contas suas."
    },
    {
      question: "O que é ransomware?",
      answers: ["Um tipo de vírus que bloqueia arquivos e pede resgate", "Um antivírus moderno", "Atualização de sistema", "Mensagem de erro do Windows"],
      correctIndex: 0,
      explanation: "Ransomware criptografa seus arquivos e exige pagamento (geralmente em criptomoedas) para liberá-los."
    }
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

  // Botão de narrador
  const ttsToggleBtn = document.createElement("button");
  ttsToggleBtn.textContent = `Narrador: ${ttsEnabled ? "ON" : "OFF"}`;
  ttsToggleBtn.style.marginLeft = "10px";
  ttsBtn.parentNode.appendChild(ttsToggleBtn);

  let currentQuestion = 0;
  let score = 0;
  let wrongAnswers = [];

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    wrongAnswers = [];
    scoreValue.textContent = "0 pts";
    correctAnswersSpan.textContent = "0";
    progressBar.value = 0;
    shuffleArray(questions);

    questions.forEach(q => {
      const correctAnswer = q.answers[q.correctIndex];
      shuffleArray(q.answers);
      q.correctIndex = q.answers.indexOf(correctAnswer);
    });

    ttsBtn.style.display = "inline-block";
    loadQuestion();
  }

  progressBar.max = questions.length;

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

    if (ttsEnabled) speak(q.question);
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
      playSound(soundCorrect);
      scoreValue.textContent = `${score} pts`;
      correctAnswersSpan.textContent = score;
      if (ttsEnabled) speak("Resposta correta!", nextQuestion);
    } else {
      wrongAnswers.push({
        pergunta: q.question,
        correta: q.answers[q.correctIndex],
        explicacao: q.explanation
      });
      playSound(soundWrong);
      if (ttsEnabled) speak("Resposta incorreta.", nextQuestion);
    }

    // ✅ Atualiza a barra de progresso toda vez que responder
    progressBar.value = currentQuestion + 1;

    if (!ttsEnabled) setTimeout(nextQuestion, 1000);
  }

  function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) loadQuestion();
    else showResults();
  }

  function showResults() {
    questionTitle.textContent = "🎉 Fim do Quiz!";
    questionText.innerHTML = `Você acertou <strong>${score}</strong> de <strong>${questions.length}</strong> perguntas.<br><br>`;
    answersContainer.innerHTML = "";
    playSound(soundFinish);

    const resultBox = document.createElement("div");
    resultBox.id = "gabarito";
    resultBox.innerHTML = "<h3>💡 Explicações:</h3>";

    questions.forEach((q, i) => {
      const p = document.createElement("p");
      const acertou = !wrongAnswers.some(w => w.pergunta === q.question);
      p.innerHTML = `<strong>${i + 1}. ${q.question}</strong><br>
        <span style="color:${acertou ? '#28a745' : '#dc3545'}">
        ${acertou ? "✅ Correta" : "❌ Incorreta"}</span><br>
        <em>${q.explanation}</em><br><br>`;
      resultBox.appendChild(p);
    });

    answersContainer.appendChild(resultBox);

    const restartBtnFinal = document.createElement("button");
    restartBtnFinal.textContent = "🔁 Jogar Novamente";
    restartBtnFinal.style.marginTop = "20px";
    restartBtnFinal.onclick = resetQuiz;
    answersContainer.appendChild(restartBtnFinal);

    ttsBtn.style.display = "none";
  }

  function playSound(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Erro ao tocar som:", e));
  }

  function speak(text, callback) {
    if ("speechSynthesis" in window && ttsEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.onend = () => {
        if (callback) callback();
      };
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } else if (callback) callback();
  }

  // Eventos principais
  restartBtn.addEventListener("click", resetQuiz);

  ttsBtn.addEventListener("click", () => {
    if (currentQuestion < questions.length && ttsEnabled)
      speak(questions[currentQuestion].question);
  });

  ttsToggleBtn.addEventListener("click", () => {
    ttsEnabled = !ttsEnabled;
    ttsToggleBtn.textContent = `Narrador: ${ttsEnabled ? "ON" : "OFF"}`;
    localStorage.setItem("ttsEnabled", ttsEnabled);
  });

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("quizTheme", document.body.classList.contains("dark") ? "dark" : "light");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  });

  if (localStorage.getItem("quizTheme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }

  resetQuiz();
});
