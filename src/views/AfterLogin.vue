<template>
  <div id="container">
    <main id="main" role="main">
      <div class="fullView after_login">
        <div class="comBox smlBox">
          <video
            style="width: 100%; height: 100%"
            muted autoplay playsinline type="video/mp4"
            src="@/assets/video/welcome_video.mp4"></video>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup>
import router from '@/router';
import { onMounted } from 'vue';

const goToHome = () => {
  router.push({ name: 'Home' });
};

onMounted(() => {
  startPlayVideo();
});

const startPlayVideo = () => {
  const video = document.querySelector('video');
  video.autoplay = true;
  video.load();
  video.addEventListener('timeupdate', () => {
    const current = (video.currentTime / video.duration) * 100;
    if (current === 100) {
      goToHome();
    }
  });
};
</script>
