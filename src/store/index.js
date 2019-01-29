import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import loader from './loader.module'
import remote from './remote.module'
import error from './error.module'
import local from './local.module'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
    key: 'queuetube',
    storage: window.localStorage,
    reducer: state => ({local: state.local})
})

export default new Vuex.Store({
    modules: {
        loader,
        remote,
        local,
        error
    },
    plugins: [
        vuexLocal.plugin
    ]
})
