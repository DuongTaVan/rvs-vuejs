import axios from 'axios';
import router from '../router';
import { getToken, setAccessToken } from '@/utils/token';
import store from '@/store';
import { BACKEND_CODE, MESSAGES } from '@/constants/messages';
import { ACCESS_TOKEN, NOTIFY_TYPE, REFRESH_TOKEN } from '@/constants/common';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
  }
});

service.interceptors.request.use(
  (config) => {
    const token = getToken(ACCESS_TOKEN);
    if (token) {
      config.headers.common['Accept'] = 'application/json';
      config.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

service.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    store.dispatch('loading/actSetLoading', false);
    if (getToken(REFRESH_TOKEN) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return service(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      const refreshToken = getToken(REFRESH_TOKEN);
      if (!refreshToken) {
        router.push({ name: 'Login' });
        store.commit('notification/setIsNotifyCation', true);
        store.commit('notification/setType', NOTIFY_TYPE[1]);
        store.commit('notification/setMessage', BACKEND_CODE[2].value);
      }

      if (
        [BACKEND_CODE[3].key, BACKEND_CODE[2].key].includes(
          error.response.data.error.code
        ) &&
        !['/reset-password', '/users/signup-with-email'].includes(
          error.response.config.url
        )
      ) {
        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise(function (resolve, reject) {
          axios
            .post(`${process.env.VUE_APP_API_BASE_URL}/refresh-jwt`, {
              refresh_token: getToken(REFRESH_TOKEN)
            })
            .then((res) => {
              originalRequest.headers[
                'Authorization'
              ] = `Bearer ${res.data.token}`;
              processQueue(null, setAccessToken(res.data));
              resolve(service(originalRequest));
            })
            .catch((err) => {
              router.push({ name: 'Login' });
              processQueue(err, null);
              reject(err);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }
    }

    if (error.response.status === 403) {
      router.push({ name: '403' });

      return Promise.reject(error);
    }

    if (error.response.status === 404) {
      return Promise.reject(error);
    }

    if (error.response.status === 400) {
      if (
        error?.response?.data?.error?.message === MESSAGES.EN_OUT_OF_30_MINUTES
      ) {
        store.commit('notification/setIsNotifyCation', true);
        store.commit('notification/setType', NOTIFY_TYPE[1]);
        store.commit('notification/setMessage', MESSAGES.JA_OUT_OF_30_MINUTES);
      }
    }

    let msg = null;
    if (
      error.response.status === 422 &&
      error.response.data.error.code === 4220
    ) {
      let messages = error.response.data.error.message;
      let firstKey = Object.keys(messages)[0];
      let firstValue = messages[firstKey][0];
      let part = firstValue.slice(
        firstValue.indexOf('.') + 1,
        firstValue.length
      );

      msg = `${part}`;
    } else {
      if (error.response.data.error.code) {
        if (error.response.data.error.code === '5022') {
          return Promise.reject(error);
        } else if (error.response.data.error.code === '4043') {
          return Promise.reject(error);
        } else if (error.response.data.error.code === '5026') {
          return Promise.reject(error);
        } else if (error.response.data.error.code === '5001') {
          return Promise.reject(error);
        } else {
          msg = error.response.data.error.code;
        }
      }
    }
    console.log(msg);

    return Promise.reject(error);
  }
);

export default service;
