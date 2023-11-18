import { createStore, emptyNode, createElement as h } from "./core.js";

/** @typedef {{ count: number }} AppState */
/** @typedef {{ type: "INCREMENT" } | { type: "DECREMENT" }} AppAction */
/** @typedef {import("./core.js").Dispatch<AppState, AppAction>} AppDispatch */
/** @typedef {import("./core.js").GetState<AppState>} AppGetState */

/**
 * @param {AppState} state
 * @param {AppAction} action
 * @returns {AppState}
 */
function update(state, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

const store = createStore({ count: 0 }, update);

/**
 * @param {AppState} state
 * @param {AppDispatch} dispatch
 * @returns {HTMLElement}
 */
function view({ count }, dispatch) {
  return h("div", {}, [
    h("h1", {}, [count]),
    h("button", { onclick: () => dispatch({ type: "DECREMENT" }) }, [
      "Decrement",
    ]),
    h("button", { onclick: () => dispatch({ type: "INCREMENT" }) }, [
      "Increment",
    ]),
  ]);
}

const $root = /** @type {HTMLDivElement} */ (document.getElementById("root"));

/**
 * @param {AppDispatch} dispatch
 * @param {AppGetState} getState
 */
function render(dispatch, getState) {
  emptyNode($root);
  const $view = view(getState(), dispatch);
  $root.appendChild($view);
}

store.subscribe(render);
render(store.dispatch, store.getState);
