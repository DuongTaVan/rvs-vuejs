<template>
  <Header />
  <div class="container">
    <router-view></router-view>
  </div>
  <Footer />
</template>
<script>
import Header from '@/components/layouts/Header.vue';
import Footer from '@/components/layouts/Footer.vue';

export default {
  components: {
    Header,
    Footer
  }
};
</script>
