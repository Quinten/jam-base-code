export default (obj) => {
    let timeouts = [];

    obj.setTimeout = (callback, duration) => {
        let {t} = obj.state.last('step');
        let end = t + duration;
        let timeout = {callback, end};
        timeouts.push(timeout);
        return timeout;
    };

    obj.clearTimeout = (timeout) => {
        timeouts.splice(timeouts.indexOf(timeout), 1);
    };

    obj.state.on('step', (e) => {
        let {t} = e;

        let toRemove = [];
        timeouts.forEach((timeout) => {
            if (timeout.end <= t) {
                timeout.callback();
                toRemove.push(timeout);
            }
        });
        toRemove.forEach((timeout) => {
            timeouts.splice(timeouts.indexOf(timeout), 1);
        });
    });

    return obj;
};
