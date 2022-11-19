<template>
  <Header />
  <div class="container">
    <router-view></router-view>
  </div>
</template>
<script>
import Header from '@/components/layouts/Header.vue';

export default {
  components: {
    Header
  }
};
</script>
