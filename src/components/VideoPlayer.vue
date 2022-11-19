<template>
  <div class="t-video-player">
    <div
      class="t-cover"
      :class="[playing ? '' : 'paused', loading ? 'loading' : '']"
    >
      <button v-show="!loading" class="t-cover-btn" @click="togglePlay()">
        <img :src="controlIcon" alt="control video" />
      </button>

      <div v-show="loading" class="t-video-loading"></div>
    </div>

    <video
      playsinline
      @loadedmetadata="videoDuration()"
      @ended="endedVideo()"
      @loadeddata="videoLoadedData()"
      id="t-video"
      class="t-video"
      @waiting="loading = true"
      @canplay="loading = false"
    >
      <source :src="videoUrl" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <div class="t-video-control">
      <progress id="t-progress-bar" value="0" min="0" :max="max"></progress>
      <input
        v-show="!loading"
        class="t-seek"
        id="t-seek"
        value="0"
        min="0"
        :max="max"
        type="range"
        step="0.01"
      />
    </div>
  </div>
</template>

<script setup>
import {
  onMounted,
  reactive,
  ref,
  defineExpose,
  computed,
  watch,
  defineEmits,
  defineProps,
  onBeforeUnmount
} from 'vue';

import { useStore } from 'vuex';

const store = useStore();
let video = reactive({});
let progressBar = reactive({});
let seek = reactive({});
const max = ref(0);
const playing = ref(false);
const loading = ref(true);
const videoUrl = ref('');

const emits = defineEmits(['ended-video', 'current-time']);

const props = defineProps({
  src: {
    type: String,
    require: true
  }
});

// watch(
//   () => [video.paused, video.ended],
//   (newPaused, newEnded) => {
//     if (newPaused || newEnded) {
//       console.log(true);
//       playing.value = false;
//     } else {
//       console.log(false);
//       playing.value = true;
//     }
//   }
// );

watch(
  () => props.src,
  async (newSrc) => {
    videoUrl.value = newSrc;
    loading.value = true;
    await video.load();
    video.autoplay = true;
    initializeVideo();
  }
);

const controlIcon = computed(() => {
  if (playing.value) {
    return require('@/assets/image/icon_pause.svg');
  }

  return require('@/assets/image/icon_play.svg');
});

onMounted(() => {
  videoUrl.value = props.src;
  video = document.getElementById('t-video');
  progressBar = document.getElementById('t-progress-bar');
  seek = document.getElementById('t-seek');
  // set default value for IOS
  seek.defaultValue = '0';
  togglePlay();

  seek.addEventListener('input', (event) => {
    const skipTo = event.target.dataset.seek
      ? event.target.dataset.seek
      : event.target.value;
    video.currentTime = skipTo;
    progressBar.value = skipTo;
    seek.value = skipTo;
  });

  initializeVideo();
  video.addEventListener('timeupdate', updateProgress);
});

onBeforeUnmount(() => {
  videoUrl.value = '';
  store.commit('lecture/videoLesson', '');
});

const updateProgress = () => {
  seek.value = Math.round(video.currentTime * 100) / 100;
  progressBar.value = Math.round(video.currentTime * 100) / 100;
  emits('current-time', video.currentTime);
  if (video.currentTime === 0) {
    playing.value = true;
  }
};

const initializeVideo = () => {
  const videoDuration = Math.round(video.duration);
  seek.setAttribute('max', videoDuration);
  progressBar.setAttribute('max', videoDuration);
};

const videoDuration = () => {
  max.value = video.duration;
  initializeVideo();
};

const endedVideo = () => {
  playing.value = false;
  emits('ended-video');
};

const togglePlay = () => {
  if (!playing.value) {
    video.play().then(() => {
      playing.value = true;
      video.autoplay = true;
    });
  } else {
    playing.value = false;
    video.pause();
  }
};

const videoLoadedData = () => {
  loading.value = false;
};

defineExpose({ togglePlay });
</script>

<style lang="scss" scoped>
.t-video-player {
  position: relative;
  width: 100%;
  display: block;
  padding-top: 56.25%;
  // height: 320px;

  * {
    margin: 0;
  }

  &:hover {
    // .t-seek,
    // #t-progress-bar::-webkit-progress-value {
    //   opacity: 1;
    // }

    .t-cover {
      opacity: 1;
    }
  }
}

.t-video {
  width: 100%;
  max-height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.t-seek {
  position: absolute;
  -webkit-appearance: none;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: transparent;
  outline: none;
  z-index: 3;
  opacity: 1;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 6px;
    height: 6px;
    background: #f44;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 6px;
    height: 6px;
    background: #f44;
    cursor: pointer;
  }
}

.t-video-control {
  width: 100%;
}

#t-progress-bar,
.t-seek {
  cursor: pointer;
}

#t-progress-bar {
  -webkit-appearance: none;
  position: absolute;
  bottom: 0;
  z-index: 2;
  width: 100%;
  height: 6px;

  &::-webkit-progress-bar {
    background-color: #dddddd;
  }

  &::-webkit-progress-value {
    opacity: 1;
    background-color: #f44;
    background-size: 35px 20px, 100% 100%, 100% 100%;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
  }
}

@mixin centerAbs {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.t-cover {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
  transition: 0.3s;
  opacity: 0;
  transition: 0.3s;
  top: 0;
  left: 0;

  button {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    border: none;
    outline: none;

    @include centerAbs;
  }

  img {
    display: block;
  }

  &.paused {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;
    left: 0;
  }

  &.loading {
    opacity: 0.6;
    background-color: #000000;
  }

  .t-video-loading {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 2px solid #fff;
    border-top: 2px solid transparent;
    animation: load 1s infinite linear;

    @include centerAbs;
  }
}

@keyframes load {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
