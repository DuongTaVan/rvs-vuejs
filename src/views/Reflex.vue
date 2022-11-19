<template>
  <div class="fullView fullView02 have_passed reflex">
    <div class="comInner">
      <div class="passedBox">
        <div class="photoBox">
          <PlayVideo
            :class="isMobile ? 'sp' : 'pc'"
            ref="videoRef"
            :video-url="videoUrl"
            @endPlayVideo="onEndVideo"
            @currentTime="timeToRecognition"
            :key="videoUrl"
          />

          <div v-show="selfOk" class="sub">
            <img :src="subImage.src" :alt="subImage.alt" width="195" />
          </div>
        </div>

        <div v-show="hasAnswer" class="textBox">
          <div v-show="showCorrectAnswer && correctAnswer" class="pBox">
            <p class="ttl">Correct Answer</p>
            <p>{{ correctAnswer }}</p>
          </div>

          <div class="pBox">
            <p class="ttl">Your Answer</p>
            <p class="div-input">
              <input type="text" v-model="userAnswer" />
              <MicIcon :icon-color="iconColor" class="position-icon" />
            </p>
          </div>

          <div class="reflexBox">
            <p class="comLinkP">
              <router-link :to="{ name: 'CardList' }" replace>受講終了</router-link>
            </p>
            <div
              v-show="(isTryAgain || noAnswer) && stoppedRecognition"
              class="comLink"
            >
              <a @click="nextStage(REFLEX_STAGES[2])"> Try Again </a>
            </div>
            <p
              v-show="(selfOk || noAnswer) && stoppedRecognition"
              class="comLinkP popLink"
            >
              <a @click="okAndNext()"> Self OK </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { NOTIFY_TYPE, REFLEX_STAGES } from '@/constants/common';
import { MESSAGES } from '@/constants/messages';
import recognition from '@/composables/recognition';

const {
  answer,
  recognitionText,
  stoppedRecognition,
  // stopRecognition,
  recognitionContinuous
} = recognition();
const videoRef = ref({});
const store = useStore();
const route = useRoute();
const router = useRouter();
const questionNo = ref(0);
const startRecog = ref(false);
const stage = ref(REFLEX_STAGES[0]);
const noAnswer = ref(false);
const endedVideo = ref(false);
const currentType = ref(route.params.type);
const currentId = ref(route.params.id);
const showCorrectAnswer = ref(false);

// const showCorrectAnswer = computed(() => stage.value !== REFLEX_STAGES[0]);
const isReflex = computed(() => stage.value === REFLEX_STAGES[0]);
const isTryAgain = computed(() => stage.value === REFLEX_STAGES[1]);
const isAfterTryAgain = computed(() => stage.value === REFLEX_STAGES[2]);
const isVeryGood = computed(() => stage.value === REFLEX_STAGES[3]);
const isMobile = computed(() => store.getters['common/isMobile']);
const selfOk = computed(() => isTryAgain.value || isVeryGood.value);
const hasAnswer = computed(() => lecture.value.training?.has_answers === 1);
const iconColor = computed(() => store.getters['lecture/micIconColor']);
const cardName = computed(() => store.getters['lecture/currentCardName']);

const subImage = computed(() => {
  if (isTryAgain.value) {
    return {
      src: require('@/assets/image/reflex/imgtext.png'),
      alt: 'Try Again!'
    };
  }

  return {
    src: require('@/assets/image/reflex/imgtext02.png'),
    alt: 'Very Good!'
  };
});

const lecture = computed(() => {
  if (questionNo.value === 0) {
    return store.getters['lecture/lecture'];
  }

  return store.getters['lecture/videoQuestion'];
});

/**
 * Get correct answer after submit
 */
const correctAnswer = computed(() => {
  let reflexAnswer = store.getters['lecture/reflexAnswer'];
  reflexAnswer = reflexAnswer?.training?.correct_answer;
  if (!answer.value && stage.value === REFLEX_STAGES[0]) return '';
  return reflexAnswer ? reflexAnswer.map((item) => item.word).join(' ') : '';
});

const videoUrl = computed(
  () =>
    lecture.value.reflex?.sentence_video_url ||
    lecture.value.training?.question_video_url
);

const userAnswer = computed(() => {
  if (!stoppedRecognition.value) {
    return recognitionText.value;
  }
  return answer.value;
});

/**
 * Get question for this video
 */
const getVideoQuestion = async () => {
  await store.dispatch('lecture/getVideoQuestion', {
    id: route?.params?.video_lesson,
    no: questionNo.value
  });

  // reset answer
  await store.commit('lecture/SET_REFLEX_ANSWER', {});
  stage.value = REFLEX_STAGES[0];
  endedVideo.value = false;
};

/**
 * When questionNo change, get match question
 */
