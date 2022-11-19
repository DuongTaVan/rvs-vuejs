import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import middlewareAuth from '../middleware/auth';
import store from '@/store';
import { LESSON_CHECK_MINUTE_ROUTER } from '@/constants/common';

const router = createRouter({
  history: createWebHistory(),
  routes
});

function globalMiddleware() {
  return [middlewareAuth];
}

function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];
  if (!subsequentMiddleware) return context.next;

  return (...parameters) => {
    context.next(...parameters);
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}

router.beforeEach((to, from, next) => {
  const isStudy = LESSON_CHECK_MINUTE_ROUTER.includes(to.name);
  if (isStudy) {
    document.title = store.getters['lecture/currentCardName'];
  } else {
    document.title = to.meta?.title || 'RVS';
  }

  let middleware = null;
  let routeMiddleware = null;

  if (to.meta.middleware) {
    routeMiddleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];
  }
  middleware = routeMiddleware
    ? globalMiddleware().concat(routeMiddleware)
    : globalMiddleware();

  if (middleware.length > 0) {
    const context = { to, from, next, router };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({ ...context, next: nextMiddleware });
  }

  return next();
});
export default router;
