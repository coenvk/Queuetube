import ApiService from '@/common/api.service'

import {
    ADD_ROOM_IF_HOSTED,
    CLEAR_CURRENT_VIDEO,
    FETCH_CURRENT_VIDEO,
    FETCH_NEXT_VIDEO,
    FETCH_PLAYLIST,
    POP_PLAYLIST,
    PUSH_PLAYLIST,
    REORDER_PLAYLIST
} from './actions.type'

import {
    ADD_TO_PLAYLIST, CLEAR_ERROR,
    REMOVE_FROM_PLAYLIST,
    REORDER_PLAYLIST_ITEM,
    SET_CURRENT_VIDEO,
    SET_ERROR,
    SET_PLAYLIST,
    SET_ROOM_NAME
} from './mutations.type'

const state = {
    playlist: [],
    currentVideo: null,
    roomName: null,
}

const getters = {
    playlist(state) {
        return state.playlist
    },
    currentVideo(state) {
        return state.currentVideo
    },
    roomName(state) {
        return state.roomName
    }
}

const actions = {
    [FETCH_PLAYLIST](context) {
        ApiService.get(`queuetube/playlist`).then(response => {
            context.commit(SET_PLAYLIST, {playlist: response.data.playlist})
        }).catch(error => {
            context.commit(`error/${SET_ERROR}`, {error: error})
        })
    },
    [FETCH_CURRENT_VIDEO](context) {
        ApiService.get(`queuetube/currentVideo`).then(response => {
            context.commit(SET_CURRENT_VIDEO, {currentVideo: response.data.currentVideo})
        }).catch(error => {
            context.commit(`error/${SET_ERROR}`, {error: error})
        })
    },
    [FETCH_NEXT_VIDEO](context, {oldStartTime}) {
        ApiService.get(`queuetube/nextVideo/${oldStartTime}`).then(response => {
            context.commit(SET_PLAYLIST, {playlist: response.data.playlist})
            context.commit(SET_CURRENT_VIDEO, {currentVideo: response.data.currentVideo})
        }).catch(error => {
            context.commit(`error/${SET_ERROR}`, {error: error})
        })
    },
    [PUSH_PLAYLIST](context, {video}) {
        ApiService.put(`queuetube/playlist`, {video: video}).then(response => {
            context.commit(SET_PLAYLIST, {playlist: response.data.playlist})
            context.commit(SET_CURRENT_VIDEO, {currentVideo: response.data.currentVideo})
        }).catch(error => {
            context.commit(`error/${SET_ERROR}`, {error: error})
        })
    },
    [POP_PLAYLIST](context, {index}) {
        ApiService.delete(`queuetube/playlist/${index}`).then(response => {
            context.commit(SET_PLAYLIST, {playlist: response.data.playlist})
        }).catch(error => {
            context.commit(`error/${SET_ERROR}`, {error: error})
        })
    },
    [REORDER_PLAYLIST](context, {oldIndex, newIndex}) {
        ApiService.put(`queuetube/playlist/${oldIndex}`, {newIndex: newIndex}).then(response => {
            context.commit(SET_PLAYLIST, {playlist: response.data.playlist})
        }).catch(error => {
            context.commit(`error/${SET_ERROR}`, {error: error})
        })
    },
    [CLEAR_CURRENT_VIDEO](context) {
        ApiService.delete(`queuetube/currentVideo`).then(response => {
            context.commit(SET_CURRENT_VIDEO, {currentVideo: response.data.currentVideo})
        }).catch(error => {
            context.commit(`error/${SET_ERROR}`, {error: error})
        })
    },
    [ADD_ROOM_IF_HOSTED](context, {roomName, hosting}) {
        ApiService.put(`queuetube`, {roomName: roomName, hosting: hosting}).then(response => {
            context.commit(SET_ROOM_NAME, {roomName: roomName})
            context.commit(`error/${CLEAR_ERROR}`)
        }).catch(error => {
            context.commit(`error/${SET_ERROR}`, {error: error})
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
        state.playlist.splice(index, 1)
    },
    [REORDER_PLAYLIST_ITEM](state, {video, index}) {
        state.playlist = state.playlist.filter(item => {
            return item.id.videoId !== video.id.videoId
        })
        state.playlist.splice(index, 0, video)
    },
    [SET_ROOM_NAME](state, {roomName}) {
        state.roomName = roomName;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
