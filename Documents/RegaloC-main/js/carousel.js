/* =========================================
   js/carousel.js - Carrusel mejorado con indicadores y touch
   ========================================= */

class EnhancedCarousel {
  constructor(selector, options = {}) {
    this.container = document.querySelector(selector);
    if (!this.container) return;
    
    // Configuración
    this.options = {
      autoPlay: options.autoPlay !== undefined ? options.autoPlay : true,
      interval: options.interval || 4000,
      showIndicators: options.showIndicators !== undefined ? options.showIndicators : true,
      enableTouch: options.enableTouch !== undefined ? options.enableTouch : true,
      enableKeyboard: options.enableKeyboard !== undefined ? options.enableKeyboard : true,
      fadeEffect: options.fadeEffect !== undefined ? options.fadeEffect : true,
      pauseOnHover: options.pauseOnHover !== undefined ? options.pauseOnHover : true
    };
    
    // Elementos
    this.slides = Array.from(this.container.querySelectorAll('img'));
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    this.isTransitioning = false;
    
    // Touch/Swipe
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    // Inicializar
    this.init();
  }
  
  init() {
    if (this.slides.length <= 1) return;
    
    // Crear indicadores
    if (this.options.showIndicators) {
      this.createIndicators();
    }
    
    // Crear botones de navegación
    this.createNavButtons();
    
    // Iniciar autoplay
    if (this.options.autoPlay) {
      this.startAutoPlay();
    }
    
    // Event listeners
    this.attachEventListeners();
    
    // Precargar próximas imágenes
    this.preloadImages();
  }
  
  createIndicators() {
    // Buscar contenedor existente o crear uno nuevo
    let indicatorsContainer = this.container.querySelector('.carousel-indicators');
    
    if (!indicatorsContainer) {
      indicatorsContainer = document.createElement('div');
      indicatorsContainer.className = 'carousel-indicators';
      this.container.appendChild(indicatorsContainer);
    }
    
    this.indicatorsContainer = indicatorsContainer;
    this.indicators = [];
    
    // Limpiar indicadores existentes
    indicatorsContainer.innerHTML = '';
    
    // Crear indicadores
    this.slides.forEach((_, index) => {
      const indicator = document.createElement('button');
      indicator.className = 'indicator';
      indicator.setAttribute('aria-label', `Ir a imagen ${index + 1}`);
      
      if (index === 0) {
        indicator.classList.add('active');
      }
      
      indicator.addEventListener('click', () => {
        this.goToSlide(index);
      });
      
      indicatorsContainer.appendChild(indicator);
      this.indicators.push(indicator);
    });
  }
  
