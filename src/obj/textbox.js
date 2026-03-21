import text from '../lib/draw/text.js';

export default (obj = {}) => {
    let defaults = {
        x: 0,
        y: 0,
        font: '20px system-ui, sans-serif',
        fill: '#F0F4EF',
        text: 'Lorem ipsum'
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    text(obj);
    obj.state.on('step', e => {
        let { vw, vh } = obj.state.last('resize');
        obj.x = vw / 2 - obj.w / 2;
        obj.y = vh / 2 - obj.h / 2;
    });
    return obj;
};
