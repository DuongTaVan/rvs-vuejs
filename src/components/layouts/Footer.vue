<template>
  <footer id="gFooter">
    <ul class="naviUl">
      <li class='bg-btn'>
        <router-link to="/">
          <HomeActiveIcon v-if="routeModule === MENU_MODULE[0]" />
          <HomeIcon v-else />
        </router-link>
      </li>
      <li class="on bg-btn">
        <router-link :to="{name: 'SelectLesson'}">
          <PlayVideoActiveIcon v-if="routeModule === MENU_MODULE[1]" />
          <PlayVideoIcon v-else />
        </router-link>
      </li>
      <li class='bg-btn'>
        <router-link :to="{ name: 'MyAccount'}">
          <UserActiveIcon v-if="routeModule === MENU_MODULE[2]" />
          <UserIcon v-else />
        </router-link>
      </li>
    </ul>
  </footer>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { MENU_MODULE } from '@/constants/common';

const route = useRoute();
const routeModule = computed(() => route.meta?.module || 'Home');
</script>
