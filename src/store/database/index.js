const local = JSON.parse(localStorage.getItem("database"));
let database = null;
let key = null;
let keys = [];
if (local) {
  keys = Object.keys(local);
  key = keys[keys.length - 1];
  database = local[key];
}

export default database = {
  state: {
    key,
    keys,
    changes: 0,
    table: database
      ? { ...database, manualSettings: database?.manualSettings || {} }
      : {},
  },
  actions: {
    create({ commit }, payload) {
      return commit("table", payload);
    },
    setChanges({ commit }, payload) {
      return commit("changes", payload);
    },
    setManualSettings({ commit }, payload) {
      return commit("manualSettings", payload);
    },
    remove({ commit }, payload) {
      const local = JSON.parse(localStorage.getItem("database"));

      delete local[payload];
      localStorage.setItem("database", JSON.stringify(local));

      return commit("keys", Object.keys(local));
    },
  },
};
