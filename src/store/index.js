import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import loader from './loader.module'
import youtube from './youtube.module'
import error from './error.module'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  key: 'queuetube',
  storage: window.localStorage
  // reducer: (state) => ({auth: {user: state.auth.user}})
})

export default new Vuex.Store({
  modules: {
    loader,
    youtube,
    error
  },
  plugins: [
    vuexLocal.plugin
  ]
})
