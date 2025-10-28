document.addEventListener("DOMContentLoaded", () => {
  const soundCorrect = new Audio("sounds/certo.mp3");
  const soundWrong = new Audio("sounds/erro.mp3");
  const soundFinish = new Audio("sounds/fim.mp3");

  let ttsEnabled = false;
  const savedTts = localStorage.getItem("ttsEnabled");
  if (savedTts !== null) ttsEnabled = savedTts === "true";

  const questions = [
    {
      question: "Qual destas senhas é mais segura para proteger sua conta?",
      answers: ["Números aleatórios", "Seu nome e algum número", "Uma palavra aleatória com símbolos e números", "Sua data de nascimento"],
      correctIndex: 2,
      explanation: "Senhas seguras misturam letras, números e símbolos (exemplo: C@fé!2025). Evite nomes ou datas pessoais."
    },
    {
      question: "Você recebe um e-mail dizendo que sua conta bancária será bloqueada e pedindo seus dados. O que fazer?",
      answers: ["Clicar no link para ver o que é", "Perguntar se é seguro", "Apagar o e-mail sem abrir", "Mandar para algum amigo"],
      correctIndex: 2,
      explanation: "Bancos nunca pedem dados pessoais por e-mail. E-mails assim geralmente são golpes."
    },
    {
      question: "Alguém envia uma mensagem pedindo sua senha se passando por banco ou loja. O que é isso?",
      answers: ["Um tipo de virus", "Um golpista", "Uma atualização de cadastro", "Um erro do site"],
      correctIndex: 1,
      explanation: "Esse tipo de golpe tenta se passar por alguém confiável para roubar senhas ou dados pessoais."
    },
    {
      question: "Por que é importante atualizar o celular ou computador?",
      answers: ["Para deixar ele mais bonito", "Para corrigir problemas", "Para ter acesso a internet", "Para poder instalar mais aplicativos"],
      correctIndex: 1,
      explanation: "Atualizações corrigem falhas que podem ser usadas por pessoas mal-intencionadas e melhoram os aplicativos."
    },
    {
      question: "Como saber se um site é seguro para digitar suas senhas?",
      answers: ["Tem um cadeado na barra de endereços", "Tem muitas propagandas", "Pede acesso as senhas da sua conta", "Pede suas informações pessoais para entrar"],
      correctIndex: 0,
      explanation: "O cadeado indica que o site protege seus dados enquanto você navega."
    },
    {
      question: "O que é a verificação em duas etapas?",
      answers: ["Trocar senha todo mês", "Receber um código extra no celular", "Uma pergunta secreta", "Usar a mesma conta em outros dispositivos"],
      correctIndex: 1,
      explanation: "Além da senha, você precisa de um código enviado para seu celular para aumentar a segurança."
    },
    {
      question: "Como se proteger de golpes em redes sociais?",
      answers: ["Aceitar todos pedidos de amizade", "Não clicar em links suspeitos", "Abrir o site que me disseram ser sobre proteger a conta", "Usar senhas seguras nos sites"],
      correctIndex: 1,
      explanation: "Links suspeitos podem instalar vírus ou levar a sites falsos que roubam informações."
    },
    {
      question: "O que fazer se receber um anexo desconhecido por e-mail?",
      answers: ["Abrir para ver", "Perguntar ao remetente antes de abrir", "Não abrir e apagar o e-mail", "Encaminhar para colegas"],
      correctIndex: 2,
      explanation: "Anexos desconhecidos podem ter vírus. O melhor é apagar o e-mail sem abrir."
    },
    {
      question: "Você deve usar a mesma senha em vários sites?",
      answers: ["Sim, é mais fácil de lembrar", "Não, se descobrirem as outras contas correm risco", "Não, porque eu não uso senhas", "Sim, não tem problema nenhum"],
      correctIndex: 1,
      explanation: "Usar a mesma senha facilita que hackers acessem suas outras contas se uma for invadida."
    },
    {
      question: "Você abre um arquivo e ele trava o computador pedindo dinheiro para liberar seus documentos. O que é isso?",
      answers: ["Um vírus perigoso", "Uma atualização do sistema", "Mensagem de erro", "Um aviso do antivírus"],
      correctIndex: 0,
      explanation: "Esse vírus é chamado ransomware. Ele bloqueia seus arquivos e tenta extorquir dinheiro. Ter cópias de segurança ajuda a se proteger."
    }
  ];

  const questionBox = document.getElementById("questionBox");
  const questionTitle = document.getElementById("questionTitle");
  const questionText = document.getElementById("questionText");
  const answersContainer = document.getElementById("answersContainer");
  const ttsBtn = document.getElementById("ttsBtn");
  const scoreValue = document.getElementById("scoreValue");
  const progressBar = document.getElementById("progressBar");
  const correctAnswersSpan = document.getElementById("correctAnswers");
  const restartBtn = document.getElementById("restartQuiz");
  const themeToggle = document.getElementById("themeToggle");

  const ttsToggleBtn = document.createElement("button");
  ttsToggleBtn.textContent = `Narrador: ${ttsEnabled ? "ON" : "OFF"}`;
  ttsToggleBtn.style.marginLeft = "10px";
  ttsBtn.parentNode.appendChild(ttsToggleBtn);

  let currentQuestion = 0;
  let score = 0;
  let wrongAnswers = [];

  function fadeOutIn(callback) {
    questionBox.classList.add("fade-out");
    setTimeout(() => {
      callback();
      questionBox.classList.remove("fade-out");
      questionBox.classList.add("fade-in");
      setTimeout(() => questionBox.classList.remove("fade-in"), 400);
    }, 400);
  }

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
    fadeOutIn(loadQuestion);
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

    progressBar.value = currentQuestion + 1;
    if (!ttsEnabled) setTimeout(nextQuestion, 900);
  }

  function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) fadeOutIn(loadQuestion);
    else fadeOutIn(showResults);
  }

  function showResults() {
    questionTitle.textContent = "🎉 Fim do Quiz!";
    questionText.textContent = `Você acertou ${score} de ${questions.length} perguntas.`;
    answersContainer.innerHTML = "";
    playSound(soundFinish);

    if (wrongAnswers.length === 0) {
      const congrats = document.createElement("p");
      congrats.textContent = "Parabéns! Você acertou todas as respostas!";
      congrats.style.fontSize = "1.3rem";
      congrats.style.marginTop = "20px";
      answersContainer.appendChild(congrats);
    } else {
      const explanationContainer = document.createElement("div");
      explanationContainer.className = "explanation";

      let currentCard = 0;

      const cardElement = document.createElement("div");
      cardElement.className = "explanation-card";
      explanationContainer.appendChild(cardElement);

      const navDiv = document.createElement("div");
      navDiv.className = "nav-buttons";

      const prevBtn = document.createElement("button");
      prevBtn.textContent = "←";
      prevBtn.className = "nav-btn";

      const nextBtn = document.createElement("button");
      nextBtn.textContent = "→";
      nextBtn.className = "nav-btn";

      const indexText = document.createElement("span");
      indexText.className = "card-index";

      navDiv.appendChild(prevBtn);
      navDiv.appendChild(indexText);
      navDiv.appendChild(nextBtn);
      explanationContainer.prepend(navDiv);

      function renderCard(index) {
        const w = wrongAnswers[index];
        cardElement.innerHTML = `
          <strong>Pergunta:</strong> ${w.pergunta}<br>
          <strong>Resposta certa:</strong> ${w.correta}<br>
          <strong>Explicação:</strong> ${w.explicacao}
        `;
        indexText.textContent = `${index + 1} / ${wrongAnswers.length}`;
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === wrongAnswers.length - 1;
      }

      prevBtn.onclick = () => {
        if (currentCard > 0) {
          currentCard--;
          renderCard(currentCard);
        }
      };

      nextBtn.onclick = () => {
        if (currentCard < wrongAnswers.length - 1) {
          currentCard++;
          renderCard(currentCard);
        }
      };

      renderCard(currentCard);
      answersContainer.appendChild(explanationContainer);
    }

    const restartBtnFinal = document.createElement("button");
    restartBtnFinal.textContent = "🔁 Jogar Novamente 🔁";
    restartBtnFinal.className = "restart-final";
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
