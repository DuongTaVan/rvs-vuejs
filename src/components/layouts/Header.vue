<template>
  <div
    class="hBox"
    v-if="isPassed25Minutes && LESSON_CHECK_MINUTE_ROUTER.includes(route.name)"
  >
    <h1>受講から25分が経過しました</h1>
    <p class="bg-btn">
      <router-link :to="{ name: 'StoryChoose' }"
        >ストーリービデオに移動してください</router-link
      >
    </p>
  </div>
  <div
    class="hBox"
    v-else-if="
      isPassed40Minutes && LESSON_CHECK_MINUTE_ROUTER.includes(route.name)
    "
  >
    <h1>受講から40分が経過しました</h1>
    <p class="bg-btn">
      <a href="#" @click="handleClose40">英会話レッスンに戻ってください</a>
    </p>
  </div>
  <header
    :class="{
      homepage: isHomepage,
      after_header: isNotifyCation,
      error: isNotifyCation && notification.type === NOTIFY_TYPE[1],
    }"
    id="gHeader"
    v-else
  >
    <h1 v-show="isNotifyCation" class="h1Ttl h1Ttl--white">
      {{ notification.message }}
    </h1>
    <h1 v-show="isHomepage && !isNotifyCation">
      こんにちは 　{{ userInfo?.last_name_kanji }}
      {{ userInfo?.first_name_kanji }}　さん<br />
      ID: {{ userInfo?.user_id }}
    </h1>
    <div v-if="!isHomepage && !isNotifyCation">
      <slot name="title">
        <h1 v-if="subTitle">
          <span
            :class="{
              'plan-purchase': isPlanPage,
              'cancel-plan': isCancelPlan,
              'study': isStudy,
            }"
          >
            {{ pageTitle }}</span
          ><br />
          <span
            :class="{
              'plan-purchase-sub': isPlanPage,
              'cancel-plan-sub': isCancelPlan,
              'study-sub': isStudy,
            }"
          >
            {{ subTitle }}
          </span>
        </h1>
        <h1 v-else class="h1Ttl">{{ pageTitle }}</h1>
      </slot>
    </div>
    <div class="link bg-btn" v-if="isLogin && !isNotifyCation">
      <div @click="handleLogout">
        <LogoutIcon />
      </div>
    </div>
    <div class="backLink bg-btn" v-if="allowBack && !isNotifyCation">
      <div @click="handleBack()">
        <BackIcon />
      </div>
    </div>
  </header>
</template>
<script setup>
import { computed, inject, onMounted, ref, watch, onUpdated } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import router from '@/router';
import { getToken } from '@/utils/token';
import {
  ACCEPT_BACK_ROUTE_NAME,
  NOT_ACCEPT_BACK_ROUTE_NAME,
  NOTIFY_TYPE,
  ACCESS_TOKEN,
  PLAN_ROUTES,
  LESSONS,
  CANCEL_PLAN_ROUTES,
  LESSON_CHECK_MINUTE_ROUTER,
} from '@/constants/common';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  setDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/plugins/firebase';

const store = useStore();
const route = useRoute();
const $formatDateTime = inject('$formatDateTime');
const _25MinuteStartDocument = ref(null);
const _25MinuteEndDocument = ref([]);
const _40MinuteStartDocument = ref(null);
const _40MinuteEndDocument = ref([]);
const userInfo = computed(() => store.getters['user/userInfo']);

onMounted(async () => {
  if (getToken(ACCESS_TOKEN)?.length) {
    store.commit('user/setLogin', true);
  }
});

const isStudy = ref(LESSON_CHECK_MINUTE_ROUTER.includes(route.name));
const pageTitle = computed(() => {
  if (isStudy.value) {
    return store.getters['lecture/currentCardName'] || 'RVS';   
  }
  return route.meta?.title || 'RVS';
});
const isLogin = computed(() => store.getters['user/isLogin']);
const isHomepage = ref(route.name === 'Home');
const notification = computed(() => ({
  type: store.getters['notification/type'],
  message: store.getters['notification/message'],
}));
const isNotifyCation = computed(
  () => store.getters['notification/isNotifyCation']
);
const isPlanPage = ref(PLAN_ROUTES.includes(route.name));
const isCancelPlan = ref(CANCEL_PLAN_ROUTES.includes(route.name));
const subscriptionSubTitle = computed(() => {
  if (+route.params.type === LESSONS[0].key) {
    return 'RVSサブスクコース';
  }
  return 'RVSオンラインレッスンコース';
});

