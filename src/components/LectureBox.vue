<template>
  <li>
<!--    // hidden tooltip-->
    <!-- <span class="tooltip">{{ lecture.name }}</span> -->
    <router-link class="bg-btn"
      :to="{
        name: 'CardList',
        params: {
          type: currentRouteName === 'GrammarList' ? 'grammar' : 'level',
          id:
            currentRouteName === 'GrammarList'
              ? lecture.grammar_id
              : lecture.level_id
        }
      }"
    >
      <p class="ttl">{{ lecture.name }}</p>
      <ProcessBar
        :current-percent="currentPercent"
        :diameter="110"
        :class="'subBox'"
        :inner-stroke-width="10"
        :stroke-width="10"
      >
        <div class="sub">
          <p>完了率</p>
          <p class="levelTxt">
            <span> {{ currentPercent }} </span>%
          </p>
        </div>
      </ProcessBar>
      <p class="txt">
        <span class="txtSpan">カード数</span>
        <span class="num"> {{ lecture.num_of_cards }} </span>
      </p>
      <p class="txt">
        <span class="txtSpan">完了数</span>
        <span class="num"> {{ lecture.num_of_completed }} </span>
      </p>
    </router-link>
  </li>
</template>
<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  lecture: {
    type: [Object],
    require: true,
    description: 'v-model variable'
  }
});
const route = useRoute();
const currentRouteName = ref(route.name);

const currentPercent = computed(() => {
  if (props.lecture.num_of_cards > 0) {
    return Math.floor(
      (props.lecture.num_of_completed / props.lecture.num_of_cards) * 100
    );
  }
  return 0;
});
</script>
