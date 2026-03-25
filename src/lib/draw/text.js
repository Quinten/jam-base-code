export default (obj = {}) => {
    let defaults = {
        text: '',
        fill: 'white',
        x: 16,
        y: 16,
        font: '16px system-ui, sans-serif',
        lineHeight: 1.5,
        center: false,
        w: 0,
        h: 24,
        visible: true
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    obj.state.on('draw', e => {
        if (!obj.visible) {
            return;
        }
        let { ctx } = e;
        let { text, x, y, font, lineHeight } = obj;
        ctx.font = font;
        ctx.textBaseline = 'middle';
        let fontSize = font.match(/\d+/g);
        fontSize = fontSize ? fontSize[0] : 16;
        fontSize = Number(fontSize);
        let lines = text.split('\n');
        obj.h = lines.length * fontSize * lineHeight;
        obj.w = 0;
        lines.forEach((line) => {
            let w = ctx.measureText(line).width;
            obj.w = Math.max(obj.w, w);
        });
        lines.forEach((line, i) => {
            let w = ctx.measureText(line).width;
            let offset = 0;
            if (obj.center) {
                offset = (obj.w - w) / 2;
            }
            ctx.fillStyle = obj.fill;
            ctx.fillText(line, x + offset, y + (i + 0.5) * fontSize * lineHeight);
        });
    });
    return obj;
};
