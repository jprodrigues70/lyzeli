import React, { createContext, useReducer } from "react";

const raw = require.context(`./`, true, /.*\.(js)$/);

const getComponents = (files) => {
  return files
    .keys()
    .filter((key) => key !== "./index.js")
    .map((page) => {
      const context = page
        .replace("./", "")
        .replace("/index.js", "")
        .replace("/", ".");

      return { context, store: getComponent(page, files).default };
    });
};

const getComponent = (componentName, files) => {
  return files(componentName);
};

let initialState = {};
let actions = {};

getComponents(raw).forEach(({ context, store }) => {
  if (store.state) {
    initialState = {
      ...initialState,
      ...Object.keys(store.state).reduce((acc, item) => {
        acc[`${context}.${item}`] = store.state[item];
        return acc;
      }, {}),
    };
  }

  if (store.actions) {
    actions = {
      ...actions,
      ...Object.keys(store.actions).reduce((acc, item) => {
        acc[`${context}.${item}`] = store.actions[item];
        return acc;
      }, {}),
    };
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
