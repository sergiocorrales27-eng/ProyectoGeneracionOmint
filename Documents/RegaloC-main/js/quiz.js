/* =========================================
   js/quiz.js - Quiz "¿Cuánto me conocés?"
   ========================================= */

const quizData = [
  {
    question: "¿Cuál es mi lugar favorito para comer juntos?",
    options: ["McDonald's", "Rodi", "El Roa", "La Tablita"],
    correct: 1,
    feedback: "¡Sí! Rodi es nuestro segundo hogar 🍽️"
  },
  {
    question: "¿Qué hago cuando quiero molestarte?",
    options: ["Te ignoro", "Te mando TikToks raros", "Te digo que 'no somos nada'", "Te peleo con todo"],
    correct: 2,
    feedback: "Soy un boludo, lo sé... pero es mi love language 😁"
  },
  {
    question: "¿Qué me mandaste cuando estaba enfermo?",
    options: ["Un mensaje de texto", "Bananita Dolca y miel", "Una playlist", "Nada (¿qué te pensás?)"],
    correct: 1,
    feedback: "Eso me derritió el corazón 😍"
  },
  {
    question: "¿Dónde nos conocimos?",
    options: ["En una fiesta", "En la facultad", "En la oficina", "Por Instagram"],
    correct: 2,
    feedback: "En la oficina, donde empezó todo 💼❤️"
  },
  {
    question: "¿Qué me hace infinitamente feliz?",
    options: ["El boxeo", "Un abrazo tuyo", "El café", "Dormir"],
    correct: 1,
    feedback: "Un abrazo tuyo vale más que la lotería 🤗"
  },
  {
    question: "¿Cuál es mi mayor defecto según yo mismo?",
    options: ["Soy muy serio", "Soy tibio a veces", "Llego tarde siempre", "Soy muy celoso"],
    correct: 1,
    feedback: "Pero por vos daría la vida, eso lo sabés 💪"
  },
  {
    question: "¿A qué recital vamos juntos?",
    options: ["Coldplay", "Bad Bunny", "Morat", "Taylor Swift"],
    correct: 2,
    feedback: "¡Morat en septiembre! Ya falta poco 🎶"
  },
  {
    question: "¿Qué postre compartimos que es el favorito de los dos?",
    options: ["Tiramisú", "Carrot cake", "Cheesecake", "Brownie con helado"],
    correct: 1,
    feedback: "La mejor carrot cake del mundo, compartida con vos 🥕🎂"
  },
  {
    question: "¿Qué te dije en la Facultad de Derecho cuando estaba mal?",
    options: ["'Te extraño'", "'¿Por qué te seguís quedando conmigo?'", "'No sé qué haría sin vos'", "'Tengo miedo'"],
    correct: 1,
    feedback: "Y nunca me soltaste la mano. Eso es único 🫶"
  },
  {
    question: "¿Cuántas razones tengo para elegirte cada día?",
    options: ["11", "50", "101", "Infinitas"],
    correct: 3,
    feedback: "Podría darte 101 razones... pero en realidad son infinitas 💕"
  }
];

// ============================================
// ESTADO DEL QUIZ
// ============================================
let currentQuestion = 0;
let score = 0;
let quizStarted = false;
let answered = false;

// ============================================
// INICIAR QUIZ
// ============================================
function startQuiz() {
  currentQuestion = 0;
  score = 0;
  quizStarted = true;
  answered = false;

  const startBtn = document.querySelector('.quiz-start-btn');
  if (startBtn) startBtn.style.display = 'none';

  renderQuestion();
}

// ============================================
// RENDERIZAR PREGUNTA
// ============================================
function renderQuestion() {
  const questionEl = document.getElementById('quiz-question');
  const optionsEl = document.getElementById('quiz-options');
  const scoreEl = document.getElementById('quiz-score');

  if (!questionEl || !optionsEl) return;

  answered = false;
  scoreEl.innerHTML = '';

  const q = quizData[currentQuestion];

  questionEl.innerHTML = `
    <div style="text-align:center;">
      <p style="font-size:0.85rem; opacity:0.8; margin-bottom:8px;">
        Pregunta ${currentQuestion + 1} de ${quizData.length}
      </p>
      <p style="font-size:1.1rem; font-weight:600;">${q.question}</p>
    </div>
  `;

  optionsEl.innerHTML = '';
  q.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.textContent = option;
    btn.onclick = () => selectAnswer(index, btn);
    optionsEl.appendChild(btn);
  });
}

