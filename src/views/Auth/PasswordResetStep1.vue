<template>
  <div class="fullView">
    <div class="comBox smlBox resetPass">
      <p class="text">
        ユーザーの確認ができました。<br />新しいパスワードを入力してください。
      </p>
      <VeeForm class="smlFrom" @submit="ResetPassword" v-slot="{ errors }">
        <dl class="formDl">
          <dt>
            <img
              src="@/assets/image/common/icon02.png"
              alt="パスワード"
              width="18"
            />パスワード
          </dt>
          <dd>
            <VeeField
              type="password"
              name="pass01"
              v-model="password"
              :class="{ 'is-invalid': errors.pass01 }"
              rules="required|password"
              label="パスワード"
              placeholder="半角英数字8文字〜20文字を入力してください。"
              autocomplete="off"
            />
            <span v-if="errors.pass01" class="invalid-feedback" name="pass01"
              >{{ errors.pass01 }}
            </span>
          </dd>
          <dt>
            <img
              src="@/assets/image/common/icon02.png"
              alt="パスワード(確認用)"
              width="18"
            />パスワード (確認用)
          </dt>
          <dd>
            <VeeField
              type="password"
              name="pass02"
              v-model="password_confirmation"
              rules="required|confirmed:@pass01,パスワード"
              :class="{ 'is-invalid': errors.pass02 }"
              label="パスワード (確認用) "
              autocomplete="off"
              placeholder="半角英数字8文字〜20文字を入力してください。"
            />
            <span v-if="errors.pass02" class="invalid-feedback" name="pass02"
              >{{ errors.pass02 }}
            </span>
          </dd>
        </dl>
        <ul class="submit">
          <li class="bg-btn">
            <input type="submit" name="__send__" value="登録" />
          </li>
        </ul>
      </VeeForm>
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { setAccessToken } from '@/utils/token';
import { useRoute } from 'vue-router';
import { NOTIFY_TYPE } from '@/constants/common';
import { MESSAGES } from '@/constants/messages';

const password = ref('');
const password_confirmation = ref('');
const store = useStore();
const router = useRouter();
const route = useRoute();
const $toast = inject('$toast');

const onCreated = async () => {
  const token = route.query.token;
  const user_type = route.query.user_type;
  if (!token || !user_type) {
    router.push({ name: 'Login' });
  }
};
onCreated();

const ResetPassword = async () => {
  await store
    .dispatch('user/ResetPassword', {
      password: password.value,
      password_confirmation: password_confirmation.value,
      token: route.query.token
    })
    .then((res) => {
      setAccessToken(res);
      $toast(NOTIFY_TYPE[2], MESSAGES.RESET_PASSWORD_SUCCESS);
      store.commit('user/setLogin', true);
      setTimeout(() => {
        router.push({ name: 'Home' });
      }, 2000);
    })
    .catch(() => {
      $toast(NOTIFY_TYPE[1], MESSAGES.URL_EXPIRED);
    });
};
</script>
