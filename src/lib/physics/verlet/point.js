export default (obj = {}) => {
    let oldX = 0;
    let oldY = 0;
    let startX = 0;
    let startY = 0;
    let defaults = {
        x: 0,
        y: 0,
        gravityX: 0,
        gravityY: 0,
        fixed: false,
        setVx(value) {
            oldX = this.x - value;
        },
        getVx() {
            return this.x - oldX;
        },
        setVy(value) {
            oldY = this.y - value;
        },
        getVy() {
            return this.y - oldY;
        },
        bounds: {
            left: 0,
            right: 320,
            top: 0,
            bottom: 320
        },
        constrain: false,
        bounce: true,
        bounced: false,
        restitution: 0.3,
        friction: 0.7,
        isGrounded: false,
        hitBottom: false,
        beyondBase: false,
        connectedTo: [],
        connectedToBase: false
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);

    oldX = obj.x;
    oldY = obj.y;
    startX = obj.x;
    startY = obj.y;

    let update = () => {
        if (obj.fixed) {
            return;
        }
        obj.x += obj.gravityX;
        obj.y += obj.gravityY;
        let {x, y} = obj;
        obj.x += obj.getVx();
        obj.y += obj.getVy();
        oldX = x;
        oldY = y;
    };

    let constrain = () => {
        let {left, right, top, bottom} = obj.bounds;
        obj.x = Math.max(left, Math.min(right, obj.x));
        obj.y = Math.max(top, Math.min(bottom, obj.y));
    };

    let bounce = () => {
        let {left, right, top, bottom} = obj.bounds;

        let tempVx = obj.getVx() * obj.restitution;
        if (obj.x > right) {
            obj.x = right;
            obj.setVx(-tempVx);
            if (!obj.bounced) {
                obj.bounced = true;
            }
        }
        if (obj.x < left) {
            obj.x = left;
            obj.setVx(-tempVx);
            if (!obj.bounced) {
                obj.bounced = true;
            }
        }

        let tempVy = obj.getVy() * obj.restitution;
        if (obj.y > bottom) {
            obj.y = bottom;
            obj.setVy(-tempVy);
            if (!obj.bounced) {
                obj.bounced = true;
                obj.setVx(-tempVy + Math.random() * tempVy * 2);
            }
            if (!obj.hitBottom) {
                obj.hitBottom = true;
            }
            obj.setVx(obj.getVx() * obj.friction);
        }
        if (obj.y < top) {
            obj.y = top;
            obj.setVy(-tempVy);
        }
    };

    let physicsElapsed = 0;
    let step = e => {
        let {dt} = e;
        physicsElapsed += dt;
        while (physicsElapsed >= 40) {
            physicsElapsed -= 40;
            update();
            if (obj.constrain) {
                constrain();
            }
            if (obj.bounce) {
                bounce();
            }
        }
    };
    obj.state.on('step', step);

    return obj;
};
