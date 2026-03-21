// The main entry point for the game,
// which sets up the state machine
// and loads the initial states.

import machine from './lib/statemachine/machine.js';

// The bare minimum states for a jam game
import menu from './states/menu.js';
import level from './states/level.js';
import help from './states/help.js';

machine.add('menu', menu);
machine.add('level', level);
machine.add('help', help);


// See index.html for the loading screen in plain HTML and CSS.
// It is removed here once the game is ready to start
let ls = document.querySelector('#loading-screen');
if (ls) {
    ls.remove();
}

export default machine;
