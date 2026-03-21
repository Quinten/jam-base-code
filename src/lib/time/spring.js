export default (obj) => {

    obj.spring = (prop, target, springiness = 0.2, decay = 0.8) => {
        let lastChange = obj[prop] - target;
        let step = e => {
            let {dt} = e;
            dt = Math.min(dt, 40);
            let s = springiness * dt / 40;
            let d = decay;
            let change = ((target - obj[prop]) * s) + (lastChange * d);
            lastChange = change;
            obj[prop] += change;
            if (Math.abs(change) > 0.00001) {
                obj.state.once('step', step);
            } else {
                obj[prop] = target;
            }
        };
        obj.state.once('step', step);
    };

    return obj;
};
