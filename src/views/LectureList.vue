<template>
  <div class="fullView fullView02 level_list">
    <div v-if="lectureList.length" class="comInner">
      <ul class="levelUl">
        <LectureBox
          v-for="(lecture, index) in lectureList"
          :key="index"
          :lecture="lecture"
        />
      </ul>
      <div class="no-data" v-if="!lectureList.length && !isLoading">
        <span class="no-data-text">{{ MESSAGES.NO_DATA }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { MESSAGES } from '@/constants/messages';

export default {
  name: 'LectureList',
  components: {},
  data() {
    return {
      afterWatching: false,
      MESSAGES
    };
  },
  async created() {
    await this.actSetLoading(true);
    const params = {};
    if (this.$route.name === 'LevelList') {
      params.route_name = 'level';
    } else if (this.$route.name === 'GrammarList') {
      params.route_name = 'grammar';
    }
    await this.getLectureList(params);
    await this.actSetLoading(false);
  },
  computed: {
    ...mapGetters({
      lectureList: 'lecture/lectureList',
      isLoading: 'loading/isLoading'
    })
  },
  methods: {
    ...mapActions({
      getLectureList: 'lecture/getLectureList',
      actSetLoading: 'loading/actSetLoading'
    })
  }
};
</script>
