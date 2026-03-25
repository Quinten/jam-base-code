export default (obj = {}) => {
    let defaults = {
        a: undefined,
        b: undefined
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);

    let { a, b } = obj;

    let dx = b.x - a.x;
    let dy = b.y - a.y;
    let len = Math.sqrt(dx * dx + dy * dy);

    let update = () => {

        dx = b.x - a.x;
        dy = b.y - a.y;
        let dst = Math.sqrt(dx * dx + dy * dy);
        let diff = len - dst;
        let offsetX = (diff * dx / dst) / 2;
        let offsetY = (diff * dy / dst) / 2;

        if (!a.fixed && !b.fixed) {
            a.x -= offsetX;
            a.y -= offsetY;
            b.x += offsetX;
            b.y += offsetY;
        } else if (!a.fixed && b.fixed) {
            a.x -= offsetX * 2;
            a.y -= offsetY * 2;
        } else if (a.fixed && !b.fixed) {
            b.x += offsetX * 2;
            b.y += offsetY * 2;
        }
    };

    let physicsElapsed = 0;
    let step = e => {
        let {dt} = e;
        physicsElapsed += dt;
        while (physicsElapsed >= 17) {
            physicsElapsed -= 17;
            update();
        }
    };
    obj.state.on('step', step);

    return obj;
};
