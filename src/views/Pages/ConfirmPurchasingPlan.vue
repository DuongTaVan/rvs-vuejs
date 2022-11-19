<template>
  <div class="fullView confirm_purchasing_plan">
    <div v-if="!isLoading" class="statusBox">
      <div class="comBox">
        <h2>プランの購入を確定しますか?</h2>
        <p>{{ planeTypeName }}</p>
        <p class="txt">
          {{ selectedPurchase?.name || '' }}
          <span v-if="price" class="price">
            <span class="yen-sign">¥</span>
            {{ $formatNumber(price, NUMBER_EN_US_FORMAT) }}
          </span>
        </p>
        <div class="dlBox">
          <dl class="clearfix">
            <template v-if="startDate">
              <dt>契約日</dt>
              <dd>{{ startDate }}</dd>
            </template>
            <template v-if="endDate">
              <dt>契約更新日</dt>
              <dd>{{ endDate }}</dd>
            </template>
          </dl>
        </div>
        <p class="txt02">
          合計
          <span v-if="price" class="price">
            <span class="yen-sign">¥</span>
            {{ $formatNumber(price, NUMBER_EN_US_FORMAT) }}
          </span>
        </p>
        <ul class="comUl">
          <li class="back bg-btn">
            <a @click="$router.back()">キャンセル</a>
          </li>
          <li class="bg-btn"><a @click="purchasePlan()">購入</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useStore } from 'vuex';
import { computed, inject, reactive, watch } from 'vue';
import {
  FORMAT_DATE,
  LESSONS,
  NOTIFY_TYPE,
  NUMBER_EN_US_FORMAT,
} from '@/constants/common';
import { loadStripe } from '@stripe/stripe-js';
import { useRoute } from 'vue-router';
import { MESSAGES } from '@/constants/messages';

const $dayjs = inject('$dayjs');
const $formatNumber = inject('$formatNumber');
const $toast = inject('$toast');
const $router = useRouter();
const store = useStore();
let stripe = reactive({});
const route = useRoute();
const planeTypeName = computed(() => {
  if (+route.params.type === LESSONS[0].key) {
    return 'RVSサブスクコース';
  }
  return 'RVSオンラインレッスンコース';
});

const isLoading = computed(() => store.getters['loading/isLoading']);
const detailPurchase = computed(() => store.getters['purchase/detailPurchase']);

const selectedPurchase = computed(
  () => store.getters['purchase/selectedPurchase']
);

const subscription = computed(() => store.getters['subscription/subscription']);

const onCreated = async () => {
  // init stripe
  stripe = await loadStripe(process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY, {
    locale: 'ja',
  });

  if (!detailPurchase.value) {
    $router.push({ name: 'PurchasingPlan', params: { type: 1 } });
    return;
  }

  const instance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
  });
  instance.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${process.env.VUE_APP_STRIPE_SECRET_KEY}`;

  if (subscription.value?.plan?.id !== selectedPurchase.value?.str_price_id) {
    await store.dispatch('loading/actSetLoading', true);
    const res = await instance({
      url: `${process.env.VUE_APP_STRIPE_API_URL}/subscriptions/${detailPurchase.value.subscription_id}`,
    });
    await store.commit('subscription/SET_SUBSCRIPTION', res.data);
    await store.dispatch('loading/actSetLoading', false);
  }
};
onCreated();

const startDate = computed(() => {
  if (!subscription.value?.start_date) return '';
  const targetDate = $dayjs(subscription.value?.start_date * 1000);
  return targetDate.format(FORMAT_DATE);
});

const endDate = computed(() => {
  if (!subscription.value?.start_date) return '';
  const targetDate = $dayjs(subscription.value?.start_date * 1000);
  return targetDate.add(30, 'day').format(FORMAT_DATE);
});

const price = computed(() => subscription.value.plan?.amount || 0);

watch(
  () => subscription.value,
  () => {
    price.value = subscription.value?.plan?.amount || 0;
  }
);

/**
 * ! Purchase plan
 */
const purchasePlan = async () => {
  await store.dispatch('loading/actSetLoading', true);
  await stripe
    .confirmCardPayment(detailPurchase.value.client_secret)
    .then((res) => {
      if (res?.error?.code) {
        $toast(NOTIFY_TYPE[1], MESSAGES.PAYMENT_PLAN_FAILED);
      } else {
        $router.push({ name: 'PurchasingPlanAfter' });
        $toast(NOTIFY_TYPE[0], MESSAGES.PAYMENT_PLAN_SUCCESS);
      }
    })
    .finally(() => {
      store.dispatch('loading/actSetLoading', false);
    });
};
</script>
