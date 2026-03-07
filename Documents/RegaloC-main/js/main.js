/* =========================================
   js/main.js - Inicializador principal CORREGIDO
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  console.log('💕 Inicializando regalo...');
  
  // ==================================================
  // ✨ COMPONENTES GLOBALES (Modal, Música)
  // ==================================================
  const modal = document.getElementById("modal");
  if (modal) {
    const modalImg = document.getElementById("modal-img");
    const modalText = document.getElementById("modal-text");
    const closeBtn = modal.querySelector(".close");
    
    window.abrirModal = (texto, imgSrc = null) => {
      if (!modalText) return;
      modalText.textContent = texto;
      if (imgSrc && modalImg && imgSrc.trim() !== "") {
        modalImg.src = imgSrc;
        modalImg.style.display = "block";
      } else if (modalImg) {
        modalImg.style.display = "none";
      }
      modal.classList.add("active");
      modal.style.display = "flex";
    };
    
    const cerrarModal = () => {
      modal.classList.remove("active");
      modal.style.display = "none";
    };
    
    if(closeBtn) closeBtn.addEventListener("click", cerrarModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) cerrarModal();
    });
  }

  // Música
  const music = document.getElementById("bg-music");
  const musicBtn = document.querySelector(".music-btn");
  if (music && musicBtn) {
    window.toggleMusic = () => {
      if (music.paused) {
        music.play().catch(e => console.error("Error al reproducir música:", e));
        musicBtn.classList.add("playing");
      } else {
        music.pause();
        musicBtn.classList.remove("playing");
      }
    };
    musicBtn.addEventListener("click", window.toggleMusic);
  }

  // ==================================================
  // 🚀 PÁGINA DE INICIO
  // ==================================================
  if (document.querySelector(".carousel")) {
    const slides = document.querySelectorAll(".carousel img");
    if (slides.length > 0) {
      let index = 0;
      setInterval(() => {
        slides[index].classList.remove("active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("active");
      }, 3000);
    }
    
    // Cards y events con modal
    document.querySelectorAll(".card, .event").forEach(el => {
      el.addEventListener("click", () => {
        if (window.abrirModal) {
          window.abrirModal(el.dataset.msg || "💕", el.dataset.img || null);
        }
      });
    });
  }

  // ==================================================
  // 📸 GALERÍAS (Recuerdos y Comida)
  // ==================================================
  if (document.querySelector(".gallery")) {
    document.querySelectorAll(".gallery img").forEach(img => {
      img.addEventListener("click", () => {
        const texto = img.dataset.text || "Momento especial 💕";
        const imagen = img.dataset.imgSrc || img.src;
        if (window.abrirModal) {
          window.abrirModal(texto, imagen);
        }
      });
    });
  }

  // ==================================================
  // 💌 DEDICATORIA
  // ==================================================
  if (document.querySelector(".envelope")) {
    const envelope = document.querySelector(".envelope");
    const letter = document.querySelector(".letter");
    const closeLetterBtn = document.querySelector(".close-letter");

    envelope.addEventListener("click", function() {
      this.classList.add("open");
      // La carta se muestra con CSS cuando el sobre tiene clase "open"
    });

    if (closeLetterBtn) {
      closeLetterBtn.addEventListener("click", function() {
        envelope.classList.remove("open");
      });
    }

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && envelope.classList.contains('open')) {
        envelope.classList.remove('open');
      }
    });
  }

  // ==================================================
  // 🎮 JUEGOS
  // ==================================================
  if (document.getElementById("juegos")) {
    
    // 1. SOPA DE LETRAS
    const initSopaLetras = () => {
      const canvasSopa = document.getElementById("wordsearch");
      if (!canvasSopa) return;
      
      const ctxSopa = canvasSopa.getContext("2d");
      const palabrasSopa = ["RANDOM", "POCHOCLITO", "PICARON", "KOALA", "LEON"];
      const gridSize = 12;
      const cellSize = 40;
      
      canvasSopa.width = gridSize * cellSize;
      canvasSopa.height = gridSize * cellSize;
      
      let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
      const directions = [
        { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 },
        { dx: -1, dy: 0 }, { dx: 0, dy: -1 }, { dx: -1, dy: -1 },
        { dx: 1, dy: -1 }, { dx: -1, dy: 1 }
      ];
      
      function placeWord(word) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) {
          attempts++;
          const dir = directions[Math.floor(Math.random() * directions.length)];
          const row = Math.floor(Math.random() * gridSize);
          const col = Math.floor(Math.random() * gridSize);
          
          let fits = true;
          for (let i = 0; i < word.length; i++) {
            let r = row + dir.dy * i;
            let c = col + dir.dx * i;
            if (r < 0 || r >= gridSize || c < 0 || c >= gridSize || 
                (grid[r][c] && grid[r][c] !== word[i])) {
              fits = false;
              break;
            }
          }
          
          if (fits) {
            for (let i = 0; i < word.length; i++) {
              grid[row + dir.dy * i][col + dir.dx * i] = word[i];
            }
            placed = true;
          }
        }
      }
      
      // Colocar palabras
      palabrasSopa.forEach(placeWord);
      
      // Rellenar espacios vacíos
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (!grid[r][c]) {
            grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
          }
        }
      }
      
      // Lista de palabras
      const listaPalabras = document.getElementById("lista-palabras");
      if (listaPalabras) {
        listaPalabras.innerHTML = "";
        palabrasSopa.forEach(p => {
          const li = document.createElement("li");
          li.textContent = p;
          li.dataset.word = p;
          listaPalabras.appendChild(li);
        });
      }
      
      let foundWords = [];
      let start = null;
      let current = null;
      
      // Dibujar grid
      function drawGrid(highlight = null) {
        ctxSopa.clearRect(0, 0, canvasSopa.width, canvasSopa.height);
        ctxSopa.font = "20px Arial";
        ctxSopa.textAlign = "center";
        ctxSopa.textBaseline = "middle";
        
        for (let r = 0; r < gridSize; r++) {
          for (let c = 0; c < gridSize; c++) {
            // Dibujar letra
            ctxSopa.fillStyle = "#000";
            ctxSopa.fillText(
              grid[r][c], 
              c * cellSize + cellSize / 2,
              r * cellSize + cellSize / 2
            );
            
            // Dibujar borde
            ctxSopa.strokeStyle = "#ccc";
            ctxSopa.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
          }
        }
        
        // Resaltar palabras encontradas
        foundWords.forEach(f => {
          ctxSopa.fillStyle = "rgba(255, 0, 100, 0.3)";
          f.path.forEach(cell => {
            ctxSopa.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
          });
        });
        
        // Resaltar selección actual
        if (highlight && highlight.start && highlight.end) {
          ctxSopa.fillStyle = "rgba(0, 150, 255, 0.2)";
          let dx = Math.sign(highlight.end.x - highlight.start.x);
          let dy = Math.sign(highlight.end.y - highlight.start.y);
          let steps = Math.max(
            Math.abs(highlight.end.x - highlight.start.x),
            Math.abs(highlight.end.y - highlight.start.y)
          );
          
          for (let i = 0; i <= steps; i++) {
            let x = highlight.start.x + dx * i;
            let y = highlight.start.y + dy * i;
            ctxSopa.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }
      }
      
      // Eventos del mouse
      canvasSopa.addEventListener("mousedown", e => {
        const rect = canvasSopa.getBoundingClientRect();
        start = {
          x: Math.floor((e.clientX - rect.left) / cellSize),
          y: Math.floor((e.clientY - rect.top) / cellSize)
        };
      });
      
      canvasSopa.addEventListener("mousemove", e => {
        if (!start) return;
        const rect = canvasSopa.getBoundingClientRect();
        current = {
          x: Math.floor((e.clientX - rect.left) / cellSize),
          y: Math.floor((e.clientY - rect.top) / cellSize)
        };
        drawGrid({ start, end: current });
      });
      
      canvasSopa.addEventListener("mouseup", e => {
        if (!start) return;
        const rect = canvasSopa.getBoundingClientRect();
        const end = {
          x: Math.floor((e.clientX - rect.left) / cellSize),
          y: Math.floor((e.clientY - rect.top) / cellSize)
        };
        
        // Verificar palabra
        let dx = Math.sign(end.x - start.x);
        let dy = Math.sign(end.y - start.y);
        let lenX = Math.abs(end.x - start.x);
        let lenY = Math.abs(end.y - start.y);
        
        if (lenX === 0 || lenY === 0 || lenX === lenY) {
          let steps = Math.max(lenX, lenY);
          let word = "";
          let path = [];
          
          for (let i = 0; i <= steps; i++) {
            let x = start.x + dx * i;
            let y = start.y + dy * i;
            if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
              word += grid[y][x];
              path.push({ x, y });
            }
          }
          
          if (palabrasSopa.includes(word) && !foundWords.some(f => f.word === word)) {
            foundWords.push({ word, path });
            const msg = document.getElementById("sopa-msg");
            if (msg) msg.textContent = `✔️ Encontraste: ${word}`;
            
            const item = document.querySelector(`#lista-palabras li[data-word="${word}"]`);
            if (item) item.classList.add("found");
          }
        }
        
        start = null;
        current = null;
        drawGrid();
      });
      
      drawGrid();
    };
    
    // 2. PUZZLE
    const initPuzzle = () => {
      const board = document.getElementById("puzzle-board");
      const shuffleBtn = document.getElementById("shuffle-puzzle-btn");
      if (!board || !shuffleBtn) return;
      
      let pieces = [];
      let draggedPiece = null;
      
      // Crear piezas
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const piece = document.createElement("div");
          piece.classList.add("puzzle-piece");
          piece.style.backgroundPosition = `-${col * 160}px -${row * 160}px`;
          piece.setAttribute("data-pos", `${row}-${col}`);
          piece.draggable = true;
          
          piece.addEventListener("dragstart", function() {
            draggedPiece = this;
            setTimeout(() => this.classList.add("dragging"), 0);
          });
          
          piece.addEventListener("dragover", e => e.preventDefault());
          
          piece.addEventListener("drop", function(e) {
            e.preventDefault();
            if (draggedPiece !== this) {
              const draggedNext = draggedPiece.nextSibling;
              const targetNext = this.nextSibling;
              board.insertBefore(draggedPiece, targetNext);
              board.insertBefore(this, draggedNext);
            }
            draggedPiece.classList.remove("dragging");
          });
          
          board.appendChild(piece);
          pieces.push(piece);
        }
      }
      
      // Mezclar
      function shufflePuzzle() {
        for (let i = pieces.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          board.appendChild(pieces[j]);
        }
      }
      
      shuffleBtn.addEventListener('click', shufflePuzzle);
      shufflePuzzle();
    };
    
    // 3. AHORCADO
    const initAhorcado = () => {
      const hangmanCanvas = document.getElementById("hangmanCanvas");
      if (!hangmanCanvas) return;
      
      const ctx = hangmanCanvas.getContext("2d");
      const palabrasAhorcado = ["AMOR", "BESO", "RECUERDO", "FELIZ"];
      
      let palabraSecreta, palabraMostrada, vidas, letrasUsadas;
      
      const wordElem = document.getElementById("word");
      const livesElem = document.getElementById("lives");
      const usedElem = document.getElementById("used-letters");
      const messageElem = document.getElementById("message");
      const guessBtn = document.getElementById('guess-letter-btn');
      const restartBtn = document.getElementById('restartBtn');
      const letterInput = document.getElementById('letterInput');
      
      function drawHangman() {
        ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#e60073";
        
        const steps = 6 - vidas;
        
        // Base
        if (steps > 0) {
          ctx.beginPath();
          ctx.moveTo(10, 240);
          ctx.lineTo(190, 240);
          ctx.stroke();
        }
        
        // Poste vertical
        if (steps > 1) {
          ctx.beginPath();
          ctx.moveTo(50, 240);
          ctx.lineTo(50, 20);
          ctx.stroke();
        }
        
        // Poste horizontal
        if (steps > 2) {
          ctx.beginPath();
          ctx.moveTo(50, 20);
          ctx.lineTo(150, 20);
          ctx.stroke();
        }
        
        // Cuerda
        if (steps > 3) {
          ctx.beginPath();
          ctx.moveTo(150, 20);
          ctx.lineTo(150, 50);
          ctx.stroke();
        }
        
        // Cabeza
        if (steps > 4) {
          ctx.beginPath();
          ctx.arc(150, 70, 20, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // Cuerpo y extremidades
        if (steps > 5) {
          // Cuerpo
          ctx.beginPath();
          ctx.moveTo(150, 90);
          ctx.lineTo(150, 150);
          ctx.stroke();
          
          // Brazos
          ctx.beginPath();
          ctx.moveTo(150, 110);
          ctx.lineTo(120, 140);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(150, 110);
          ctx.lineTo(180, 140);
          ctx.stroke();
          
          // Piernas
          ctx.beginPath();
          ctx.moveTo(150, 150);
          ctx.lineTo(120, 200);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(150, 150);
          ctx.lineTo(180, 200);
          ctx.stroke();
        }
      }
      
      function guessLetter() {
        const letra = letterInput.value.toUpperCase();
        letterInput.value = "";
        
        if (!letra.match(/[A-ZÑ]/) || letrasUsadas.includes(letra)) return;
        
        letrasUsadas.push(letra);
        if (usedElem) usedElem.textContent = letrasUsadas.join(", ");
        
        if (palabraSecreta.includes(letra)) {
          let nueva = "";
          for (let i = 0; i < palabraSecreta.length; i++) {
            nueva += (palabraSecreta[i] === letra) ? letra : palabraMostrada[i];
          }
          palabraMostrada = nueva;
          if (wordElem) wordElem.textContent = palabraMostrada.split("").join(" ");
          
          if (!palabraMostrada.includes("_") && messageElem) {
            messageElem.textContent = "🎉 ¡Ganaste!";
          }
        } else {
          vidas--;
          if (livesElem) livesElem.textContent = vidas;
          drawHangman();
          
          if (vidas <= 0 && messageElem) {
            messageElem.textContent = `💔 Perdiste... era: ${palabraSecreta}`;
          }
        }
      }
      
      function restartGame() {
        palabraSecreta = palabrasAhorcado[Math.floor(Math.random() * palabrasAhorcado.length)];
        palabraMostrada = "_".repeat(palabraSecreta.length);
        vidas = 6;
        letrasUsadas = [];
        
        if (wordElem) wordElem.textContent = palabraMostrada.split("").join(" ");
        if (livesElem) livesElem.textContent = vidas;
        if (usedElem) usedElem.textContent = "";
        if (messageElem) messageElem.textContent = "";
        
        drawHangman();
      }
      
      if (guessBtn) guessBtn.addEventListener('click', guessLetter);
      if (restartBtn) restartBtn.addEventListener('click', restartGame);
      if (letterInput) {
        letterInput.addEventListener('keyup', e => {
          if (e.key === "Enter") guessLetter();
        });
      }
      
      restartGame();
    };
    
    // Inicializar todos los juegos
    initSopaLetras();
    initPuzzle();
    initAhorcado();
  }

  // ==================================================
  // 🎨 PINTAR
  // ==================================================
  if (document.getElementById("mandala")) {
    const canvas = document.getElementById("paintCanvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const colorPicker = document.getElementById("colorPicker");
    const brushSizeInput = document.getElementById("brushSize");
    const clearBtn = document.getElementById("clearCanvasBtn");
    const undoBtn = document.getElementById("undoBtn");
    const uploadBtn = document.getElementById("uploadImageBtn");
    const imageLoader = document.getElementById("bgImageLoader");
    
    let painting = false;
    let history = [];
    
    // Ajustar tamaño del canvas
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      redrawHistory();
    };
    
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };
    
    const startPaint = (e) => {
      painting = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };
    
    const endPaint = () => {
      if (!painting) return;
      painting = false;
      ctx.beginPath();
      // Guardar estado
      history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      if (history.length > 10) history.shift(); // Limitar historial
    };
    
    const draw = (e) => {
      if (!painting) return;
      e.preventDefault();
      
      const pos = getPos(e);
      ctx.lineWidth = brushSizeInput ? brushSizeInput.value : 5;
      ctx.lineCap = "round";
      ctx.strokeStyle = colorPicker ? colorPicker.value : "#e60073";
      
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };
    
    const redrawHistory = () => {
      if (history.length > 0) {
        ctx.putImageData(history[history.length - 1], 0, 0);
      }
    };
    
    // Event listeners
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.backgroundImage = "";
        history = [];
      });
    }
    
    if (undoBtn) {
      undoBtn.addEventListener("click", () => {
        history.pop();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redrawHistory();
      });
    }
    
    if (uploadBtn && imageLoader) {
      uploadBtn.addEventListener("click", () => imageLoader.click());
      imageLoader.addEventListener("change", (e) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          canvas.style.backgroundImage = `url(${event.target.result})`;
          canvas.style.backgroundSize = "contain";
          canvas.style.backgroundRepeat = "no-repeat";
          canvas.style.backgroundPosition = "center";
        };
        if (e.target.files[0]) {
          reader.readAsDataURL(e.target.files[0]);
        }
      });
    }
    
    // Canvas events
    canvas.addEventListener("mousedown", startPaint);
    canvas.addEventListener("mouseup", endPaint);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("touchstart", startPaint, { passive: false });
    canvas.addEventListener("touchend", endPaint);
    canvas.addEventListener("touchmove", draw, { passive: false });
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  }
  
  console.log('✨ Regalo inicializado correctamente');
});