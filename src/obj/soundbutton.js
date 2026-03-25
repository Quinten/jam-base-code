import data from '../lib/data/kv.js';
import textbutton from './textbutton.js';

export default (obj = {}) => {
    let defaults = {
        text: 'Sound = OFF'
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    obj.state.on('step', () => {
        let {vw, vh} = obj.state.last('resize');
        obj.x = vw / 2 - obj.w / 2;
        obj.y = vh / 2 + obj.h * 1.5 + 16;
    });
    textbutton(obj);
    data(obj);
    if (obj.data.getItem('soundIsOn') === undefined) {
        obj.data.setItem('soundIsOn', true);
        obj.sound.setIsOn(true);
    }
    if (obj.sound.getIsOn()) {
        obj.text = 'Sound = ON';
    } else {
        obj.text = 'Sound = OFF';
    }
    obj.pointer.on('pointerup', () => {
        if (obj.sound.getIsOn()) {
            obj.sound.setIsOn(false);
            obj.text = 'Sound = OFF';
            obj.data.setItem('soundIsOn', false);
        } else {
            obj.sound.setIsOn(true);
            obj.text = 'Sound = ON';
            obj.sound.playNthChunk('uiux', 0);
            obj.data.setItem('soundIsOn', true);
        }
    });
    return obj;
};
