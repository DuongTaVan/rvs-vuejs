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
        </div>
        <div v-if="hasAnswer" class="textBox">
          <div class="pBox">
            <p class="ttl">Your Answer</p>
            <p>
              <InputSpeech ref="inputSpeechRef" v-model="answer" />
            </p>
          </div>
          <p class="comLinkP bg-btn">
            <router-link to="card-list">受講終了</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { NOTIFY_TYPE } from '@/constants/common';
import { MESSAGES } from '@/constants/messages';

const answer = ref('');
const inputSpeechRef = ref({});
const store = useStore();
const route = useRoute();
const router = useRouter();
const questionNo = ref(0);
const startRecognition = ref(false);

const isMobile = computed(() => store.getters['common/isMobile']);

const lecture = computed(() => {
  if (questionNo.value === 0) {
    return store.getters['lecture/lecture'];
  }

  return store.getters['lecture/videoQuestion'];
});

const hasAnswer = computed(() => lecture.value.training?.has_answer === 1);

const videoUrl = computed(
  () =>
    lecture.value.training?.sentence_video_url ||
    lecture.value.training?.question_video_url
);

const getVideoQuestion = async () => {
  await store.dispatch('lecture/getVideoQuestion', {
    id: route?.params?.id,
    no: questionNo.value
  });
};

watch(
  () => questionNo.value,
  () => {
    getVideoQuestion();
  }
);

watch(
  () => answer.value,
  async () => {
    await store
      .dispatch('lecture/submitAnswer', {
        id: route?.params?.id,
        no: null,
        answer: answer.value
      })
      .then((res) => {
        if (res.training?.result === 1) {
          router.push({ name: 'ReflexVeryGood' });
        }
        if (res.training?.result === 2) {
          router.push({ name: 'ReflexTryAgain' });
        }
      });
  }
);

const onCreated = async () => {
  await store
    .dispatch('lecture/actGetLecture', { id: route?.params?.id })
    .catch((err) => {
      console.log(err);
      store.commit('notification/setIsNotifyCation', true);
      store.commit('notification/setType', NOTIFY_TYPE[1]);
      store.commit('notification/setMessage', MESSAGES.NO_DATA);
    });
};
onCreated();

const onEndVideo = async () => {
  if (questionNo.value > 0) {
    setTimeout(async () => {
      if (!lecture.value.training.has_answer) return;
      if (lecture.value.training?.has_next) {
        questionNo.value += 1;
        await store.dispatch('lecture/getVideoQuestion', {
          id: route?.params?.id,
          no: questionNo.value
        });
      } else {
        await store.dispatch('lecture/actGetVideoLessonPractice', {
          id: route?.params?.id
        });

        router.push({
          name: 'PracticeVideo'
        });
      }
    }, 3000);
  } else {
    questionNo.value += 1;
  }
};

const timeToRecognition = async (currentTime) => {
  if (questionNo.value === 0 || startRecognition.value) return;
  if (currentTime === lecture.value.training?.recognition_start_sec) {
    startRecognition.value = true;
    inputSpeechRef.value.speechAudio();
  }
};
</script>
