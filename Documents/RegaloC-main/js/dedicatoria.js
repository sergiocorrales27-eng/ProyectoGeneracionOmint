/* =========================================
   js/dedicatoria.js - Lógica del sobre
   ========================================= */

class EnvelopeLetter {
  constructor() {
    this.envelope = document.querySelector(".envelope");
    this.letter = document.querySelector(".letter");
    this.closeBtn = document.querySelector(".close-letter");
    
    if (this.envelope && this.letter && this.closeBtn) {
      this.init();
    }
  }
  
  init() {
    this.envelope.addEventListener("click", () => this.open());
    this.closeBtn.addEventListener("click", () => this.close());
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.envelope.classList.contains("open")) {
        this.close();
      }
    });
  }
  
  open() {
    this.envelope.classList.add("open");
  }
  
  close() {
    this.envelope.classList.remove("open");
  }
}

window.EnvelopeLetter = EnvelopeLetter;
