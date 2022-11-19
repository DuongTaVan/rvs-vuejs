<template>
  <div class="fullView">
    <div class="comBox smlBox resetPass">
      <p>
        登録されたメールアドレスを入力して下さい。<br />
        入力していただいたメールアドレス宛にパスワード再発行の案内メールをお送りします。
      </p>
      <VeeForm 
        class="smlFrom" 
        @submit="onSubmit"
        v-slot="{ errors }"
      >
        <dl class="formDl">
          <dt>
            <img src="@/assets/image/icon-email.svg" alt="" />メールアドレス
          </dt>
          <dd>
            <VeeField
              type="email"
              name="email"
              v-model="email"
              rules="required|email|max:254"
              label="メールアドレス"
              :class="{ 'is-invalid': errors.email }"
              autocomplete="off"
            />
            <span v-if="errors.email" class="invalid-feedback"
            >{{ errors.email }}
            </span>
          </dd> 
        </dl>
        <ul class="submit">
          <li class="back bg-btn">
            <router-link
              :to="{ name: 'Login' }"
              class="btn-submit btn-submit-outline"
            >
              キャンセル
            </router-link>
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
import { inject, ref } from 'vue';
import { NOTIFY_TYPE, USER_TYPES } from '@/constants/common';
import { useStore } from 'vuex';
import { MESSAGES } from '@/constants/messages';

const email = ref('');
const store = useStore();
const $toast = inject('$toast');

const onSubmit = async () => {
  await store
    .dispatch('user/PasswordResetEmailSending', {
      email: email.value,
      user_type: USER_TYPES[0]
    })
    .then(() => {
      $toast(NOTIFY_TYPE[0], MESSAGES.SEND_EMAIL_RESET_PASSWORD_SUCCESS);
    }).catch(() => {
      $toast(NOTIFY_TYPE[1], MESSAGES.SEND_EMAIL_RESET_PASSWORD_FAIL);
    });
};
</script>
