import {
    CLEAR_CURRENT_VIDEO,
    FETCH_CURRENT_VIDEO,
    FETCH_NEXT_VIDEO,
    FETCH_PLAYLIST,
    POP_PLAYLIST,
    PUSH_PLAYLIST,
    REORDER_PLAYLIST
} from './actions.type'

import {
    ADD_TO_PLAYLIST,
    REMOVE_FROM_PLAYLIST,
    REORDER_PLAYLIST_ITEM,
    SET_CURRENT_VIDEO,
    SET_PAUSE_TIME,
    SET_PLAYLIST,
    GET_NEXT_VIDEO
} from './mutations.type'

const axios = require('axios');

const ROOT_URL = 'https://www.googleapis.com/youtube/v3/videos';

function _playNext(state) {
    if (!state.playlist) return new Error("Playlist is undefined!");
    if (state.playlist.length === 0) return new Error("No videos in playlist!");
    const video = state.playlist.splice(0, 1)[0].video;
    const params = {
        id: video.id.videoId,
        part: 'contentDetails',
        key: process.env.VUE_APP_BROWSER_YOUTUBE_API_KEY
    }
    axios.get(ROOT_URL, {params: params}).then(response => {
        let duration = response.data.items[0].contentDetails.duration;
        duration = duration.replace("PT", "")
        const hi = duration.indexOf("H");
        const hours = parseInt(duration.substr(0, hi));
        duration = duration.substr(hi + 1);
        const mi = duration.indexOf("M");
        const minutes = parseInt(duration.substr(0, mi));
        duration = duration.substr(mi + 1);
        const si = duration.indexOf("S");
        const seconds = parseInt(duration.substr(0, si));
        let timeout = 0;
        if (!!seconds) timeout += seconds * 1000;
        if (!!minutes) timeout += minutes * 60000;
        if (!!hours) timeout += hours * 3600000;
        state.currentVideo = {video: video, startTime: new Date().getTime(), duration: timeout};
        // this.timeoutId = setTimeout(this.playNext, timeout);
        return ({queuetube: {playlist: state.playlist, currentVideo: state.currentVideo}});
    }).catch(error => {
        return error;
    })
}

const state = {
    playlist: [],
    currentVideo: null,
}

const getters = {
    playlist(state) {
        return state.playlist
    },
    currentVideo(state) {
        return state.currentVideo
    },
}

const actions = {
    [FETCH_PLAYLIST](context) {

    },
    [FETCH_CURRENT_VIDEO](context) {

    },
    [FETCH_NEXT_VIDEO](context, {oldStartTime}) {
        context.commit(GET_NEXT_VIDEO, {oldStartTime: oldStartTime})
    },
    [PUSH_PLAYLIST](context, {video}) {
        context.commit(ADD_TO_PLAYLIST, {video: video});
    },
    [POP_PLAYLIST](context, {index}) {
        context.commit(REMOVE_FROM_PLAYLIST, {index: index});
    },
    [REORDER_PLAYLIST](context, {oldIndex, newIndex}) {
        context.commit(REORDER_PLAYLIST_ITEM, {oldIndex: oldIndex, newIndex: newIndex});
    },
    [CLEAR_CURRENT_VIDEO](context) {
        context.commit(SET_CURRENT_VIDEO, {currentVideo: null})
    }
}

const mutations = {
    [ADD_TO_PLAYLIST](state, {video}) {
        state.playlist.push({video: video})
        if (state.playlist.length === 1 && !state.currentVideo) {
            _playNext(state)
        }
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
    [REORDER_PLAYLIST_ITEM](state, {oldIndex, newIndex}) {
        const video = state.playlist[oldIndex];
        state.playlist = state.playlist.filter(item => {
            return item.video.id.videoId !== video.video.id.videoId
        })
        state.playlist.splice(newIndex, 0, video)
    },
    [SET_PAUSE_TIME](state, {pauseTime}) {
        if (state.currentVideo) state.currentVideo.pauseTime = pauseTime;
    },
    [GET_NEXT_VIDEO](state, {oldStartTime}) {
        if (true) { // !!this.timeoutId
            // clearTimeout(this.timeoutId);
            state.currentVideo = null;
            _playNext(state);
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations,
    namespaced: true
}
