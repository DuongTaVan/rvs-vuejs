<template>
  <div class="error-page">
    <div class="error-page__content">
      <div class="error-page__content__code">
        <div>404 Not Found!</div>
      </div>
      <div class="error-page__content__button bg-btn">
        <button
          @click.prevent="onPushToHome">
          トップへ
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const onPushToHome = () => {
  router.push({ name: 'Home' });
};
</script>
