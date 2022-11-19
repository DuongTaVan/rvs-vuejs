<template>
  <ListData
    class="fullView fullView02 card_list"
    :loading="isLoading"
    :data="lessons"
    :emptyTitle="MESSAGES.NO_DATA"
  >
    <div class="comInner">
      <ul class="cardUl bg-btn">
        <CardItem
          v-for="lesson in lessons"
          :key="lesson.video_lesson_id"
          :cardData="lesson"
          @click="openConfirmStart(lesson)"
        />
      </ul>
    </div>
  </ListData>

  <AppModal ref="startConfirmRef">
    <CardListStartConfirm
      :current-card="currentCard"
      @close="closeConfirmStart"
      @startLesson="closeConfirmStart"
    />
  </AppModal>
</template>

<script setup>
import { computed, onMounted, ref, inject } from 'vue';
import CardItem from './CardItem.vue';
import CardListStartConfirm from './CardListStartConfirm.vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { MESSAGES } from '@/constants/messages';
import { NOTIFY_TYPE } from '@/constants/common';

const startConfirmRef = ref({});
const route = useRoute();
const currentType = ref(route.params.type);
const currentId = ref(route.params.id);
const store = useStore();
const lessons = computed(() => store.getters['lecture/lessons']);
const userInfo = computed(() => store.getters['user/userInfo']);
const $toast = inject('$toast');

let currentCard = ref({});
const isLoading = ref(false);

onMounted(async () => {
  store.dispatch('loading/actSetLoading', true);
  isLoading.value = true;
  const lessonParams = {};
  if (currentType.value === 'level') {
    lessonParams.level_id = currentId.value;
  } else {
    lessonParams.grammar_id = currentId.value;
  }
  await store.dispatch('lecture/actGetLessons', lessonParams);

  isLoading.value = false;
  store.dispatch('loading/actSetLoading', false);
});

const openConfirmStart = (item) => {
  currentCard.value = item;
  if ( userInfo.value.has_online_lesson === 0 
      && userInfo.value.has_video_lesson === 0 
      && userInfo.value.trial_video_lessons === 0) 
  {
    $toast(NOTIFY_TYPE[1], MESSAGES.FREE_USER_NOTICE);
  } 
  else {
    startConfirmRef.value.openModal();
  }
};

const closeConfirmStart = () => {
  startConfirmRef.value.closeModal();
};
</script>
