document.addEventListener("DOMContentLoaded", () => {

  const soundCorrect = new Audio("sounds/certo.mp3");
  const soundWrong = new Audio("sounds/erro.mp3");
  const soundFinish = new Audio("sounds/fim.mp3");

  let ttsEnabled = true;

  const questions = [
    { question: "Qual destas é uma senha realmente segura?", answers: ["123456","meunome123","C@n3c0$2025!","Data de aniversário"], correctIndex:2 },
    { question: "Você recebe um e-mail pedindo para atualizar seus dados bancários. O que fazer?", answers:["Clicar no link do e-mail","Responder com suas informações","Ignorar e excluir o e-mail","Encaminhar para todos os contatos"], correctIndex:2 },
    { question: "O que significa 'phishing'?", answers:["Vírus que formata o computador","Roubo de informações se passando por algo confiável","Programa de segurança","Erro no sistema"], correctIndex:1 },
    { question: "Por que é importante manter aplicativos atualizados?", answers:["Para ter novas cores","Para corrigir falhas de segurança","Para gastar mais internet","Para ocupar mais espaço no celular"], correctIndex:1 },
    { question: "Qual é um sinal de que um site é seguro?", answers:["Tem cadeado na barra de endereço","Tem muitas propagandas","Abre várias janelas pop-up","Pede senha logo ao entrar"], correctIndex:0 },
    { question: "O que é autenticação de dois fatores (2FA)?", answers:["Senha que deve ser trocada todo mês","Verificação com duas etapas para maior segurança","Pergunta secreta apenas","Usar dois dispositivos diferentes"], correctIndex:1 },
    { question: "Qual prática ajuda a evitar golpes em redes sociais?", answers:["Aceitar todos pedidos de amizade","Não clicar em links suspeitos","Compartilhar senhas com amigos","Usar a mesma senha em todos sites"], correctIndex:1 },
    { question: "O que você deve fazer se receber um anexo desconhecido por e-mail?", answers:["Abrir imediatamente","Responder pedindo confirmação","Não abrir e excluir o e-mail","Encaminhar para colegas"], correctIndex:2 },
    { question: "Por que não é seguro usar a mesma senha em vários sites?", answers:["Porque é difícil de lembrar","Se um site for hackeado, todos os outros estão em risco","Porque os navegadores não gostam","Não existe problema"], correctIndex:1 },
    { question: "O que é ransomware?", answers:["Um tipo de vírus que bloqueia arquivos e pede resgate","Um antivírus moderno","Atualização de sistema","Mensagem de erro do Windows"], correctIndex:0 }
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

  const ttsToggleBtn = document.createElement("button");
  ttsToggleBtn.textContent = "Narrador: ON";
  ttsToggleBtn.style.marginLeft = "10px";
  ttsBtn.parentNode.appendChild(ttsToggleBtn);

  let currentQuestion = 0;
  let score = 0;
  let wrongAnswers = [];

  // Embaralhar array
  function shuffleArray(array){
    for(let i = array.length -1; i>0; i--){
      const j = Math.floor(Math.random() * (i+1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Reset quiz
  function resetQuiz(){
    currentQuestion = 0;
    score = 0;
    wrongAnswers = [];
    scoreValue.textContent = "0 pts";
    correctAnswersSpan.textContent = "0";
    progressBar.value = 0;

    // Embaralhar perguntas
    shuffleArray(questions);

    // Embaralhar respostas de cada pergunta e atualizar correctIndex
    questions.forEach(q=>{
      const correctAnswer = q.answers[q.correctIndex];
      shuffleArray(q.answers);
      q.correctIndex = q.answers.indexOf(correctAnswer);
    });

    ttsBtn.style.display = "inline-block";
    loadQuestion();
  }

  progressBar.max = questions.length;

  // Carrega questão
  function loadQuestion(){
    const q = questions[currentQuestion];
    questionTitle.textContent = `Pergunta ${currentQuestion+1}`;
    questionText.textContent = q.question;

    answersContainer.innerHTML = "";
    q.answers.forEach((answer,i)=>{
      const btn = document.createElement("button");
      btn.className = "answer-btn";
      btn.textContent = answer;
      btn.disabled = false;
      btn.onclick = ()=> selectAnswer(i);
      answersContainer.appendChild(btn);
    });

    if(ttsEnabled) speak(q.question);
  }

  function selectAnswer(index){
    const q = questions[currentQuestion];
    const buttons = answersContainer.querySelectorAll("button");

    buttons.forEach((btn,i)=>{
      btn.disabled = true;
      if(i === q.correctIndex) btn.classList.add("correct");
      if(i === index && i !== q.correctIndex) btn.classList.add("incorrect");
    });

    if(index === q.correctIndex){
      score++;
      playSound(soundCorrect);
      scoreValue.textContent = `${score} pts`;
      correctAnswersSpan.textContent = score;
      progressBar.value = score; // só sobe se acertar
      if(ttsEnabled) speak("Resposta correta!", nextQuestion);
    } else {
      wrongAnswers.push({pergunta:q.question, correta:q.answers[q.correctIndex]});
      playSound(soundWrong);
      if(ttsEnabled) speak("Resposta incorreta.", nextQuestion);
    }

    if(!ttsEnabled) setTimeout(nextQuestion,1000);
  }

  function nextQuestion(){
    currentQuestion++;
    if(currentQuestion < questions.length) loadQuestion();
    else showResults();
  }

  function showResults(){
    questionTitle.textContent = "Fim do Quiz!";
    questionText.textContent = `Você acertou ${score} de ${questions.length} perguntas.`;
    answersContainer.innerHTML = "";
    playSound(soundFinish);

    if(wrongAnswers.length>0){
      const gabarito = document.createElement("div");
      gabarito.innerHTML = "<h3>Respostas corretas:</h3>";
      wrongAnswers.forEach(item=>{
        const p = document.createElement("p");
        p.textContent = `${item.pergunta} — Correta: ${item.correta}`;
        gabarito.appendChild(p);
      });
      answersContainer.appendChild(gabarito);
    }

    ttsBtn.style.display = "none";
  }

  function playSound(audio){
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(e=>console.log("Erro ao tocar som:", e));
  }

  function speak(text, callback){
    if('speechSynthesis' in window && ttsEnabled){
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.onend = ()=>{if(callback) callback();};
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } else if(callback) callback();
  }

  // Eventos
  restartBtn.addEventListener("click", resetQuiz);

  ttsBtn.addEventListener("click", ()=>{
    if(currentQuestion < questions.length && ttsEnabled) speak(questions[currentQuestion].question);
  });

  ttsToggleBtn.addEventListener("click", ()=>{
    ttsEnabled = !ttsEnabled;
    ttsToggleBtn.textContent = `Narrador: ${ttsEnabled?"ON":"OFF"}`;
  });

  themeToggle.addEventListener("click", ()=>{
    document.body.classList.toggle("dark");
    localStorage.setItem("quizTheme", document.body.classList.contains("dark")?"dark":"light");
    themeToggle.textContent = document.body.classList.contains("dark")?"☀️":"🌙";
  });

  if(localStorage.getItem("quizTheme")==="dark"){
    document.body.classList.add("dark");
    themeToggle.textContent="☀️";
  }

  // Inicializa
  resetQuiz();
});
