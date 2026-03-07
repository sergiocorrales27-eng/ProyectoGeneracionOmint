/* =========================================
   js/extras.js - Cupones, Ruleta, Countdown
   ========================================= */

// ============================================
// 🎟️ SISTEMA DE CUPONES DE AMOR
// ============================================
class CouponSystem {
  constructor() {
    this.container = document.getElementById('coupons-container');
    this.randomCoupons = [
      { title: "Un día de spa en casa", desc: "Con masajes y mimos incluidos 🧖‍♀️", color: "linear-gradient(135deg, #ff6b6b, #ffd93d)" },
      { title: "Maratón de tu serie favorita", desc: "Con pochoclos y mantita 📺", color: "linear-gradient(135deg, #667eea, #764ba2)" },
      { title: "Desayuno sorpresa en la cama", desc: "Con todo lo que te gusta 🥐", color: "linear-gradient(135deg, #00b894, #00cec9)" },
      { title: "Un beso de 1 minuto", desc: "Sin interrupciones ⏰", color: "linear-gradient(135deg, #e60073, #ff4da6)" },
      { title: "Elijo yo la cena", desc: "Y vos no te podés quejar 🍝", color: "linear-gradient(135deg, #fdcb6e, #e17055)" },
      { title: "Masaje de pies", desc: "20 minutos de relax total 👣", color: "linear-gradient(135deg, #a29bfe, #6c5ce7)" },
      { title: "Día sin celulares", desc: "Solo vos y yo 📵", color: "linear-gradient(135deg, #55a3ff, #0984e3)" },
      { title: "Picnic romántico", desc: "En nuestro lugar favorito 🧺", color: "linear-gradient(135deg, #ff7675, #d63031)" },
      { title: "Noche de karaoke", desc: "Cantamos hasta quedar afónicos 🎤", color: "linear-gradient(135deg, #fd79a8, #e84393)" },
      { title: "Vale por 100 besos", desc: "Canjeables cuando quieras 💋", color: "linear-gradient(135deg, #e60073, #ff00ff)" },
      { title: "Una tarde de juegos", desc: "Yo elijo los juegos 🎮", color: "linear-gradient(135deg, #00b894, #00cec9)" },
      { title: "Cena romántica", desc: "Con velas y todo 🕯️", color: "linear-gradient(135deg, #e17055, #fdcb6e)" },
      { title: "Sesión de fotos", desc: "Para tener más recuerdos 📸", color: "linear-gradient(135deg, #74b9ff, #a29bfe)" },
      { title: "Abrazo de 5 minutos", desc: "Sin soltarnos 🤗", color: "linear-gradient(135deg, #ffeaa7, #dfe6e9)" },
      { title: "Tu postre favorito", desc: "Hecho por mí 🍰", color: "linear-gradient(135deg, #ff6b6b, #ee5a24)" }
    ];
    this.loadUsedCoupons();
  }

  loadUsedCoupons() {
    const usedCoupons = JSON.parse(localStorage.getItem('usedCoupons') || '[]');
    if (this.container) {
      const coupons = this.container.querySelectorAll('.coupon');
      coupons.forEach(coupon => {
        const title = coupon.querySelector('.coupon-title')?.textContent.replace('Vale por: ', '').trim();
        if (usedCoupons.some(used => used.title === title)) {
          coupon.classList.add('used');
          coupon.style.opacity = '0.5';
        }
      });
    }
  }

  useCoupon(element) {
    if (element.classList.contains('used')) {
      this.showNotification('Este cupón ya fue usado 😊', 'info');
      return;
    }

    element.classList.add('used');
    element.style.opacity = '0.5';
    element.style.transform = 'scale(0.95)';

    const titleElement = element.querySelector('.coupon-title');
    if (!titleElement) return; // Exit if title element is not found

    const title = titleElement.textContent.replace('Vale por: ', '').trim(); // Get the title text only

    // Animación de confetti local
    this.couponConfetti(element);

    // Guardar en localStorage
    const usedCoupons = JSON.parse(localStorage.getItem('usedCoupons') || '[]');
    usedCoupons.push({
      title: title, // Usar la variable 'title' que obtuvimos
      date: new Date().toISOString()
    });
    localStorage.setItem('usedCoupons', JSON.stringify(usedCoupons));

    // Notificación
    this.showNotification(`¡Cupón canjeado! 🎉<br>${title}<br><small>¡Prepárate para disfrutarlo!</small>`, 'success');
  }

