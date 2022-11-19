<template>
  <div class="fullView fullView02 japanese_card">
    <div class="comInner">
      <div class="passedBox">
        <div class="photoBox" v-if="!isLoading">
          <PlayVideo
            :class="isMobile ? 'sp' : 'pc'"
            ref="videoPcRef"
            :video-url="videoUrl"
            @endPlayVideo="onEndVideo"
          />

          <div class="sub bg-btn" @click="replay" v-if="afterWatching">
            <img
              src="@/assets/image/common/imgtext01.png"
              alt="Replay"
              width="44"
            />
          </div>
        </div>
        <div class="textBox">
          <div class="comLink bg-btn">
            <router-link
              :to="{
                name: 'Lecture',
                params: {
                  type: currenType,
                  id: currentId,
                  video_lesson: currentVideoLessonTryId
                }
              }"
            replace>Let's Study
            </router-link>
          </div>
          <p class="comLinkP bg-btn">
            <!-- Wait document -->
            <router-link :to="{
                name: 'CardList',
                params: {
                  type: currenType,
                  id: currentId
                }
              }">Skip
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'JapaneseCard',
  data() {
    return {
      afterWatching: false,
      isMobile: false,
      currenType: 'level',
      currentId: 1,
    };
  },
  async created() {
    this.currenType = this.$route.params.type;
    this.currentId = this.$route.params.id;
    if (!this.videoLessonStart.japanese) {
      return this.$router.push({
        name: 'CardList',
        params: {
          type: this.currenType,
          id: this.currentId,
        }
      })
    }
  },
  mounted() {
    const innerWidth = window.innerWidth;
    if (innerWidth < 897) {
      this.isMobile = true;
    }
  },
  computed: {
    ...mapGetters({
      videoLessonStart: 'lecture/videoLessonStart',
      isLoading: 'loading/isLoading',
    }),
    videoUrl() {
      return this.videoLessonStart?.japanese?.japanese_card_url;
    },
    currentVideoLessonTryId() {
      return this.videoLessonStart?.video_lesson_try_id
    },
  },
  methods: {
    ...mapActions({
      actGetVideoLessonStart: 'lecture/actGetVideoLessonStart',
      actSetLoading: 'loading/actSetLoading'
    }),
    onEndVideo() {
      this.afterWatching = true;
    },
    replay() {
      this.afterWatching = !this.afterWatching;
      this.$refs.videoPcRef.startPlayVideo();
    }
  }
};
</script>
