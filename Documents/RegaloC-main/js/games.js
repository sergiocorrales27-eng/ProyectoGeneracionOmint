/* =========================================
   js/games.js - Todos los juegos
   ========================================= */

class WordSearch {
  constructor() {
    this.canvas = document.getElementById("wordsearch");
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext("2d");
    this.palabras = ["RANDOM", "POCHOCLITO", "PICARON", "KOALA", "LEON"];
    this.gridSize = 12;
    this.cellSize = 40;
    this.grid = Array.from({ length: this.gridSize }, () => 
      Array(this.gridSize).fill("")
    );
    this.directions = [
      { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 },
      { dx: -1, dy: 0 }, { dx: 0, dy: -1 }, { dx: -1, dy: -1 },
      { dx: 1, dy: -1 }, { dx: -1, dy: 1 }
    ];
    this.foundWords = [];
    this.start = null;
    this.current = null;
    
    this.setup();
  }
  
  setup() {
    this.canvas.width = this.gridSize * this.cellSize;
    this.canvas.height = this.gridSize * this.cellSize;
    this.fillGrid();
    this.setupUI();
    this.attachListeners();
    this.draw();
  }
  
  fillGrid() {
    this.palabras.forEach(word => this.placeWord(word));
    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        if (!this.grid[r][c]) {
          this.grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }
  }
  
  placeWord(word) {
    let placed = false;
    while (!placed) {
      const dir = this.directions[Math.floor(Math.random() * this.directions.length)];
      const row = Math.floor(Math.random() * this.gridSize);
      const col = Math.floor(Math.random() * this.gridSize);
      
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const r = row + dir.dy * i;
        const c = col + dir.dx * i;
        if (r < 0 || r >= this.gridSize || c < 0 || c >= this.gridSize ||
            (this.grid[r][c] && this.grid[r][c] !== word[i])) {
          fits = false;
          break;
        }
      }
      
      if (fits) {
        for (let i = 0; i < word.length; i++) {
          this.grid[row + dir.dy * i][col + dir.dx * i] = word[i];
        }
        placed = true;
      }
    }
  }
  
  setupUI() {
    const list = document.getElementById("lista-palabras");
    if (list) {
      list.innerHTML = "";
      this.palabras.forEach(p => {
        const li = document.createElement("li");
        li.textContent = p;
        li.dataset.word = p;
        list.appendChild(li);
      });
    }
  }
  
  attachListeners() {
    this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    this.canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e));
  }
  
  handleMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.start = {
      x: Math.floor((e.clientX - rect.left) / this.cellSize),
      y: Math.floor((e.clientY - rect.top) / this.cellSize)
    };
  }
  
  handleMouseMove(e) {
    if (!this.start) return;
    const rect = this.canvas.getBoundingClientRect();
    this.current = {
      x: Math.floor((e.clientX - rect.left) / this.cellSize),
      y: Math.floor((e.clientY - rect.top) / this.cellSize)
    };
    this.draw();
  }
  
  handleMouseUp(e) {
    if (!this.start) return;
    const rect = this.canvas.getBoundingClientRect();
    const end = {
      x: Math.floor((e.clientX - rect.left) / this.cellSize),
      y: Math.floor((e.clientY - rect.top) / this.cellSize)
    };
    this.checkWord(this.start, end);
    this.start = null;
    this.current = null;
    this.draw();
  }
  
  checkWord(start, end) {
    const dx = Math.sign(end.x - start.x);
    const dy = Math.sign(end.y - start.y);
    const lenX = Math.abs(end.x - start.x);
    const lenY = Math.abs(end.y - start.y);
    
    if (!(lenX === 0 || lenY === 0 || lenX === lenY)) return;
    
    const steps = Math.max(lenX, lenY);
    let word = "";
    let path = [];
    
    for (let i = 0; i <= steps; i++) {
      const x = start.x + dx * i;
      const y = start.y + dy * i;
      word += this.grid[y][x];
      path.push({ x, y });
    }
    
    if (this.palabras.includes(word) && !this.foundWords.some(f => f.word === word)) {
      this.foundWords.push({ word, path });
      const msg = document.getElementById("sopa-msg");
      if (msg) msg.textContent = `✔️ Encontraste: ${word}`;
      
      const item = document.querySelector(`#lista-palabras li[data-word="${word}"]`);
      if (item) item.classList.add("found");
    }
  }
  
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = "20px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    
    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        this.ctx.fillStyle = "#000";
        this.ctx.fillText(this.grid[r][c], c * this.cellSize + this.cellSize / 2,
          r * this.cellSize + this.cellSize / 2);
        this.ctx.strokeStyle = "#ccc";
        this.ctx.strokeRect(c * this.cellSize, r * this.cellSize, this.cellSize, this.cellSize);
      }
    }
    
    this.foundWords.forEach(f => {
      this.ctx.fillStyle = "rgba(255, 0, 100, 0.3)";
      f.path.forEach(cell => {
        this.ctx.fillRect(cell.x * this.cellSize, cell.y * this.cellSize, 
          this.cellSize, this.cellSize);
      });
    });
    
    if (this.current && this.start) {
      this.ctx.fillStyle = "rgba(0, 150, 255, 0.2)";
      const dx = Math.sign(this.current.x - this.start.x);
      const dy = Math.sign(this.current.y - this.start.y);
      const steps = Math.max(Math.abs(this.current.x - this.start.x),
        Math.abs(this.current.y - this.start.y));
      
      for (let i = 0; i <= steps; i++) {
        const x = this.start.x + dx * i;
        const y = this.start.y + dy * i;
        this.ctx.fillRect(x * this.cellSize, y * this.cellSize, 
          this.cellSize, this.cellSize);
      }
    }
  }
}

