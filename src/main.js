import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import IncludeFooterLayout from '@/layouts/IncludeFooterLayout';
import ExcludeFooterLayout from '@/layouts/ExcludeFooterLayout';
import components from '@/plugins/components';
import VeeValidatePlugin from '@/plugins/validation';
import './assets/scss/style.scss';
import AppFunctions from '@/utils/AppFunctions';
import dayjs from 'dayjs';

const app = createApp(App);
app.config.globalProperties.$dayjs = dayjs;
app
  .use(VeeValidatePlugin)
  .use(store)
  .use(router)
  .use(components)
  .use(AppFunctions)
  .component('include-footer-layout', IncludeFooterLayout)
  .component('exclude-footer-layout', ExcludeFooterLayout)
  .mount('#app');
