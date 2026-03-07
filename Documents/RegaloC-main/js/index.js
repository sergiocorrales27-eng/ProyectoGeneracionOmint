document.addEventListener("DOMContentLoaded", () => {

  // ==================================================
  // ✨ COMPONENTES GLOBALES (Modal, Música)
  // ==================================================
  const modal = document.getElementById("modal");
  if (modal) {
    const modalImg = document.getElementById("modal-img");
    const modalText = document.getElementById("modal-text");
    const closeBtn = modal.querySelector(".close");
    const abrirModal = (texto, imgSrc = null) => {
      if (!modalText) return;
      modalText.textContent = texto;
      if (imgSrc && modalImg && imgSrc.trim() !== "") {
        modalImg.src = imgSrc;
        modalImg.style.display = "block";
      } else if (modalImg) {
        modalImg.style.display = "none";
      }
      modal.classList.add("active");
    };
    const cerrarModal = () => modal.classList.remove("active");
    if(closeBtn) closeBtn.addEventListener("click", cerrarModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) cerrarModal();
    });
    window.abrirModal = abrirModal;
  }

  const music = document.getElementById("bg-music");
  const musicBtn = document.querySelector(".music-btn");
  if (music && musicBtn) {
    musicBtn.addEventListener("click", () => {
      if (music.paused) {
        music.play().catch(e => console.error("Error al reproducir música:", e));
        musicBtn.classList.add("playing");
      } else {
        music.pause();
        musicBtn.classList.remove("playing");
      }
    });
  }

  // ==================================================
  // 🚀 INICIALIZACIÓN POR PÁGINA
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
    document.querySelectorAll(".card, .event").forEach(el => {
      el.addEventListener("click", () => {
        if (window.abrirModal) window.abrirModal(el.dataset.msg, el.dataset.img);
      });
    });
  }

  if (document.querySelector(".gallery")) {
    document.querySelectorAll(".gallery img").forEach(img => {
      img.addEventListener("click", () => {
        if (window.abrirModal) window.abrirModal(img.dataset.text, img.dataset.imgSrc);
      });
    });
  }

