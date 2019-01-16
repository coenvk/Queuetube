import ApiService from '@/common/api.service'
import JwtService from '@/common/jwt.service'

import {CHECK_AUTH, LOGIN, LOGOUT, REGISTER} from './actions.type'

import {CLEAR_ERROR, PURGE_AUTH, RESET_STATE, SET_AUTH, SET_ERROR} from './mutations.type'

const state = {
    user: null,
    isAuthenticated: !!JwtService.getToken()
}

const getters = {
    currentUser(state) {
        return state.user
    },
    isAuthenticated(state) {
        return state.isAuthenticated
    }
}

const actions = {
    [LOGIN](context, credentials) {
        console.log('[auth.LOGIN]')
        return new Promise((resolve, reject) => {
            ApiService.post('/users/login', {user: credentials})
                .then(response => {
                    context.commit(SET_AUTH, response.data)
                    context.commit(`error/${CLEAR_ERROR}`)
                    resolve(response.data)
                })
                .catch(error => {
                    context.commit(RESET_STATE, error.response)
                    context.commit(`error/${SET_ERROR}`, error.response.data.error)
                    reject(error)
                })
        })
    },
    [LOGOUT](context) {
        console.log('[auth.LOGOUT')
        context.commit(PURGE_AUTH)
    },
    [REGISTER](context, credentials) {
        console.log('[auth.REGISTER]')
        return new Promise((resolve, reject) => {
            ApiService.post('/users/register', {user: credentials})
                .then(response => {
                    context.commit(SET_AUTH, response.data)
                    context.commit(`error/${CLEAR_ERROR}`)
                    resolve(response.data)
                })
                .catch(error => {
                    context.commit(RESET_STATE, error)
                    context.commit(`error/${SET_ERROR}`, error.response.data.error)
                    reject(error)
                })
        })
    },
    [CHECK_AUTH](context) {
        console.log('[auth.CHECK_AUTH]')
        return new Promise((resolve, reject) => {
            if (JwtService.getToken()) {
                ApiService.setHeader()
                ApiService.get('/auth')
                    .then(response => {
                        context.commit(SET_AUTH, response.data)
                        context.commit(`error/${CLEAR_ERROR}`)
                        resolve(response.data)
                    })
                    .catch(error => {
                        context.commit(PURGE_AUTH)
                        context.commit(RESET_STATE, error)
                        context.commit(`error/${SET_ERROR}`, error.response.data.error)
                        reject(error)
                    })
            } else {
                context.commit(PURGE_AUTH)
                const error = new Error('No token')
                context.commit(RESET_STATE, error)
                context.commit(`error/${SET_ERROR}`, error.response.data.error)
                reject(error)
            }
        })
    }
}

const mutations = {
    [RESET_STATE](state, error) {
        console.log('[auth.RESET_STATE]')
        if (error.data) {
            const data = error.data
            if (data.auth) state.isAuthenticated = data.auth
            if (data.user) {
                const {uid, username, email, birthday} = data.user
                state.user = {uid, username, email, birthday}
            }
        }
    },
    [SET_AUTH](state, data) {
        console.log('[auth.SET_AUTH]')
        if (data.auth) state.isAuthenticated = data.auth
        if (data.user) {
            const {uid, username, email, birthday} = data.user
            state.user = {uid, username, email, birthday}
        }
        JwtService.saveToken(data.token)
    },
    [PURGE_AUTH](state) {
        console.log('[auth.PURGE_AUTH]')
        state.isAuthenticated = false
        state.user = null
        JwtService.destroyToken()
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}
