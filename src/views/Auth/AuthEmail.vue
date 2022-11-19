<template>
  <div class="fullView auth-email">
    <div class="comBox smlBox">
      <h2 class="headLine01 smlSpeace">下記の項目を入力してください</h2>
      <VeeForm
        :validation-schema="schema"
        @submit="handleSubmit"
        class="smlFrom"
        v-slot="{ errors }"
      >
        <dl class="formDl">
          <dt>メールアドレス <span class="required">*</span></dt>
          <dd>
            <VeeField
              name="email"
              id="email"
              type="email"
              :class="{ 'is-invalid': errors.email }"
              label="メールアドレス"
              v-model="email"
              :maxlength="254"
            />
            <ErrorMessage class="error-message" name="email" />
          </dd>
          <dt>新しいパスワード <span class="required">*</span></dt>
          <dd>
            <VeeField
              id="password"
              name="password"
              type="password"
              :class="{ 'is-invalid': errors.password }"
              label="新しいパスワード"
              v-model="password"
              placeholder="半角英数字8文字〜20文字を入力してください。"
              :maxlength="191"
              autocomplete="off"
            />
            <ErrorMessage class="error-message" name="password" />
          </dd>
          <dt>パスワード(確認用) <span class="required">*</span></dt>
          <dd>
            <VeeField
              name="password_confirmation"
              type="password"
              placeholder="半角英数字8文字〜20文字を入力してください。"
              :class="{ 'is-invalid': errors.password_confirmation }"
              v-model="passwordConfirmation"
              label="パスワード(確認用)"
              :maxlength="191"
              autocomplete="off"
            />
            <ErrorMessage class="error-message" name="password_confirmation" />
          </dd>
        </dl>
        <ul class="submit">
          <li class="back">
            <!-- <router-link
              :to="{ name: 'Login' }"
              class="btn-submit btn-submit-outline"
            >
              キャンセル
            </router-link> -->
            <button
              type="button"
              @click="redirectToLogin()"
              class="btn-submit btn-submit-outline"
            >
              キャンセル
            </button>
          </li>
          <li class="bg-btn">
            <input type="submit" name="__send__" value="送信" />
          </li>
        </ul>
      </VeeForm>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, inject } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { MESSAGES } from '@/constants/messages';
import { ERROR_CODES, NOTIFY_TYPE } from '@/constants/common';

const $toast = inject('$toast');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const store = useStore();
const router = useRouter();

const schema = reactive({
  email: 'required|email|max:254',
  password: 'required|password',
  password_confirmation: 'required|confirmed:@password,新しいパスワード'
});

const handleSubmit = async () => {
  await store
    .dispatch('user/authEmailSending', {
      user_type: 1,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })
    .then(() => {
      router.push({ name: 'AuthEmailConfirm' });
    })
    .catch((err) => {
      if (err?.code === ERROR_CODES[0]) {
        $toast(NOTIFY_TYPE[1], MESSAGES.EMAIL_EXISTS);
      }
    });
};

const redirectToLogin = () => {
  router.push({ name: 'Login' });
};
</script>
