import pointarea from '../lib/pointer/rect.js';
import sound from '../lib/sound.js';

sound({
    soundAssets: {
        click: {
            url: new URL('../assets/sounds/click.mp3', import.meta.url),
            chunks: [
                {start: 0, end: 0.25},
                {start: 1, end: 1.25},
                {start: 2, end: 2.25},
                {start: 3, end: 3.25},
                {start: 4, end: 4.25},
                {start: 5, end: 5.25},
                {start: 6, end: 6.25},
                {start: 7, end: 7.25}
            ]
        }
    }
});


let margin = 8;

export default (obj = {}) => {
    let defaults = {
        x: 0,
        y: 0,
        w: 64,
        h: 40
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    sound(obj);
    pointarea(obj);
    obj.state.on('resize', e => {
        let {vw} = e;
        obj.x = vw - obj.w - margin;
        obj.y = margin;
    });
    let hover = false;
    obj.state.on('draw', e => {
        let {ctx} = e;
        let { x, y } = obj;
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(x + (i + 0.5) * obj.w/4, y + obj.h/2, 4, 0, 2 * Math.PI);
            if (hover) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
        }
    });
    obj.pointer.on('pointerup', () => {
        obj.sound.playRandom('click');
        obj.state.stop('menu');
    });
    obj.pointer.on('startpointing', () => {
        hover = true;
    });
    obj.pointer.on('stoppointing', () => {
        hover = false;
    });
    return obj;
};
