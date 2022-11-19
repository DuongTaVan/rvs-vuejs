import { ref, reactive, watch } from 'vue';
import store from '@/store';
import azure from '@/plugins/azure';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export default function () {
  const answer = ref('');
  const recognitionText = ref('');
  const stoppedRecognition = ref(false);
  const startRecognition = ref(false);
  const recognitionOnce = ref(true);
  const TIME_GET_ANSWER = 5;
  let recognition = reactive({});

  const recognitionContinuous = (timeRecognition = null) => {
    if (timeRecognition) {
      recognitionOnce.value = false;
    }
    stoppedRecognition.value = false;
    recognition = new sdk.SpeechRecognizer(
      azure.speechConfig,
      azure.audioConfig
    );
    let timeId = null;
    let stoppedId = null;
    recognition.startContinuousRecognitionAsync(
      () => {
        console.log('say something....');
        store.commit('lecture/setMicIconColor', '#3F6AC8');
        startRecognition.value = true;
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
        console.log('recognition.recognized', e.result.text);
        answer.value += `${e.result.text} `;
      }

      timeId = setTimeout(function () {
        if (recognition) {
          recognition.stopContinuousRecognitionAsync(
            function () {
              console.log('recognition close');
              recognition.close();
              recognition = undefined;
              store.commit('lecture/setMicIconColor', '#ccc');
              stoppedRecognition.value = true;
              startRecognition.value = false;
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

    recognition.recognizing = (s, e) => {
      recognitionText.value = answer.value + e.result.text;

      if (timeId) {
        clearTimeout(timeId);
      }
      timeId = null;
    };

    recognition.canceled = function (s, e) {
      recognition.stopContinuousRecognitionAsync(
        function () {
          console.log('recognition cancel: stopped');
          recognition.close();
          recognition = undefined;
          stoppedRecognition.value = true;
          startRecognition.value = false;
          store.commit('lecture/setMicIconColor', '#ccc');
        },
        function (err) {
          console.log(`recognition cancel: stopped ${err}`);
          recognition.close();
          recognition = undefined;
          store.commit('lecture/setMicIconColor', '#ccc');
        }
      );
    };

    recognition.sessionStarted = function (s, e) {
      console.log(`SessionId Started: ${e.sessionId}`);
    };

    recognition.sessionStopped = function (s, e) {
      console.log(`SessionId Stopped: ${e.sessionId}`);
    };

    recognition.speechStartDetected = function (s, e) {
      console.log(`SessionId Detected: ${e.sessionId}`);
    };

    recognition.speechEndDetected = function (s, e) {
      console.log(`SessionId Detected: ${e.sessionId}`);
    };

    if (timeRecognition) {
      stoppedId = setTimeout(() => {
        stopRecognition();
      }, timeRecognition * 1000);
    }

    if (stoppedId) {
      clearTimeout(stoppedId);
    }
  };

  /**
   * @param proactive: {Boolean}
   */
  const stopRecognition = (proactive = false) => {
    if (recognition) {
      try {
        recognition.stopContinuousRecognitionAsync(
          () => {
            console.log('recognition close');
            recognition.close();
            recognition = undefined;
            store.commit('lecture/setMicIconColor', '#ccc');
            stoppedRecognition.value = true;
            startRecognition.value = false;
            if (proactive) {
              answer.value = recognitionText.value;
            }
          },
          (err) => {
            recognition.close();
            recognition = undefined;
            reject(err);
            store.commit('notification/setIsNotifyCation', true);
            store.commit('notification/setType', NOTIFY_TYPE[1]);
            store.commit('notification/setMessage', err);
            store.commit('lecture/setMicIconColor', '#ccc');
          }
        );
      } catch {}
    }
  };

  watch(
    () => startRecognition.value,
    (newStart) => {
      if (newStart) {
        setTimeout(() => {
          if (!answer.value && recognitionOnce.value && recognition) {
            recognition.stopContinuousRecognitionAsync(
              function () {
                recognition.close();
                recognition = undefined;
                stoppedRecognition.value = true;
                startRecognition.value = false;
                store.commit('lecture/setMicIconColor', '#ccc');
              },
              function () {
                recognition.close();
                recognition = undefined;
              }
            );
          }
        }, TIME_GET_ANSWER * 1000);
      }
    }
  );

  return {
    answer,
    recognitionText,
    stoppedRecognition,
    startRecognition,
    stopRecognition,
    recognitionContinuous
  };
}
