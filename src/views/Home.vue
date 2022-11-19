<template>
  <div>
    <div class="fullView fullView02">
      <div class="index">
        <div class="inner">
          <div class="rBox">
            <div class="comBox reservation">
              <h2>次回の予約</h2>
              <p v-if="myReservation.length" class="date">
                {{
                  $reservationDateTime(
                    myReservation[0]?.slot_start_time,
                    'year'
                  )
                }}
                <span class="txtSpan">
                  {{
                    $reservationDateTime(
                      myReservation[0]?.slot_start_time,
                      'month'
                    )
                  }} </span
                ><small>(月)</small
                ><span class="txtSpan02">
                  {{
                    $reservationDateTime(
                      myReservation[0]?.slot_start_time,
                      'hours'
                    )
                  }}
                  -{{
                    $reservationDateTime(
                      myReservation[0]?.slot_end_time,
                      'hours'
                    )
                  }}</span
                >
              </p>
              <div
                v-if="myReservation.length"
                class="comLink comLink02"
              >
                <div class="btn-border bg-btn" @click="openBookingModal">
                  予約変更を依頼する
                </div>
              </div>
              <p v-if="myReservation.length" class="txt">
                24時間前まで変更可(変更は1回/月まで)
              </p>
              <p
                :class="{
                  'no-reservation': myReservation.length <= 0
                }"
              >
                今月の残りレッスン数<span class="num">{{
                  userInfo.tickets || '--'
                }}</span
                >回
              </p>
            </div>
            <div class="lBox statusBox" v-if="isMobile">
              <div class="comBox">
                <h2>受講状況</h2>
                <div class="sub">
                  <div class="status">
                    <ProcessBar
                      :current-percent="currentPercent"
                      :diameter="diameter"
                    >
                      <div class="pBox">
                        <p>
                          <span class="num">
                            {{
                              $formatNumber(
                                userInfo.point_balance,
                                NUMBER_EN_US_FORMAT
                              )
                            }} </span
                          ><small>pt</small>
                          <span class="txtSpan">
                            /{{
                              $formatNumber(
                                userInfo.goal_points,
                                NUMBER_EN_US_FORMAT
                              )
                            }}
                            <small>pt</small></span
                          >
                        </p>
                        <div class="comLink comLink02">
                          <div
                            class="btn-border bg-btn"
                            @click="openChangePointModal"
                          >
                            ゴール設定
                          </div>
                        </div>
                      </div>
                    </ProcessBar>
                  </div>
                  <div class="levels">
                    <dl>
                      <dt>
                        <CharIcon />
                        レベル達成数
                      </dt>
                      <dd>
                        <span class="num">
                          {{ homeData.num_of_levels_achieved || '--' }} </span
                        >Levels
                      </dd>
                      <dt>
                        <VideoOverviewIcon />
                        現在受講中の講義
                      </dt>
                      <dd>
                        <p>
                          <span class="txtSpan">Level</span>
                          <span class="num">
                            {{ homeData.ongoing_level || '--' }}
                          </span>
                        </p>
                        <p>
                          <span class="txtSpan">Card</span>
                          <span class="num">
                            {{ homeData.ongoing_card || '--' }}
                          </span>
                        </p>
                      </dd>
                      <dt>
                        <StarIcon />
                        習熟度
                      </dt>
                      <dd>
                        <span class="txtSpan02">
                          {{ userInfo.skill_lb || '--' }}
                        </span>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div class="comLink lectureLink bg-btn">
                  <router-link :to="{ name: 'SelectLesson' }">
                    講義を受ける
                  </router-link>
                </div>
              </div>
            </div>
            <div class="comBox">
              <h2>契約プラン</h2>
              <dl class="planDl">
                <dt>RVSサブスクコース</dt>
                <dd v-if="subscriptionTypeCourse.length <= 0">--</dd>
                <dd
                  v-else
                  v-for="subscription in subscriptionTypeCourse"
                  :key="subscription.plan_id"
                >
                  {{ subscription.name }}
                </dd>
                <dt>RVSオンラインレッスンコース</dt>
                <dd v-if="subscriptionTypeOnlineCourse.length <= 0">--</dd>
                <dd
                  v-else
                  v-for="subscription in subscriptionTypeOnlineCourse"
                  :key="subscription.plan_id"
                >
                  {{ subscription.name }}
                </dd>
              </dl>
              <div class="comLink comLink02 comLink03 plan-btn bg-btn">
                <router-link :to="{ name: 'PurchasingPlanAfter' }">
                  詳細
                </router-link>
              </div>
            </div>
          </div>
          <div class="lBox statusBox" v-if="!isMobile">
            <div class="comBox">
              <h2>受講状況</h2>
              <div class="sub">
                <div class="status">
                  <ProcessBar
                    :current-percent="currentPercent"
                    :diameter="diameter"
                  >
                    <div class="pBox">
                      <p>
                        <span class="num">{{
                          $formatNumber(
                            userInfo.point_balance,
                            NUMBER_EN_US_FORMAT
                          )
                        }}</span
                        ><small>pt</small
                        ><span class="txtSpan"
                          >/{{
                            $formatNumber(
                              userInfo.goal_points,
                              NUMBER_EN_US_FORMAT
                            )
                          }}<small>pt</small></span
                        >
                      </p>
                      <div class="comLink comLink02">
                        <div
                          class="btn-border bg-btn"
                          @click="openChangePointModal"
                        >
                          ゴール設定
                        </div>
                      </div>
                    </div>
                  </ProcessBar>
                </div>
                <div class="levels">
                  <dl>
                    <dt>
                      <CharIcon />
                      レベル達成数
                    </dt>
                    <dd>
                      <span class="num">
                        {{ homeData.num_of_levels_achieved || '--' }} </span
                      >Levels
                    </dd>
                    <dt>
                      <VideoOverviewIcon />
                      現在受講中の講義
                    </dt>
                    <dd>
                      <p>
                        <span class="txtSpan">Level</span>
                        <span class="num">
                          {{ homeData.ongoing_level || '--' }}
                        </span>
                      </p>
                      <p>
                        <span class="txtSpan">Card</span>
                        <span class="num">
                          {{ homeData.ongoing_card || '--' }}
                        </span>
                      </p>
                    </dd>
                    <dt>
                      <StarIcon />
                      習熟度
                    </dt>
                    <dd>
                      <span class="txtSpan02">
                        {{ userInfo.skill_lb || '--' }}
                      </span>
                    </dd>
                  </dl>
                </div>
              </div>
              <div class="comLink lectureLink bg-btn">
                <router-link :to="{ name: 'SelectLesson' }">
                  講義を受ける
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="comBox">
          <ul class="linkUl">
            <li class="bg-btn">
              <router-link :to="{ name: 'About' }">会社概要</router-link>
            </li>
            <li class="bg-btn">
              <router-link :to="{ name: 'TransactionsLaw' }">
                特定商取引法に基づく表記
              </router-link>
            </li>
            <li class="bg-btn">
              <router-link :to="{ name: 'PrivacyPolicy' }">
                プライバシーポリシー
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <AppModal ref="changePointModalRef">
      <div class="popBox popBox02" id="pop02">
        <VeeForm @submit="onChangeGoal">
          <div class="subPop">
            <p>ゴールポイント設定</p>
            <div class="selectBox">
              <VeeField
                name="goal"
                as="select"
                rules="required"
                v-model="goalId"
                label="ゴールポイント"
              >
                <option
                  v-for="goal in goalsList"
                  :key="goal.goal_id"
                  :value="goal.goal_id"
                >
                  {{ $formatNumber(goal.points, NUMBER_EN_US_FORMAT) }}pt
                </option>
              </VeeField>
              <ErrorMessage class="error-message" name="goal" />
            </div>
            <ul class="submit bg-btn">
              <li>
                <input type="submit" value="保存" />
              </li>
            </ul>
          </div>
        </VeeForm>
      </div>
    </AppModal>
    <AppModal ref="bookingModalRef">
      <div class="popBox popBox02" id="pop">
        <div class="subPop">
          <p>予約変更の依頼をしますか?</p>
          <p class="popTxt">次回の予約</p>
          <p class="date">
            {{
              $reservationDateTime(
                myReservation[0]?.slot_start_time,
                'year'
              )
            }}
            <span class="num">
              {{
                $reservationDateTime(
                  myReservation[0]?.slot_start_time,
                  'month'
                )
              }} </span
            ><small>(月)</small>
            <span class="txtSpan">
              {{
                $reservationDateTime(
                  myReservation[0]?.slot_start_time,
                  'hours'
                )
              }}
              -{{
                $reservationDateTime(
                  myReservation[0]?.slot_end_time,
                  'hours'
                )
              }}</span
            >
          </p>
          <ul class="comUl">
            <li class="back">
              <div class="btn-modal closeBtn bg-btn" @click="closeBookingModal">
                いいえ
              </div>
            </li>
            <li>
              <div class="btn-modal bg-btn" @click="onChangeReservation">
                はい
              </div>
            </li>
          </ul>
        </div>
      </div>
    </AppModal>
  </div>

  <app-modal class="a-modal-full" ref="allowAutoPlayRef">
    <h3>受講する前に、下記手順により自動再生をご許可ください。</h3>
    <ol>
      <li>1.【Safari】を選択</li>
      <li>2.【このWebサイトでの設定...】を選択</li>
      <li>3.「自動再生: 」で【すべてのメディアを自動再生】を選択</li>
    </ol>
  </app-modal>
