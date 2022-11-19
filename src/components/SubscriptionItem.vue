<template>
  <div>
    <h2>契約プラン</h2>
    <div class="subStatus">
      <p>{{ planName }}</p>
      <p class="txt">
        {{ subscription.name }}
        <span class="price">
          <span class="yen-sign">¥</span> 
          {{ subscription.price }}
        </span>
      </p>
      <div class="dlBox">
        <dl class="clearfix">
          <dt>契約日</dt>
          <dd>{{ subscription.start_date }}</dd>
          <dt>契約更新日</dt>
          <dd>{{ subscription.current_period_end }}</dd>
        </dl>
      </div>
      <p class="txt02">
        合計
        <span class="price">
          <span class="yen-sign">¥</span> 
          {{ subscription.price }}
        </span>
      </p>
    </div>
    <div class="comLinkP bg-btn">
      <router-link
        :to="{
          name: 'CancelPlan',
          params: { id: subscription.subscription_id },
        }"
      >
        解約手続き
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  subscription: {
    type: Object,
    require: true,
    description: 'v-model variable',
  },
});

const planName = computed(() =>
  props.subscription.type === 1
    ? 'RVSサブスクコース'
    : 'RVSオンラインレッスンコース '
);
</script>
