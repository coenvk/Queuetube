<template>
    <div>
        <div class="video-wrapper">
            <h4>{{ title }}</h4>
            <div class="embed-responsive embed-responsive-16by9">
                <youtube :video-id="video.id.videoId"
                         ref="youtube"
                         @ready="onPlayerReady"
                         @ended="onPlayerEnded"
                         @playing="onPlayerPlaying"
                         @paused="onPlayerPaused"
                         @buffering="onPlayerBuffering"
                         @cued="onPlayerCued"
                         @error="onPlayerError"
                         :player-vars="playerVars"
                         :rel="0"
                ></youtube>
            </div>
            <b-row>
                <b-col cols="10">
                    <b-progress class="my-3" :value="now" :max="duration"></b-progress>
                </b-col>
                <b-col>
                    <b-button class="my-2 ml-auto" size="sm" variant="primary" @click.prevent="onSkip">Skip</b-button>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
import getArtistTitle from 'get-artist-title'

export default {
  name: 'QueuetubeFrame',
  data () {
    return {
      playerVars: {
        allowfullscreen: 1,
        autoplay: 1,
        disablekb: 1,
        controls: 0,
        enablejsapi: 1
      },
      now: 0,
      intervalId: null
    }
  },
  props: {
    video: Object,
    startTime: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0
    }
  },
  computed: {
    player () {
      return this.$refs.youtube.player
    },
    title () {
      const [artist, title] = getArtistTitle(this.video.snippet.title)
      return artist + ' - ' + title
    },
    windowTitle () {
      return this.video.snippet.title + ' | Queuetube'
    }
  },
  methods: {
    onPlayerReady (event) {
      this.intervalId = window.setInterval(() => {
        this.now = (new Date().getTime() - this.startTime)
      }, 1000)
      const start = (new Date().getTime() - this.startTime) / 1000
      this.player.seekTo(start)
      this.player.playVideo()
      window.document.title = this.windowTitle
    },
    onPlayerEnded (event) {
      if (this.intervalId) window.clearInterval(this.intervalId)
      this.intervalId = null
      this.$emit('ended')
      window.document.title = process.env.VUE_APP_NAME
    },
    onPlayerPlaying (event) {

    },
    onPlayerPaused (event) {

    },
    onPlayerBuffering (event) {

    },
    onPlayerCued (event) {
      this.intervalId = window.setInterval(() => {
        this.now = (new Date().getTime() - this.startTime)
      }, 1000)
      this.player.playVideo()
      window.document.title = this.windowTitle
    },
    onPlayerError (event) {

    },
    onSkip () {
      this.$emit('skip')
    }
  }
}
</script>

<style scoped lang="scss">
    .embed-responsive {
        pointer-events: none;
    }
</style>
