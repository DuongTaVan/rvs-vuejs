export const state = {
  loading: false,
};
export const getters = {
  isLoading: (state) => state.loading,
};
export const mutations = {
  setLoading(state, data) {
    state.loading = data;
  },
};
export const actions = {
  actSetLoading({ commit }, data) {
    commit('setLoading', data);
  },
};
