<template>
  <Loading ref="loading" />
  <router-view />

  <!-- <button id="recognition" @click="startRecognitionOnce()">
    Start Continuous Once
  </button>
  <button id="recognition" @click="startContinuousRecognition()">
    Start Continuous Recognition
  </button> -->
</template>
<script>
import Cookie from 'js-cookie';
import { MIC_PERMISSION } from './constants/common';

export default {
  name: 'App',
  created() {
    if (window.innerWidth < 897) {
      this.$store.dispatch('common/getIsMobile', true);
    }
  },

  mounted() {
    const micPermission = Cookie.get(MIC_PERMISSION);
    if (!micPermission) {
      const permissions = navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });
      permissions
        .then(() => {
          Cookie.set(MIC_PERMISSION, 1);
          navigator.mediaDevices.getUserMedia({
            audio: false,
            video: false
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (/Mac/.test(navigator.platform) && window.safari !== undefined) {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });
    }

    document.addEventListener('click', () => {
      const activeElement = document.activeElement;
      const formElement = activeElement.closest('form');
      if (!formElement) {
        activeElement.blur();
      }
    });
  },

  methods: {
    async startRecognitionOnce() {
      const result = await this.$startRecognizeOnce();
      console.log(result);
    },
    async startContinuousRecognition() {
      const result = await this.$continuousRecognition(15, 2);
      console.log(result);
    }
  }
};
</script>

<style lang="scss" scoped>
#recognition {
  margin-bottom: 100px;
}
</style>
