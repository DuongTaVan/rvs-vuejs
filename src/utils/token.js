import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/common';
import Cookie from 'js-cookie';

const removeAccessToken = () => {
  Cookie.remove(ACCESS_TOKEN);
  Cookie.remove(REFRESH_TOKEN);
};

const setAccessToken = (res) => {
  Cookie.set(ACCESS_TOKEN, res.token, {
    secure: true,
    expires: Math.floor((res.expires_in * 100) / (24 * 60)) / 100 // days
  });

  Cookie.set(REFRESH_TOKEN, res.refresh_token, {
    secure: true
  });
};

const getToken = (tokenName = ACCESS_TOKEN) => Cookie.get(tokenName);

export { removeAccessToken, setAccessToken, getToken };