watch(
  () => questionNo.value,
  () => {
    getVideoQuestion();
    showCorrectAnswer.value = false;
    answer.value = '';
    noAnswer.value = false;
    recognitionText.value = '';
    startRecog.value = false;
    endedVideo.value = false;
    videoRef.value.startPlayVideo();
  }
);

// watch(
//   () => answer.value,
//   () => {
//     if (answer.value) {
//       noAnswer.value = false;
//     } else {
//       noAnswer.value = true;
//     }
//   }
// );

watch(
  () => [answer.value, stoppedRecognition.value],
  async ([newAnswer, newStopped]) => {
    if (newAnswer && newStopped) {
      await checkYourAnswer();
    }
  }
);

watch(
  () => stoppedRecognition.value,
  async (newStopped) => {
    if (newStopped && !answer.value) {
      noAnswer.value = true;
      stage.value = REFLEX_STAGES[1];
    } else {
      noAnswer.value = false;
    }
  }
);

/**
 * Created
 */
const onCreated = async () => {
  if (!cardName.value) {
    return router.push({
      name: 'CardList',
      params: {
        type: currentType.value,
        id: currentId.value
      }
    });
  }
  await store
    .dispatch('lecture/actGetLecture', { id: route?.params?.video_lesson })
    .catch(() => {
      store.commit('notification/setIsNotifyCation', true);
      store.commit('notification/setType', NOTIFY_TYPE[1]);
      store.commit('notification/setMessage', MESSAGES.NO_DATA);
    });
};
onCreated();

/**
 * Get next question or redirect to practice video
 */
const onEndVideo = async () => {
  endedVideo.value = true;

  // stop recognition when end video
  // if (questionNo.value > 0) {
  //   stopRecognition(true);
  // }

  if (!answer.value && questionNo.value > 0) {
    noAnswer.value = true;
  }

  if (questionNo.value > 0) {
    // training
    if (lecture.value.training.has_answers) return;
    setTimeout(async () => {
      if (lecture.value.training?.has_next) {
        // if has next question, change questionNo to Watch RUN
        questionNo.value += 1;
        startRecog.value = false;
      } else {
        router.replace({
          name: 'PracticeVideo',
          params: route.params
        });
      }
    }, 3000);
  } else {
    // sentence => training
    questionNo.value += 1;
  }
};

/**
 * Get answer when video run to recognition_start_sec
 */
const timeToRecognition = async (currentTime) => {
  if (
    questionNo.value === 0 ||
    startRecog.value ||
    lecture.value.training?.has_answers === 0
  )
    return;
  if (
    Math.floor(currentTime * 10) >=
    lecture.value.training?.recognition_start_sec * 10
  ) {
    startRecog.value = true;
    answer.value = '';
    noAnswer.value = false;
    recognitionText.value = '';
    await recognitionContinuous();
  }
};

/**
 * submit answer
 */
const checkYourAnswer = async () => {
  await store
    .dispatch('lecture/submitAnswer', {
      videoLessonTryId: route?.params?.video_lesson,
      reflexTryId: lecture.value.training.reflex_try_id,
      answer: answer.value
    })
    .then((res) => {
      showCorrectAnswer.value = true;
      if (res.training?.result === 1) {
        stage.value = REFLEX_STAGES[3];
        setTimeout(() => {
          if (res.training.has_next === 1) {
            questionNo.value += 1;
          } else {
            router.replace({
              name: 'PracticeVideo',
              params: route.params
            });
          }
        }, 3000);
      }
      if (res.training?.result === 2) {
        stage.value = REFLEX_STAGES[1];
      }
    });
};

/**
 * Next stage
 * @param {string} stage
 */
const nextStage = (next) => {
  if (next === REFLEX_STAGES[2]) {
    endedVideo.value = false;
    videoRef.value.startPlayVideo();
    startRecog.value = false;
    answer.value = '';
    noAnswer.value = false;
    recognitionText.value = '';
    stage.value = REFLEX_STAGES[2];
    showCorrectAnswer.value = false;
  } else {
    stage.value = next;
  }
};

/**
 * User feel ok and next question or redirect to practice
 */
const okAndNext = async () => {
  await store.dispatch('lecture/selfOk', {
    videoLessonTryId: route?.params?.video_lesson,
    reflexTryId: lecture.value.training.reflex_try_id
  });

  if (lecture.value.training?.has_next === 1) {
    stage.value = REFLEX_STAGES[3];
    setTimeout(() => {
      questionNo.value += 1;
      stage.value = REFLEX_STAGES[0];
      endedVideo.value = false;
    }, 3000);
  } else {
    stage.value = REFLEX_STAGES[3];
    setTimeout(() => {
      router.replace({
        name: 'PracticeVideo',
        params: route.params
      });
    }, 3000);
    return;
  }
};
</script>
