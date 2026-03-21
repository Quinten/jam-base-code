import sound from '../lib/sound.js';
import svg from '../lib/svg.js';
import pathsprite from '../lib/draw/pathsprite.js';
import pointarea from '../lib/pointer/rect.js';
import text from '../lib/draw/text.js';

// cache the svg
svg({url: new URL('../assets/sprites/textbutton.svg', import.meta.url)});

// cache the sound
sound({
    soundAssets: {
        'uiux': {
            url: new URL('../assets/sounds/uiux.mp3', import.meta.url),
            chunks: [
                {start: 0, end: 1.5},
                {start: 2, end: 2.25},
                {start: 3, end: 3.99}
            ]
        }
    }
});

export default (obj = {}) => {
    let defaults = {
        url: new URL('../assets/sprites/textbutton.svg', import.meta.url),
        w: 192,
        h: 48,
        text: 'Push me'
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    pathsprite(obj);
    sound(obj);

    let label = {
        x: 0,
        y: 0,
        font: '20px system-ui, sans-serif',
        lineHeight: 2,
        fill: '#F0F4EF',
        text: obj.text,
        state: obj.state
    };
    text(label);
    let labelOffset = 0;

    obj.state.on('step', e => {
        label.text = obj.text;
        label.x = obj.x + obj.w / 2 - label.w / 2;
        label.y = obj.y + obj.h / 2 - label.h / 2 + labelOffset;
    });
    pointarea(obj);
    obj.pointer.on('startpointing', () => {
        obj.currentFrame = 1;
        labelOffset = 2;
    });
    obj.pointer.on('stoppointing', () => {
        obj.currentFrame = 0;
        labelOffset = 0;
    });
    obj.pointer.on('pointerdown', () => {
        obj.currentFrame = 2;
        labelOffset = 4;
    });
    obj.pointer.on('pointerup', () => {
        obj.currentFrame = 0;
        labelOffset = 0;
    });
    return obj;
};
