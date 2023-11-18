/**
 * Returns the current state of the store
 * @template TState
 * @typedef {() => TState} GetState
 */

/**
 * An object representing intent to change the state of the application
 * @typedef {Object} Action - Represents an action that can be dispatched to update the state.
 * @property {string} type - The type of the action.
 * @property {unknown} [payload] - The payload data associated with the action.
 */

/**
 * Accepts the current state and an action and returns the next state
 * @template TState
 * @template {Action} TAction
 * @typedef {(state: TState, action: TAction) => TState} Reducer
 */

/**
 * Sends an intent to change the state of the application
 * @template TState
 * @template {Action} TAction
 * @typedef {(action: TAction) => void} Dispatch
 */

/**
 * Called when the store state changes
 * @template TState
 * @template {Action} TAction
 * @typedef {(dispatch: Dispatch<TState, TAction>, getState: GetState<TState>) => void} Listener
 */

/**
 * Subscribes to the store and returns an unsubscribe function
 * @template TState
 * @template {Action} TAction
 * @typedef {(listener: Listener<TState, TAction>) => Unsubscribe} Subscribe
 */

/**
 * Unsubscribes from the store
 * @typedef {() => void} Unsubscribe
 */

/**
 * @template TState
 * @template {Action} TAction
 * @typedef {Object} Store
 * @property {GetState<TState>} getState
 * @property {Dispatch<TState, TAction>} dispatch
 * @property {Subscribe<TState, TAction>} subscribe
 */

/**
 * Creates a store with the specified initial state and reducer function.
 * @template TState - The type of the state.
 * @template {Action} TAction - The type of the action.
 * @param {TState} initialState - The initial state of the store.
 * @param {Reducer<TState, TAction>} reducer - The reducer function that updates the state based on actions.
 * @returns {Store<TState, TAction>} The created store object.
 */
export function createStore(initialState, reducer) {
  let state = { ...initialState };

  /** @type {Array<Listener<TState, TAction>>} */
  let listeners = [];

  /**
   * @returns {TState}
   */
  function getState() {
    return state;
  }

  /**
   * @param {TAction} action
   */
  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach((listener) => {
      listener(dispatch, getState);
    });
  }

  /**
   * @param listener {Listener<TState, TAction>}
   * @returns {Unsubscribe}
   */
  function subscribe(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  return { dispatch, getState, subscribe };
}

/**
 * Creates an HTML element with the specified type, attributes, and children.
 * @param {string} type - The type of the HTML element to create.
 * @param {Object} attributes - The attributes to set on the HTML element.
 * @param {Array<HTMLElement | string | number>} children - The children elements to append to the HTML element.
 * @returns {HTMLElement} The created HTML element.
 */
export function createElement(type, attributes = {}, children = []) {
  const $element = document.createElement(type);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      $element.addEventListener(key.substring(2).toLowerCase(), value);
    } else {
      $element.setAttribute(key, value);
    }
  });

  children.forEach((child) => {
    if (typeof child === "string" || typeof child === "number") {
      $element.appendChild(document.createTextNode(`${child}`));
    } else {
      $element.appendChild(child);
    }
  });

  return $element;
}

/**
 * @param {HTMLElement} $node
 */
export function emptyNode($node) {
  while ($node.firstChild) {
    $node.removeChild($node.firstChild);
  }
}