onBeforeRouteUpdate((to, from) => {
  isHomepage.value = to.name === 'Home';
  isStudy.value = LESSON_CHECK_MINUTE_ROUTER.includes(to.name);
  if (to.name === 'Login') {
    closeAllNotifyTimeLearning();
  }
});
watch(isNotifyCation, async (newValue) => {
  if (newValue) {
    setTimeout(() => {
      store.commit('notification/setIsNotifyCation', false);
    }, 2500);
  }
});
watch(userInfo, async (newValue) => {
  if (newValue.user_id) {
    // get 25minute query with story end time
    const data25MinutesQueryEnd = query(
      collection(db, 'reservations'),
      where('userId', '==', newValue?.user_id),
      where('isFinished', '==', 0),
      where('storyEndTime', '>', $formatDateTime(new Date())),
      orderBy('storyEndTime'),
      limit(1)
    );
    let storyEndTime = null;
    let storyStartTime = null;
    let docItemId = null
    const querySnapshot25Minutes = await getDocs(data25MinutesQueryEnd);
    querySnapshot25Minutes.forEach((docItem) => {
      storyEndTime = new Date(docItem._document.data.value.mapValue.fields.storyEndTime.stringValue).getTime();
      storyStartTime = new Date(docItem._document.data.value.mapValue.fields.storyStartTime.stringValue).getTime();
      docItemId = docItem.id;
    });
    // count and show noti video 25 minutes
    if(storyStartTime){
      const fnNoti25min = setInterval(() => {
      if (storyStartTime - new Date().getTime() <= 0) {
        clearInterval(fnNoti25min);
        handleCheckSameDocument();
      }
    }, 1000);
    }

    // count and show noti video 40 minutes
    if (storyEndTime - new Date().getTime() >= 0) {
      const fnNoti40min = setInterval(() => {
        if (storyEndTime - new Date().getTime() <= 0) {
          clearInterval(fnNoti40min);
          handleCheckSame40MinuteDocument(newValue?.user_id, docItemId);
        }
      }, 1000);
    }
  }
});

const allowBack = computed(() => {
  if (NOT_ACCEPT_BACK_ROUTE_NAME.includes(route.name)) {
    return false;
  }
  if (
    (isLogin.value && !route.fullPath.includes('reflex')) ||
    ACCEPT_BACK_ROUTE_NAME.indexOf(route.name) !== -1
  ) {
    return true;
  }
  return false;
});
const subTitle = computed(() => {
  if (route.name === PLAN_ROUTES[0]) {
    return subscriptionSubTitle.value;
  } else if (route.name === PLAN_ROUTES[1]) {
    return '';
  } else if (route.meta?.subTitle) {
    return route.meta?.subTitle;
  } else {
    return '';
  }
});

const isPassed25Minutes = computed(
  () => store.getters['lecture/getOutOf25Minutes']
);
const isPassed40Minutes = computed(
  () => store.getters['lecture/getOutOf40Minutes']
);

const handleLogout = () => {
  router.push({ name: 'Login' });
};

const handleBack = () => {
  router.go(-1);
};

const handleCheckSameDocument = async () => {
  await store.dispatch('lecture/actSetOutOf25Minutes', true);
};
const handleCheckSame40MinuteDocument = async (userId, revesationId) => {
    await store.dispatch('lecture/actSetOutOf25Minutes', false);
    await store.dispatch('lecture/actSetOutOf40Minutes', true);
    const checkReservationFinished = query(
      collection(db, 'reservations'),
      where('userId', '==', userId)
    );
    onSnapshot(checkReservationFinished, (querySnapshot) => {
      querySnapshot.forEach(async (doc2) => {
        if (doc2.id === revesationId) {
          await setDoc(doc(db, 'reservations', doc2.id), {
            ...doc2.data(),
            isFinished: 1,
          });
        }
      });
    });
};

const handleClose40 = async () => {
  closeAllNotifyTimeLearning();
};
const closeAllNotifyTimeLearning = () => {
  _25MinuteStartDocument.value = null;
  _25MinuteEndDocument.value = [];
  _40MinuteStartDocument.value = null;
  _40MinuteEndDocument.value = [];
  store.dispatch('lecture/actSetOutOf40Minutes', false);
  store.dispatch('lecture/actSetOutOf25Minutes', false);
}
</script>
