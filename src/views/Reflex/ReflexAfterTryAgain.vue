<template>
  <div class="fullView fullView02 have_passed reflex">
    <div class="comInner">
      <div class="passedBox">
        <div class="photoBox">
          <img src="@/assets/image/reflex/photo.jpg" alt="" class="pc">
          <img src="@/assets/image/reflex/sp_photo.jpg" alt="" class="sp">
        </div>
        <div class="textBox">
          <div class="pBox">
            <p class="ttl">Correct Answer</p>
            <p>Yes, I played soccer.</p>
          </div>
          <div class="pBox">
            <p class="ttl">Your Answer</p>
            <p>
              <input type="text" value="" name=""
                placeholder="Yes, I play soccer.">
            </p>
          </div>
          <p class="comLinkP bg-btn">
            <router-link :to="{ name: 'CardList' }">受講終了</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>
