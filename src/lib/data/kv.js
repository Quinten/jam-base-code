import events from '../events.js';

let store = {};
let lsKey = document.title.toLowerCase() + '_kv-data_';
lsKey = lsKey.replace(/[^a-zA-Z0-9]/g, '-');
let {on, off, once, emit, last} = events();
let data = {
    on,
    off,
    once,
    emit,
    last,
    getItem: k => {
        if (store[k] === undefined) {
            let lsData = localStorage.getItem(lsKey + k);
            if (lsData !== null) {
                store[k] = JSON.parse(lsData);
            }
        }
        return store[k];
    },
    setItem: (k, v) => {
        if (store[k] !== v) {
            data.emit('change', {key: k, value: v});
        }
        store[k] = v;
        let lsData = JSON.stringify(v);
        localStorage.setItem(lsKey + k, lsData);
    }
};

export default (obj = {}) => {
    obj.data = {
        getItem: data.getItem,
        setItem: data.setItem
    };
    events(obj.data, ['change']);
    obj.data.syncOn(data);
    obj.state.once('stop', () => {
        obj.data.syncOff(data);
        obj.data.off('change');
        obj.data = undefined;
    });
    return obj;
};
