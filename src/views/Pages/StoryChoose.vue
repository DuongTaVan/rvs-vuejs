<template>
  <div class="fullView story-choose">
    <div class="comBox smlBox">
      <h2 class="headLine01">字幕の言語を選んでください</h2>
      <!--      <p class="ttl">字幕なし</p>-->
      <ul class="chooseUl">
        <li class="bg-btn" v-for="(language, key) in languages" :key="key" :class="{'enLi': key === 2}">
          <label>
            <input
              type="radio"
              :value="language.key"
              name="subtitles"
              v-model="lang"
              :class="language.key == 'non' ? 'input-no-text' : ''"
            />
            <span>{{ language.value }}</span></label
          >
        </li>
      </ul>
      <div class="comLink bg-btn" v-if="lang !== null">
        <a href="#" @click.prevent="goToStoryVideo">視聴開始</a>
      </div>
    </div>
  </div>
</template>
<script>
import PlayVideo from '@/components/PlayVideo';
import { LANGUAGES } from '@/constants/common';

export default {
  name: 'StoryChoose',
  components: {},
  data() {
    return {
      lang: null,
      languages: LANGUAGES
    };
  },
  created() {
    window.scrollTo(0, 0);
    document.body.classList.add('no-scroll');
  },
  methods: {
    goToStoryVideo() {
      this.$store.commit('lecture/setIsAccessFromScreen', true);
      return this.$router.push({
        name: 'StoryVideo',
        params: {
          subtitle: this.lang
        }
      });
    }
  }
};
</script>
