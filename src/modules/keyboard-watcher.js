let options = {
  cmd: 'Cmd',
  ctrl: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift',
  joinWith: '+'
};

const modifiers = [
  16, // Shift
  17, // Ctrl
  18, // Alt
  225, // Alt
  91, // OS left/right
  92, // OS left/right
  224 // OS left/right
];

const keys = {
  8: 'Backspace',
  9: 'Tab',
  12: 'NumpadEqual',
  13: 'Enter',
  19: 'Pause',
  20: 'CapsLock',
  27: 'Esc',
  32: 'Space',
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'Left',
  38: 'Up',
  39: 'Right',
  40: 'Down',
  45: 'Insert',
  46: 'Delete',
  93: 'ContextMenu',
  96: 'Numpad0',
  97: 'Numpad1',
  98: 'Numpad2',
  99: 'Numpad3',
  100: 'Numpad4',
  101: 'Numpad5',
  102: 'Numpad6',
  103: 'Numpad7',
  104: 'Numpad8',
  105: 'Numpad9',
  106: 'NumpadMultiply',
  107: 'NumpadAdd',
  109: 'NumpadExtract',
  110: 'NumpadDecimal',
  111: 'NumpadDivide',
  112: 'F1',
  113: 'F2',
  114: 'F3',
  115: 'F4',
  116: 'F5',
  117: 'F6',
  118: 'F7',
  119: 'F8',
  120: 'F9',
  121: 'F10',
  122: 'F11',
  123: 'F12',
  144: 'NumLock',
  145: 'ScrollLock',
  173: '-',
  188: ',',
  190: '.',
  191: '/',
  192: '`',
  194: 'NumpadComma',
  219: ']',
  220: '\\',
  221: '[',
  222: '\''
};

function buildModifiers(event) {
  let modifiers = [];

  if (event.metaKey) {
    modifiers.push(options.cmd);
  }
  if (event.ctrlKey) {
    modifiers.push(options.ctrl);
  }
  if (event.altKey) {
    modifiers.push(options.alt);
  }
  if (event.shiftKey) {
    modifiers.push(options.shift);
  }
  return modifiers;
}

/**
 * @param {KeyboardEvent} event
 * @returns {string}
 */
function eventToString(event) {
  const isOnlyModifier = modifiers.indexOf(event.keyCode) !== -1;

  if (isOnlyModifier) {
    return buildModifiers(event).join(options.joinWith);
  }

  const character =
    keys[event.keyCode] || String.fromCharCode(event.keyCode);

  return buildModifiers(event)
    .concat([character])
    .join(options.joinWith);
}

function setOptions(opts) {
  options = Object.assign(options, opts);
  return options;
}

/**
 * Add event listener to node, call named function from keyMap by eventToStriing
 * keyMap example:
 * {
 *  'Enter': function(event) {},
 *  'Up': function(event) {}
 * }
 * @param {HTMLElement} node
 * @param {object} keyMap
 */
function keydownWatcher(node, keyMap) {
  function keydownCallback(event) {
    const keyFunction = keyMap[eventToString(event)];
    if (keyFunction && keyFunction.call && keyFunction.apply) {
      keyFunction(event);
    }
  }

  node.addEventListener('keydown', keydownCallback);

  return {
    destroy() {
      node.removeEventListener('keydown', keydownCallback);
    }
  };
}

export { eventToString, setOptions, keydownWatcher };
