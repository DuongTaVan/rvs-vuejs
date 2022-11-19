import service from '@/plugins/axios';
import * as api from '@/api/lecture';

export const state = {
  outOf25Minutes: false,
  outOf40Minutes: false,
  lessons: [],
  lecture: {},
  lectureList: [],
  videoLessonStart: {
    video_lesson_try_id: 1
  },
  videoLessonPractice: {},
  videoLesson: {},
  videoQuestion: {},
  practiceResult: false,
  reflexAnswer: {},
  micIconColor: '#ccc',
  currentCardName: '',
  isAccessFromScreen: false
};
export const getters = {
  getOutOf25Minutes: (state) => state.outOf25Minutes,
  getOutOf40Minutes: (state) => state.outOf40Minutes,
  lessons: (state) => state.lessons,
  lecture: (state) => state.lecture,
  lectureList: (state) => state.lectureList,
  videoLessonStart: (state) => state.videoLessonStart,
  videoLessonPractice: (state) => state.videoLessonPractice,
  videoLesson: (state) => state.videoLesson,
  videoQuestion: (state) => state.videoQuestion,
  practiceResult: (state) => state.practiceResult,
  reflexAnswer: (state) => state.reflexAnswer,
  micIconColor: (state) => state.micIconColor,
  currentCardName: (state) => state.currentCardName,
  isAccessFromScreen: (state) => state.isAccessFromScreen
};
export const mutations = {
  setOutOf25Minutes(state, data) {
    state.outOf25Minutes = data;
  },
  setOutOf40Minutes(state, data) {
    state.outOf40Minutes = data;
  },
  setLessons(state, data) {
    state.lessons = data;
  },
  setLecture(state, data) {
    state.lecture = data;
  },
  setLectureList(state, levelList) {
    state.lectureList = levelList;
  },
  setVideoLessonStart(state, data) {
    state.videoLessonStart = data;
  },
  setVideoLessonPractice(state, data) {
    state.videoLessonPractice = data;
  },
  videoLesson(state, data) {
    state.videoLesson = data;
  },
  SET_VIDEO_QUESTION(state, data) {
    state.videoQuestion = data;
  },
  setPracticeResult(state, data) {
    state.practiceResult = data;
  },

  SET_REFLEX_ANSWER(state, data) {
    state.reflexAnswer = data;
  },
  setMicIconColor(state, data) {
    state.micIconColor = data;
  },
  setCurrentCardName(state, data) {
    state.currentCardName = data;
  },
  setIsAccessFromScreen(state, data) {
    state.isAccessFromScreen = data;
  }
};
export const actions = {
  actSetOutOf25Minutes({ commit }, data) {
    commit('setOutOf25Minutes', data);
  },
  actSetOutOf40Minutes({ commit }, data) {
    commit('setOutOf40Minutes', data);
  },
  async actGetLessons({ commit }, params) {
    await service({
      url: api.LESSON_LIST,
      method: 'GET',
      params
    })
      .then((res) => {
        commit('setLessons', res);
      })
      .catch((err) => {
        throw err;
      });
  },
  async getLectureList({ commit }, params) {
    let urlApi = api.LEVELS;
    if (params.route_name === 'grammar') {
      urlApi = api.GRAMMARS;
    }
    await service({
      url: urlApi,
      method: 'GET'
    }).then((response) => {
      commit('setLectureList', response);
    });
  },
  async actGetLecture({ commit }, params) {
    commit('setLecture', {});
    await service({
      url: api.LECTURE_VIDEO(params.id),
      method: 'GET'
    })
      .then((res) => {
        commit('setLecture', res);
      })
      .catch((err) => {
        throw err;
      });
  },
  async actGetVideoLessonStart({ commit }, params) {
    commit('setVideoLessonStart', {});
    await service({
      url: api.VIDEO_LESSON_START(params.id),
      method: 'POST'
    })
      .then((res) => {
        commit('setVideoLessonStart', res);
      })
      .catch((err) => {
        throw err;
      });
  },
  async actGetVideoLessonPractice({ commit }, params) {
    commit('setVideoLessonPractice', {});
    await service({
      url: api.VIDEO_LESSON_PRACTICE(params.id),
      method: 'GET'
    })
      .then((res) => {
        commit('setVideoLessonPractice', res);
      })
      .catch((err) => {
        throw err;
      });
  },
  async actGetVideoLessonPracticeSubmit({ commit }, body) {
    await service({
      url: api.VIDEO_LESSON_PRACTICE_SUBMIT(body.id, body.reflex_try_id),
      method: 'POST',
      data: {
        answer: body.answer
      }
    })
      .then((res) => {
        commit('setPracticeResult', res);
      })
      .catch((err) => {
        throw err;
      });
  },
  async actGetVideoLessonPracticeEnd(_, body) {
    await service({
      url: api.VIDEO_LESSON_PRACTICE_END(body.id),
      method: 'POST',
      body
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        throw err;
      });
  },
  async actGetVideoLessonPracticeSelfOk(_, body) {
    await service({
      url: api.VIDEO_LESSON_PRACTICE_SELF_OK(body.id, body.reflex_try_id),
      method: 'POST'
    })
      .then((res) => {})
      .catch((err) => {
        throw err;
      });
  },

  async actionGetVideoLesson({ commit }, params) {
    commit('videoLesson', {});
    await service({
      url: api.VIDEO_LESSON(params.id),
      method: 'GET'
    })
      .then((res) => {
        commit('videoLesson', res);
      })
      .catch((err) => {
        throw err;
      });
  },

  async getVideoQuestion({ commit }, params) {
    commit('SET_VIDEO_QUESTION', {});
    await service({
      url: api.LECTURE_VIDEO_QUESTION(params),
      method: 'GET'
    })
      .then((res) => {
        commit('SET_VIDEO_QUESTION', res);
      })
      .catch((err) => {
        throw err;
      });
  },

  async submitAnswer({ commit }, params) {
    return new Promise((resolve, reject) => {
      service({
        url: api.LECTURE_SUBMIT_ANSWER(params),
        method: 'POST',
        data: {
          answer: params.answer
        }
      })
        .then((res) => {
          commit('SET_REFLEX_ANSWER', res);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  async selfOk(_, params) {
    return new Promise((resolve, reject) => {
      service({
        url: api.LECTURE_SELF_OK(params),
        method: 'POST'
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
};
