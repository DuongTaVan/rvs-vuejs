<template>
  <div class="loading" :style="{display: show ? 'block' : 'none'}">
    <div class="loading__content">
      <span class="circle"></span>
      <span class="circle"></span>
      <span class="circle"></span>
      <span class="circle"></span>
      <span class="circle"></span>
      <span class="circle"></span>
    </div>
  </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();
const show = computed(() => store.getters['loading/isLoading']);

</script>