// ============================================
// SELECCIONAR RESPUESTA
// ============================================
function selectAnswer(index, btn) {
  if (answered) return;
  answered = true;

  const q = quizData[currentQuestion];
  const allBtns = document.querySelectorAll('.quiz-option-btn');

  allBtns.forEach((b, i) => {
    b.style.pointerEvents = 'none';
    if (i === q.correct) {
      b.style.background = 'linear-gradient(135deg, rgba(0,184,148,0.9), rgba(0,206,201,0.9))';
      b.style.borderColor = 'rgba(255,255,255,0.8)';
    } else if (i === index && index !== q.correct) {
      b.style.background = 'linear-gradient(135deg, rgba(214,48,49,0.9), rgba(255,107,107,0.9))';
      b.style.borderColor = 'rgba(255,255,255,0.8)';
    }
  });

  const scoreEl = document.getElementById('quiz-score');

  if (index === q.correct) {
    score++;
    scoreEl.innerHTML = `
      <div style="color:#55efc4; font-weight:bold; text-align:center; margin:10px 0; font-size:1.1rem;">
        ✅ ¡Correcto! ${q.feedback}
      </div>
    `;
  } else {
    scoreEl.innerHTML = `
      <div style="color:#ff7675; font-weight:bold; text-align:center; margin:10px 0; font-size:1.1rem;">
        ❌ Casi... ${q.feedback}
      </div>
    `;
  }

  // Botón para continuar
  setTimeout(() => {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'quiz-option-btn';
    nextBtn.style.marginTop = '10px';
    nextBtn.style.textAlign = 'center';
    nextBtn.style.background = 'linear-gradient(135deg, rgba(230,0,115,0.85), rgba(255,77,166,0.85))';

    if (currentQuestion < quizData.length - 1) {
      nextBtn.textContent = 'Siguiente →';
      nextBtn.onclick = () => {
        currentQuestion++;
        renderQuestion();
      };
    } else {
      nextBtn.textContent = 'Ver resultado 🎉';
      nextBtn.onclick = showResult;
    }

    scoreEl.appendChild(nextBtn);
  }, 800);
}

// ============================================
// RESULTADO FINAL
// ============================================
function showResult() {
  const questionEl = document.getElementById('quiz-question');
  const optionsEl = document.getElementById('quiz-options');
  const scoreEl = document.getElementById('quiz-score');

  if (!questionEl || !optionsEl) return;

  optionsEl.innerHTML = '';

  const percentage = Math.round((score / quizData.length) * 100);

  let emoji, message;
  if (percentage === 100) {
    emoji = '🏆';
    message = '¡Me conocés perfectamente! Sos mi persona 💕';
  } else if (percentage >= 70) {
    emoji = '💖';
    message = '¡Me conocés muy bien! Somos un equipo 😍';
  } else if (percentage >= 40) {
    emoji = '😊';
    message = 'Bien, pero hay que pasar más tiempo juntos 😉';
  } else {
    emoji = '😅';
    message = 'Tranquila, tenemos toda la vida para conocernos mejor 💕';
  }

  questionEl.innerHTML = `
    <div style="text-align:center; padding:10px;">
      <div style="font-size:3rem; margin-bottom:10px;">${emoji}</div>
      <p style="font-size:1.4rem; font-weight:bold; margin-bottom:8px;">
        ${score} / ${quizData.length} correctas
      </p>
      <p style="font-size:1rem; opacity:0.9;">${message}</p>
    </div>
  `;

  scoreEl.innerHTML = `
    <button class="quiz-option-btn" style="margin-top:15px; text-align:center;" onclick="startQuiz()">
      🔄 Jugar de nuevo
    </button>
  `;
}
