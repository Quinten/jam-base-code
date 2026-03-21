import textbutton from './textbutton.js';

export default (obj = {}) => {
    let defaults = {
        text: 'Sound = OFF'
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    obj.state.on('step', e => {
        let {vw, vh} = obj.state.last('resize');
        obj.x = vw / 2 - obj.w / 2;
        obj.y = vh / 2 + obj.h * 1.5 + 16;
    });
    textbutton(obj);
    if (obj.sound.getIsOn()) {
        obj.text = 'Sound = ON';
    } else {
        obj.text = 'Sound = OFF';
    }
    obj.pointer.on('pointerup', () => {
        if (obj.sound.getIsOn()) {
            obj.sound.setIsOn(false);
            obj.text = 'Sound = OFF';
        } else {
            obj.sound.setIsOn(true);
            obj.text = 'Sound = ON';
            obj.sound.playNthChunk('uiux', 0);
        }
    });
    return obj;
};
