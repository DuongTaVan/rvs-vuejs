import * as api from '@/api/user';
import service from '@/plugins/axios';
import { setAccessToken } from '@/utils/token';

export const state = {
  users: [],
  isLogin: false,
  user: {},
  homeData: {},
  goals: [],
  subScript: '',
  isRequest: false,
  skills: {},
};
export const getters = {
  getUsers: (state) => state.users,
  isLogin: (state) => state.isLogin,
  userInfo: (state) => state.user,
  homeData: (state) => state.homeData,
  goalList: (state) => state.goals,
  isRequest: (state) => state.isRequest,
  subScript: (state) => state.subScript,
  getSkills: (state) => state.skills,
};
export const mutations = {
  setUsers(state, users) {
    state.users = users;
    state.isLogin = true;
  },
  getUserInfo(state, response) {
    state.user = response;
  },
  setLogin(state, isLogin) {
    state.isLogin = isLogin;
  },
  setHomeData(state, data) {
    state.homeData = data;
  },
  setGoals(state, data) {
    state.goals = data;
  },
  setSubScript(state, data) {
    state.subScript = data;
  },
  setIsRequest(state, data) {
    state.isRequest = data;
  },
  setSkills(state, data) {
    state.skills = data;
  },
};
export const actions = {
  async actionGetUser({ commit }, params) {
    await service({
      url: api.GET_USER,
      method: 'GET',
      params,
    }).then((response) => {
      commit('setUsers', response);
    });
  },
  async actionSubScriptList({ commit }) {
    await service({
      url: api.SUBSCRIPTION,
      method: 'GET',
    }).then((response) => {
      commit('setSubScript', response);
    });
  },
  async actionGetUserInfo({ commit }) {
    await service({
      url: api.USER_INFO,
      method: 'GET',
    }).then((response) => {
      commit('getUserInfo', response);
    });
  },
  async actionUpdateUserInfoTemp({ commit }, params) {
    commit('getUserInfo', params);
  },
  async actionInitialSetup({ commit }, params) {
    return new Promise((resolve, reject) => {
      service({
        url: api.POST_INITIAL_SETUP,
        method: 'POST',
        data: params,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          commit('setLogin', false);
          reject(error);
        });
    });
  },

  async authEmailSending(_, params) {
    return new Promise((resolve, reject) => {
      service({
        url: api.AUTH_EMAIL_SENDING,
        method: 'POST',
        data: params,
      })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err.response?.data?.error)
      });
    })
  },

  async login({ commit }, body) {
    return new Promise((resolve, reject) => {
      service({
        url: api.LOGIN,
        method: 'POST',
        data: body,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          commit('setLogin', false);
          reject(error);
        });
    });
  },

  async PasswordResetEmailSending(_, params) {
    return new Promise((resolve, reject) => {
      service({
        url: api.PASSWORD_RESET_EMAIL_SENDING,
        method: 'POST',
        data: params
      }).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  },

  async actionUpdateUserInfo(_, params) {
    return new Promise((resolve, reject) => {
      service({
        url: api.USER_INFO,
        method: 'POST',
        data: params,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  async ResetPassword(_, params) {
    return new Promise((resolve, reject) => {
      service({
        url: api.RESET_PASSWORD,
        method: 'PUT',
        data: params
      }).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  },
  async actGetHomeData({ commit }, params) {
    await service({
      url: api.HOME,
      method: 'GET',
      params,
    })
      .then((res) => {
        commit('setHomeData', res);
      })
      .catch((err) => {
        throw err;
      });
  },
  async actGetGoals({ commit }, params) {
    await service({
      url: api.GOAL_LIST,
      method: 'GET',
      params,
    })
      .then((res) => {
        commit('setGoals', res);
      })
      .catch((err) => {
        throw err;
      });
  },
  async actChangeGoal(_, params) {
    await service({
      url: api.CHANGE_GOAL,
      method: 'PATCH',
      params
    }).catch(err => {
      throw err;
    });
  },

  async actionSignupWithEmail({ commit }, params) {
    await service({
      url: api.SIGNUP_WITH_EMAIL,
      method: 'POST',
      data: params,
    })
      .then((res) => {
        if (res.token) {
          setAccessToken(res);
        }
      })
      .catch((err) => {
        throw err;
      });
  },

  async actionGetSkills({ commit }, params) {
    await service({
      url: api.GET_SKILLS,
      method: 'GET',
      params,
    }).then((response) => {
      console.log(response);
      commit('setSkills', response);
    });
  },
};
