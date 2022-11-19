import service from '@/plugins/axios';
import * as api from '@/api/card';

export const state = {
  card: []
};
export const getters = {
  getCard: (state) => state.card
};
export const mutations = {
  getCard(state, data) {
    state.card = data;
  }
};
export const actions = {
  async actionGetCreditCard({ commit }) {
    await service({
      url: api.CREDIT_CARD,
      method: 'GET'
    })
      .then((res) => {
        commit('getCard', res);
      })
      .catch((err) => {
        throw err;
      });
  },
  async actionEditCreditCard(_, params) {
    await service({
      url: api.EDIT_CREDIT_CARD(params.str_card_id),
      method: 'PUT',
      data: params.token
    }).catch((err) => {
      throw err;
    });
  },
  async actionCreateCreditCard({ commit }, params) {
    await service({
      url: api.CREDIT_CARD,
      method: 'POST',
      data: params
    })
      .then((res) => {})
      .catch((err) => {
        throw err;
      });
  }
};
