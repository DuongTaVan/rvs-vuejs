<template>
  <div class="fullView contracted_plan">
    <div class="index">
      <div class="inner">
        <div class="lBox statusBox">
          <div class="comBox">
            <h2>契約プラン</h2>
            <div class="subStatus">
              <p>RVSサブスクコース</p>
              <div v-if="lessonOff">
                <p class="txt">
                  {{ lessonOff.name }}
                  <span class="price">
                    <span class="yen-sign">¥</span>
                    {{ lessonOff.price }}
                  </span>
                </p>
                <div class="dlBox">
                  <dl class="clearfix">
                    <dt>契約日</dt>
                    <dd>{{ lessonOff.start_date }}</dd>
                    <dt>契約更新日</dt>
                    <dd>{{ lessonOff.current_period_end }}</dd>
                  </dl>
                </div>
                <p class="txt02">
                  合計
                  <span class="price">
                    <span class="yen-sign">¥</span>
                    {{ lessonOff.price }}
                  </span>
                </p>
              </div>
              <p v-else>--</p>
            </div>
            <div class="comLinkP bg-btn" v-if="lessonOff">
              <router-link
                :to="{ name: 'CancelPlan', params: { id: lessonOff.type } }"
                >プラン購入</router-link
              >
            </div>
            <div class="comLink bg-btn" v-else>
              <router-link :to="{ name: 'PurchasingPlan', params: { type: 1 } }"
                >解約手続き</router-link
              >
            </div>
          </div>
          <div class="comBox">
            <h2>契約プラン</h2>
            <div class="subStatus">
              <p>RVSオンラインレッスンコース</p>
              <div v-if="lessonOnl">
                <p class="txt">
                  {{ lessonOnl.name }}
                  <span class="price">
                    <span class="yen-sign">¥</span>
                    {{ lessonOnl.price }}
                  </span>
                </p>
                <div class="dlBox">
                  <dl class="clearfix">
                    <dt>契約日</dt>
                    <dd>{{ lessonOnl.start_date }}</dd>
                    <dt>契約更新日</dt>
                    <dd>{{ lessonOnl.current_period_end }}</dd>
                  </dl>
                </div>
                <p class="txt02">
                  合計
                  <span class="price">
                    <span class="yen-sign">¥</span>
                    {{ lessonOnl.price }}
                  </span>
                </p>
              </div>
              <p v-else>--</p>
            </div>
            <div class="comLinkP bg-btn" v-if="lessonOnl">
              <router-link
                :to="{ name: 'CancelPlan', params: { id: lessonOnl.type } }"
                >プラン購入</router-link
              >
            </div>
            <div class="comLink bg-btn" v-else>
              <router-link :to="{ name: 'PurchasingPlan', params: { type: 2 } }"
                >解約手続き</router-link
              >
            </div>
          </div>
        </div>
        <div class="comBox rBox">
          <h2>支払い方法</h2>
          <div v-if="!card.length" class="method bg-btn">
            <router-link :to="{ name: 'CreditCardRegister' }">
              <p><span class="txtSpan">支払い方法の追加</span></p>
            </router-link>
          </div>
          <div v-else>
            <div class="method method02">
              <p>
                <span class="methodTxt">VISA</span>末尾が●●●●{{
                  card[0]?.last4
                }}のクレジットカード
              </p>
            </div>
            <div class="comLink comLink02 comLink03 bg-btn">
              <router-link :to="{ name: 'CreditCardEdit' }">編集</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { LESSONS } from '@/constants/common';

export default {
  name: 'CreditCardChoose',
  data() {
    return {
      card: '',
      script: '',
      lessonOff: '',
      lessonOnl: '',
    };
  },
  async created() {
    await this.actSetLoading(true);
    await this.actionGetCreditCard();
    this.card = this.creditCard;
    await this.actionSubScriptList();
    this.script = await this.subScript;
    this.lessonOff = await this.lesson(this.script, LESSONS[0].key);
    this.lessonOnl = await this.lesson(this.script, LESSONS[1].key);
    await this.actSetLoading(false);
  },
  computed: {
    ...mapGetters({
      creditCard: 'card/getCard',
      subScript: 'user/subScript',
    }),
  },
  methods: {
    ...mapActions({
      actionGetCreditCard: 'card/actionGetCreditCard',
      actionEditCreditCard: 'card/actionEditCreditCard',
      actionSubScriptList: 'user/actionSubScriptList',
      actSetLoading: 'loading/actSetLoading',
    }),

    /**
     * Lesson
     * Get lesson of every class schedule.
     * 1-online, 2-offline.
     *
     * @param arr
     * @param type
     * @returns {*|string}
     */
    lesson(arr, type) {
      if (!arr) return null;
      let arrayTemp = arr.filter((el) => el.type === type);
      return arrayTemp && arrayTemp.length > 0 ? arrayTemp[0] : null;
    },
  },
};
</script>