if (document.querySelector(".envelope")) {
  const envelope = document.querySelector(".envelope");
  const letter = document.querySelector(".letter");
  const closeLetterBtn = document.querySelector(".close-letter");

  // Función para abrir la carta
  envelope.addEventListener("click", function() {
    this.classList.add("open");
  });

  // Función para cerrar la carta con el botón 'X'
  closeLetterBtn.addEventListener("click", function() {
    envelope.classList.remove("open");
  });

  // Función para cerrar la carta con la tecla 'Escape'
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && envelope.classList.contains('open')) {
      envelope.classList.remove('open');
    }
  });
}
  // --- Página de JUEGOS ---
  if (document.getElementById("juegos")) {

    // 1. Sopa de Letras (Tu código original)
    (() => {
      const palabrasSopa = ["RANDOM", "POCHOCLITO", "PICARON", "KOALA", "LEON"];
      const gridSize = 12;
      const cellSize = 40;
      const canvasSopa = document.getElementById("wordsearch");
      if (!canvasSopa) return;
      const ctxSopa = canvasSopa.getContext("2d");
      canvasSopa.width = gridSize * cellSize;
      canvasSopa.height = gridSize * cellSize;
      let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
      const directions = [ { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 }, { dx: -1, dy: 0 }, { dx: 0, dy: -1 }, { dx: -1, dy: -1 }, { dx: 1, dy: -1 }, { dx: -1, dy: 1 } ];
      function placeWord(word) { let placed = false; while (!placed) { const dir = directions[Math.floor(Math.random() * directions.length)]; const row = Math.floor(Math.random() * gridSize); const col = Math.floor(Math.random() * gridSize); let fits = true; for (let i = 0; i < word.length; i++) { let r = row + dir.dy * i; let c = col + dir.dx * i; if (r < 0 || r >= gridSize || c < 0 || c >= gridSize || (grid[r][c] && grid[r][c] !== word[i])) { fits = false; break; } } if (fits) { for (let i = 0; i < word.length; i++) { let r = row + dir.dy * i; let c = col + dir.dx * i; grid[r][c] = word[i]; } placed = true; } } }
      palabrasSopa.forEach(placeWord);
      for (let r = 0; r < gridSize; r++) for (let c = 0; c < gridSize; c++) if (!grid[r][c]) grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      let foundWords = [];
      function drawGrid(highlight = null) { ctxSopa.clearRect(0, 0, canvasSopa.width, canvasSopa.height); ctxSopa.font = "20px Arial"; ctxSopa.textAlign = "center"; ctxSopa.textBaseline = "middle"; for (let r = 0; r < gridSize; r++) { for (let c = 0; c < gridSize; c++) { ctxSopa.fillStyle = "#000"; ctxSopa.fillText(grid[r][c], c * cellSize + cellSize / 2, r * cellSize + cellSize / 2); ctxSopa.strokeStyle = "#ccc"; ctxSopa.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize); } } foundWords.forEach(f => { ctxSopa.fillStyle = "rgba(255, 0, 100, 0.3)"; f.path.forEach(cell => { ctxSopa.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize); }); }); if (highlight) { ctxSopa.fillStyle = "rgba(0, 150, 255, 0.2)"; let dx = Math.sign(highlight.end.x - highlight.start.x); let dy = Math.sign(highlight.end.y - highlight.start.y); let steps = Math.max(Math.abs(highlight.end.x - highlight.start.x), Math.abs(highlight.end.y - highlight.start.y)); let x = highlight.start.x, y = highlight.start.y; for (let i = 0; i <= steps; i++) { ctxSopa.fillRect(x * cellSize, y * cellSize, cellSize, cellSize); x += dx; y += dy; } } }
      const listaPalabras = document.getElementById("lista-palabras"); if (listaPalabras) { listaPalabras.innerHTML = ""; palabrasSopa.forEach(p => { const li = document.createElement("li"); li.innerText = p.toUpperCase(); li.dataset.word = p.toUpperCase(); listaPalabras.appendChild(li); }); }
      let start = null; let current = null;
      canvasSopa.addEventListener("mousedown", e => { const rect = canvasSopa.getBoundingClientRect(); start = { x: Math.floor((e.clientX - rect.left) / cellSize), y: Math.floor((e.clientY - rect.top) / cellSize) }; });
      canvasSopa.addEventListener("mousemove", e => { if (!start) return; const rect = canvasSopa.getBoundingClientRect(); current = { x: Math.floor((e.clientX - rect.left) / cellSize), y: Math.floor((e.clientY - rect.top) / cellSize) }; drawGrid({ start, end: current }); });
      canvasSopa.addEventListener("mouseup", e => { if (!start) return; const rect = canvasSopa.getBoundingClientRect(); const end = { x: Math.floor((e.clientX - rect.left) / cellSize), y: Math.floor((e.clientY - rect.top) / cellSize) }; checkWord(start, end); start = null; current = null; drawGrid(); });
      function checkWord(start, end) { let dx = Math.sign(end.x - start.x); let dy = Math.sign(end.y - start.y); let lenX = Math.abs(end.x - start.x); let lenY = Math.abs(end.y - start.y); if (!(lenX === 0 || lenY === 0 || lenX === lenY)) return; let steps = Math.max(lenX, lenY); let word = ""; let path = []; let x = start.x, y = start.y; for (let i = 0; i <= steps; i++) { word += grid[y][x]; path.push({ x, y }); x += dx; y += dy; } word = word.toUpperCase(); if (palabrasSopa.includes(word) && !foundWords.some(f => f.word === word)) { foundWords.push({ word, path }); document.getElementById("sopa-msg").innerText = `✔️ Encontraste: ${word}`; const item = document.querySelector(`#lista-palabras li[data-word="${word}"]`); if (item) item.classList.add("found"); drawGrid(); } }
      drawGrid();
    })();

    // 2. Puzzle (Tu código original)
    (() => {
        const board = document.getElementById("puzzle-board");
        const shuffleBtn = document.getElementById("shuffle-puzzle-btn");
        if (!board || !shuffleBtn) return;
        let pieces = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const piece = document.createElement("div");
                piece.classList.add("puzzle-piece");
                piece.style.backgroundPosition = `-${col * 160}px -${row * 160}px`;
                piece.setAttribute("data-pos", `${row}-${col}`);
                piece.draggable = true;
                piece.addEventListener("dragstart", dragStart);
                piece.addEventListener("dragover", dragOver);
                piece.addEventListener("drop", drop);
                board.appendChild(piece);
                pieces.push(piece);
            }
        }
        function shufflePuzzle() {
            for (let i = pieces.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                board.appendChild(pieces[j]);
            }
        }
        let draggedPiece = null;
        function dragStart() { draggedPiece = this; setTimeout(() => this.classList.add("dragging"), 0); }
        function dragOver(e) { e.preventDefault(); }
        function drop(e) {
            e.preventDefault();
            if (draggedPiece !== this) {
                const draggedNext = draggedPiece.nextSibling;
                const targetNext = this.nextSibling;
                board.insertBefore(draggedPiece, targetNext);
                board.insertBefore(this, draggedNext);
            }
            draggedPiece.classList.remove("dragging");
        }
        shuffleBtn.addEventListener('click', shufflePuzzle);
        shufflePuzzle();
    })();

    // 3. Ahorcado (Tu código original)
    (() => {
        const hangmanCanvas = document.getElementById("hangmanCanvas");
        if (!hangmanCanvas) return;
        const hctx = hangmanCanvas.getContext("2d");
        const palabrasAhorcado = ["AMOR", "BESO", "RECUERDO", "FELIZ"];
        let palabraSecreta, palabraMostrada, vidas, letrasUsadas;
        const wordElem = document.getElementById("word");
        const livesElem = document.getElementById("lives");
        const usedElem = document.getElementById("used-letters");
        const messageElem = document.getElementById("message");
        const guessBtn = document.getElementById('guess-letter-btn');
        const restartBtn = document.getElementById('restartBtn');
        const letterInput = document.getElementById('letterInput');
        function drawHangman(step) { hctx.lineWidth = 3; hctx.strokeStyle = "#e60073"; switch (step) { case 6: hctx.moveTo(10,240);hctx.lineTo(190,240);hctx.stroke(); break; case 5: hctx.moveTo(50,240);hctx.lineTo(50,20);hctx.stroke(); break; case 4: hctx.moveTo(50,20);hctx.lineTo(150,20);hctx.stroke(); break; case 3: hctx.moveTo(150,20);hctx.lineTo(150,50);hctx.stroke(); break; case 2: hctx.beginPath();hctx.arc(150,70,20,0,Math.PI*2);hctx.stroke(); break; case 1: hctx.moveTo(150,90);hctx.lineTo(150,150);hctx.stroke(); break; case 0: hctx.moveTo(150,110);hctx.lineTo(120,140); hctx.moveTo(150,110);hctx.lineTo(180,140); hctx.moveTo(150,150);hctx.lineTo(120,200); hctx.moveTo(150,150);hctx.lineTo(180,200);hctx.stroke(); break; } }
        function resetHangman() { hctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height); for (let i = 6; i > vidas; i--) drawHangman(i); }
        function guessLetter() { const letra = letterInput.value.toUpperCase(); letterInput.value = ""; if (!letra.match(/[A-ZÑ]/) || letrasUsadas.includes(letra)) return; letrasUsadas.push(letra); if (usedElem) usedElem.textContent = letrasUsadas.join(", "); if (palabraSecreta.includes(letra)) { let nueva = ""; for (let i = 0; i < palabraSecreta.length; i++) { nueva += (palabraSecreta[i] === letra) ? letra : palabraMostrada[i]; } palabraMostrada = nueva; if (wordElem) wordElem.textContent = palabraMostrada.split("").join(" "); if (!palabraMostrada.includes("_") && messageElem) messageElem.textContent = "🎉 ¡Ganaste!"; } else { vidas--; if (livesElem) livesElem.textContent = vidas; drawHangman(vidas); if (vidas <= 0 && messageElem) messageElem.textContent = `💔 Perdiste... era: ${palabraSecreta}`; } }
        function restartGame() { palabraSecreta = palabrasAhorcado[Math.floor(Math.random() * palabrasAhorcado.length)]; palabraMostrada = "_".repeat(palabraSecreta.length); vidas = 6; letrasUsadas = []; if (wordElem) wordElem.textContent = palabraMostrada.split("").join(" "); if (livesElem) livesElem.textContent = vidas; if (usedElem) usedElem.textContent = ""; if (messageElem) messageElem.textContent = ""; resetHangman(); }
        guessBtn.addEventListener('click', guessLetter);
        restartBtn.addEventListener('click', restartGame);
        letterInput.addEventListener('keyup', e => { if (e.key === "Enter") guessLetter() });
        restartGame();
    })();
  }

  // --- Página de PINTAR ---
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
    const resizeCanvas = () => { const rect = canvas.getBoundingClientRect(); canvas.width = rect.width; canvas.height = rect.height; redrawHistory(); };
    const getPos = (e) => { const rect = canvas.getBoundingClientRect(); const clientX = e.clientX || e.touches[0].clientX; const clientY = e.clientY || e.touches[0].clientY; return { x: clientX - rect.left, y: clientY - rect.top }; };
    const startPaint = (e) => { painting = true; draw(e); };
    const endPaint = () => { if (!painting) return; painting = false; ctx.beginPath(); history.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); };
    const draw = (e) => { if (!painting) return; e.preventDefault(); const { x, y } = getPos(e); ctx.lineWidth = brushSizeInput.value; ctx.lineCap = "round"; ctx.strokeStyle = colorPicker.value; ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y); };
    const redrawHistory = () => { if (history.length > 0) ctx.putImageData(history[history.length - 1], 0, 0); };
    clearBtn.addEventListener("click", () => { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.style.backgroundImage = ""; history = []; });
    undoBtn.addEventListener("click", () => { history.pop(); ctx.clearRect(0, 0, canvas.width, canvas.height); redrawHistory(); });
    uploadBtn.addEventListener("click", () => imageLoader.click());
    imageLoader.addEventListener("change", (e) => { const reader = new FileReader(); reader.onload = (event) => { canvas.style.backgroundImage = `url(${event.target.result})`; }; reader.readAsDataURL(e.target.files[0]); });
    canvas.addEventListener("mousedown", startPaint);
    canvas.addEventListener("mouseup", endPaint);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("touchstart", startPaint, { passive: false });
    canvas.addEventListener("touchend", endPaint);
    canvas.addEventListener("touchmove", draw, { passive: false });
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  }
});