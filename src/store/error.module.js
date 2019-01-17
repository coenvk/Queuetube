import {CLEAR_ERROR, SET_ERROR} from './mutations.type'

const state = {
  error: null
}

const getters = {
  error (state) {
    return state.error
  }
}

const actions = {

}

const mutations = {
  [SET_ERROR] (state, error) {
    state.error = error
  },
  [CLEAR_ERROR] (state) {
    state.error = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
}
