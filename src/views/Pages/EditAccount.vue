<template>
  <div class="fullView edit_accout">
    <div v-if="!isLoading" class="comBox">
      <h2 class="headLine01">アカウント情報</h2>
      <VeeForm
        :validation-schema="schema"
        @submit="editAccount"
        method="post"
        v-slot="{ errors }"
      >
        <ul class="formUl">
          <li>
            <ul class="subUl">
              <li>
                <p>姓(Last Name)</p>
                <VeeField
                  name="last_name_kanji"
                  id="last_name_kanji"
                  type="text"
                  v-model="user.last_name_kanji"
                  rules="required"
                  label="姓"
                  placeholder="Taro"
                  :class="{
                    'is-invalid': errors.last_name_kanji || errorMessage
                  }"
                  :maxlength="20"
                />
                <ErrorMessage class="error-message" name="last_name_kanji" />
              </li>
              <li>
                <p>名(First Name)</p>
                <VeeField
                  name="first_name_kanji"
                  id="first_name_kanji"
                  type="text"
                  v-model="user.first_name_kanji"
                  rules="required"
                  label="名"
                  placeholder="Yamada"
                  :class="{
                    'is-invalid': errors.first_name_kanji || errorMessage
                  }"
                  :maxlength="20"
                />
                <ErrorMessage class="error-message" name="first_name_kanji" />
              </li>
            </ul>
          </li>
          <li>
            <p>性別</p>
            <VeeField
              name="gender"
              as="select"
              rules="required"
              v-model="user.sex"
              class="wid01"
              :class="{ 'is-invalid': errors.gender || errorMessage }"
            >
              <option
                v-for="gender in genders"
                :key="gender.key"
                :value="gender.key"
                :selected="gender.key === parseInt(user.sex)"
              >
                {{ gender.value }}
              </option>
            </VeeField>
            <ErrorMessage class="error-message" name="gender" />
          </li>
          <li>
            <p>電話番号</p>
            <VeeField
              name="phone"
              type="tel"
              v-model="user.phone"
              label="電話番号"
              class="wid01 input-number"
              :maxlength="20"
              rules="numeric"
            />
            <ErrorMessage class="error-message" name="phone" />
          </li>
          <li>
            <p>メールアドレス</p>
            <VeeField
              name="email"
              type="email"
              v-model="user.email"
              rules="required|email"
              label="メールアドレス"
              :maxlength="254"
              :class="{ 'is-invalid': errors.email || errorMessage }"
            />
            <ErrorMessage class="error-message" name="email" />
          </li>
          <li>
            <p>skype ID</p>
            <VeeField
              name="skypeId"
              type="text"
              v-model="user.skype_id"
              label="skype ID"
              :maxlength="100"
            />
          </li>
          <li>
            <p>習熟度</p>
            <VeeField
              name="skill_id"
              as="select"
              v-model="user.skill_id"
              class="custom-select"
            >
              <option
                v-for="skill in skills"
                :key="skill.skill_id"
                :value="skill.skill_id"
                :selected="skill.skill_id === parseInt(user.skill_id)"
              >
                {{ skill.name }}
              </option>
            </VeeField>
          </li>
        </ul>
        <ul class="submit bg-btn">
          <li>
            <input type="submit" name="__send__" value="保存" />
          </li>
        </ul>
      </VeeForm>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { GENDERS, SKILLS, NOTIFY_TYPE } from '@/constants/common';
import { BACKEND_CODE, MESSAGES } from '@/constants/messages';
export default {
  name: 'RegisterInformation',
  data() {
    return {
      user: {},
      genders: GENDERS,
      skills: {}
    };
  },
  async created() {
    await this.$store.dispatch('loading/actSetLoading', true);
    await this.actionGetUserInfo();
    await this.actionGetSkills();
    this.user = this.userInfo;
    this.skills = this.getSkills;
    await this.$store.dispatch('loading/actSetLoading', false);
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo',
      getSkills: 'user/getSkills',
      isLoading: 'loading/isLoading'
    })
  },
  methods: {
    ...mapActions({
      actionGetUserInfo: 'user/actionGetUserInfo',
      actionUpdateUserInfo: 'user/actionUpdateUserInfo',
      actionGetSkills: 'user/actionGetSkills'
    }),
    async editAccount() {
      this.user = {
        last_name_kanji: this.user.last_name_kanji,
        first_name_kanji: this.user.first_name_kanji,
        sex: this.user.sex,
        phone: this.user.phone,
        email: this.user.email,
        skype_id: this.user.skype_id,
        skill_id: this.user.skill_id
      };
      const res = await this.actionUpdateUserInfo(this.user)
        .then(() => {
          // TODO check res return redirect
          this.$router.push({ name: 'MyAccount' });
          this.$toast(NOTIFY_TYPE[0], MESSAGES.EDIT_ACCOUNT_SUCCESS);
        })
        .catch((exception) => {
          if (exception?.response?.data?.error?.code) {
            const message = BACKEND_CODE.filter(
              (item) => item.key === exception.response.data.error.code
            );
            this.$toast(NOTIFY_TYPE[1], message[0].value);
          }
        });
    }
  }
};
</script>
