import service from '@/plugins/axios';
import * as api from '@/api/purchase';

export const state = {
  purchasingPlan: '',
  detailPurchase: '',
  selectedPurchase: null,
};
export const getters = {
  purchasingPlan: (state) => state.purchasingPlan,
  detailPurchase: (state) => state.detailPurchase,
  selectedPurchase: state => state.selectedPurchase
};
export const mutations = {
  SET_PURCHASING_PLAN(state, data) {
    state.purchasingPlan = data;
  },
  SET_DETAIL_PURCHASE(state, data) {
    state.detailPurchase = data;
  },
  SET_SELECTED_PURCHASE(state, data) {
    state.selectedPurchase = data;
  }
};
export const actions = {
  async getPurchasingPlan({commit}, params) {
    await service({
      url: api.PURCHASING_PLAN(params.type),
      method: 'GET'
    }).then(res => {
      commit('SET_PURCHASING_PLAN', res);
    }).catch(err => {
      throw err;
    });
  },

  async createSubscription({commit}, param) {
    await service({
      url: api.SUBSCRIPTION,
      method: 'POST',
      data: param
    }).then(res => {
      commit('SET_DETAIL_PURCHASE', res);
    }).catch(err => {
      throw err;
    });
  },
};
