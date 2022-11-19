<template>
  <div class="fullView">
    <div class="comBox">
      <div class="afterAut">
        <p>
          本人確認の認証ページへのURLを添付したメールを送信しました。<br />添付されたURLにアクセスし、本登録の手続きを行ってください。
        </p>
        <div class="comBtn authen_confirm_btn">
          <router-link class="bg-btn" :to="{ name: 'Login' }">
            <p><span class="txtSpan">ログイン画面に戻る</span></p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