  createNavButtons() {
    // Botón anterior
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-prev';
    prevBtn.innerHTML = '❮';
    prevBtn.setAttribute('aria-label', 'Imagen anterior');
    prevBtn.addEventListener('click', () => this.prevSlide());
    
    // Botón siguiente
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-next';
    nextBtn.innerHTML = '❯';
    nextBtn.setAttribute('aria-label', 'Imagen siguiente');
    nextBtn.addEventListener('click', () => this.nextSlide());
    
    this.container.appendChild(prevBtn);
    this.container.appendChild(nextBtn);
    
    // Estilos para los botones
    const style = document.createElement('style');
    style.textContent = `
      .carousel-prev,
      .carousel-next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        font-size: 24px;
        padding: 10px 15px;
        cursor: pointer;
        z-index: 10;
        transition: all 0.3s ease;
        border-radius: 5px;
      }
      
      .carousel-prev {
        left: 20px;
      }
      
      .carousel-next {
        right: 20px;
      }
      
      .carousel-prev:hover,
      .carousel-next:hover {
        background: rgba(230, 0, 115, 0.8);
        transform: translateY(-50%) scale(1.1);
      }
      
      @media (max-width: 768px) {
        .carousel-prev,
        .carousel-next {
          padding: 8px 12px;
          font-size: 18px;
        }
        
        .carousel-prev {
          left: 10px;
        }
        
        .carousel-next {
          right: 10px;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  attachEventListeners() {
    // Pausar en hover
    if (this.options.pauseOnHover) {
      this.container.addEventListener('mouseenter', () => {
        this.pauseAutoPlay();
      });
      
      this.container.addEventListener('mouseleave', () => {
        if (this.options.autoPlay) {
          this.startAutoPlay();
        }
      });
    }
    
    // Soporte táctil
    if (this.options.enableTouch) {
      this.container.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
        this.pauseAutoPlay();
      });
      
      this.container.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
        
        if (this.options.autoPlay) {
          this.startAutoPlay();
        }
      });
    }
    
    // Teclado
    if (this.options.enableKeyboard) {
      document.addEventListener('keydown', (e) => {
        if (!this.isElementInViewport()) return;
        
        if (e.key === 'ArrowLeft') {
          this.prevSlide();
        } else if (e.key === 'ArrowRight') {
          this.nextSlide();
        }
      });
    }
    
    // Visibility API para pausar cuando no es visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAutoPlay();
      } else if (this.options.autoPlay) {
        this.startAutoPlay();
      }
    });
  }
  
  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchEndX - this.touchStartX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.prevSlide();
      } else {
        this.nextSlide();
      }
    }
  }
  
  goToSlide(index) {
    if (this.isTransitioning || index === this.currentIndex) return;
    
    this.isTransitioning = true;
    
    // Actualizar clases
    this.slides[this.currentIndex].classList.remove('active');
    if (this.indicators) {
      this.indicators[this.currentIndex].classList.remove('active');
    }
    
    // Efecto de transición
    if (this.options.fadeEffect) {
      this.slides[index].style.opacity = '0';
      this.slides[index].classList.add('active');
      
      setTimeout(() => {
        this.slides[index].style.opacity = '1';
      }, 50);
    } else {
      this.slides[index].classList.add('active');
    }
    
    // Actualizar indicador
    if (this.indicators) {
      this.indicators[index].classList.add('active');
    }
    
    this.currentIndex = index;
    
    // Emitir evento personalizado
    this.container.dispatchEvent(new CustomEvent('slideChange', {
      detail: { currentIndex: index, slide: this.slides[index] }
    }));
    
    setTimeout(() => {
      this.isTransitioning = false;
    }, 300);
    
    // Precargar siguiente imagen
    this.preloadNextImage();
  }
  
  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }
  
  prevSlide() {
    const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }
  
  startAutoPlay() {
    this.pauseAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.options.interval);
  }
  
  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
  
  preloadImages() {
    // Precargar las próximas 2 imágenes
    for (let i = 1; i <= 2; i++) {
      const nextIndex = (this.currentIndex + i) % this.slides.length;
      const img = new Image();
      img.src = this.slides[nextIndex].src;
    }
  }
  
  preloadNextImage() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    const img = new Image();
    img.src = this.slides[nextIndex].src;
  }
  
  isElementInViewport() {
    const rect = this.container.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Métodos públicos
  play() {
    if (this.options.autoPlay) {
      this.startAutoPlay();
    }
  }
  
  pause() {
    this.pauseAutoPlay();
  }
  
  destroy() {
    this.pauseAutoPlay();
    // Limpiar event listeners y elementos creados
    if (this.indicatorsContainer) {
      this.indicatorsContainer.remove();
    }
    const prevBtn = this.container.querySelector('.carousel-prev');
    const nextBtn = this.container.querySelector('.carousel-next');
    if (prevBtn) prevBtn.remove();
    if (nextBtn) nextBtn.remove();
  }
  
  // Obtener información del estado actual
  getState() {
    return {
      currentIndex: this.currentIndex,
      totalSlides: this.slides.length,
      isPlaying: this.autoPlayInterval !== null,
      currentSlide: this.slides[this.currentIndex]
    };
  }
}

// Compatibilidad con la clase antigua
class Carousel extends EnhancedCarousel {
  constructor(selector, interval = 3000) {
    super(selector, {
      autoPlay: true,
      interval: interval,
      showIndicators: true
    });
  }
}

// Exportar
window.EnhancedCarousel = EnhancedCarousel;
window.Carousel = Carousel;