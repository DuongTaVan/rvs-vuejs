<template>
  <div class="fullView contracted_plan">
    <div class="index">
      <div class="inner">
        <div class="lBox statusBox">
          <div class="comBox">
            <h2>契約プラン</h2>
            <div class="subStatus">
              <p>RVSサブスクコース</p>
              <div v-if="videoLesson">
                <p class="txt">
                  {{ videoLesson.name }}
                  <span class="price">
                    <span class="yen-sign">¥</span>
                    {{ $formatNumber(videoLesson.price, NUMBER_EN_US_FORMAT) }}
                  </span>
                </p>
                <div class="dlBox">
                  <dl class="clearfix">
                    <dt>契約日</dt>
                    <dd>{{ datetime(videoLesson.start_date).start_date }}</dd>
                    <dt>契約更新日</dt>
                    <dd>{{ datetime(videoLesson.start_date).end_date }}</dd>
                  </dl>
                </div>
                <p class="txt02">
                  合計
                  <span class="price">
                    <span class="yen-sign">¥</span>
                    {{ $formatNumber(videoLesson.price, NUMBER_EN_US_FORMAT) }}
                  </span>
                </p>
              </div>

              <p v-else>--</p>
            </div>
            <div class="comLinkP bg-btn" v-if="videoLesson">
              <router-link
                :to="{
                  name: 'CancelPlan',
                  params: {
                    id: videoLesson.subscription_id,
                    type: videoLesson.type,
                  },
                }"
                >解約手続き</router-link
              >
            </div>
            <div class="comLink bg-btn" v-else>
              <router-link :to="{ name: 'PurchasingPlan', params: { type: 1 } }"
                >プラン購入</router-link
              >
            </div>
          </div>

          <div class="comBox">
            <h2>契約プラン</h2>
            <div class="subStatus">
              <p>RVSオンラインレッスンコース</p>
              <div v-if="onlineLesson">
                <p class="txt">
                  {{ onlineLesson.name }}
                  <span class="price">
                    <span class="yen-sign">¥</span>
                    {{ $formatNumber(onlineLesson.price, NUMBER_EN_US_FORMAT) }}
                  </span>
                </p>
                <div class="dlBox">
                  <dl class="clearfix">
                    <dt>契約日</dt>
                    <dd>{{ datetime(onlineLesson.start_date).start_date }}</dd>
                    <dt>契約更新日</dt>
                    <dd>{{ datetime(onlineLesson.start_date).end_date }}</dd>
                  </dl>
                </div>
                <p class="txt02">
                  合計
                  <span class="price">
                    <span class="yen-sign">¥</span>
                    {{ $formatNumber(onlineLesson.price, NUMBER_EN_US_FORMAT) }}
                  </span>
                </p>
              </div>

              <p v-else>--</p>
            </div>
            <div class="comLinkP bg-btn" v-if="onlineLesson">
              <router-link
                :to="{
                  name: 'CancelPlan',
                  params: {
                    id: onlineLesson.subscription_id,
                    type: onlineLesson.type,
                  },
                }"
                >解約手続き</router-link
              >
            </div>
            <div class="comLink bg-btn" v-else>
              <router-link :to="{ name: 'PurchasingPlan', params: { type: 2 } }"
                >プラン購入</router-link
              >
            </div>
          </div>
        </div>
        <div class="comBox rBox">
          <h2>支払い方法</h2>
          <div v-if="!card.length" class="method bg-btn">
            <router-link :to="{ name: 'CreditCardRegister' }">
              <p><span class="txtSpan">支払い方法の追加</span></p>
            </router-link>
          </div>
          <div v-else>
            <div class="method method02">
              <p>
                <span class="methodTxt">{{ card[0]?.brand }}</span
                >末尾が●●●●{{ card[0]?.last4 }}のクレジットカード
              </p>
            </div>
            <div class="comLink comLink02 comLink03 bg-btn">
              <router-link :to="{ name: 'CreditCardEdit' }">編集</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, inject } from 'vue';
import { useStore } from 'vuex';
import { FORMAT_DATE, NUMBER_EN_US_FORMAT } from '@/constants/common';

const store = useStore();
const card = computed(() => store.getters['card/getCard']);

const subscriptions = computed(
  () => store.getters['subscription/mySubscriptionList']
);

const $dayjs = inject('$dayjs');
const $formatNumber = inject('$formatNumber');

onMounted(async () => {
  await store.dispatch('loading/actSetLoading', true);
  await store.dispatch('card/actionGetCreditCard');
  await store.dispatch('loading/actSetLoading', false);
  await store.dispatch('subscription/actGetMySubscriptionList');
});

const onlineLesson = computed(() =>
  subscriptions.value?.find((sub) => sub.type === 2)
);

const videoLesson = computed(() =>
  subscriptions.value?.find((sub) => sub.type === 1)
);

const datetime = (time) => {
  const targetDate = $dayjs(time);
  return {
    start_date: targetDate.format(FORMAT_DATE),
    end_date: targetDate.add(30, 'day').format(FORMAT_DATE),
  };
};
</script>
