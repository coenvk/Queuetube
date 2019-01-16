import ApiService from '@/common/api.service'

import {
  CLEAR_CURRENT_VIDEO,
  FETCH_CURRENT_VIDEO,
  FETCH_NEXT_VIDEO,
  FETCH_PLAYLIST,
  POP_PLAYLIST,
  PUSH_PLAYLIST,
  REORDER_PLAYLIST
} from "./actions.type";

import {
  ADD_TO_PLAYLIST,
  REMOVE_FROM_PLAYLIST,
  REORDER_PLAYLIST_ITEM,
  SET_CURRENT_VIDEO,
  SET_PLAYLIST
} from "./mutations.type";

const state = {
  playlist: [],
  currentVideo: null,
}

const getters = {
  playlist(state) {
    return state.playlist;
  },
  currentVideo(state) {
    return state.currentVideo;
  }
}

const actions = {
  [FETCH_PLAYLIST](context) {
    ApiService.get(`youtube/playlist`).then(response => {
      context.commit(SET_PLAYLIST, {playlist: response.data.playlist})
    })
  },
  [FETCH_CURRENT_VIDEO](context) {
    ApiService.get(`youtube/currentVideo`).then(response => {
      context.commit(SET_CURRENT_VIDEO, {currentVideo: response.data.currentVideo})
    })
  },
  [FETCH_NEXT_VIDEO](context, {oldStartTime}) {
    ApiService.get(`youtube/nextVideo/${oldStartTime}`).then(response => {
      context.commit(SET_PLAYLIST, {playlist: response.data.playlist})
      context.commit(SET_CURRENT_VIDEO, {currentVideo: response.data.currentVideo})
    })
  },
  [PUSH_PLAYLIST](context, {video}) {
    ApiService.put(`youtube/playlist`, {video: video}).then(response => {
      context.commit(SET_PLAYLIST, {playlist: response.data.playlist})
      context.commit(SET_CURRENT_VIDEO, {currentVideo: response.data.currentVideo})
    })
  },
  [POP_PLAYLIST](context, {index}) {
    ApiService.delete(`youtube/playlist/${index}`).then(response => {
      context.commit(SET_PLAYLIST, {playlist: response.data.playlist})
    })
  },
  [REORDER_PLAYLIST](context, {oldIndex, newIndex}) {
    ApiService.put(`youtube/playlist/${oldIndex}`, {newIndex: newIndex}).then(response => {
      context.commit(SET_PLAYLIST, {playlist: response.data.playlist})
    })
  },
  [CLEAR_CURRENT_VIDEO](context) {
    ApiService.delete(`youtube/currentVideo`).then(response => {
      context.commit(SET_CURRENT_VIDEO, {currentVideo: response.data.currentVideo})
    })
  }
}

const mutations = {
  [ADD_TO_PLAYLIST](state, {video}) {
    state.playlist.push(video)
  },
  [SET_PLAYLIST](state, {playlist}) {
    state.playlist = playlist
  },
  [SET_CURRENT_VIDEO](state, {currentVideo}) {
    state.currentVideo = currentVideo
  },
  [REMOVE_FROM_PLAYLIST](state, {index}) {
    state.playlist.splice(index, 1);
  },
  [REORDER_PLAYLIST_ITEM](state, {video, index}) {
    state.playlist = state.playlist.filter(item => {
      return item.id.videoId !== video.id.videoId
    })
    state.playlist.splice(index, 0, video);
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
