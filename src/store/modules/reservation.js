import service from '@/plugins/axios';
import * as api from '@/api/reservation';

export const state = {
  myReservationsList: []
};
export const getters = {
  myReservationList: (state) => state.myReservationsList
};
export const mutations = {
  setMyReservationList(state, data) {
    state.myReservationsList = data;
  }
};
export const actions = {
  async actGetMyReservationList({ commit }, params) {
    await service({
      url: api.MY_RESERVATION_LIST,
      method: 'GET',
      params
    }).then(res => {
      commit('setMyReservationList', res);
    }).catch(err => {
      throw err;
    });
  },
  async actChangeReservation(_, body) {
    return new Promise((resolve, reject) => {
      service({
        url: api.RESERVATION_CHANGE(body.user_id),
        method: 'POST',
        body
      }).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
        throw err;
      });
    });
  }
};
