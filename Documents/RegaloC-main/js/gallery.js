/* =========================================
   js/gallery.js - Galerías con modales
   ========================================= */

class Gallery {
  constructor(gallerySelector, modalManager) {
    this.gallery = document.querySelector(gallerySelector);
    this.modal = modalManager;

    if (!this.gallery || !this.modal) {
      console.error("No se encontró la galería o el gestor de modales.");
      return;
    }
    
    this.init();
  }
  
  init() {
    // Escuchamos el clic directamente en el contenedor de la galería para más eficiencia
    this.gallery.addEventListener("click", (e) => {
      // Nos aseguramos de que el clic fue en una imagen dentro de la galería
      const image = e.target.closest('img');
      if (image) {
        const text = image.dataset.text || "Foto especial";
        const imgSrc = image.dataset.imgSrc || image.src;
        this.modal.open(text, imgSrc);
      }
    });
  }
}

window.Gallery = Gallery;