export const VALIDATIONS = {
  REQUIRED: 'は、必ず指定してください。',
  EMAIL: 'は、有効なメールアドレス形式で指定してください。',
  MIN: 'は、8文字以上にしてください。',
  MIN_VALUE: 'は、8文字以上にしてください。'
};
export const MESSAGES = {
  LOGIN_SUCCESS: 'ログインに成功しました。',
  LOGOUT_SUCCESS: '正常にログアウトしました。',
  LOGIN_FAIL: '到達情報があります。',
  SEND_EMAIL_RESET_PASSWORD_SUCCESS: 'パスワードの変更をリクエストしました。',
  BOOKING_SUCCESS: '予約変更の依頼をしました',
  BOOKING_FAIL: 'Accept Booking Fail',
  CHANGE_GOAL_SUCCESS: 'ゴールが設定できました。',
  CHANGE_GOAL_FAIL: 'Change point Fail',
  REGISTER_FALSE: '登録に失敗しました',
  RESET_PASSWORD_SUCCESS: 'パスワードリセットに成功しました。',
  SEND_EMAIL_RESET_PASSWORD_FAIL: 'アカウントは存在しません。',
  LOGIN_EXPIRES: 'Login session has expired.',
  NO_DATA: 'データが見つかりません。',
  EMAIL_EXISTS: 'このアカウントは登録できません。',
  INVALID_ACCOUNT: 'アカウントまたは、 パスワードが間違っています。',
  URL_EXPIRED: '有効なURLではありません。',
  PAYMENT_PLAN_FAILED: 'プラン購入に失敗しました。',
  PAYMENT_PLAN_SUCCESS: 'プラン購入に成功しました。',
  EN_OUT_OF_30_MINUTES: 'The daily limit to take courses is thirty minutes.',
  JA_OUT_OF_30_MINUTES: 'カードの受講は1日30分までです。',
  CANCEL_PLAN_SUCCESS: 'プラン解約に成功しました。',
  CANCEL_PLAN_FAIL: 'プラン解約に失敗しました。再度お試しください。',
  EDIT_ACCOUNT_SUCCESS: 'アカウント情報を保存しました。',
  FREE_USER_NOTICE: 'カードの受講資格がありません。',
  NO_DATA_STORY: 'ストーリの動画が見つかりませんでした。'
};
export const BACKEND_CODE = [
  {
    id: 1,
    key: 'INVALID_REQUEST',
    value: '不正なリクエストです'
  },
  {
    id: 2,
    key: 'AUTHENTICATION_FAILED',
    value: '認証に失敗しました'
  },
  {
    id: 3,
    key: 'TOKEN_EXPIRED',
    value: '認証トークンの有効期限が切れています'
  },
  {
    id: 4,
    key: 'INVALID_TOKEN',
    value: '認証トークンが無効です'
  },
  {
    id: 5,
    key: 'NOT_AUTHORIZED',
    value: '権限がありません'
  },
  {
    id: 6,
    key: 'NOT_FOUND',
    value: 'リソースが見つかりません'
  },
  {
    id: 7,
    key: 'NO_ACCOUNT',
    value: 'アカウントは存在しません'
  },
  {
    id: 8,
    key: 'NO_DATA',
    value: 'データが存在しません'
  },
  {
    id: 9,
    key: 'METHOD_NOT_ALLOWED',
    value: 'HTTPメソッドが不正です'
  },
  {
    id: 10,
    key: 'DUPLICATE_EXECUTION',
    value: 'この操作はすでに実行されています'
  },
  {
    id: 11,
    key: 'ACCOUNT_CANNOT_BE_REGISTERED',
    value: 'このアカウントは登録できません。'
  },
  {
    id: 12,
    key: 'INVALID_PARAMETERS',
    value: '不正なリクエストです'
  },
  {
    id: 13,
    key: 'LOCK_ACQUISITION_TIMEOUT',
    value: '他のユーザが操作中です'
  },
  {
    id: 14,
    key: 'TOO_MANY_REQUESTS',
    value: '試行回数の上限に達しました。しばらくしてから再度お試しください。'
  },
  {
    id: 15,
    key: 'INTERNAL_ERROR',
    value: '予期せぬエラーが発生しました'
  },
  {
    id: 16,
    key: 'DB_ERROR',
    value: 'データベースエラーが発生しました。'
  },
  {
    id: 17,
    key: 'SETTLEMENT_ERROR',
    value: '決済に失敗しました'
  },
  {
    id: 18,
    key: 'UNDER_MAINTENANCE',
    value: 'ただいまメンテナンス中です'
  },
  {
    id: 19,
    key: 'OVER_CAPACITY',
    value: '一時的にサービスがご利用できません'
  }
];

export const UNREGISTER_INPUT = '登録なし';
