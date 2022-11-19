import service from '@/plugins/axios';
import * as api from '@/api/subscription';

export const state = {
  mySubscriptionList: [],
  cancelingSubscription: [],
  subscription: {}
};

export const getters = {
  mySubscriptionList: (state) => state.mySubscriptionList,
  cancelingSubscription: (state) => state.cancelingSubscription,
  subscription: (state) => state.subscription
};

export const mutations = {
  setMySubscriptionList(state, data) {
    state.mySubscriptionList = data;
  },
  setCancelingSubscription(state, data) {
    state.CancelingSubscription = data;
  },
  SET_SUBSCRIPTION(state, data) {
    state.subscription = data;
  }
};

export const actions = {
  async actGetMySubscriptionList({ commit }, params) {
    await service({
      url: api.MY_SUBSCRIPTIONS_LIST,
      method: 'GET',
      params
    })
      .then((res) => {
        commit('setMySubscriptionList', res);
      })
      .catch((err) => {
        throw err;
      });
  },

  async actCancelingSubscription({ commit }, body) {
    await service({
      url: api.CANCELING_SUBSCRIPTIONS(body.id),
      method: 'DELETE'
    })
      .then((res) => {
        commit('setCancelingSubscription', res.data);
      })
      .catch((err) => {
        throw err;
      });
  }
};
