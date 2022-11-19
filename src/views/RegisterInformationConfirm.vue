<template>
  <div class="fullView registerate_infomation confirm_registration">
    <ul class="registerateUl">
      <li><span class="none">基本情報登録</span></li>
      <li class="on">登録確認</li>
    </ul>
    <div class="comBox">
      <h2 class="headLine01 smlSpeace">以下の内容を登録しますか?</h2>
      <form @submit.prevent="handleSubmit()">
        <dl class="formDl">
          <dt>姓(Last Name)</dt>
          <dd>{{ user.last_name_kanji }}</dd>
          <dt>名(First Name)</dt>
          <dd>{{ user.first_name_kanji }}</dd>
          <dt>性別</dt>
          <dd>{{ gender }}</dd>
          <dt>メールアドレス</dt>
          <dd>{{ users.email }}</dd>
          <dt>パスワード</dt>
          <dd>＊＊＊＊＊＊＊＊</dd>
        </dl>
        <ul class="submit">
          <li class="back bg-btn">
            <input
              type="submit"
              name="__retry_input__"
              value="戻る"
              @click="prevent"
            />
          </li>
          <li class="bg-btn">
            <input
              type="submit"
              name="__send__"
              value="登録"
              @click="sendInfo"
            />
          </li>
        </ul>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { GENDERS, NOTIFY_TYPE } from '@/constants/common';
import { setAccessToken } from '@/utils/token';
import { MESSAGES } from '@/constants/messages';

export default {
  name: 'RegisterInformation',
  data() {
    return {
      user: {},
      gender: '',
      users: []
    };
  },
  async created() {
    window.addEventListener('load', this.handler);
    this.user = this.userInfo;
    await this.actionGetUserInfo();
    // call api user for get user DB
    this.users = this.userInfo;
    let gender = GENDERS.filter((sex) => sex.key === parseInt(this.user.sex));
    if (gender.length !== 0) {
      this.gender = gender[0].value;
    }
  },

  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo'
    })
  },
  methods: {
    ...mapActions({
      actionGetUserInfo: 'user/actionGetUserInfo',
      actionInitialSetup: 'user/actionInitialSetup',
      actionUpdateUserInfoTemp: 'user/actionUpdateUserInfoTemp',
    }),
    prevent() {
      this.actionUpdateUserInfoTemp(this.user);
      this.$router.push({ name: 'RegisterInformation' });
    },
    async sendInfo(event) {
      event.preventDefault();
      const res = await this.actionInitialSetup(this.user);
      if (res.token) {
        setAccessToken(res);
        this.$router.push({ name: 'AfterLogin' });
      } else {
        this.$toast(NOTIFY_TYPE[1], MESSAGES.REGISTER_FALSE);
      }
    },
    handler() {
      this.$router.push({ name: 'RegisterInformation' });
    }
  }
};
</script>