  generateRandomCoupon() {
    if (!this.container) return;

    // Check if the coupon already exists to avoid duplicates (optional but good)
    const existingTitles = Array.from(this.container.querySelectorAll('.coupon-title')).map(el => el.textContent.replace('Vale por: ', '').trim());
    let potentialCoupons = this.randomCoupons.filter(c => !existingTitles.includes(c.title));

    if (potentialCoupons.length === 0) {
        // Handle case where all random coupons are already displayed, maybe reset or show a message
        console.log("No more unique random coupons to generate.");
        // Optionally, pick any coupon if duplicates are okay
        potentialCoupons = this.randomCoupons;
    }

    const coupon = potentialCoupons[Math.floor(Math.random() * potentialCoupons.length)];

    const newCoupon = document.createElement('div');
    newCoupon.className = 'coupon new-coupon';
    newCoupon.style.background = coupon.color;
    newCoupon.innerHTML = `
      <div class="coupon-title">Vale por: ${coupon.title}</div>
      <div class="coupon-desc">${coupon.desc}</div>
      <div class="coupon-date">Válido hasta: ${this.getExpiryDate()}</div>
    `;

    newCoupon.addEventListener('click', () => this.useCoupon(newCoupon));

    // Animación de entrada
    newCoupon.style.animation = 'slideInUp 0.5s ease-out';
    this.container.appendChild(newCoupon);

    // Scroll hasta el nuevo cupón
    setTimeout(() => {
      newCoupon.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    // Efecto de brillo
    this.addSparkle(newCoupon);
  }

  getExpiryDate() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleDateString('es-ES');
  }

  couponConfetti(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 10; i++) {
      const confetti = document.createElement('div');
      confetti.textContent = ['💝', '✨', '🎁', '💕'][Math.floor(Math.random() * 4)];
      confetti.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        font-size: 20px;
        z-index: 9999;
        pointer-events: none;
        animation: confettiPop 1s ease-out forwards;
      `;
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 1000);
    }
  }

  addSparkle(element) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 30px;
      animation: sparkle 2s ease-in-out infinite;
    `;
    sparkle.textContent = '✨';
    element.style.position = 'relative'; // Ensure the coupon has relative positioning
    element.appendChild(sparkle);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
      success: 'linear-gradient(135deg, #00b894, #00cec9)',
      info: 'linear-gradient(135deg, #74b9ff, #0984e3)',
      love: 'linear-gradient(135deg, #e60073, #ff4da6)'
    };

    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      background: ${colors[type]};
      color: white;
      padding: 25px 40px;
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      z-index: 10000;
      text-align: center;
      max-width: 80%;
      animation: notificationPop 0.5s forwards;
    `;
    notification.innerHTML = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'notificationPopOut 0.5s forwards';
      setTimeout(() => notification.remove(), 500);
    }, 2500);
  }
}

// ============================================
// 🎡 RULETA DE CITAS
// ============================================
class DateWheel {
  constructor() {
    this.canvas = document.getElementById('wheel-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.options = [
      "Cine 🎬", "Restaurant 🍽️", "Parque 🌳", "Museo 🎨",
      "Café ☕", "Cocinar juntos 👨‍🍳", "Netflix 📺", "Shopping 🛍️", "Helado 🍦"
    ];
    this.colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#6bcf7f',
      '#e056fd', '#f38181', '#fce38a', '#786fa6', '#f8b500'
    ];
    this.isSpinning = false;
    this.rotation = 0;

    // Ensure canvas has dimensions, either from CSS or set here
    if (this.canvas.width === 0 || this.canvas.height === 0) {
        this.canvas.width = 250; // Example size
        this.canvas.height = 250; // Example size
    }

    this.draw();
  }

  draw() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.9; // Adjust radius based on canvas size
    const anglePerSection = (Math.PI * 2) / this.options.length;

    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(this.rotation);
    this.ctx.translate(-centerX, -centerY);

    this.options.forEach((option, i) => {
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.arc(centerX, centerY, radius, i * anglePerSection, (i + 1) * anglePerSection);
      this.ctx.closePath();
      this.ctx.fillStyle = this.colors[i];
      this.ctx.fill();
      this.ctx.strokeStyle = '#fff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      this.ctx.save();
      this.ctx.translate(centerX, centerY);
      this.ctx.rotate(i * anglePerSection + anglePerSection / 2);
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = 'white';
      this.ctx.font = `bold ${radius * 0.12}px Arial`; // Scale font size with radius
      this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
      this.ctx.shadowBlur = 3;
      this.ctx.fillText(option, radius * 0.65, 3); // Adjust text position based on radius
      this.ctx.restore();
    });

    // Center circle
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius * 0.15, 0, Math.PI * 2); // Scale center circle
    this.ctx.fillStyle = '#fff';
    this.ctx.fill();
    this.ctx.strokeStyle = '#e60073';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    this.ctx.restore();
  }

  spin() {
    if (this.isSpinning) return;
    this.isSpinning = true;

    const resultEl = document.getElementById('wheel-result');
    if (resultEl) resultEl.innerHTML = '';

    const totalRotation = Math.PI * 2 * (5 + Math.random() * 3);
    const duration = 3000 + Math.random() * 2000;
    const startTime = Date.now();
    const startRotation = this.rotation;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      this.rotation = startRotation + totalRotation * easeOut;

      this.draw();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const normalizedRotation = this.rotation % (Math.PI * 2);
        // Adjust rotation calculation to match the pointer (usually at the top or right)
        // Assuming the pointer is at the top (negative y-axis)
        const pointerAngle = Math.PI * 1.5; // Top position
        const adjustedRotation = (normalizedRotation - pointerAngle + (Math.PI*4)) % (Math.PI * 2); // Ensure positive
        const sectionAngle = (Math.PI * 2) / this.options.length;
        const selectedIndex = Math.floor(adjustedRotation / sectionAngle);
        const winningOption = this.options[selectedIndex];

        this.showResult(winningOption);
        this.saveResult(winningOption); // <-- Added call to save result
        this.isSpinning = false;
      }
    };
    animate();
  }

  showResult(option) {
    const resultEl = document.getElementById('wheel-result');
    if (!resultEl) return;

    resultEl.innerHTML = `
      <div style="animation: bounceIn 0.5s;">
        <h3 style="color: #e60073; margin-bottom: 10px;">¡Cita elegida!</h3>
        <p style="font-size: 1.5em; font-weight: bold;">${option}</p>
        <p style="margin-top: 10px;">¡Plan para la próxima salida! 💕</p>
      </div>
    `;
    // Optional: Confetti or celebration effect
    this.celebrateResult();
  }

  saveResult(option) {
    const history = JSON.parse(localStorage.getItem('wheel_history') || '[]');
    history.push({
      option: option,
      date: new Date().toISOString()
    });
    localStorage.setItem('wheel_history', JSON.stringify(history));
  }

  celebrateResult() {
    // Basic confetti effect similar to CouponSystem
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const emoji = document.createElement('div');
        emoji.textContent = ['🎉', '🎊', '✨', '💕', '🎡', '🎯'][Math.floor(Math.random() * 6)];
        emoji.style.cssText = `
          position: fixed;
          left: ${Math.random() * window.innerWidth}px;
          top: -50px;
          font-size: ${20 + Math.random() * 20}px;
          z-index: 9999;
          pointer-events: none;
          animation: fall 3s ease-out forwards;
        `;
        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), 3000);
      }, i * 50);
    }
  }
}

// ============================================
// ⏰ SISTEMA DE CUENTA REGRESIVA
// ============================================
class CountdownTimer {
  constructor() {
    // ⚠️ CAMBIAR ESTAS FECHAS POR LAS REALES
    this.specialDates = [
      { name: "Nuestro Aniversario", date: '2025-06-15T00:00:00', emoji: "💕" }, // Use ISO format for consistency
      { name: "Tu Cumpleaños", date: '2025-10-18T00:00:00', emoji: "🎂" },
      { name: "Mi Cumpleaños", date: '2025-09-02T00:00:00', emoji: "🎉" },
      { name: "San Valentín", date: '2026-02-14T00:00:00', emoji: "💝" }, // Adjusted year if needed
      { name: "Navidad", date: '2025-12-25T00:00:00', emoji: "🎄" }
    ];

    this.countdownElement = document.getElementById('countdown-timer'); // Assuming you have an element with this ID
    if (!this.countdownElement) return;

    this.findNextEvent();
    this.startCountdown();
  }

  findNextEvent() {
    const now = new Date();
    let nextEvent = null;
    let minDiff = Infinity;

    this.specialDates.forEach(event => {
      let eventDate = new Date(event.date);
      // If the date is in the past for the current year, check next year's date
      if (eventDate < now) {
        eventDate.setFullYear(eventDate.getFullYear() + 1);
      }
      const diff = eventDate - now;
      if (diff > 0 && diff < minDiff) {
        minDiff = diff;
        nextEvent = { ...event, date: eventDate }; // Store the calculated future date
      }
    });

    // If no future event found in the list (e.g., all passed), default to the "soonest" next year
    if (!nextEvent) {
        this.specialDates.forEach(event => {
            let eventDate = new Date(event.date);
            eventDate.setFullYear(now.getFullYear() + 1); // Set to next year explicitly
             const diff = eventDate - now;
             if (diff > 0 && diff < minDiff) {
                minDiff = diff;
                nextEvent = { ...event, date: eventDate };
            }
        });
    }

    this.currentEvent = nextEvent;
  }

  updateCountdown() {
    if (!this.currentEvent) return; // No event to countdown to

    const now = new Date();
    const target = new Date(this.currentEvent.date);
    const difference = target - now;

    if (difference <= 0) {
      this.celebrateEvent();
      this.findNextEvent(); // Find the next event after celebration
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    this.updateDisplay(days, hours, minutes, seconds);

    const titleEl = this.countdownElement.querySelector('.countdown-title'); // Assuming a title element exists
    if (titleEl) {
      titleEl.innerHTML = `${this.currentEvent.emoji} ${this.currentEvent.name} en:`;
    }
  }

  updateDisplay(days, hours, minutes, seconds) {
    const elements = {
      days: this.countdownElement.querySelector('#days'),
      hours: this.countdownElement.querySelector('#hours'),
      minutes: this.countdownElement.querySelector('#minutes'),
      seconds: this.countdownElement.querySelector('#seconds')
    };

    if (elements.days && elements.hours && elements.minutes && elements.seconds) {
      elements.days.textContent = String(days).padStart(2, '0');
      elements.hours.textContent = String(hours).padStart(2, '0');
      elements.minutes.textContent = String(minutes).padStart(2, '0');
      elements.seconds.textContent = String(seconds).padStart(2, '0');

      elements.seconds.style.animation = 'pulse 0.5s';
      setTimeout(() => {
        elements.seconds.style.animation = '';
      }, 500);
    }
  }

  celebrateEvent() {
    if (this.countdownElement) {
      this.countdownElement.innerHTML = `
        <div style="text-align: center; padding: 30px; animation: bounceIn 1s;">
          <h2 style="color: var(--primary); margin-bottom: 20px;">¡LLEGÓ EL DÍA! 🎉🎊</h2>
          <div style="font-size: 5em;">${this.currentEvent.emoji}</div>
          <p style="font-size: 1.5em; margin-top: 20px; font-weight: bold;">
            ¡Feliz ${this.currentEvent.name}!
          </p>
        </div>
      `;
      this.massiveConfetti();
    }
  }

  massiveConfetti() {
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        const emojis = ['🎉', '🎊', '🎈', '🎁', '💕', '⭐', '✨', this.currentEvent.emoji];
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.cssText = `
          position: fixed;
          left: ${Math.random() * window.innerWidth}px;
          top: -50px;
          font-size: ${20 + Math.random() * 30}px;
          z-index: 9999;
          pointer-events: none;
          animation: fall ${3 + Math.random() * 2}s ease-out forwards;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
      }, i * 20);
    }
  }

  startCountdown() {
      if (!this.currentEvent) {
          console.error("No upcoming event found for countdown.");
          return;
      }
    this.updateCountdown(); // Initial update
    this.intervalId = setInterval(() => this.updateCountdown(), 1000); // Store interval ID
  }

  // Optional: Method to stop the timer if needed
  stopCountdown() {
      clearInterval(this.intervalId);
  }
}

