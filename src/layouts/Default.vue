<template>
  <Header v-if="allowHeader" />
  <main id="main" role="main">
    <router-view></router-view>
  </main>
  <Footer v-if="allowFooter" />
</template>
<script>
export default {
  data() {
    return {
      allowFooter: true,
      allowHeader: true
    };
  },

  async created() {
    this.setFooter(this.$route);
    this.setHeader(this.$route);
    if (this.$route.meta.requireLogin) {
      await this.$store.dispatch('user/actionGetUserInfo');
    }
  },

  watch: {
    $route(to) {
      this.setFooter(to);
      this.setHeader(to);
      if (document.body.classList.contains('no-scroll')) {
        document.body.classList.remove('no-scroll');
      }
    }
  },

  methods: {
    setFooter(to) {
      this.allowFooter = to.meta.footer !== undefined ? to.meta.footer : true;
    },
    setHeader(to) {
      this.allowHeader = to.meta.header !== undefined ? to.meta.header : true;
    }
  }
};
</script>
