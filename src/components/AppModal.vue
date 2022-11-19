<template>
  <div class="a-modal" v-show="show">
    <div class="a-modal-bg bg-btn" @click="closeModal"></div>
    <div class="a-modal-container">
      <div class="a-modal-content">
        <button class="btn-close" @click="closeModal"></button>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue';

const show = ref(false);

const openModal = () => {
  show.value = true;
  document.body.classList.add('no-scroll');
};

const closeModal = () => {
  show.value = false;
  document.body.classList.remove('no-scroll');
};

defineExpose({ openModal, closeModal });
</script>
