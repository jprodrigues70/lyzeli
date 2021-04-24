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
    table: database || {
      titles: [
        "Upload an .tsv file formated as Google Spreadsheet does, them you will see the magic.",
      ],
      rows: [["Claro"], ["Com certeza"]],
      classifications: ["yesOrNot"],
    },
  },
  actions: {
    create({ commit }, payload) {
      return commit("table", payload);
    },
    setKey({ commit }, payload) {
      return commit("key", payload);
    },
    setKeys({ commit }, payload) {
      return commit("keys", payload);
    },
    remove({ commit }, payload) {
      const local = JSON.parse(localStorage.getItem("database"));

      delete local[payload];
      localStorage.setItem("database", JSON.stringify(local));
      const keys = Object.keys(local);

      return commit("keys", Object.keys(local));
    },
  },
};
