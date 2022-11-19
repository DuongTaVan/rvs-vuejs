export const state = {
  message: '',
  type: 'success',
  isNotifyCation: false,
  pageSubTitle: ''
};
export const getters = {
  message: (state) => state.message,
  type: (state) => state.type,
  isNotifyCation: (state) => state.isNotifyCation,
  pageSubTitle: (state) => state.pageSubTitle
};
export const mutations = {
  setMessage(state, data) {
    state.message = data;
  },
  setType(state, data) {
    state.type = data;
  },
  setIsNotifyCation(state, data) {
    state.isNotifyCation = data;
  },
  setPageSubTitle(state, data) {
    state.pageSubTitle = data;
  }
};
