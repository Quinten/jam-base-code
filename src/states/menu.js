import state from '../lib/statemachine/state.js';
import titletext from '../obj/titletext.js';
import playbutton from '../obj/playbutton.js';
import helpbutton from '../obj/helpbutton.js';
import soundbutton from '../obj/soundbutton.js';

let menu = state();
menu.on('start', () => {
    menu.emit('color', { stroke: '#ffffff', fill: '#ffffff', bg: '#000000' });
    titletext({state: menu, text: 'Jam Base Code'}); 
    playbutton({state: menu});
    helpbutton({state: menu});
    soundbutton({state: menu});
});

export default menu;
