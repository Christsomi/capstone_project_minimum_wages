class Graph {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.setCanvasSize();
        this.options = options;
        
        this.marginX = 50;
        this.marginY = 50;
        this.originX = this.marginX;
        this.originY = this.canvas.height - this.marginY;
        this.scale = 2;

        this.colors = {
            supply: '#2196F3',
            demand: '#F44336',
            mc: '#9C27B0',
            minWage: '#4CAF50',
            grid: '#f0f0f0',
            axis: '#666',
            text: '#333'
        };

        window.addEventListener('resize', () => {
            this.setCanvasSize();
            this.draw();
        });

        this.setupHiDPI();
    }

    setupHiDPI() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }

    setCanvasSize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.originX = this.marginX;
        this.originY = this.canvas.height - this.marginY;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid() {
        const stepX = 30;
        const stepY = 30;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 0.5;

        for (let x = this.originX; x < this.canvas.width - this.marginX; x += stepX) {
            this.ctx.moveTo(x, this.marginY);
            this.ctx.lineTo(x, this.originY);
        }

        for (let y = this.originY; y > this.marginY; y -= stepY) {
            this.ctx.moveTo(this.originX, y);
            this.ctx.lineTo(this.canvas.width - this.marginX, y);
        }

        this.ctx.stroke();
    }

    drawAxes() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.colors.axis;
        this.ctx.lineWidth = 2;

        this.ctx.moveTo(this.originX, this.marginY);
        this.ctx.lineTo(this.originX, this.originY);

        this.ctx.moveTo(this.originX, this.originY);
        this.ctx.lineTo(this.canvas.width - this.marginX, this.originY);

        this.ctx.moveTo(this.originX - 5, this.marginY + 10);
        this.ctx.lineTo(this.originX, this.marginY);
        this.ctx.lineTo(this.originX + 5, this.marginY + 10);

        this.ctx.moveTo(this.canvas.width - this.marginX - 10, this.originY - 5);
        this.ctx.lineTo(this.canvas.width - this.marginX, this.originY);
        this.ctx.lineTo(this.canvas.width - this.marginX - 10, this.originY + 5);

        this.ctx.stroke();

        this.ctx.font = '14px Inter';
        this.ctx.fillStyle = this.colors.text;
        
        this.ctx.save();
        this.ctx.translate(25, this.canvas.height / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Wage Rate ($)', 0, 0);
        this.ctx.restore();

        this.ctx.textAlign = 'center';
        this.ctx.fillText('Labor Quantity (L)', this.canvas.width / 2, this.originY + 35);
    }

    drawLine(startX, startY, endX, endY, color = '#000', label = '', dash = []) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash(dash);
        
        const x1 = this.originX + startX * this.scale;
        const y1 = this.originY - startY * this.scale;
        const x2 = this.originX + endX * this.scale;
        const y2 = this.originY - endY * this.scale;

        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        if (label) {
            this.ctx.fillStyle = color;
            this.ctx.font = '12px Inter';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(label, x2 + 10, y2);
        }
    }

    drawIntersection(x, y, color = '#000') {
        const px = this.originX + x * this.scale;
        const py = this.originY - y * this.scale;

        this.ctx.beginPath();
        this.ctx.arc(px, py, 4, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
}

class CompetitiveMarket extends Graph {
    constructor(canvasId) {
        super(canvasId);
        this.bindControls();
        this.updateValueDisplays();
    }

    bindControls() {
        ['compSupplySlope', 'compDemandSlope', 'compMinWage'].forEach(id => {
            const input = document.getElementById(id);
            input.addEventListener('input', () => {
                this.updateValueDisplays();
                this.draw();
            });
        });
    }

    updateValueDisplays() {
        document.getElementById('compSupplySlopeValue').textContent = 
            document.getElementById('compSupplySlope').value + '%';
        document.getElementById('compDemandSlopeValue').textContent = 
            document.getElementById('compDemandSlope').value + '%';
        document.getElementById('compMinWageValue').textContent = 
            '$' + (document.getElementById('compMinWage').value / 6.67).toFixed(2);
    }

    draw() {
        this.clear();
        this.drawGrid();
        this.drawAxes();

        const supplySlope = document.getElementById('compSupplySlope').value / 100;
        const demandSlope = -document.getElementById('compDemandSlope').value / 50;
        const minWage = document.getElementById('compMinWage').value;

        const x1 = 150;
        const y1 = x1 * supplySlope;
        const y2 = 150 + x1 * demandSlope;

        this.drawLine(0, 0, x1, y1, this.colors.supply, 'Supply (S)');

        this.drawLine(0, 140, x1, y2, this.colors.demand, 'Demand (D)');

        const minWageY = minWage;
        this.drawLine(0, minWageY, x1, minWageY, this.colors.minWage, 'Min Wage', [5, 5]);
    }
}

class MonopsonyMarket extends Graph {
    constructor(canvasId) {
        super(canvasId);
        this.bindControls();
        this.updateValueDisplays();
    }

    bindControls() {
        ['monoSupplySlope', 'monoMCSlope', 'monoDemandSlope', 'monoMinWage'].forEach(id => {
            const input = document.getElementById(id);
            input.addEventListener('input', () => {
                this.updateValueDisplays();
                this.draw();
            });
        });
    }

    updateValueDisplays() {
        document.getElementById('monoSupplySlopeValue').textContent = 
            document.getElementById('monoSupplySlope').value + '%';
        document.getElementById('monoMCSlopeValue').textContent = 
            document.getElementById('monoMCSlope').value + '%';
        document.getElementById('monoDemandSlopeValue').textContent = 
            document.getElementById('monoDemandSlope').value + '%';
        document.getElementById('monoMinWageValue').textContent = 
            '$' + (document.getElementById('monoMinWage').value / 6.67).toFixed(2);
    }

    draw() {
        this.clear();
        this.drawGrid();
        this.drawAxes();

        const supplySlope = document.getElementById('monoSupplySlope').value / 100;
        const mcSlope = document.getElementById('monoMCSlope').value / 100;
        const demandSlope = -document.getElementById('monoDemandSlope').value / 50;
        const minWage = document.getElementById('monoMinWage').value;

        const x1 = 150;
        
        const supplyY = x1 * supplySlope;
        this.drawLine(0, 0, x1, supplyY, this.colors.supply, 'Supply (AC)');

        const mcY = x1 * mcSlope;
        this.drawLine(0, 0, x1, mcY, this.colors.mc, 'MC');

        const demandY = 150 + x1 * demandSlope;
        this.drawLine(0, 140, x1, demandY, this.colors.demand, 'Demand (MRP)');

        const minWageY = minWage;
        this.drawLine(0, minWageY, x1, minWageY, this.colors.minWage, 'Min Wage', [5, 5]);
    }
}

window.addEventListener('load', () => {
    const competitiveMarket = new CompetitiveMarket('competitiveCanvas');
    const monopsonyMarket = new MonopsonyMarket('monopsonyCanvas');

    competitiveMarket.draw();
    monopsonyMarket.draw();
});