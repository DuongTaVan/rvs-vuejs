<template>
  <div class="fullView" id="login">
    <div class="comBox">
      <h2 class="headLine01">ログイン</h2>
      <VeeForm
        @submit="handleLogin"
        id="login-form"
        class="smlFrom"
        v-slot="{ errors }"
      >
        <dl class="formDl">
          <dt>
            <EmailIcon />
            メールアドレス
          </dt>
          <dd>
            <VeeField
              type="email"
              name="email"
              v-model="email"
              rules="required"
              label="メールアドレス"
              :class="{ 'is-invalid': errors.email || errorMessage }"
              autocomplete="off"
              :maxlength="254"
            />
            <span v-if="errors.email" class="invalid-feedback"
              >{{ errors.email }}
            </span>
          </dd>
          <dt>
            <KeyIcon />
            パスワード
          </dt>
          <dd>
            <VeeField
              type="password"
              name="password"
              v-model="password"
              rules="required"
              :class="{ 'is-invalid': errors.password || errorMessage }"
              label="パスワード"
              autocomplete="off"
              :maxlength="191"
            />
            <span v-if="errors.password" class="invalid-feedback"
              >{{ errors.password }}
            </span>
            <p class="grayLink bg-btn">
              <router-link :to="{ name: 'PasswordReset' }"
                >パスワードを忘れた方
              </router-link>
            </p>
          </dd>
          <dd>
            <span v-if="errorMessage" class="invalid-feedback"
              >{{ errorMessage }}
            </span>
          </dd>
        </dl>
        <p class="note">
          ※サインインを行うことにより、利用者は
          RVSの利用規約および、株式会社G-FLEX
          からのメールや最新情報の受信、および
          <router-link class="bg-btn" :to="{ name: 'PrivacyPolicy' }"
            >プライバシーポリシー
          </router-link>
          に同意したものとみなされます。
        </p>
        <ul class="submit smlWid bg-btn">
          <li>
            <input type="submit" name="__send__" value="ログイン" /><br />
            <router-link class="bg-btn" :to="{ name: 'AuthEmail' }"
              >新規登録はこちら
            </router-link>
          </li>
        </ul>
      </VeeForm>
    </div>
  </div>
</template>
<script setup>
import EmailIcon from '@/components/Icons/EmailIcon';
import KeyIcon from '@/components/Icons/KeyIcon';
import { inject, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import router from '@/router';
import { removeAccessToken, setAccessToken } from '@/utils/token';
import { BACKEND_CODE, MESSAGES } from '@/constants/messages';
import { NOTIFY_TYPE, USER_TYPES } from '@/constants/common';

const email = ref('');
const password = ref('');
const store = useStore();
const $toast = inject('$toast');
const errorMessage = ref('');

onMounted(() => {
  removeAccessToken();
  store.commit('user/setLogin', false);
});

const handleLogin = async () => {
  await store.dispatch('loading/actSetLoading', true);
  const body = {
    email: email.value,
    password: password.value,
    user_type: USER_TYPES[0]
  };
  await store
    .dispatch('user/login', body)
    .then((response) => {
      setAccessToken(response);
      router.push({ name: 'Home' });
      store.commit('user/setLogin', true);
    })
    .catch((exception) => {
      errorMessage.value = '';
      if (exception?.response?.data?.error?.code) {
        if (
          exception?.response?.data?.error?.code === BACKEND_CODE[11].key ||
          exception?.response?.data?.error?.code === BACKEND_CODE[1].key
        ) {
          errorMessage.value = MESSAGES.INVALID_ACCOUNT;
        } else {
          const message = BACKEND_CODE.filter(
            (item) => item.key === exception.response.data.error.code
          );
          $toast(NOTIFY_TYPE[1], message[0].value);
        }
      } else {
        $toast(NOTIFY_TYPE[1], MESSAGES.LOGIN_FAIL);
      }
    })
    .finally(() => {
      store.dispatch('loading/actSetLoading', false);
    });
};
</script>
