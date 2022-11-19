<template>
  <div v-if="!loading">
    <slot> </slot>
    <div class="no-data" v-if="lessons.length === 0">
      <span class="no-data-text no-data-card-list">{{ MESSAGES.NO_DATA }}</span>
    </div>
  </div>
</template>

<script setup>
import { MESSAGES } from '@/constants/messages';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const lessons = computed(() => store.getters['lecture/lessons']);

defineProps({
  loading: {
    type: Boolean,
    default: true,
  },
  data: {
    type: Array,
    default: null,
  },
  emptyTitle: {
    type: String,
    default: 'Empty Data',
  },
});
</script>
