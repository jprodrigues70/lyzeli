const loading = {
  state: {
    loading: false,
  },
  actions: {
    database({ commit }, payload) {
      return commit("database", payload);
    },
  },
};
export default loading;
