import { NOTIFY_TYPE, NUMBER_EN_US_FORMAT } from '@/constants/common';
import store from '@/store';
import azure from '@/plugins/azure';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

const AppFunctions = {
  install(app) {
    const App = app.config.globalProperties;
    App.$formatNumber = (num, type = null) => {
      if (!num) return 0;
      if (type === NUMBER_EN_US_FORMAT) {
        return new Intl.NumberFormat('en-US', {
          style: 'decimal',
          maximumFractionDigits: 20
        }).format(num);
      }
      return parseFloat(num);
    };

    App.$toast = (type = 'success', message) => {
      if (!message) return false;
      store.commit('notification/setIsNotifyCation', true);
      store.commit('notification/setType', type);
      store.commit('notification/setMessage', message);
      return true;
    };

    App.$reservationDateTime = (dateTime, type = 'year') => {
      if (!dateTime) return;
      dateTime = dateTime.replace(/-/g, '/');
      // dateTime += ' UTC';
      dateTime = new Date(dateTime);
      switch (type) {
        case 'year':
          return dateTime.getFullYear();
        case 'month':
          return `${dateTime.getMonth() + 1}.${dateTime.getDate()}`;
        case 'hours':
          return `${
            dateTime.getHours() >= 10
              ? dateTime.getHours()
              : `0${dateTime.getHours()}`
          }
            :${
              dateTime.getMinutes() >= 10
                ? dateTime.getMinutes()
                : `0${dateTime.getMinutes()}`
            }`;
        default:
          return dateTime.toString();
      }
    };

    App.$formatDateTime = (dateTime) => {
      if (!dateTime) return;
      dateTime = new Date(dateTime);
      const year =
        dateTime.getFullYear() >= 10
          ? dateTime.getFullYear()
          : `0${dateTime.getFullYear()}`;
      const month =
        dateTime.getMonth() + 1 >= 10
          ? dateTime.getMonth() + 1
          : `0${dateTime.getMonth() + 1}`;
      const date =
        dateTime.getDate() >= 10
          ? dateTime.getDate()
          : `0${dateTime.getDate()}`;
      const hours =
        dateTime.getHours() >= 10
          ? dateTime.getHours()
          : `0${dateTime.getHours()}`;
      const minutes =
        dateTime.getMinutes() >= 10
          ? dateTime.getMinutes()
          : `0${dateTime.getMinutes()}`;
      const seconds =
        dateTime.getSeconds() >= 10
          ? dateTime.getSeconds()
          : `0${dateTime.getSeconds()}`;
      return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    };

    /**
     * Recognition once
     */
    App.$startRecognizeOnce = () =>
      new Promise((resolve, reject) => {
        let recognition = new sdk.SpeechRecognizer(
          azure.speechConfig,
          azure.audioConfig
        );

        recognition.recognizeOnceAsync(
          function (successfulResult) {
            let result = successfulResult.privText || '';
            resolve(result);
            store.commit('lecture/setMicIconColor', '#3F6AC8');
          },
          function (err) {
            reject(err);
            store.commit('notification/setIsNotifyCation', true);
            store.commit('notification/setType', NOTIFY_TYPE[1]);
            store.commit('notification/setMessage', err);
            store.commit('lecture/setMicIconColor', '#ccc');
          }
        );
      });

    /**
     * Continuous recognition
     */
    App.$continuousRecognition = () =>
      new Promise((resolve, reject) => {
        let recognition = new sdk.SpeechRecognizer(
          azure.speechConfig,
          azure.audioConfig
        );
        let timeId = null;
        recognition.startContinuousRecognitionAsync(
          () => {
            console.log('say something....');
            store.commit('lecture/setMicIconColor', '#3F6AC8');
          },
          (err) => {
            reject(err);
            store.commit('notification/setIsNotifyCation', true);
            store.commit('notification/setType', NOTIFY_TYPE[1]);
            store.commit('notification/setMessage', err);
            store.commit('lecture/setMicIconColor', '#ccc');
          }
        );

        /**
         * Get result recognition
         */
        recognition.recognized = (s, e) => {
          if (e.result.text && e.result.text !== undefined) {
            resolve(
              e.result.text.toLowerCase().substring(0, e.result.text.length - 1)
            );
          }

          timeId = setTimeout(function () {
            if (recognition) {
              recognition.stopContinuousRecognitionAsync(
                function () {
                  console.log('recognition close');
                  recognition.close();
                  recognition = undefined;
                  store.commit('lecture/setMicIconColor', '#ccc');
                },
                function (err) {
                  console.log(`error recognition close: ${err}`);
                  recognition.close();
                  recognition = undefined;
                  store.commit('lecture/setMicIconColor', '#ccc');
                }
              );
            }
          }, 2000);
        };

        recognition.recognizing = () => {
          if (timeId) {
            clearTimeout(timeId);
          }
          timeId = null;
        };
      });

    Object.keys(App).forEach((properties) => {
      app.provide(properties, App[properties]);
    });
  }
};

export default AppFunctions;
