import state from '../lib/statemachine/state.js';
import menubutton from '../obj/menubutton.js';
import textbox from '../obj/textbox.js';

let helptext = `
Short but helpful instructions
on how to play this game.
`;

let help = state();
help.on('start', () => {
    menubutton({state: help});
    textbox({
        state: help,
        text: helptext
    });
});

export default help;
