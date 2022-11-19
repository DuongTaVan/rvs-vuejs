<template>
  <div class="fullView register_credit_card edit_credit_card">
    <div class="comBox">
      <h2 class="headLine01">ご利用中のカード</h2>
      <div class="creditBox">
        <div class="lBox">
          <div class="method">
            <p>
              <span class="methodTxt">{{ creditCard[0]?.brand }}</span
              >末尾が●●●●{{ creditCard[0]?.last4 }}のクレジットカード
            </p>
          </div>
        </div>
        <div class="rBox">
          <form action="./" method="post" class="smlFrom">
            <dl class="formDl">
              <dt>カード番号</dt>
              <dd>
                <div id="card-number-element"></div>
              </dd>
              <dd>
                <ul class="list">
                  <li>
                    <p>有効期限</p>
                    <div id="card-expiry-element"></div>
                  </li>
                  <li class="liStyle">
                    <p>セキュリティコード</p>
                    <div id="card-cvc-element"></div>
                  </li>
                </ul>
              </dd>
            </dl>
            <p class="note">以下のクレジットカード等をご利用いただけます。</p>
            <div class="textImg">
              <img
                src="@/assets/image/common/imgtext02.png"
                alt=""
                width="165"
              />
            </div>
            <ul class="comUl">
              <li class="back bg-btn">
                <router-link
                  :to="{ name: 'PurchasingPlanAfter' }"
                  href="after_register_credit_card.html"
                  >キャンセル
                </router-link>
              </li>
              <li class="bg-btn"><a @click="createCard">保存</a></li>
            </ul>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';
import { mapActions, mapGetters } from 'vuex';
import { NOTIFY_TYPE } from '@/constants/common';
import { BACKEND_CODE } from '@/constants/messages';

export default {
  name: 'CreditCardEdit',
  data() {
    return {
      expiration: '',
      cardNumberElement: null,
      cardExpiryElement: null,
      cardCvcElement: null,
      stripe: null
    };
  },
  async created() {
    await this.actionGetCreditCard();
    this.stripe = await loadStripe(process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY, {
      locale: 'ja'
    });
    let elements = this.stripe.elements();
    let style = {
      base: {
        padding: '0.5px',
        width: '100%',
        color: '#111',
        height: '20px',
        borderRadius: '2px',
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        border: '1px solid',
        borderColor: '#CCC',
        appearance: 'none',
        fontSize: '1rem',
        fontFamily: '"Noto Sans JP", sans-serif',
        '::placeholder': {
          color: '#ccc'
        }
      }
    };
    this.cardNumberElement = elements.create('cardNumber', {
      style: style,
      placeholder: '0000 0000 0000 0000'
    });
    this.cardNumberElement.mount('#card-number-element');

    this.cardExpiryElement = elements.create('cardExpiry', {
      style: style,
      placeholder: 'MM/YY'
    });
    this.cardExpiryElement.mount('#card-expiry-element');

    this.cardCvcElement = elements.create('cardCvc', {
      style: style,
      placeholder: '0000'
    });
    this.cardCvcElement.mount('#card-cvc-element');
  },
  computed: {
    ...mapGetters({
      creditCard: 'card/getCard'
    })
  },
  methods: {
    ...mapActions({
      actionGetCreditCard: 'card/actionGetCreditCard',
      actionEditCreditCard: 'card/actionEditCreditCard',
      actSetLoading: 'loading/actSetLoading'
    }),
    async createCard(e) {
      e.preventDefault();
      await this.actSetLoading(true);
      this.stripe
        .createToken(this.cardNumberElement)
        .then((result) => {
          if (result.error) {
            this.$toast(NOTIFY_TYPE[1], result.error.message);
          } else {
            let params = {
              str_card_id:
                (this.creditCard.length && this.creditCard[0].str_card_id) ||
                '',
              token: {
                source: result.token.id
              }
            };
            this.actionEditCreditCard(params)
              .then(() => {
                this.$router.push({ name: 'PurchasingPlanAfter' });
              })
              .catch((err) => {
                const errorCode = err.response.data?.error?.code;
                const error = BACKEND_CODE.find(
                  (item) => item.key === errorCode
                );
                this.$toast(
                  NOTIFY_TYPE[1],
                  error.value ?? BACKEND_CODE[16].value
                );
              });
          }
          this.actSetLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
};
</script>
