<template>
  <div id="app">
    <navbar></navbar>
    <b-container class="p-4">
      <loader v-if="isLoading"></loader>
      <router-view/>
    </b-container>
    <scroll-to-top :threshold="100"/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
import Navbar from '@/components/Navbar'
import ScrollToTop from '@/components/ScrollToTop'
import Loader from '@/components/Loader'

export default {
  components: {
    Navbar,
    ScrollToTop,
    Loader,
  },
  computed: {
    ...mapState({
      isLoading: state => state.loader.isLoading
    })
  }
}
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    height: 100% !important;
  }

  .container, .container-fluid {
    height: inherit !important;
    min-height: 100% !important;
  }
</style>
