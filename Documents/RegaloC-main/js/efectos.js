
/* =========================================
   js/effects.js - Efectos especiales mágicos
   ========================================= */

// ============================================
// 🌟 EFECTO DE CLICK CON EMOJIS
// ============================================
function initClickEffects() {
  document.addEventListener('click', function(e) {
    // No crear efecto en botones de juegos
    if (e.target.closest('#juegos')) return;
    
    const emojis = ['💕', '❤️', '💖', '💗', '💝', '✨', '🌟', '💫'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.textContent = emoji;
    effect.style.left = e.clientX + 'px';
    effect.style.top = e.clientY + 'px';
    effect.style.fontSize = '30px';
    
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 600);
  });
}

// ============================================
// 💝 MENSAJES DEL DÍA
// ============================================
const dailyMessages = [
  "Hoy es un día perfecto para amarte más 💕",
  "Tu sonrisa ilumina mi mundo ✨",
  "Cada día contigo es un regalo 🎁",
  "Sos mi persona favorita en el universo 🌟",
  "Gracias por existir y elegirme 💖",
  "Nuestro amor es infinito ∞",
  "Sos mi lugar feliz 🏡",
  "Contigo todo es más bonito 🌈",
  "Te amo hasta la luna y de vuelta 🌙",
  "Sos mi sueño hecho realidad 💫",
  "Cada momento contigo es mágico ✨",
  "Tu amor es mi superpoder 💪",
  "Sos la razón de mi sonrisa 😊",
  "Mi corazón es tuyo para siempre 💝",
  "Juntos somos invencibles 👫"
];

function showDailyMessage() {
  const message = dailyMessages[Math.floor(Math.random() * dailyMessages.length)];
  const messageEl = document.createElement('div');
  messageEl.className = 'daily-message';
  messageEl.textContent = message;
  
  document.body.appendChild(messageEl);
  
  setTimeout(() => {
    messageEl.style.animation = 'popOut 0.5s forwards';
    setTimeout(() => messageEl.remove(), 500);
  }, 3000);
}

// ============================================
// 📅 CONTADOR DE DÍAS JUNTOS
// ============================================
function createDaysCounter() {
  // ⚠️ CAMBIAR ESTA FECHA POR LA FECHA REAL
  const START_DATE = new Date('2025-03-23'); // Cambiar por su fecha
  
  const counter = document.createElement('div');
  counter.className = 'love-counter';
  counter.id = 'daysCounter';
  
  function updateCounter() {
    const today = new Date();
    const diffTime = Math.abs(today - START_DATE);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    counter.innerHTML = `💕 ${diffDays} días juntos`;
  }
  
  updateCounter();
  setInterval(updateCounter, 60000); // Actualizar cada minuto
  
  counter.addEventListener('click', () => {
    showDailyMessage();
  });
  
  document.body.appendChild(counter);
}

// ============================================
// 🎁 CAJA DE SORPRESAS
// ============================================
const surprises = [
  { emoji: "🌹", message: "Una rosa para la más hermosa" },
  { emoji: "☕", message: "Un cafecito para compartir" },
  { emoji: "🍰", message: "Un postre dulce como vos" },
  { emoji: "📸", message: "Capturando momentos eternos" },
  { emoji: "🎵", message: "Nuestra canción está sonando" },
  { emoji: "🌅", message: "Cada amanecer es mejor contigo" },
  { emoji: "🏖️", message: "Próxima parada: la playa" },
  { emoji: "🍕", message: "Pizza y Netflix esta noche?" },
  { emoji: "💑", message: "Tú y yo contra el mundo" },
  { emoji: "🎈", message: "Celebremos cada día juntos" },
  { emoji: "🎬", message: "Vamos al cine este finde?" },
  { emoji: "🍦", message: "Heladito para endulzar el día" },
  { emoji: "🎮", message: "Torneo de juegos esta noche!" },
  { emoji: "📚", message: "Leamos juntos antes de dormir" },
  { emoji: "🚗", message: "Road trip sorpresa!" }
];

