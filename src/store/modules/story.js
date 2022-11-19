import service from '@/plugins/axios';
import * as api from '@/api/story';

export const state = {
  storyVideo: {}
};
export const getters = {
  storyVideo: (state) => state.storyVideo,
};
export const mutations = {
  storyVideo(state, data) {
    state.storyVideo = data;
  }
};
export const actions = {
  async getStoryVideo({ commit }, params) {
    commit('storyVideo', {});
    await service({
      url: api.STORY_VIDEO,
      method: 'GET',
      params
    }).then(res => {
      commit('storyVideo', res);
    }).catch(err => {
      throw err;
    });
  }
};
