<template>
  <div class="fullView fullView02 have_passed reflex practice">
    <div class="comInner">
      <div class="passedBox">
        <div class="photoBox">
          <PlayVideo
            :class="isMobile ? 'sp' : 'pc'"
            ref="videoRef"
            :video-url="videoLessonPractice?.practice?.practice_video_url"
            @endPlayVideo="onEndVideo"
            @currentTime="timeToRecognition"
          />
          <div class="sub" v-show="isSubmitAnswer && !answerStatus">
            <img
              src="@/assets/image/reflex/imgtext.png"
              alt="Try Again!"
              width="195"
            />
          </div>
          <div class="sub" v-show="isSubmitAnswer && answerStatus">
            <img
              src="@/assets/image/reflex/imgtext02.png"
              alt="Very Good!"
              width="195"
            />
          </div>
        </div>
        <div class="textBox">
          <div class="pBox" v-show="isCallAPi">
            <p class="ttl">Correct Answer</p>
            <p>{{ resultAnswer }}</p>
          </div>
          <div class="pBox">
            <p class="ttl">Your Answer</p>
            <p class="div-input">
              <input
                readonly
                type="text"
                ref="inputSpeechRef"
                v-model="userAnswer"
              />
              <MicIcon :icon-color="iconColor" class="position-icon" />
            </p>
          </div>
          <div class="reflexBox">
            <p class="comLinkP bg-btn" v-show="!answerStatus">
              <router-link
                :to="{
                  name: 'CardList',
                  params: {
                    type: currentType,
                    id: currentId
                  }
                }"
                replace
                >受講終了
              </router-link>
            </p>
            <div
              class="comLink bg-btn"
              v-show="isSubmitAnswer && !answerStatus"
            >
              <div class="btn-background" @click="onReplayVideo">Try Again</div>
            </div>
            <div class="comLink bg-btn" v-show="isSubmitAnswer && answerStatus">
              <div class="btn-background" @click="onEndPractice">Finish</div>
            </div>
            <p class="comLinkP bg-btn" v-show="isSubmitAnswer && !answerStatus">
              <span @click="onSelfOk">Self OK</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, watch, inject, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { PRACTICE_RESULT_STATUS_CORRECT } from '@/constants/common';
import router from '@/router';
import recognition from '@/composables/recognition';

const {
  answer,
  recognitionText,
  stoppedRecognition,
  stopRecognition,
  recognitionContinuous
} = recognition();
let isSubmitAnswer = ref(false);
const store = useStore();
const isMobile = ref(false);
const afterWatching = ref(false);
const videoRef = ref();
let resultAnswer = ref('');
const route = useRoute();
const currentType = route.params.type;
const currentId = route.params.id;
const lessionId = route.params.video_lesson;
const videoLessonPractice = computed(
  () => store.getters['lecture/videoLessonPractice']
);
const startRecognition = ref(false);
const inputSpeechRef = ref({});
const answerResult = computed(() => store.getters['lecture/practiceResult']);
const answerStatus = ref(false);
const isCallAPi = ref(false);
const iconColor = computed(() => store.getters['lecture/micIconColor']);
const cardName = computed(() => store.getters['lecture/currentCardName']);
let recogID = null;

const onCreated = async () => {
  await store.dispatch('loading/actSetLoading', true);
  if (!cardName.value) {
    return router.push({
      name: 'CardList',
      params: {
        type: currentType,
        id: currentId
      }
    });
  }
};

watch(
  () => stoppedRecognition.value,
  (newValue) => {
    if (recogID && newValue) {
      clearTimeout(recogID);
    }
  }
);

const userAnswer = computed(() => {
  if (!stoppedRecognition.value) {
    return recognitionText.value;
  }
  return answer.value;
});

onCreated();
onMounted(() => {
  const innerWidth = window.innerWidth;
  if (innerWidth < 897) {
    isMobile.value = true;
  }
  const params = {
    id: lessionId
  };
  store.dispatch('lecture/actGetVideoLessonPractice', params);
  store.dispatch('loading/actSetLoading', false);
});
const onEndVideo = () => {
  afterWatching.value = true;
  const body = {
    answer: answer.value,
    id: videoLessonPractice.value.video_lesson_try_id,
    reflex_try_id: videoLessonPractice.value.practice?.reflex_try_id
  };
  if (!body.answer) {
    isSubmitAnswer.value = true;
  }
  store.dispatch('lecture/actGetVideoLessonPracticeSubmit', body).then(() => {
    isSubmitAnswer.value = true;
    isCallAPi.value = true;
    resultAnswer.value = answerResult.value.training?.correct_answer
      .map((el) => el.word)
      .join(' ');
    if (
      answerResult.value.training?.result === PRACTICE_RESULT_STATUS_CORRECT
    ) {
      answerStatus.value = true;
    }
  });
};

const timeToRecognition = async (currentTime) => {
  if (startRecognition.value) return;
  if (
    Math.floor(currentTime * 10) >=
    +videoLessonPractice.value.practice?.recognition_start_sec * 10
  ) {
    const timeAnswer =
      videoLessonPractice.value.practice?.recognition_end_sec -
      videoLessonPractice.value.practice?.recognition_start_sec;
    answer.value = '';
    recognitionText.value = '';
    startRecognition.value = true;
    await recognitionContinuous(timeAnswer);

    recogID = setTimeout(() => {
      stopRecognition();
    }, timeAnswer * 1000);
  }
};

const onReplayVideo = () => {
  answer.value = null;
  startRecognition.value = false;
  afterWatching.value = false;
  answerStatus.value = false;
  isSubmitAnswer.value = false;
  isCallAPi.value = null;
  videoRef.value.startPlayVideo();
};

const onSelfOk = () => {
  const body = {
    id: videoLessonPractice.value.video_lesson_try_id,
    reflex_try_id: videoLessonPractice.value.practice?.reflex_try_id
  };
  store.dispatch('lecture/actGetVideoLessonPracticeSelfOk', body).then(() => {
    answerStatus.value = true;
  });
};
const onEndPractice = () => {
  const body = {
    id: videoLessonPractice.value.video_lesson_try_id,
    reflex_try_id: videoLessonPractice.value.practice?.reflex_try_id
  };
  store.dispatch('lecture/actGetVideoLessonPracticeEnd', body).then(() => {
    router.replace({
      name: 'CardList',
      params: {
        type: currentType,
        id: currentId
      }
    });
  });
};
</script>