// ============================================
// 🎯 INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar sistemas solo si los elementos correspondientes existen
  if (document.getElementById('coupons-container')) {
    window.couponSystem = new CouponSystem();
  }
  if (document.getElementById('wheel-canvas')) {
    window.dateWheel = new DateWheel();
  }
  if (document.getElementById('countdown-timer')) { // Make sure you have this element in your HTML
    window.countdown = new CountdownTimer();
  }

  // Event listeners para botones globales
  const spinBtn = document.querySelector('.spin-btn'); // Assuming a button with this class exists for the wheel
  if (spinBtn && window.dateWheel) {
    spinBtn.addEventListener('click', () => {
      window.dateWheel.spin();
    });
  }

  // Find the generate coupon button more reliably if it doesn't have a specific ID/class
  // Example: Find a button containing specific text
  const couponBtns = document.querySelectorAll('button');
  couponBtns.forEach(btn => {
      if (btn.textContent.includes("Generar Cupón Aleatorio")) { // Adjust text if needed
        btn.addEventListener('click', () => {
            if (window.couponSystem) {
                window.couponSystem.generateRandomCoupon();
            }
        });
      }
  });

});

// ============================================
// 🎨 ESTILOS CSS (Inyectados dinámicamente)
// ============================================
const extrasStyles = document.createElement('style');
extrasStyles.textContent = `
  @keyframes slideInUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-20px); } }
  @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); opacity: 1; } }
  @keyframes sparkle { 0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; } 50% { transform: scale(1.5) rotate(180deg); opacity: 0.5; } }
  @keyframes confettiPop { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * -200 - 50}px) scale(0); opacity: 0; } }
  @keyframes notificationPop { from { transform: translate(-50%, -50%) scale(0); } to { transform: translate(-50%, -50%) scale(1); } }
  @keyframes notificationPopOut { from { transform: translate(-50%, -50%) scale(1); opacity: 1; } to { transform: translate(-50%, -50%) scale(0); opacity: 0; } }
  @keyframes fall { to { transform: translateY(${window.innerHeight + 100}px) rotate(360deg); opacity: 0; } }
  @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }

  .new-coupon { position: relative; overflow: visible !important; } /* Ensure sparkle is visible */
  .coupon.used { pointer-events: none; filter: grayscale(0.7); opacity: 0.6 !important; } /* Stronger indication for used */
  .coupon-date { font-size: 0.8em; opacity: 0.8; margin-top: 10px; text-align: right; }
`;
document.head.appendChild(extrasStyles);

// ============================================
// 🔧 FUNCIONES GLOBALES (para compatibilidad con HTML onclick si aún existen)
// ============================================
// It's better to remove onclick attributes from HTML and use event listeners as shown in the DOMContentLoaded section.
// However, these are kept for backward compatibility if needed.
window.useCoupon = function(element) {
  if (window.couponSystem) {
    window.couponSystem.useCoupon(element);
  }
};
window.generateRandomCoupon = function() {
  if (window.couponSystem) {
    window.couponSystem.generateRandomCoupon();
  }
};
window.spinWheel = function() {
  if (window.dateWheel) {
    window.dateWheel.spin();
  }
};
