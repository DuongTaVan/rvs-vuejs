<template>
  <div class="fullView my_account" id="my-account">
    <div v-if="!isLoading" class="accoutBox">
      <div class="lBox">
        <div class="comBox">
          <h2 class="headLine01">アカウント情報</h2>
          <dl class="formDl">
            <dt>氏名</dt>
            <div
              v-if="
                user.last_name_kanji != null && user.first_name_kanji != null
              "
            >
              <dd>{{ user.last_name_kanji + ' ' + user.first_name_kanji }}</dd>
            </div>
            <p v-else>--</p>
            <dt>性別</dt>
            <dd>{{ gender }}</dd>
            <dt>電話番号</dt>
            <dd>{{ user.phone ? user.phone : UNREGISTER_INPUT }}</dd>
            <dt>メールアドレス</dt>
            <dd>{{ user.email }}</dd>
            <dt>skype ID</dt>
            <dd>{{ user.skype_id ? user.skype_id : UNREGISTER_INPUT }}</dd>
            <dt>習熟度</dt>
            <dd>{{ skill }}</dd>
          </dl>
          <div class="comLink comLink02 comLink03 bg-btn">
            <router-link class="btn-mobile" :to="{ name: 'EditAccount' }"
              >編集</router-link
            >
          </div>
        </div>
      </div>
      <div class="rBox">
        <div class="comBox">
          <h2 class="headLine01">契約プラン</h2>
          <dl class="formDl formDl02">
            <dt>RVSサブスクコース</dt>
            <dd>{{ lessonOff }}</dd>
            <dt>RVSオンラインレッスンコース</dt>
            <dd>{{ lessonOnl }}</dd>
          </dl>
          <div class="comLink comLink02 comLink03 bg-btn">
            <router-link
              class="btn-mobile"
              :to="{ name: 'PurchasingPlanAfter' }"
              >詳細</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { GENDERS, LESSONS, SKILLS } from '@/constants/common';
import { UNREGISTER_INPUT } from '@/constants/messages';

export default {
  name: 'RegisterInformation',
  data() {
    return {
      user: {},
      gender: '',
      skill: '',
      script: '',
      lessonOff: '',
      lessonOnl: '',
      UNREGISTER_INPUT
    };
  },
  async created() {
    await this.$store.dispatch('loading/actSetLoading', true);
    await this.actionGetUserInfo();
    this.user = await this.userInfo;
    let gender = GENDERS.filter((sex) => sex.key === parseInt(this.user.sex));
    if (gender.length !== 0) {
      this.gender = gender[0].value;
    }
    let skill = SKILLS.filter(
      (skillId) => skillId.key === parseInt(this.user.skill_id)
    );
    if (skill.length !== 0) {
      this.skill = skill[0].value;
    }
    await this.actionSubScriptList();
    this.lessonOff = await this.lessonName(this.subScript, LESSONS[0].key);
    this.lessonOnl = await this.lessonName(this.subScript, LESSONS[1].key);
    await this.$store.dispatch('loading/actSetLoading', false);
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo',
      subScript: 'user/subScript',
      isLoading: 'loading/isLoading'
    })
  },
  methods: {
    ...mapActions({
      actionGetUserInfo: 'user/actionGetUserInfo',
      actionSubScriptList: 'user/actionSubScriptList'
    }),

    /**
     * Lesson Name
     * Get name of every class schedule.
     * 1-online, 2-offline.
     *
     * @param arr
     * @param type
     * @returns {*|string}
     */
    lessonName(arr, type) {
      let arrayTemp = arr ? arr.filter((el) => el.type === type) : '';
      return arrayTemp.length > 0 ? arrayTemp[0].name : '--';
    }
  }
};
</script>
