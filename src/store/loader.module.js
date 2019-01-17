import {FETCH_END, FETCH_START, PUSH_END, PUSH_START} from './mutations.type'

const state = {
  isUpdating: false,
  isLoading: false
}

const getters = {
  isLoading (state) {
    return state.isLoading
  },
  isUpdating (state) {
    return state.isUpdating
  }
}

const actions = {}

const mutations = {
  [FETCH_START] (state) {
    state.isLoading = true
  },
  [FETCH_END] (state) {
    state.isLoading = false
  },
  [PUSH_START] (state) {
    state.isUpdating = true
  },
  [PUSH_END] (state) {
    state.isUpdating = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
}
