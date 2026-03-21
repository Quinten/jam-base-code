import css from '../css.js';
css`body.p canvas{cursor:pointer;}`;

import events from '../events.js';

export default (obj = {}) => {
    let defaults = {
        x: 0,
        y: 0,
        nCols: 10,
        nRows: 10,
        tileSize: 40,
        w: 400,
        h: 400,
        grid: [],
        pointValues: [1, 2]
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    let {on, off, once, emit, last} = events();
    obj.pointer = {
        on,
        off,
        once,
        emit,
        last,
        down: false,
        pointing: false,
        x: 0,
        y: 0,
        value: undefined,
        interactive: true
    };
    obj.state.on('pointerdown', e => {
        if (!obj.pointer.interactive) {
            return;
        }
        let {nCols, nRows, tileSize, grid} = obj;
        let x = Math.floor((e.x - obj.x) / tileSize);
        let y = Math.floor((e.y - obj.y) / tileSize);
        if (x < 0 || x >= nCols || y < 0 || y >= nRows) {
            return;
        }
        let value = grid[y][x];
        emit('pointerdown', {x, y, value});
        obj.pointer.down = true;
    });
    obj.state.on('pointerup', e => {
        if (!obj.pointer.interactive) {
            return;
        }
        obj.pointer.down = false;
        let {nCols, nRows, tileSize, grid} = obj;
        let x = Math.floor((e.x - obj.x) / tileSize);
        let y = Math.floor((e.y - obj.y) / tileSize);
        if (x < 0 || x >= nCols || y < 0 || y >= nRows) {
            emit('pointerup', {});
            return;
        }
        let value = grid[y][x];
        emit('pointerup', {x, y, value});
    });
    obj.state.on('pointermove', e => {
        if (!obj.pointer.interactive) {
            return;
        }
        let {nCols, nRows, tileSize, grid} = obj;
        let x = Math.floor((e.x - obj.x) / tileSize);
        let y = Math.floor((e.y - obj.y) / tileSize);
        if (x < 0 || x >= nCols || y < 0 || y >= nRows) {
            emit('pointermove', {});
            if (obj.pointer.pointing) {
                emit('stoppointing', {});
                document.body.classList.remove('p');
            }
            obj.pointer.pointing = false;
            return;
        }
        let value = grid[y][x];
        emit('pointermove', {x, y, value});
        obj.pointer.x = x;
        obj.pointer.y = y;
        obj.pointer.value = value;
        if (obj.pointValues.indexOf(value) !== -1) {
            if (!obj.pointer.pointing) {
                emit('startpointing', {x, y, value});
                document.body.classList.add('p');
                obj.pointer.pointing = true;
            }
        } else {
            if (obj.pointer.pointing) {
                emit('stoppointing', {x, y, value});
                document.body.classList.remove('p');
            }
            obj.pointer.pointing = false;
        }
    });
    obj.state.on('stop', e => {
        obj.pointer.down = false;
        if (obj.pointer.pointing) {
            emit('stoppointing', {x: obj.pointer.x, y: obj.pointer.y, value: obj.pointer.value});
            document.body.classList.remove('p');
        }
        obj.pointer.pointing = false;
    });
    return obj;
};
