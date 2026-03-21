export default (obj = {}) => {
    let defaults = {
        nRows: 10,
        nCols: 10,
        tileSize: 40,
        grid: [],
        fills: ['white', 'black'], // 0 = white, 1 = black
        visible: true
    };
    Object.assign(defaults, obj);
    Object.assign(obj, defaults);
    obj.state.on('draw', e => {
        if (!obj.visible) {
            return;
        }
        let { ctx } = e;
        let { nRows, nCols, tileSize, grid, fills } = obj;
        for (let y = 0; y < nRows; y++) {
            for (let x = 0; x < nCols; x++) {
                ctx.fillStyle = fills[grid[y][x]];
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    });
    return obj;
};
