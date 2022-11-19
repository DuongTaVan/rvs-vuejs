<template>
  <div class="fullView cancel_plan">
    <div class="comBox">
      <h2>以下の契約プランを解約しますか?</h2>
      <p>※解約した場合無料プランに切り替わります</p>
      <dl class="cancelDl">
        <dt>{{ planTypeName }}</dt>
        <dd>{{ result.length ? result[0].name : '' }}</dd>
      </dl>
      <ul class="comUl">
        <li class="back bg-btn">
          <router-link :to="{ name: 'PurchasingPlanAfter' }">
            キャンセル
          </router-link>
        </li>
        <li class="bg-btn" @click="cancelingSubscription">
          <a> 解約 </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { ref, inject, computed, onMounted } from 'vue';
import { MESSAGES } from '@/constants/messages';
import { NOTIFY_TYPE, LESSONS, PLAN_TYPE } from '@/constants/common';

const store = useStore();
const route = useRoute();
const router = useRouter();
const currentSubscriptId = ref(route.params.id);
const $toast = inject('$toast');

const planTypeName = computed(() => {
  if (+route.params.type === LESSONS[0].key) {
    return PLAN_TYPE[0].title;
  }
  return PLAN_TYPE[1].title;
});

const currentId = computed(() => route.params.id);

const subscriptions = computed(
  () => store.getters['subscription/mySubscriptionList']
);

const result = ref([]);
onMounted(async () => {
  await store.dispatch('loading/actSetLoading', true);
  await store
    .dispatch('subscription/actGetMySubscriptionList')
    .then(() => {
      result.value = subscriptions.value.filter(
        (subscription) =>
          subscription.subscription_id === Number(currentId.value)
      );
    })
    .finally(async () => {
      await store.dispatch('loading/actSetLoading', false);
    });
});

const cancelingSubscription = async () => {
  await store.dispatch('loading/actSetLoading', true);
  await store
    .dispatch('subscription/actCancelingSubscription', {
      id: currentSubscriptId.value,
    })
    .then(() => {
      router.push({ name: 'PurchasingPlanAfter' });
      $toast(NOTIFY_TYPE[0], MESSAGES.CANCEL_PLAN_SUCCESS);
    })
    .catch(() => {
      $toast(NOTIFY_TYPE[1], MESSAGES.CANCEL_PLAN_FAIL);
    });
  await store.dispatch('loading/actSetLoading', false);
};
</script>
