
const SCROLL_LINE_COUNT = 1;

const SCROLL_HORIZONTAL_PIXELS = 5;

const actions = [
  { keyCombination: 'j', command: 'cmd_scrollLineDown' },
  { keyCombination: 'k', command: 'cmd_scrollLineUp' },
  { keyCombination: 'G', command: 'cmd_scrollFileBottom' },
  { keyCombination: 'gg', command: 'cmd_scrollFileTop' },
];

const commands = {
  cmd_scrollLineDown: function() {
    window.scrollBy({
      left: 0,
      top: 400,
      behavior: 'smooth'
    })
  },
  cmd_scrollLineUp: function() {
    window.scrollBy({
      left: 0,
      top: -400,
      behavior: 'smooth'
    })
  },
  cmd_scrollFileTop: function() {
    window.scrollTo(window.scrollX, 0);
  },
};

//Store the longest action combination's length as the max length
const maxCombinationLength = actions.reduce((acc, curr) => Math.max(curr.keyCombination.length, acc), 0);
const numbers = [];
const validKeys = new Set();
let repetition = "";
let keyCombination = "";

//Stringify numbers
for (let i = 0; i < 10; ++i) {
  numbers.push(`${i}`);
}

actions.map(action => {
  for (let i = 0; i < action.keyCombination.length; ++i) {
    validKeys.add(action.keyCombination[i]);
  }
});

/**
 * Resets the repetition and key combination histories
 * @method
 */
function resetHistory() {
    repetition = "";
    keyCombination = "";
}

/**
 * Runs an action
 * @param {VimBindings~action} action
 */
function runAction(action) {
  commands[action.command](repetition);
  resetHistory();
}

document.addEventListener("keypress", event => {
  //Check if a number key is pressed (for repetition)
  if (numbers.includes(event.key)) {
    repetition += event.key;
    return;
  }

  //If a non-command key is pressed, bail
  if (!validKeys.has(event.key)) {
    resetHistory();
    return;
  }

  //Store the key
  keyCombination += event.key;

  // see if the key combination matches one of our vim command combinations
  const action = actions.find(value => value.keyCombination == keyCombination);

  // bail if not supported action
  if (!action) {
    //If the combination length is reached the max length, there are no possible actions left.
    if (keyCombination.length == maxCombinationLength) resetHistory();
    return;
  };

  // bail if in contenteditable elements, textareas, inputs, etc
  const contentEditable = event.target.getAttribute('contenteditable');
  const formElements = ['input', 'textarea', 'select'];
  const isFormElement = formElements.indexOf(event.target.tagName.toLowerCase()) != -1;

  if (contentEditable || isFormElement) {
    resetHistory();
    return;
  };

  runAction(action);
}, false);

/**
 * @typedef VimBindings~action
 * @type {object}
 * @property {string} keyCombination The keystroke combination
 * @property {string} command The name of the command function
 */
