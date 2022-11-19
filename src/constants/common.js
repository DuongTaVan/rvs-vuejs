export const ACCESS_TOKEN = 'access_token';
export const REFRESH_TOKEN = 'refresh_token';
export const CLIENT_SECRET = 'client_secret';
export const SUBSCRIPTION_ID = 'subscription_id';
export const NUMBER_EN_US_FORMAT = 'en-US';
export const SUBSCRIPTION_TYPE_COURSE = 1;
export const SUBSCRIPTION_TYPE_ONLINE = 2;
export const GENDERS = [
  { value: '男性', key: 1 },
  { value: '女性', key: 2 },
  { value: 'その他', key: 9 }
];
export const SKILLS = [
  { value: 'Beginner', key: 1 },
  { value: 'UpperBeginner', key: 2 },
  { value: 'Beginner-Intermediate', key: 3 },
  { value: 'Intermediate', key: 4 }
];
export const USER_TYPES = [1, 2];
export const ACCEPT_BACK_ROUTE_NAME = ['PrivacyPolicy'];
export const NOT_ACCEPT_BACK_ROUTE_NAME = [
  'Home',
  'StoryChoose',
  'StoryVideo',
  'JapaneseCard',
  'Lecture',
  'Reflex',
  'PracticeVideo',
  'SelectLesson',
  'MyAccount'
];
export const MY_RESERVATION_STATUS = [
  {
    key: 1,
    value: 'Tentative'
  },
  {
    key: 2,
    value: 'Confirmed'
  },
  {
    key: 3,
    value: 'Canceled'
  }
];

export const STATUS_CARD_COLOR = [
  {
    status: '受講中',
    class: 'txtSpan'
  },
  {
    status: '完了',
    class: 'txtSpan02'
  },
  {
    status: '未受講',
    class: 'txtSpan03'
  }
];
export const LANGUAGES = [
  { key: 'non', value: '字幕なし' },
  { key: 'ja', value: '日本語' },
  { key: 'en', value: 'English' }
];
export const STAGE_LESSON = ['japanese', 'lecture', 'training', 'practice'];
export const MENU_MODULE = ['Home', 'Video', 'User'];
export const LESSONS = [
  { key: 1, value: 'off' },
  { key: 2, value: 'onl' }
];
export const PLAN_TYPE = [
  { key: 1, value: 'Video lesson', title: 'RVSサブスクコース' },
  { key: 2, value: 'Online lesson', title: 'RVSオンラインレッスンコース' }
];
export const PRACTICE_RESULT_STATUS_CORRECT = 1;
export const NOTIFY_TYPE = ['success', 'error'];

export const ERROR_CODES = ['ACCOUNT_CANNOT_BE_REGISTERED'];

export const FORMAT_DATE = 'YYYY/MM/DD';
export const PLAN_ROUTES = ['PurchasingPlan', 'ConfirmPurchasingPlan'];

export const STRIPE_INVOICE_STATUS = [
  'draft',
  'open',
  'paid',
  'void',
  'uncollectible'
];
export const LESSON_CHECK_MINUTE_ROUTER = [
  'JapaneseCard',
  'Lecture',
  'Reflex',
  'ReflexTryAgain',
  'ReflexAfterTryAgain',
  'PracticeVideo'
];
export const CANCEL_PLAN_ROUTES = ['CancelPlan'];

export const REFLEX_STAGES = [
  'reflex',
  'try_again',
  'after_try_again',
  'very_good'
];

export const MIC_PERMISSION = 'mic-permission';

export const SHOWED_GUIDE_AUTOPLAY = 'SHOWED_GUIDE_AUTOPLAY';
