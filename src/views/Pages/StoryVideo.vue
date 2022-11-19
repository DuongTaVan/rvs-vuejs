<template>
  <div class="fullView have_passed story_video">
    <div class="comInner">
      <template v-if="!loading">
        <div v-if="story" class="passedBox">
          <div class="photoBox">
            <PlayVideo
              :class="isMobile ? 'sp' : 'pc'"
              ref="videoPcRef"
              :video-url="story.video_url"
            />
          </div>
          <div class="textBox">
            <div class="pBox">
              <ul class="passedUl">
                <li v-for="(question, key) in story.story_questions" :key="key">
                  <span class="num">{{ question.display_order }}</span
                  ><span class="txtSpan">{{ question.question }}</span>
                </li>
              </ul>
            </div>
            <p class="comLink bg-btn">
              <router-link :to="{ name: 'Home' }">Finish</router-link>
            </p>
          </div>
        </div>
        <div class="passedBox no-data" v-else>
          <span>{{ MESSAGES.NO_DATA_STORY }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { MESSAGES } from '@/constants/messages';

export default {
  name: 'StoryVideo',
  components: {},
  data() {
    return {
      isMobile: false,
      story: '',
      MESSAGES,
      loading: true
    };
  },

  async created() {
    if (!this.isAccessFromScreen) {
      return this.$router.push({ name: 'Home' });
    }
    let params = {
      subtitle: this.$route.params.subtitle
    };
    this.loading = true;
    await this.getStoryVideo(params);
    this.loading = false;
    this.story = this.storyVideo;
    window.scrollTo(0, 0);
    document.body.classList.add('no-scroll');
  },
  mounted() {
    const innerWidth = window.innerWidth;
    if (innerWidth < 897) {
      this.isMobile = true;
    }
  },
  computed: {
    ...mapGetters({
      storyVideo: 'story/storyVideo',
      isAccessFromScreen: 'lecture/isAccessFromScreen'
    })
  },
  methods: {
    ...mapActions({
      getStoryVideo: 'story/getStoryVideo'
    })
  }
};
</script>