class Puzzle {
  constructor() {
    this.board = document.getElementById("puzzle-board");
    this.shuffleBtn = document.getElementById("shuffle-puzzle-btn");
    
    if (this.board && this.shuffleBtn) {
      this.pieces = [];
      this.draggedPiece = null;
      this.setup();
    }
  }
  
  setup() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const piece = document.createElement("div");
        piece.classList.add("puzzle-piece");
        piece.style.backgroundPosition = `-${col * 160}px -${row * 160}px`;
        piece.setAttribute("data-pos", `${row}-${col}`);
        piece.draggable = true;
        
        piece.addEventListener("dragstart", () => this.dragStart(piece));
        piece.addEventListener("dragover", (e) => e.preventDefault());
        piece.addEventListener("drop", (e) => this.drop(e, piece));
        
        this.board.appendChild(piece);
        this.pieces.push(piece);
      }
    }
    
    this.shuffleBtn.addEventListener("click", () => this.shuffle());
    this.shuffle();
  }
  
  dragStart(piece) {
    this.draggedPiece = piece;
    setTimeout(() => piece.classList.add("dragging"), 0);
  }
  
  drop(e, targetPiece) {
    e.preventDefault();
    if (this.draggedPiece !== targetPiece) {
      const draggedNext = this.draggedPiece.nextSibling;
      const targetNext = targetPiece.nextSibling;
      this.board.insertBefore(this.draggedPiece, targetNext);
      this.board.insertBefore(targetPiece, draggedNext);
    }
    this.draggedPiece.classList.remove("dragging");
  }
  
  shuffle() {
    for (let i = this.pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      this.board.appendChild(this.pieces[j]);
    }
  }
}

class Hangman {
  constructor() {
    this.canvas = document.getElementById("hangmanCanvas");
    this.wordEl = document.getElementById("word");
    this.livesEl = document.getElementById("lives");
    this.usedEl = document.getElementById("used-letters");
    this.messageEl = document.getElementById("message");
    this.guessBtn = document.getElementById("guess-letter-btn");
    this.restartBtn = document.getElementById("restartBtn");
    this.letterInput = document.getElementById("letterInput");
    
    if (this.canvas) {
      this.ctx = this.canvas.getContext("2d");
      this.palabras = ["AMOR", "BESO", "RECUERDO", "FELIZ"];
      this.init();
    }
  }
  
  init() {
    this.guessBtn.addEventListener("click", () => this.guess());
    this.restartBtn.addEventListener("click", () => this.restart());
    this.letterInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") this.guess();
    });
    this.restart();
  }
  
  restart() {
    this.palabraSecreta = this.palabras[Math.floor(Math.random() * this.palabras.length)];
    this.palabraMostrada = "_".repeat(this.palabraSecreta.length);
    this.vidas = 6;
    this.letrasUsadas = [];
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.render();
  }
  
  guess() {
    const letra = this.letterInput.value.toUpperCase();
    this.letterInput.value = "";
    
    if (!letra.match(/[A-ZÑ]/) || this.letrasUsadas.includes(letra)) return;
    
    this.letrasUsadas.push(letra);
    this.usedEl.textContent = this.letrasUsadas.join(", ");
    
    if (this.palabraSecreta.includes(letra)) {
      let nueva = "";
      for (let i = 0; i < this.palabraSecreta.length; i++) {
        nueva += this.palabraSecreta[i] === letra ? letra : this.palabraMostrada[i];
      }
      this.palabraMostrada = nueva;
      
      if (!this.palabraMostrada.includes("_")) {
        this.messageEl.textContent = "🎉 ¡Ganaste!";
      }
    } else {
      this.vidas--;
      this.drawHangman();
      if (this.vidas <= 0) {
        this.messageEl.textContent = `💔 Perdiste... era: ${this.palabraSecreta}`;
      }
    }
    
    this.render();
  }
  
  drawHangman() {
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "#e60073";
    const steps = [
      () => { this.ctx.moveTo(10, 240); this.ctx.lineTo(190, 240); },
      () => { this.ctx.moveTo(50, 240); this.ctx.lineTo(50, 20); },
      () => { this.ctx.moveTo(50, 20); this.ctx.lineTo(150, 20); },
      () => { this.ctx.moveTo(150, 20); this.ctx.lineTo(150, 50); },
      () => { this.ctx.beginPath(); this.ctx.arc(150, 70, 20, 0, Math.PI * 2); },
      () => { this.ctx.moveTo(150, 90); this.ctx.lineTo(150, 150); },
      () => {
        this.ctx.moveTo(150, 110); this.ctx.lineTo(120, 140);
        this.ctx.moveTo(150, 110); this.ctx.lineTo(180, 140);
        this.ctx.moveTo(150, 150); this.ctx.lineTo(120, 200);
        this.ctx.moveTo(150, 150); this.ctx.lineTo(180, 200);
      }
    ];
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 6; i > this.vidas; i--) {
      steps[i - 1]?.();
      this.ctx.stroke();
    }
  }
  
  render() {
    this.wordEl.textContent = this.palabraMostrada.split("").join(" ");
    this.livesEl.textContent = this.vidas;
  }
}

window.WordSearch = WordSearch;
window.Puzzle = Puzzle;
window.Hangman = Hangman;
