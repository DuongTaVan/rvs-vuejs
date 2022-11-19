<template>
  <div class="fullView fullView02 purchasing_plan">
    <div class="comBox">
      <h2>購入するプラン選んでください</h2>
      <p>{{ planType?.title || '' }}</p>
      <div class="purchasingSelect">
        <form>
          <select
            class="priceselect"
            @change="choosePurchase"
            v-model="strPriceId"
          >
            <option value="" data-price="0">--</option>
            <option
              v-for="(plan, index) in plans"
              :value="plan.str_price_id"
              :data-price="plan.price"
              :key="index"
            >
              {{ plan.name }}
            </option>
          </select>
        </form>
        <span class="priceSpan">
          <span class="yen-sign">¥</span>
          {{ price }}
        </span>
      </div>
      <ul class="comUl">
        <li class="back bg-btn">
          <router-link :to="{ name: 'PurchasingPlanAfter' }"
            >キャンセル
          </router-link>
        </li>
        <li class="bg-btn">
          <button
            class="btn-submit"
            :disabled="!strPriceId"
            @click="handledPurchase"
          >
            確認画面
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { BACKEND_CODE } from '@/constants/messages';
import {
  NOTIFY_TYPE,
  NUMBER_EN_US_FORMAT,
  PLAN_TYPE,
  STRIPE_INVOICE_STATUS,
} from '@/constants/common';
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
});
instance.defaults.headers.common[
  'Authorization'
] = `Bearer ${process.env.VUE_APP_STRIPE_SECRET_KEY}`;

export default {
  name: 'PurchasingPlan',
  data() {
    return {
      price: 0,
      strPriceId: '',
      priceArray: [],
      myInvoices: [],
      activeInvoice: [],
      purchasingType: null,
      resetData: false,
    };
  },
  async created() {
    this.purchasingType = this.$route.params.type;
    await this.getPurchasingPlan({
      type: this.purchasingType,
    });
    this.priceArray = [];

    const { data } = await instance({
      url: `${process.env.VUE_APP_STRIPE_API_URL}/invoices`,
    });
    this.myInvoices = data.data.filter(
      (invoice) => invoice.customer_email === this.user.email
    );

    // filter invoice paid
    const paidInvoices = this.myInvoices.filter(
      (invoice) => invoice.status === STRIPE_INVOICE_STATUS[2]
    );

    // get plan of invoice not cancel_at
    paidInvoices.forEach(async (paidInvoice) => {
      const res = await instance({
        url: `${process.env.VUE_APP_STRIPE_API_URL}/subscriptions/${paidInvoice?.subscription}`,
      });

      if (!res.data?.cancel_at) {
        this.activeInvoice.push(paidInvoice?.lines?.data[0]?.plan?.id);
      }
    });

    await this.$store.dispatch('subscription/actGetMySubscriptionList');
  },

  computed: {
    ...mapGetters({
      plans: 'purchase/purchasingPlan',
      selectedPurchase: 'purchase/selectedPurchase',
      subscription: 'subscription/subscription',
      user: 'user/userInfo',
      mySubscriptionList: 'subscription/mySubscriptionList',
    }),

    planType() {
      return PLAN_TYPE.find(
        (item) => item.key === parseInt(this.purchasingType)
      );
    },

    priceList() {
      return this.plans?.map((item) => item.str_price_id);
    },
  },

  watch: {
    // reset price and priceId when change type
    purchasingType() {
      this.price = 0;
      this.strPriceId = '';
    },

    mySubscriptionList(newVal) {
      if (newVal.length === 0) return false;

      const boughtPlan = newVal.find(
        (item) => parseInt(item.type) === parseInt(this.purchasingType)
      );

      if (boughtPlan) {
        this.$router.push({ name: 'PurchasingPlanAfter' });
      }
    },
  },

  mounted() {
    if (
      this.selectedPurchase?.str_price_id &&
      this.selectedPurchase?.type === parseInt(this.purchasingType) &&
      !this.resetData
    ) {
      this.strPriceId = this.selectedPurchase?.str_price_id;
      this.price = this.$formatNumber(
        this.selectedPurchase.price,
        NUMBER_EN_US_FORMAT
      );
      this.resetData = false;
    }
  },

  methods: {
    ...mapActions({
      getPurchasingPlan: 'purchase/getPurchasingPlan',
      createSubscription: 'purchase/createSubscription',
    }),
    choosePurchase() {
      this.priceArray = this.plans.filter(
        (item) => item.str_price_id === this.strPriceId
      );
      this.$store.commit('purchase/SET_SELECTED_PURCHASE', this.priceArray[0]);

      this.priceArray.length > 0
        ? (this.price = this.priceArray[0].price
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
        : (this.price = 0);
    },
    async handledPurchase() {
      // if not back from confirm page then create subscription
      if (this.strPriceId !== this.subscription?.plan?.id) {
        await this.$store.dispatch('loading/actSetLoading', true);
        await this.createSubscription({ str_price_id: this.strPriceId })
          .then(() => {
            if (this.priceArray.length) {
              this.$store.commit(
                'notification/setPageSubTitle',
                this.priceArray[0].name
              );
            }
            this.$router.push({
              name: 'ConfirmPurchasingPlan',
              type: this.$route.params.type,
            });
          })
          .catch((err) => {
            const errorCode = err.response?.data?.error?.code || '';
            if (errorCode) {
              const myError = BACKEND_CODE.find(
                (code) => code.key === errorCode
              );
              this.$store.commit('notification/setIsNotifyCation', true);
              this.$store.commit('notification/setType', NOTIFY_TYPE[1]);
              this.$store.commit(
                'notification/setMessage',
                myError?.value || ''
              );
            }
          })
          .finally(async () => {
            await this.$store.dispatch('loading/actSetLoading', false);
          });
      } else {
        this.$router.push({
          name: 'ConfirmPurchasingPlan',
          type: this.$route.params.type,
        });
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name === 'PurchasingPlanAfter' && to.name === 'PurchasingPlan') {
        vm.resetData = true;
      }
    });
  },
  beforeRouteLeave(to, from) {
    if (from.name === 'PurchasingPlan' && to.name === 'ConfirmPurchasingPlan') {
      this.resetData = false;
    }
  },
};
</script>
