<template>
  <div class="fullView registerate_infomation" id="register_information">
    <ul class="registerateUl">
      <li class="on">基本情報登録</li>
      <li><span class="none">登録確認</span></li>
    </ul>
    <div class="comBox">
      <h2 class="headLine01 smlSpeace">下記の項目を入力してください</h2>
      <VeeForm v-slot="{ errors }" :validation-schema="schema" @submit="register" class="smlFrom">
        <dl class="formDl">
          <dt>
            姓(Last Name)
            <span class="color-note">*</span>
          </dt>
          <dd>
            <VeeField
              name="last_name_kanji"
              id="last_name_kanji"
              type="text"
              v-model="user.last_name_kanji"
              rules="required"
              label="姓"
              placeholder="Yamada"
              :maxlength="20"
              :class="{ 'is-invalid': errors.last_name_kanji || errorMessage }"
            />
            <ErrorMessage class="error-message" name="last_name_kanji" />
          </dd>
          <dt>
            名(First Name)
            <span class="color-note">*</span>
          </dt>
          <dd>
            <VeeField
              name="first_name_kanji"
              id="first_name_kanji"
              type="text"
              v-model="user.first_name_kanji"
              rules="required"
              label="名"
              placeholder="Yamada"
              :maxlength="20"
              :class="{ 'is-invalid': errors.first_name_kanji || errorMessage }"
            />
            <ErrorMessage class="error-message" name="first_name_kanji" />
          </dd>
          <dt>性別 <span class="required">*</span></dt>
          <dd>
            <div class="selectBox">
              <VeeField
                label="性別"
                rules="required"
                name="gender"
                as="select"
                v-model="user.sex"
                :class="{ 'is-invalid': errors.sex || errorMessage }"
              >
                <option value="" disabled="disabled" selected hidden>--</option>
                <option
                  v-for="gender in genders"
                  :key="gender.key"
                  :value="gender.key"
                >
                  {{ gender.value }}
                </option>
              </VeeField>
              <ErrorMessage class="error-message" name="gender" />
            </div>
          </dd>
        </dl>
        <ul class="submit bg-btn">
          <li><input name="__send__" type="submit" value="確認画面" /></li>
        </ul>
      </VeeForm>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import {
  GENDERS,
  NOTIFY_TYPE,
  USER_TYPES
} from '@/constants/common';
import { BACKEND_CODE, MESSAGES } from '@/constants/messages';
import { reactive } from 'vue';

export default {
  name: 'RegisterInformation',
  data() {
    return {
      user: {},
      genders: GENDERS
    };
  },
  async created() {
    let dataSignUp = {
      token: this.$route.query.token,
      user_type: USER_TYPES[0]
    };
    this.user = this.userInfo;
    if (!this.userInfo.last_name_kanji) {
      await this.actionSignupWithEmail(dataSignUp).catch((err) => {
        if (err.response.data.error.code === BACKEND_CODE[3].key) {
          this.$store.commit('notification/setIsNotifyCation', true);
          this.$store.commit('notification/setType', NOTIFY_TYPE[1]);
          this.$store.commit('notification/setMessage', MESSAGES.URL_EXPIRED);
        }

        this.$router.push({ name: 'Login' });
      });
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
      actionUpdateUserInfoTemp: 'user/actionUpdateUserInfoTemp',
      actionSignupWithEmail: 'user/actionSignupWithEmail'
    }),
    async register() {
      await this.actionGetUserInfo();
      this.actionUpdateUserInfoTemp(this.user);
      this.$router.push({ name: 'RegisterInformationConfirm' });
    }
  }
};
</script>
