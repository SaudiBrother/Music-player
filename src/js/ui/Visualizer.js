class Visualizer {
    constructor(canvasId, analyser) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.analyser = analyser;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.animationId = null;
    }

    start() {
        const draw = () => {
            this.animationId = requestAnimationFrame(draw);
            this.analyser.getByteFrequencyData(this.dataArray);

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            const barWidth = (this.canvas.width / this.dataArray.length) * 2.5;
            let x = 0;

            for (let i = 0; i < this.dataArray.length; i++) {
                const barHeight = this.dataArray[i] / 2;
                this.ctx.fillStyle = `rgb(50, 150, ${barHeight + 100})`;
                this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };
        draw();
    }

    stop() {
        cancelAnimationFrame(this.animationId);
    }
}
