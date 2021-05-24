let database = {
  state: {
    count: 0,
  },
  actions: {
    setTo({ commit }, payload) {
      return commit("count", payload);
    },
  },
};

export default database;
