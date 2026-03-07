/* =========================================
   js/core.js - Funciones globales compartidas
   ========================================= */

/**
 * Clase para manejar el modal global
 */
class ModalManager {
  constructor(selector = '#modal') {
    this.modal = document.querySelector(selector);
    if (!this.modal) return;
    
    this.imgEl = this.modal.querySelector('#modal-img');
    this.textEl = this.modal.querySelector('#modal-text');
    this.closeBtn = this.modal.querySelector('.close');
    
    this.init();
  }
  
  init() {
    // Event listeners
    this.closeBtn?.addEventListener('click', () => this.close());
    
    // Cerrar al hacer click fuera
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    
    // Cerrar con ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  }
  
  open(text, imgSrc = null) {
    // Establecer contenido
    if (this.textEl) this.textEl.textContent = text;
    
    // Manejar imagen
    if (imgSrc && imgSrc.trim() !== "" && this.imgEl) {
      this.imgEl.src = imgSrc;
      this.imgEl.style.display = 'block';
      this.imgEl.onload = () => {
        this.modal.classList.add('active');
      };
    } else {
      if (this.imgEl) this.imgEl.style.display = 'none';
      this.modal.classList.add('active');
    }
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Limpiar después de la animación
    setTimeout(() => {
      if (this.imgEl) this.imgEl.src = '';
    }, 300);
  }
}

/**
 * Clase para manejar el reproductor de música
 */
class MusicPlayer {
  constructor(audioId = 'bg-music', btnSelector = '.music-btn') {
    this.audio = document.getElementById(audioId);
    this.btn = document.querySelector(btnSelector);
    this.isPlaying = false;
    
    if (this.audio && this.btn) {
      this.init();
    }
  }
  
  init() {
    // Click en el botón
    this.btn.addEventListener('click', () => this.toggle());
    
    // Intentar reproducir con la primera interacción del usuario
    document.addEventListener('click', () => {
      if (!this.isPlaying && this.audio.paused) {
        this.play();
      }
    }, { once: true });
    
    // Actualizar estado si el audio termina
    this.audio.addEventListener('ended', () => {
      this.btn.classList.remove('playing');
      this.btn.innerHTML = '🎵';
      this.isPlaying = false;
    });
  }
  
  toggle() {
    if (this.audio.paused) {
      this.play();
    } else {
      this.pause();
    }
  }
  
  play() {
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.btn.classList.add('playing');
      this.btn.innerHTML = '🎶';
      this.showNotification('🎵 Música activada');
    }).catch(e => {
      console.log('No se pudo reproducir el audio:', e);
    });
  }
  
  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.btn.classList.remove('playing');
    this.btn.innerHTML = '🎵';
    this.showNotification('⏸️ Música pausada');
  }
  
  showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 30px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px 20px;
      border-radius: 20px;
      font-size: 14px;
      z-index: 1000;
      animation: fadeInOut 2s ease-out forwards;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 2000);
  }
}

/**
 * Clase para manejar animaciones al scroll
 */
class ScrollAnimator {
  constructor() {
    this.elements = [];
    this.init();
  }
  
  init() {
    // Configurar el observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Animar elementos hijos con delay
          const children = entry.target.querySelectorAll('[data-animate]');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('visible');
            }, index * 100);
          });
        }
      });
    }, observerOptions);
  }
  
  observe(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.classList.add('scroll-animate');
      this.observer.observe(el);
    });
  }
}

/**
 * Clase para manejar efectos de typewriter
 */
class TypeWriter {
  constructor(element, options = {}) {
    this.element = element;
    this.text = options.text || element.textContent;
    this.speed = options.speed || 50;
    this.delay = options.delay || 0;
    this.callback = options.callback || null;
    
    this.element.textContent = '';
    this.index = 0;
    
    setTimeout(() => this.type(), this.delay);
  }
  
  type() {
    if (this.index < this.text.length) {
      this.element.textContent += this.text.charAt(this.index);
      this.index++;
      setTimeout(() => this.type(), this.speed);
    } else if (this.callback) {
      this.callback();
    }
  }
}

/**
 * Utilidades generales
 */
const Utils = {
  // Debounce para optimizar eventos
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle para limitar llamadas
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  },
  
  // Formatear fecha
  formatDate(date) {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('es-ES', options);
  },
  
  // Calcular días entre fechas
  daysBetween(date1, date2) {
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const differenceMs = Math.abs(date1 - date2);
    return Math.round(differenceMs / ONE_DAY);
  },
  
  // Precargar imágenes
  preloadImages(urls) {
    return Promise.all(urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
    }));
  },
  
  // Crear elemento con propiedades
  createElement(tag, props = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(props).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else if (key.startsWith('data')) {
        element.setAttribute(key, value);
      } else {
        element[key] = value;
      }
    });
    
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    
    return element;
  },
  
  // Animación de contador
  animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      element.textContent = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  },
  
  // Copiar al portapapeles
  copyToClipboard(text) {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return Promise.resolve();
      } catch (err) {
        document.body.removeChild(textArea);
        return Promise.reject(err);
      }
    }
  }
};

/**
 * Sistema de notificaciones
 */
class NotificationSystem {
  constructor() {
    this.container = this.createContainer();
  }
  
  createContainer() {
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 5000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(container);
    return container;
  }
  
  show(message, type = 'info', duration = 3000) {
    const colors = {
      info: '#3498db',
      success: '#2ecc71',
      warning: '#f39c12',
      error: '#e74c3c',
      love: '#e60073'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
      background: ${colors[type]};
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      animation: slideInRight 0.3s ease-out;
      max-width: 300px;
      word-wrap: break-word;
      font-size: 14px;
      font-weight: 500;
    `;
    notification.textContent = message;
    
    this.container.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
}

/**
 * Gestión de localStorage con fallback
 */
class Storage {
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }
  
  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }
  
  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Añadir animaciones CSS necesarias
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(10px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }
  
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .scroll-animate {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;
  }
  
  .scroll-animate.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

// Exportar para usar en otros módulos
window.ModalManager = ModalManager;
window.MusicPlayer = MusicPlayer;
window.ScrollAnimator = ScrollAnimator;
window.TypeWriter = TypeWriter;
window.Utils = Utils;
window.NotificationSystem = NotificationSystem;
window.Storage = Storage; 

// --- Lógica para el Video de YouTube con Poster ---
if (document.querySelector(".video-container")) {
  const videoContainer = document.querySelector(".video-container");

  videoContainer.addEventListener("click", () => {
    const youtubeId = videoContainer.dataset.youtubeId;
    
    // Crear el iframe
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
    iframe.title = "YouTube video player";
    iframe.frameborder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    
    // Reemplazar la imagen y el botón por el video
    videoContainer.innerHTML = "";
    videoContainer.appendChild(iframe);
  });
}
// 1. LAZY LOADING MEJORADO
// Agregar en js/core.js
const lazyImageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add('loaded');
      lazyImageObserver.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  lazyImageObserver.observe(img);
});

// 4. SERVICE WORKER PARA OFFLINE
// Crear sw.js en la raíz
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/global.css',
        '/js/main.js'
      ]);
    })
  );
});
// Para el día del cumple - explosión de confeti
function birthdayExplosion() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
  
  // Mensaje especial
  setTimeout(() => {
    alert('¡FELIZ CUMPLEAÑOS MI AMOR! 🎂🎉');
  }, 1000);
}