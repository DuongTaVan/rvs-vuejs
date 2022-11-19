<template>
  <li>
    <!-- <span class="tooltip">{{ cardData.title }}</span> -->
    <a class="popLink">
      <p class="ttl">Card{{ cardData.display_order }}</p>
      <p class="ctn">{{ cardData.control_number }}</p>
      <p>
        <span :class="['txtSpan', txtSpanClass]">{{ cardData.status_lb }}</span>
        <span v-if="cardData.status === 1">
          {{ cardData.stage_lb !== 'Japanese Card' ? cardData.stage_lb : '' }}
          <br />から</span
        >
      </p>
    </a>
  </li>
</template>

<script setup>
import { computed } from 'vue';
import { STATUS_CARD_COLOR } from '@/constants/common';

const props = defineProps({
  cardData: {
    type: null,
    require: true
  }
});

const txtSpanClass = computed(() => {
  const statusColor = STATUS_CARD_COLOR.filter(
    (item) => item.status === props.cardData.status_lb
  );
  if (statusColor.length) {
    return statusColor[0].class;
  }
  return STATUS_CARD_COLOR[0].class;
});
</script>
