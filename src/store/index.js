import React, { createContext, useReducer } from "react";
import Files from "../plugins/Files";

const raw = require.context(`./`, true, /.*\.(js)$/);

const getStoreModules = (files) => {
  return files
    .keys()
    .filter((key) => key !== "./index.js")
    .map((page) => {
      const context = page
        .replace("./", "")
        .replace("/index.js", "")
        .replace("/", ".");

      return { context, store: Files.getComponent(page, files).default };
    });
};

let initialState = {};
let actions = {};

const reduceIt = (initial, component, context) => {
  return {
    ...initial,
    ...Object.keys(component).reduce((acc, item) => {
      acc[`${context}.${item}`] = component[item];
      return acc;
    }, {}),
  };
};

getStoreModules(raw).forEach(({ context, store }) => {
  if (store.state) {
    initialState = reduceIt(initialState, store.state, context);
  }

  if (store.actions) {
    actions = reduceIt(actions, store.actions, context);
  }
});

const commit = (state, key, payload) => {
  delete state.key;
  return {
    ...state,
    [key]: payload,
  };
};

const Reducer = (state, { action, payload }) => {
  const contextArray = action.split(".");
  contextArray.pop();
  const context = contextArray.join(".");

  return actions[action](
    {
      state,
      commit: (key, payload) => commit(state, `${context}.${key}`, payload),
    },
    payload
  );
};

export const Context = createContext(initialState);

export default function Store({ children }) {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const globalCommit = (context, payload) => commit(state, context, payload);
  return (
    <Context.Provider value={{ state, dispatch, commit: globalCommit }}>
      {children}
    </Context.Provider>
  );
}
