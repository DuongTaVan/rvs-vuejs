export const state = {
  isMobile: false,
};
export const getters = {
  isMobile: (state) => state.isMobile
};
export const mutations = {
  SET_IS_MOBILE(state, data) {
    state.isMobile = data;
  },
};
export const actions = {
  getIsMobile({ commit }, data) {
    commit('SET_IS_MOBILE', data);
  },
};