</template>
<script setup>
import CharIcon from '@/components/Icons/CharIcon';
import StarIcon from '@/components/Icons/StarIcon';
import VideoOverviewIcon from '@/components/Icons/VideoOverviewIcon';
import { computed, inject, onMounted, ref, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import {
  NOTIFY_TYPE,
  NUMBER_EN_US_FORMAT,
  SHOWED_GUIDE_AUTOPLAY,
  SUBSCRIPTION_TYPE_COURSE,
  SUBSCRIPTION_TYPE_ONLINE
} from '@/constants/common';
import { BACKEND_CODE, MESSAGES } from '@/constants/messages';
import AppModal from '@/components/AppModal';

const isMobile = ref(false);
const store = useStore();
const userInfo = computed(() => store.getters['user/userInfo']);
const currentPercent = computed(() => {
  if (!userInfo.value.goal_points) {
    return 0;
  }
  return (userInfo.value.point_balance / userInfo.value.goal_points) * 100;
});
const homeData = computed(() => store.getters['user/homeData']);
const myReservationList = computed(
  () => store.getters['reservation/myReservationList']
);
let myReservationListActive = reactive([]);
const mySubscription = computed(
  () => store.getters['subscription/mySubscriptionList']
);
const subscriptionTypeCourse = computed(() =>
  mySubscription.value.filter((item) => item.type === SUBSCRIPTION_TYPE_COURSE)
);
const subscriptionTypeOnlineCourse = computed(() =>
  mySubscription.value.filter((item) => item.type === SUBSCRIPTION_TYPE_ONLINE)
);
const goalsList = computed(() => store.getters['user/goalList']);

const isMacSafari =
  /Mac/.test(navigator.platform) && window.safari !== undefined;

const allowAutoPlayRef = ref({});
const goalId = ref(null);
const $toast = inject('$toast');
const bookingModalRef = ref();
const changePointModalRef = ref();
const diameter = ref(210);

onMounted(async () => {
  if (!localStorage.getItem(SHOWED_GUIDE_AUTOPLAY) && isMacSafari) {
    allowAutoPlayRef.value.openModal();
    localStorage.setItem(SHOWED_GUIDE_AUTOPLAY, 1);
  }

  await store.dispatch('user/actGetHomeData');
  const innerWidth = window.innerWidth;
  if (innerWidth < 897) {
    isMobile.value = true;
    diameter.value = 170;
  }
  await store.dispatch('loading/actSetLoading', true);
  await store.dispatch('user/actionGetUserInfo');
  await store.dispatch('user/actGetGoals');
  const reservationParams = {
    page: 1,
    per_page: 10
  };
  await store.dispatch(
    'reservation/actGetMyReservationList',
    reservationParams
  );
  await store.dispatch('subscription/actGetMySubscriptionList');
  goalId.value = userInfo.value.goal_id;
  await store.dispatch('loading/actSetLoading', false);
});

const myReservation = computed(() => {
  const today = new Date();
  return myReservationList.value.filter(
    (item) => item.status !== 3 && new Date(item.slot_start_time).getTime() >= today.getTime()
  )?.sort((a, b) => new Date(a.slot_start_time).getTime() - new Date(b.slot_start_time).getTime())
})

const openBookingModal = () => {
  bookingModalRef.value.openModal();
};

const closeBookingModal = () => {
  bookingModalRef.value.closeModal();
};
const openChangePointModal = () => {
  changePointModalRef.value.openModal();
};

const closeChangePointModal = () => {
  changePointModalRef.value.closeModal();
};

const onChangeReservation = () => {
  store.dispatch('loading/actSetLoading', true);
  const body = {
    user_id: myReservationListActive.value[0].user_reservation_id
  };
  store
    .dispatch('reservation/actChangeReservation', body)
    .then(async () => {
      $toast(NOTIFY_TYPE[0], MESSAGES.BOOKING_SUCCESS);
      store.commit('user/setIsRequest', true);
      await store.dispatch('user/actionGetUserInfo');
    })
    .catch((exception) => {
      if (exception?.response?.data?.error?.code) {
        const message = BACKEND_CODE.filter(
          (item) => item.key === exception.response.data.error.code
        );
        $toast(NOTIFY_TYPE[1], message[0].value);
      } else {
        $toast(NOTIFY_TYPE[1], MESSAGES.BOOKING_FAIL);
      }
    })
    .finally(() => {
      closeBookingModal();
      store.dispatch('loading/actSetLoading', false);
    });
};
const onChangeGoal = () => {
  store.dispatch('loading/actSetLoading', true);
  const body = {
    goal_id: goalId.value
  };
  store
    .dispatch('user/actChangeGoal', body)
    .then(async () => {
      $toast(NOTIFY_TYPE[0], MESSAGES.CHANGE_GOAL_SUCCESS);
      await store.dispatch('user/actionGetUserInfo');
    })
    .catch((exception) => {
      if (exception?.response?.data?.error?.code) {
        const message = BACKEND_CODE.filter(
          (item) => item.key === exception.response.data.error.code
        );
        $toast(NOTIFY_TYPE[1], message[0].value);
      } else {
        $toast(NOTIFY_TYPE[1], MESSAGES.CHANGE_GOAL_FAIL);
      }
    })
    .finally(() => {
      closeChangePointModal();
      store.dispatch('loading/actSetLoading', false);
    });
};
</script>
<style>
.pBox {
  z-index: 2;
}

.statusBox {
  position: relative;
}
</style>
