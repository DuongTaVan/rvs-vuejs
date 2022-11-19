import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/common';
import { getToken } from '@/utils/token';

export default async function auth({ to, next }) {
  const token = getToken(ACCESS_TOKEN);
  const refreshToken = getToken(REFRESH_TOKEN);
  if (to.matched.some((record) => record.meta.requireLogin)) {
    if (!token && !refreshToken) {
      next({ name: 'Login' });
    }
  }

  next();
}
