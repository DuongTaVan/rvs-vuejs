const speechToText = (function () {
  /**
   * Audio Input function.
   *
   */
  function speechToTextFun() {
    this.AudioInput = function (callback) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      /**
       * Sets the language of the recognition.
       */
      recognition.lang = 'en-US';
      /**
       * Defines whether the speech recognition 
       * system should return interim results, or just final results.
       */
      recognition.interimResults = false;
      /**
       * Sets the number of alternative 
       * potential matches that should be returned per result.
       * This can sometimes be useful,
       * say if a result is not completely clear and 
       * you want to display a list if alternatives 
       * for the user to choose the correct one from.
       */
      recognition.maxAlternatives = 1;
      /**
       * Controls whether continuous results are captured (true), 
       * or just a single result each time recognition is started.
       */
      recognition.continuous = true;
      recognition.start();
      this.ResultText(recognition, callback);
      this.ResultStop(recognition);
      this.ResultError(recognition);
    };

    /**
     * Result text.
     *
     * @param recognition
     * @constructor
     */
    this.ResultText = function (recognition, callback) {
      let text = '';
      recognition.onresult = function (event) {
        console.log(event, event.results);
        text = event.results[0][0].transcript;
        console.log(text);
        callback(text);
      };
    };

    /**
     * Result stop.
     *
     * @param recognition
     * @constructor
     */
    this.ResultStop = function (recognition) {
      recognition.onnomatch = function () {
        console.log('I didn\'t recognize that color.');
      };
    };

    /**
     * Result error.
     *
     * @param recognition
     * @constructor
     */
    this.ResultError = function (recognition) {
      recognition.onerror = function (event) {
        console.log(`Error occurred in recognition: ${event.error}`);
      };
    };
  }

  return speechToTextFun;
})();

export default speechToText;
