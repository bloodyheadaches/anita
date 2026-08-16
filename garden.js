function Garden(ctx, element) {
    this.ctx = ctx;
    this.element = element;
    this.chars = [];
    this.scale = 15;
}

Garden.prototype = {
initHeart: function() {
    this.chars = [];
    const symbols = "!@#$%^&*()_+-=[]{}|;':\",./<>?~`";

    const width = this.element.width;
    const height = this.element.height;

    this.scale = Math.min(14, width / 52);

    const points = [];

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let angle = 0; angle <= 360; angle += 3) {
        const t = angle * Math.PI / 180;

        const x = 16 * Math.pow(Math.sin(t), 3) * this.scale;
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * this.scale;

        points.push({ x, y });

        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
    }

    const heartWidth = maxX - minX;
    const heartHeight = maxY - minY;

    const startX = (width - heartWidth) / 2 - minX;
    const startY = (height - heartHeight) / 2 - minY;

    points.forEach(p => {
        this.chars.push({
            baseX: startX + p.x,
            baseY: startY + p.y,
            char: symbols[Math.floor(Math.random() * symbols.length)]
        });
    });
},
    render: function() {
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
        const symbols = "!@#$%^&*()_+-=[]{}|;':\",./<>?~`";
        
        this.chars.forEach(c => {
            if (Math.random() < 0.2) c.char = symbols[Math.floor(Math.random() * symbols.length)];

            this.ctx.save();
            this.ctx.font = 'bold ' + Math.max(12, Math.floor(this.scale * 0.9)) + 'px monospace';
			this.ctx.fillStyle = '#ff3366';
            this.ctx.fillText(c.char, c.baseX - 8, c.baseY);
            this.ctx.restore();
        });
    }
};