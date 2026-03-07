/* =========================================
   js/pintar.js - Canvas de dibujo
   ========================================= */

class Painter {
  constructor() {
    this.canvas = document.getElementById("paintCanvas");
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext("2d");
    this.colorPicker = document.getElementById("colorPicker");
    this.brushSize = document.getElementById("brushSize");
    this.clearBtn = document.getElementById("clearCanvasBtn");
    this.undoBtn = document.getElementById("undoBtn");
    this.uploadBtn = document.getElementById("uploadImageBtn");
    this.imageLoader = document.getElementById("bgImageLoader");
    
    this.painting = false;
    this.history = [];
    
    this.init();
  }
  
  init() {
    this.setupCanvas();
    this.attachListeners();
    window.addEventListener("resize", () => this.setupCanvas());
  }
  
  setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.redrawHistory();
  }
  
  attachListeners() {
    this.canvas.addEventListener("mousedown", (e) => this.startPaint(e));
    this.canvas.addEventListener("mouseup", () => this.endPaint());
    this.canvas.addEventListener("mousemove", (e) => this.draw(e));
    this.canvas.addEventListener("touchstart", (e) => this.startPaint(e), { passive: false });
    this.canvas.addEventListener("touchend", () => this.endPaint());
    this.canvas.addEventListener("touchmove", (e) => this.draw(e), { passive: false });
    
    this.clearBtn.addEventListener("click", () => this.clear());
    this.undoBtn.addEventListener("click", () => this.undo());
    this.uploadBtn.addEventListener("click", () => this.imageLoader.click());
    this.imageLoader.addEventListener("change", (e) => this.loadImage(e));
  }
  
  getPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }
  
  startPaint(e) {
    this.painting = true;
    this.draw(e);
  }
  
  endPaint() {
    if (!this.painting) return;
    this.painting = false;
    this.ctx.beginPath();
    this.history.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
  }
  
  draw(e) {
    if (!this.painting) return;
    e.preventDefault();
    
    const { x, y } = this.getPos(e);
    this.ctx.lineWidth = this.brushSize.value;
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = this.colorPicker.value;
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }
  
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.style.backgroundImage = "";
    this.history = [];
  }
  
  undo() {
    this.history.pop();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.redrawHistory();
  }
  
  redrawHistory() {
    if (this.history.length > 0) {
      this.ctx.putImageData(this.history[this.history.length - 1], 0, 0);
    }
  }
  
  loadImage(e) {
    const reader = new FileReader();
    reader.onload = (event) => {
      this.canvas.style.backgroundImage = `url(${event.target.result})`;
    };
    reader.readAsDataURL(e.target.files[0]);
  }
}

window.Painter = Painter;
