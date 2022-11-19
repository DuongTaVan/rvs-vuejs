<template>
  <div class="fullView fullView02 japanese_card">
    <div class="comInner">
      <div class="passedBox">
        <div class="photoBox" v-if="!isLoading">
          <!-- <PlayVideo
            :class="isMobile ? 'sp' : 'pc'"
            ref="videoRef"
            :video-url="videoLesson?.lecture?.lecture_video_url"
            @endPlayVideo="onEndVideo"
          /> -->

          <VideoPlayer
            :src="videoLesson?.lecture?.lecture_video_url"
            @ended-video="onEndVideo"
            ref="videoPlayerRef"
          />
          <div v-if="afterWatching" class="sub bg-btn" @click="onStartVideo">
            <img
              src="@/assets/image/common/imgtext01.png"
              alt="Replay"
              width="44"
            />
          </div>
        </div>
        <div v-if="afterWatching" class="textBox">
          <div class="comLink bg-btn">
            <router-link
              :to="{
                name: 'Reflex',
                params: {
                  type: currentType,
                  id: currentId,
                  video_lesson: lessonId
                }
              }"
              replace>Let's Reflex
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
// import PlayVideo from '@/components/PlayVideo';
import { useRoute } from 'vue-router';
import router from '@/router';
import { NOTIFY_TYPE } from '@/constants/common';
import { BACKEND_CODE } from '@/constants/messages';
import VideoPlayer from '@/components/VideoPlayer.vue';

const store = useStore();
let afterWatching = ref(false);
const videoLesson = computed(() => store.getters['lecture/videoLesson']);
// const videoRef = ref();
const isMobile = ref(false);
const route = useRoute();
const currentType = ref(route.params.type);
const currentId = ref(route.params.id);
const lessonId = ref(route.params.video_lesson);
const $toast = inject('$toast');
const isLoading = computed(() => store.getters['loading/isLoading']);
const cardName = computed(() => store.getters['lecture/currentCardName']);
const videoPlayerRef = ref({});

const onCreated = async () => {
  await store.dispatch('loading/actSetLoading', true);
  if (!cardName.value) {
    return router.push({
      name: 'CardList',
      params: {
        type: currentType.value,
        id: currentId.value
      }
    });
  }
};

onCreated();

onMounted(async () => {
  const innerWidth = window.innerWidth;
  if (innerWidth < 897) {
    isMobile.value = true;
  }
  const params = {
    id: lessonId.value
  };
  await store
    .dispatch('lecture/actionGetVideoLesson', params)
    .catch((error) => {
      if (error?.response?.data?.error?.code) {
        const message = BACKEND_CODE.filter(
          (item) => item.key === error.response.data.error.code
        );
        $toast(NOTIFY_TYPE[1], message[0].value);
      }
      router.push({
        name: 'CardList',
        params: {
          type: currentType.value,
          id: currentId.value
        }
      });
    })
    .finally(() => {
      store.dispatch('loading/actSetLoading', false);
    });
});

const onEndVideo = () => {
  afterWatching.value = true;
};
const onStartVideo = () => {
  afterWatching.value = false;
  // videoRef.value.startPlayVideo();
  videoPlayerRef.value.togglePlay();
};
</script>
