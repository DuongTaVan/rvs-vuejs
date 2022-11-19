import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.VUE_APP_SUBSCRIPTION_KEY_1,
  process.env.VUE_APP_REGION
);

speechConfig.speechRecognitionLanguage = process.env.VUE_APP_LANGUAGE;
let audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();

// let recognition = new sdk.SpeechRecognizer(speechConfig, audioConfig);
// export default recognition;

export default {
  speechConfig,
  audioConfig
};
