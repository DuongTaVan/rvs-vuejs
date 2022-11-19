<template>
  <div class="fullView fullView02 have_passed reflex">
    <div class="comInner">
      <div class="passedBox">
        <div class="photoBox">
          <img src="@/assets/image/reflex/photo.jpg" alt="" class="pc">
          <img src="@/assets/image/reflex/sp_photo.jpg" alt="" class="sp">
          <div class="sub">
            <img src="@/assets/image/reflex/imgtext.png" alt="Try Again!"
                 width="195">
          </div>
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
          <div class="reflexBox">
            <p class="comLinkP bg-btn">
              <router-link :to="{ name: 'CardList' }">受講終了</router-link>
            </p>
            <div class="comLink bg-btn">
              <router-link :to="{ name: 'ReflexAfterTryAgain' }">
                Try Again
              </router-link>
            </div>
            <p class="comLinkP bg-btn">
              <router-link :to="{
                name: 'Reflex',
                params: {
                  type: currentType,
                  id: currentId
                }
              }">
                Self OK
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentType = ref(route.params.type);
const currentId = ref(route.params.id);
</script>
