<template>
    <div>

        <div class="video-wrapper" @click.prevent="onPlayPause">
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
    import YouTubeSearch from 'youtube-api-search'
    import {mapState} from 'vuex'
    import {SET_PAUSE_TIME} from "@/store/mutations.type";

    export default {
        name: 'QueuetubeFrame',
        data() {
            return {
                playerVars: {
                    allowfullscreen: 1,
                    autoplay: 1,
                    disablekb: 1,
                    controls: 0,
                    enablejsapi: 1,
                    modestbranding: 1,
                },
                now: 0,
                intervalId: null,
                paused: false
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
            ...mapState({
                pauseTime: state => state.local.currentVideo ? state.local.currentVideo.pauseTime : null
            }),
            player() {
                // if (!this.$refs.youtube) return null
                return this.$refs.youtube.player
            },
            title() {
                const [artist, title] = getArtistTitle(this.video.snippet.title)
                return artist + ' - ' + title
            },
            windowTitle() {
                return this.video.snippet.title + ' | Queuetube'
            }
        },
        methods: {
            onPlayerReady(event) {
                if (!isNaN(this.pauseTime)) {
                    this.player.seekTo(this.pauseTime / 1000);
                }
                this.player.playVideo()
                window.document.title = this.windowTitle
            },
            onPlayerEnded(event) {
                this.now = 0;
                if (this.intervalId) window.clearInterval(this.intervalId)
                this.intervalId = null
                this.$emit('ended')
                window.document.title = process.env.VUE_APP_NAME
            },
            onPlayerPlaying(event) {
                if (!isNaN(this.pauseTime)) {
                    this.now = this.pauseTime;
                }
                this.intervalId = window.setInterval(() => {
                    this.now += 1000;
                }, 1000)
            },
            onPlayerPaused(event) {
                window.clearInterval(this.intervalId);
                this.intervalId = null;
            },
            onPlayerBuffering(event) {

            },
            onPlayerCued(event) {
                this.player.playVideo()
                window.document.title = this.windowTitle
            },
            onPlayerError(event) {

            },
            onSkip() {
                this.$emit('skip')
                this.now = 0
            },
            onPlayPause() {
                this.paused = !this.paused;
                if (this.paused) {
                    this.player.pauseVideo();
                    this.savePause(this.now);
                } else {
                    this.player.playVideo();
                }
            },
            savePause(pauseTime) {
                if (!pauseTime) pauseTime = this.now
                this.$store.commit(`local/${SET_PAUSE_TIME}`, {pauseTime: pauseTime})
            },
        }
    }
</script>

<style scoped lang="scss">
    .embed-responsive {
        pointer-events: none;
    }
</style>
