import sound from '../lib/sound.js';
import textbutton from './textbutton.js';

sound({
    soundAssets: {
        uimove: {
            url: new URL('../assets/sounds/uimove.mp3', import.meta.url),
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

export default (obj = {}) => {
    let defaults = {
        text: 'Play'
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    obj.state.on('step', () => {
        let {vw, vh} = obj.state.last('resize');
        obj.x = vw / 2 - obj.w / 2;
        obj.y = vh / 2 - obj.h / 2;
    });
    textbutton(obj);
    obj.pointer.on('pointerup', () => {
        obj.state.stop('level');
        obj.sound.playNthChunk('uiux', 2);
    });
    return obj;
};