function createSurpriseBox() {
  const box = document.createElement('div');
  box.className = 'surprise-box';
  
  box.addEventListener('click', function() {
    this.classList.add('opened');
    
    const surprise = surprises[Math.floor(Math.random() * surprises.length)];
    
    const notification = document.createElement('div');
    notification.className = 'love-notification';
    notification.innerHTML = `
      <span style="font-size: 2rem">${surprise.emoji}</span><br>
      ${surprise.message}
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
    
    setTimeout(() => this.classList.remove('opened'), 500);
  });
  
  document.body.appendChild(box);
}

// ============================================
// 🎵 VISUALIZADOR DE MÚSICA
// ============================================
function createMusicVisualizer() {
  const visualizer = document.createElement('div');
  visualizer.className = 'music-visualizer';
  
  for (let i = 0; i < 5; i++) {
    const bar = document.createElement('div');
    bar.className = 'music-bar';
    bar.style.animationDelay = `${i * 0.1}s`;
    visualizer.appendChild(bar);
  }
  
  document.body.appendChild(visualizer);
  
  // Conectar con el reproductor de música
  const music = document.getElementById('bg-music');
  if (music) {
    music.addEventListener('play', () => {
      visualizer.classList.add('active');
    });
    music.addEventListener('pause', () => {
      visualizer.classList.remove('active');
    });
  }
}

// ============================================
// 🎆 FUEGOS ARTIFICIALES
// ============================================
function createFirework(x, y) {
  const colors = ['#ff0084', '#ff00ff', '#00ffff', '#ffff00', '#ff4da6'];
  
  for(let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'firework-particle';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    const angle = (Math.PI * 2 * i) / 20;
    const velocity = 50 + Math.random() * 50;
    particle.style.transform = `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px)`;
    
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
  }
}

function randomFireworks() {
  setInterval(() => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.5;
    createFirework(x, y);
  }, 8000);
}

// ============================================
// 🌸 PÉTALOS CAYENDO
// ============================================
function createPetal() {
  const petal = document.createElement('div');
  petal.className = 'petal';
  petal.textContent = '🌸';
  petal.style.left = Math.random() * window.innerWidth + 'px';
  petal.style.animationDuration = (Math.random() * 5 + 5) + 's';
  petal.style.fontSize = (Math.random() * 10 + 15) + 'px';
  
  document.body.appendChild(petal);
  setTimeout(() => petal.remove(), 10000);
}

function startPetalRain() {
  setInterval(createPetal, 3000);
}

// ============================================
// 💫 ESTRELLAS FUGACES
// ============================================
function createShootingStar() {
  const star = document.createElement('div');
  star.className = 'shooting-star';
  star.style.top = Math.random() * window.innerHeight * 0.5 + 'px';
  star.style.left = '-10px';
  
  document.body.appendChild(star);
  setTimeout(() => star.remove(), 1000);
}

function startShootingStars() {
  setInterval(createShootingStar, 8000);
}

// ============================================
// 🎉 INICIALIZACIÓN
// ============================================
function initMagicalEffects() {
  // Activar efectos según la página
  initClickEffects();
  createDaysCounter();
  createSurpriseBox();
  createMusicVisualizer();
  
  // Mensaje de bienvenida
  setTimeout(showDailyMessage, 2000);
  
  // Mensajes periódicos
  setInterval(showDailyMessage, 45000);
  
  // Efectos ambientales (activar según preferencia)
  startPetalRain();
  startShootingStars();
  
  // Fuegos artificiales ocasionales
  if (document.querySelector('#inicio')) {
    randomFireworks();
  }
  
  // Cursor personalizado (opcional)
  // document.body.classList.add('custom-cursor');
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMagicalEffects);
} else {
  initMagicalEffects();
}