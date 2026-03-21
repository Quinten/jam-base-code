import state from '../lib/statemachine/state.js';
import menubutton from '../obj/menubutton.js';

let level = state();
level.on('start', () => {
    menubutton({state: level});
});

export default level;
