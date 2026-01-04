/**
 * Visualizer - Canvas-based audio visualization
 */
class Visualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d', { 
            alpha: true, 
            willReadFrequently: false 
        });

        this.dataArray = null;
        this.bufferLength = 0;
        this.animationId = null;
        this.isPlaying = false;

        // Visualizer settings
        this.type = 'bars'; // 'bars', 'waveform', 'circular'
        this.smoothing = 0.85;
        this.sensitivity = 1.5;

        // Performance optimization
        this.lastUpdateTime = 0;
        this.frameRate = 60;
        this.frameInterval = 1000 / this.frameRate;

        // Smooth transitions
        this.smoothValues = [];

        this.resize();
        this.setupResizeListener();
    }

    resize() {
        // High DPI support
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.scale(dpr, dpr);
        this.displayWidth = rect.width;
        this.displayHeight = rect.height;
    }

    setupResizeListener() {
        // Debounce resize events
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.resize();
            }, 250);
        });
    }

    /**
     * Start rendering visualizer
     */
    start() {
        this.isPlaying = true;
        this.animate();
    }

    /**
     * Stop rendering
     */
    stop() {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.clearCanvas();
    }

    /**
     * Main animation loop
     */
    animate() {
        const now = Date.now();
        const elapsed = now - this.lastUpdateTime;

        // Control frame rate
        if (elapsed >= this.frameInterval) {
            this.lastUpdateTime = now - (elapsed % this.frameInterval);

            // Get data dan render
            if (this.dataArray) {
                switch (this.type) {
                    case 'bars':
                        this.drawBars();
                        break;
                    case 'waveform': 
                        this.drawWaveform();
                        break;
                    case 'circular':
                        this.drawCircular();
                        break;
                }
            }
        }

        if (this.isPlaying) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }

    /**
     * Draw bar visualizer
     */
    drawBars() {
        const width = this.displayWidth;
        const height = this.displayHeight;

        // Clear dengan gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(0, 212, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 153, 255, 0.05)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);

        const bars = Math.min(64, this.dataArray.length >> 4);
        const barWidth = (width / bars) * 2.5;
        let x = 0;

        // Draw bars
        for (let i = 0; i < bars; i++) {
            const index = i << 4;
            let barHeight = (this.dataArray[index] / 255) * height * this.sensitivity;

            // Smooth value transitions
            if (!this.smoothValues[i]) {
                this.smoothValues[i] = 0;
            }

            this.smoothValues[i] += (barHeight - this.smoothValues[i]) * (1 - this.smoothing);
            barHeight = this.smoothValues[i];

            // Create gradient untuk setiap bar
            const barGradient = this.ctx.createLinearGradient(0, height - barHeight, 0, height);
            barGradient.addColorStop(0, '#00ff88');
            barGradient.addColorStop(0.5, '#00d4ff');
            barGradient.addColorStop(1, '#0099ff');

            this.ctx.fillStyle = barGradient;
            this.ctx.globalAlpha = 0.8;

            // Draw bar dengan rounded corners
            const radius = 4;
            this.ctx.beginPath();
            this.ctx.moveTo(x + radius, height - barHeight);
            this.ctx.lineTo(x + barWidth - radius, height - barHeight);
            this.ctx.quadraticCurveTo(x + barWidth, height - barHeight, x + barWidth, height - barHeight + radius);
            this.ctx.lineTo(x + barWidth, height - radius);
            this.ctx.quadraticCurveTo(x + barWidth, height, x + barWidth - radius, height);
            this.ctx.lineTo(x + radius, height);
            this.ctx.quadraticCurveTo(x, height, x, height - radius);
            this.ctx.lineTo(x, height - barHeight + radius);
            this.ctx.quadraticCurveTo(x, height - barHeight, x + radius, height - barHeight);
            this.ctx.fill();

            this.ctx.globalAlpha = 1;
            x += barWidth + 1;
        }
    }

    /**
     * Draw waveform visualizer
     */
    drawWaveform() {
        const width = this.displayWidth;
        const height = this.displayHeight;
        const centerY = height / 2;

        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, width, height);

        // Draw waveform
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#00d4ff';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        const sliceWidth = (width * 1.0) / this.dataArray.length;
        let x = 0;

        for (let i = 0; i < this.dataArray.length; i++) {
            const v = this.dataArray[i] / 128.0;
            const y = (v * height) / 2;

            if (i === 0) {
                this.ctx.moveTo(x, centerY);
            } else {
                this.ctx.lineTo(x, centerY - y);
            }

            x += sliceWidth;
        }

        this.ctx.lineTo(width, centerY);
        this.ctx.stroke();

        // Draw mirror waveform
        this.ctx.globalAlpha = 0.3;
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#0099ff';
        x = 0;

        for (let i = 0; i < this.dataArray.length; i++) {
            const v = this.dataArray[i] / 128.0;
            const y = (v * height) / 2;

            if (i === 0) {
                this.ctx.moveTo(x, centerY);
            } else {
                this.ctx.lineTo(x, centerY + y);
            }

            x += sliceWidth;
        }

        this.ctx.lineTo(width, centerY);
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }

    /**
     * Draw circular visualizer
     */
    drawCircular() {
        const width = this.displayWidth;
        const height = this.displayHeight;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;

        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, width, height);

        // Draw center circle
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 212, 255, 0.2)';
        this.ctx.fill();
        this.ctx.strokeStyle = '#00d4ff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw bars in circle
        const bars = this.dataArray.length >> 4;
        const angleSlice = (Math.PI * 2) / bars;

        for (let i = 0; i < bars; i++) {
            const index = i << 4;
            const barHeight = (this.dataArray[index] / 255) * radius * this.sensitivity;
            const angle = angleSlice * i - Math.PI / 2;

            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            const x2 = centerX + Math.cos(angle) * (radius + barHeight);
            const y2 = centerY + Math.sin(angle) * (radius + barHeight);

            const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, 'rgba(0, 212, 255, 0.5)');
            gradient.addColorStop(1, '#00d4ff');

            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 3;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }

    /**
     * Update data dari audio engine
     */
    updateData(dataArray) {
        this.dataArray = dataArray;
        this.bufferLength = dataArray.length;
    }

    /**
     * Set visualizer type
     */
    setType(type) {
        if (['bars', 'waveform', 'circular'].includes(type)) {
            this.type = type;
            this.smoothValues = [];
        }
    }

    /**
     * Set sensitivity
     */
    setSensitivity(value) {
        this.sensitivity = Math.max(0.5, Math.min(3, value));
    }

    /**
     * Clear canvas
     */
    clearCanvas() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        this.ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);
    }

    /**
     * Get current visualizer type
     */
    getType() {
        return this.type;
    }
}

const visualizer = new Visualizer('visualizer');
