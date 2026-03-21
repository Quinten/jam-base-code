import path from './path.js';

export default (obj = {}) => {
    let defaults = {
        allPaths: [],
        currentFrame: 0
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    path(obj);
    let copyPaths = () => {
        if (obj.paths.length) {
            obj.allPaths = obj.paths.slice();
            obj.state.on('step', () => {
                if (obj.allPaths[obj.currentFrame]) {
                    obj.paths = [obj.allPaths[obj.currentFrame]];
                }
            });
        } else {
            obj.state.once('step', copyPaths);
        }
    };
    obj.state.once('step', copyPaths);
    return obj;
};
