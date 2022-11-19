<template>
  <div class="popBox">
    <div class="subPop">
      <p>受講を開始しますか?</p>
      <dl>
        <dt>Level</dt>
        <dd>{{ currentCard?.level }}</dd>
      </dl>
      <dl>
        <dt>Card</dt>
        <dd>{{ currentCard?.display_order }}</dd>
      </dl>
      <ul class="comUl">
        <li class="back bg-btn">
          <a @click="$emit('close')" class="closeBtn">戻る</a>
        </li>
        <li class="bg-btn"><a href="#" @click="onStartLesson">開始</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, defineEmits } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { STAGE_LESSON } from '@/constants/common';
import router from '@/router';

const props = defineProps({
  currentCard: {
    type: Object,
    required: true,
  },
});
const route = useRoute();
const currentType = ref(route.params.type);
const currentId = ref(route.params.id);
const store = useStore();
const videoLessonStartDetail = computed(
  () => store.getters['lecture/videoLessonStart']
);
const emit = defineEmits(['startLesson']);

const onStartLesson = async () => {
  await store.dispatch('loading/actSetLoading', true);
  await store.commit(
    'lecture/setCurrentCardName',
    `Card${props.currentCard?.display_order}`
  );
  const params = {
    id: props.currentCard?.video_lesson_id,
  };
  await store
    .dispatch('lecture/actGetVideoLessonStart', params)
    .then(async () => {
      emit('startLesson');
      switch (videoLessonStartDetail.value?.stage) {
        case STAGE_LESSON[0]: {
          await router.replace({
            name: 'JapaneseCard',
            params: {
              type: currentType.value,
              id:
                currentType.value === 'level'
                  ? props.currentCard?.level_id
                  : props.currentCard.grammar_id,
              video_lesson: props.currentCard?.video_lesson_id,
            },
          });
          break;
        }
        case STAGE_LESSON[1]: {
          await router.replace({
            name: 'Lecture',
            params: {
              type: currentType.value,
              id:
                currentType.value === 'level'
                  ? props.currentCard?.level_id
                  : props.currentCard.grammar_id,
              video_lesson: videoLessonStartDetail?.value.video_lesson_try_id,
            },
          });
          break;
        }
        case STAGE_LESSON[2]: {
          await router.replace({
            name: 'Reflex',
            params: {
              type: currentType.value,
              id:
                currentType.value === 'level'
                  ? props.currentCard?.level_id
                  : props.currentCard.grammar_id,
              video_lesson: videoLessonStartDetail?.value.video_lesson_try_id,
            },
          });
          break;
        }
        case STAGE_LESSON[3]: {
          await router.replace({
            name: 'PracticeVideo',
            params: {
              type: currentType.value,
              id:
                currentType.value === 'level'
                  ? props.currentCard?.level_id
                  : props.currentCard.grammar_id,
              video_lesson: videoLessonStartDetail?.value.video_lesson_try_id,
            },
          });
          break;
        }
      }
    })
    .finally(() => {
      emit('startLesson');
      store.dispatch('loading/actSetLoading', false);
    });
};
</script>
