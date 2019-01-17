import ApiService from '@/common/api.service'

import {FETCH_USERS} from './actions.type'

import {CLEAR_ERROR, SET_ERROR, SET_USERS} from './mutations.type'

const state = {
  users: [] // [{uid: x, username: x, email: x, birthday: x}]
}

const getters = {
  users (state) {
    return state.users
  }
}

const actions = {
  [FETCH_USERS] (context) {
    ApiService.get(`users`).then(response => {
      context.commit(`error/${CLEAR_ERROR}`, null, {root: true})
      context.commit(SET_USERS, {users: response.data.users})
    }).catch(error => {
      context.commit(`error/${SET_ERROR}`, {error: error}, {root: true})
    })
  }
}

const mutations = {
  [SET_USERS] (state, {users}) {
    state.users = users
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
}
