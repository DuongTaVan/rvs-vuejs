export const LESSON_LIST = '/video-lessons';
export const LECTURE_VIDEO = (id) => `/video-lesson-tries/${id}/training`;
export const LECTURE_VIDEO_QUESTION = ({ id, no }) => {
  if (no) {
    return `/video-lesson-tries/${id}/training/question?no=${no}`;
  }

  return `/video-lesson-tries/${id}/training/question`;
};
export const LECTURE_SUBMIT_ANSWER = ({ videoLessonTryId, reflexTryId }) =>
  `/video-lesson-tries/${videoLessonTryId}/training/question/${reflexTryId}`;

export const LECTURE_SELF_OK = ({ videoLessonTryId, reflexTryId }) =>
  `/video-lesson-tries/${videoLessonTryId}/reflex/${reflexTryId}/self-ok`;

export const LEVELS = '/levels';
export const GRAMMARS = '/grammars';
export const VIDEO_LESSON_START = (id) => `/video-lessons/${id}/start`;
export const VIDEO_LESSON_PRACTICE = (id) =>
  `/video-lesson-tries/${id}/practice`;
export const VIDEO_LESSON_PRACTICE_SUBMIT = (id, reflex_try_id) =>
  `/video-lesson-tries/${id}/training/practice/${reflex_try_id}`;
export const VIDEO_LESSON_PRACTICE_END = (id) =>
  `/video-lesson-tries/${id}/end`;
export const VIDEO_LESSON_PRACTICE_SELF_OK = (id, reflex_try_id) =>
  `/video-lesson-tries/${id}/reflex/${reflex_try_id}/self-ok`;
export const VIDEO_LESSON = (id) => `/video-lesson-tries/${id}/lecture`;
