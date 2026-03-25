import text from '../lib/draw/text.js';

export default (obj = {}) => {
    let defaults = {
        x: 0,
        y: 0,
        font: '48px system-ui, sans-serif',
        fill: '#ffffff',
        text: '',
        lineHeight: 2,
        offsetY: 0
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    text(obj);
    obj.state.on('step', () => {
        let { vw } = obj.state.last('resize');
        obj.x = vw / 2 - obj.w / 2;
        obj.y = 8 + obj.offsetY;
    });
    return obj;
};
