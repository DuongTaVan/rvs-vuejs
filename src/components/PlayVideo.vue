<template>
  <div class="video-container">
    <video playsinline @loadeddata="videoLoadedData()" :src="videoUrl"></video>
    <div class="controls">
      <div class="timeline">
        <div class="bar">
          <div ref="videoInnerRef" class="inner"></div>
        </div>
      </div>
    </div>

    <div v-show="loading" class="video-cover">
      <div class="video-loading"></div>
    </div>

    <button v-if="showPlayButton" class="btn-play" @click="startPlayVideo">
      <img src="@/assets/image/icon_play5.png" alt="play video" />
    </button>
  </div>
</template>
<script setup>
import {
  onMounted,
  computed,
  defineEmits,
  defineExpose,
  onBeforeUnmount,
  ref
} from 'vue';

defineProps({
  videoUrl: {
    required: true
  }
});

const timesPlay = ref(0);
const videoInnerRef = ref({});
const currentTimeVideo = ref(0);
const loading = ref(true);

const emit = defineEmits(['endPlayVideo', 'currentTime']);
onMounted(() => {
  startPlayVideo();
});

const isIOS = /iPad|iPhone|iPod/.test(navigator.platform);

const showPlayButton = computed(
  () => isIOS && timesPlay.value === 1 && currentTimeVideo.value === 0
);

const startPlayVideo = () => {
  const video = document.querySelector('video');
  video.play();
  video.autoplay = true;
  video.load();
  timesPlay.value += 1;
  video.addEventListener('timeupdate', () => {
    emit('currentTime', video.currentTime);
    const current = (video.currentTime / video.duration) * 100;
    currentTimeVideo.value = video.currentTime;
    if (videoInnerRef.value) {
      videoInnerRef.value.style.width = `${current}%`;
    }
    if (current >= 100) {
      emit('endPlayVideo');
    }
  });
};

const videoLoadedData = () => {
  loading.value = false;
};

onBeforeUnmount(() => {
  videoInnerRef.value.style.width = '0%';
});

defineExpose({ startPlayVideo });
</script>
