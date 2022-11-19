import { ACCESS_TOKEN } from '@/constants/common';
import { getToken } from '@/utils/token';

export default [
  {
    path: '/',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: {
          requireLogin: true,
          title: 'RVSオンライン英会話',
          module: 'Home'
        }
      },
      {
        path: '/internal-server-error',
        name: 'Error500',
        component: () => import('@/views/Errors/Error500.vue')
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Auth/Login.vue'),
        meta: {
          requireLogin: false,
          title: 'RVSオンライン英会話',
          footer: false
        }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/About.vue'),
        meta: {
          requireLogin: true,
          title: '会社概要',
          module: 'Home'
        }
      },

      {
        path: 'authentication',
        component: {
          template: '<router-view></router-view>'
        },
        meta: {
          title: 'メール認証',
          footer: false
        },
        children: [
          {
            path: '',
            name: 'AuthEmail',
            component: () => import('@/views/Auth/AuthEmail.vue')
          },
          {
            path: 'confirm',
            name: 'AuthEmailConfirm',
            component: () => import('@/views/Auth/AuthEmailConfirm.vue')
          }
        ]
      },

      {
        path: 'sign-up',
        component: {
          template: '<router-view></router-view>'
        },
        meta: {
          footer: false
        },
        children: [
          {
            path: '',
            name: 'RegisterInformation',
            component: () => import('@/views/RegisterInformation.vue'),
            meta: {
              title: '本登録'
            }
          },
          {
            path: 'confirm',
            name: 'RegisterInformationConfirm',
            component: () => import('@/views/RegisterInformationConfirm.vue'),
            meta: {
              title: '本登録'
            }
          }
        ]
      },
      {
        path: 'password-reset',
        name: 'PasswordReset',
        component: () => import('@/views/Auth/PasswordReset.vue'),
        meta: {
          requireLogin: false,
          title: 'パスワードリセット',
          footer: false
        }
      },

      {
        path: 'reset-password',
        name: 'PasswordResetStep1',
        component: () => import('@/views/Auth/PasswordResetStep1.vue'),
        meta: {
          requireLogin: false,
          title: 'パスワードリセット',
          footer: false
        }
      },

      {
        path: ':type/:id/japanese-card/:video_lesson',
        name: 'JapaneseCard',
        component: () => import('@/views/Pages/JapaneseCard'),
        meta: {
          requireLogin: true,
          title: 'Card1',
          subTitle: 'Japanese Card',
          module: 'Video'
        }
      },

      {
        path: 'my-account',
        name: 'MyAccount',
        component: () => import('@/views/Pages/MyAccount'),
        meta: {
          requireLogin: true,
          title: 'マイアカウント',
          module: 'User'
        }
      },

      {
        path: 'edit-account',
        name: 'EditAccount',
        component: () => import('@/views/Pages/EditAccount'),
        meta: {
          requireLogin: true,
          title: 'アカウント編集',
          module: 'User'
        }
      },
      {
        path: ':type/:id/practice/:video_lesson',
        name: 'PracticeVideo',
        component: () => import('@/views/Pages/PracticeVideo'),
        meta: {
          requireLogin: true,
          title: 'Card1',
          subTitle: 'Practice Video',
          module: 'Video'
        }
      },

      {
        path: ':type/:id/card-list',
        name: 'CardList',
        component: () => import('@/views/CardList.vue'),
        meta: {
          requireLogin: true,
          title: 'カード一覧',
          module: 'Video'
        }
      },
      {
        path: ':type/:id/lecture/:video_lesson',
        name: 'Lecture',
        component: () => import('@/views/Pages/Lecture.vue'),
        meta: {
          requireLogin: true,
          title: 'Card1',
          subTitle: 'Lecture Video',
          module: 'Video'
        }
      },
      {
        path: 'subscriptions',
        name: 'PurchasingPlanAfter',
        component: () => import('@/views/Pages/PurchasingPlanAfter.vue'),
        meta: {
          requireLogin: true,
          title: 'プラン詳細',
          module: 'Home'
        }
      },
      {
        path: 'cancel-plan/:type/:id',
        name: 'CancelPlan',
        component: () => import('@/views/Pages/CancelPlan.vue'),
        meta: {
          requireLogin: true,
          title: 'プラン解約',
          subTitle: 'RVSサブスクコース',
          module: 'Home'
        }
      },
      {
        path: 'story-video',
        name: 'StoryChoose',
        component: () => import('@/views/Pages/StoryChoose.vue'),
        meta: {
          requireLogin: true,
          title: 'Story Video',
          module: 'Video'
        }
      },
      {
        path: 'story-video/:subtitle',
        name: 'StoryVideo',
        component: () => import('@/views/Pages/StoryVideo.vue'),
        meta: {
          requireLogin: true,
          title: 'Story Video',
          module: 'Video'
        }
      },
      {
        path: 'purchasing-plan/:type',
        name: 'PurchasingPlan',
        component: () => import('@/views/Pages/PurchasingPlan.vue'),
        meta: {
          requireLogin: true,
          title: 'プラン購入',
          subTitle: 'RVSオンラインレッスンコース',
          module: 'Home'
        }
      },
      {
        path: 'purchasing-plan/:type/confirm-purchasing-plan',
        name: 'ConfirmPurchasingPlan',
        component: () => import('@/views/Pages/ConfirmPurchasingPlan.vue'),
        meta: {
          requireLogin: true,
          title: 'プラン購入',
          module: 'Home'
        }
      },
      {
        path: 'transactions-law',
        name: 'TransactionsLaw',
        component: () => import('@/views/TransactionsLaw.vue'),
        meta: {
          requireLogin: true,
          title: '特定商取引法に基づく表記',
          module: 'Home'
        }
      },
      {
        path: 'privacy-policy',
        name: 'PrivacyPolicy',
        component: () => import('@/views/PrivacyPolicy.vue'),
        meta: {
          requireLogin: false,
          title: 'プライバシーポリシー',
          footer:
            getToken(ACCESS_TOKEN) !== undefined &&
            getToken(ACCESS_TOKEN) !== null,
          module: 'Home'
        }
      },
      {
        path: 'select-lesson',
        name: 'SelectLesson',
        component: () => import('@/views/SelectLesson.vue'),
        meta: {
          requireLogin: true,
          title: '講義選択',
          module: 'Video'
        }
      },
      {
        path: 'levels',
        component: {
          template: '<router-view></router-view>'
        },
        children: [
          {
            path: '',
            name: 'LevelList',
            component: () => import('@/views/LectureList.vue'),
            meta: {
              requireLogin: true,
              title: 'レベル一覧',
              module: 'Video'
            }
          }
        ]
      },
      {
        path: ':type/:id/reflex/:video_lesson',
        component: {
          template: '<router-view></router-view>'
        },
        children: [
          {
            path: '',
            name: 'Reflex',
            component: () => import('@/views/Reflex.vue'),
            meta: {
              requireLogin: true,
              title: '',
              module: 'Video',
              subTitle: 'Reflex'
            }
          }
        ]
      },
      {
        path: 'register-credit-card',
        name: 'CreditCardRegister',
        component: () => import('@/views/CreditCardRegister.vue'),
        meta: {
          requireLogin: true,
          title: 'クレジットカード登録',
          module: 'Home'
        }
      },
      {
        path: 'credit-card-choose',
        name: 'CreditCardChoose',
        component: () => import('@/views/CreditCardChoose.vue'),
        meta: {
          requireLogin: true,
          title: 'プラン詳細',
          module: 'Home'
        }
      },
      {
        path: 'credit-card-edit',
        name: 'CreditCardEdit',
        component: () => import('@/views/CreditCardEdit.vue'),
        meta: {
          requireLogin: true,
          title: 'クレジットカード編集',
          module: 'Home'
        }
      },
      {
        path: 'grammar-list',
        name: 'GrammarList',
        component: () => import('@/views/LectureList.vue'),
        meta: {
          requireLogin: true,
          title: '文法一覧',
          module: 'Video'
        }
      },
      {
        path: ':catchAll(.*)',
        name: 'ErrorPage',
        component: () => import('@/views/Errors/ErrorPage.vue'),
        meta: {
          requireLogin: false,
          title: 'エラー',
          footer:
            getToken(ACCESS_TOKEN) !== undefined &&
            getToken(ACCESS_TOKEN) !== null,
          module: 'Home'
        }
      }
    ]
  },
  {
    path: '/after-login',
    name: 'AfterLogin',
    component: () => import('@/views/AfterLogin'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/test-video-player',
    name: 'VideoPlayerTest',
    component: () => import('@/views/TestVideoPlayer.vue')
  }
];
