import textbutton from './textbutton.js';

export default (obj = {}) => {
    let defaults = {
        text: 'Help'
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    obj.state.on('step', e => {
        let {vw, vh} = obj.state.last('resize');
        obj.x = vw / 2 - obj.w / 2;
        obj.y = vh / 2 + obj.h / 2 + 8;
    });
    textbutton(obj);
    obj.pointer.on('pointerup', () => {
        obj.state.stop('help');
        obj.sound.playNthChunk('uiux', 1);
    });
    return obj;
};
