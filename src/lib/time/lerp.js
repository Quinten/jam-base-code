export default (obj) => {

    obj.lerp = (prop, target, duration, delay = 0, callback) => {
        let start = obj[prop];
        let elapsed = -delay;
        let step = e => {
            let { dt } = e;
            elapsed += dt;
            if (elapsed < 0) {
                obj.state.once('step', step);
                return;
            }
            let progress = Math.min(elapsed / duration, 1);
            obj[prop] = start + (target - start) * progress;
            if (progress !== 1) {
                obj.state.once('step', step);
            } else {
                obj[prop] = target;
                if (callback) {
                    callback();
                }
            }
        };
        obj.state.once('step', step);
    };

    return obj;
};
