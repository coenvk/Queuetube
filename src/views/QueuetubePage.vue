<template>
  <b-container class="mt-4">
    <b-row>
      <b-col>

        <b-form @submit.prevent="searchRequest">
          <b-form-group>
            <b-input-group>
              <b-form-input v-model.trim="query" type="text" placeholder="Search..."></b-form-input>
              <b-input-group-append>
                <b-button variant="primary" type="submit">
                  <v-icon name="search"/>
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-form>

      </b-col>
    </b-row>

    <b-row>
      <b-col>

        <youtube-frame v-if="selectedVideo" :video="selectedVideo" :startTime="startTime"
                       :duration="currentVideo.duration" @ended="playNext" @skip="playNext"></youtube-frame>
        <div v-else>
          <h4>Select a video</h4>
        </div>

        <draggable v-model="playlist" @sort="onSort" class="playlist-wrapper">
          <b-card class="mt-2 ml-0" v-for="(result, index) in playlist" :key="index" :value="result"
                  :id="'playlist-item-' + index" @click.prevent="removeVideo(index)">
            <b-media right-align>
              <b-img fluid slot="aside" :src="result.video.snippet.thumbnails.default.url" alt=""></b-img>
              <h6>{{ result.video.snippet.title }}</h6>
            </b-media>
          </b-card>
        </draggable>

      </b-col>

      <b-col>

        <b-card class="mt-2 ml-0" v-for="(result, index) in searchResults" :key="index" :value="result"
                @click.prevent="selectVideo(result)">
          <b-media right-align>
            <b-img fluid slot="aside" :src="result.snippet.thumbnails.default.url" alt=""></b-img>
            <h6>{{ result.snippet.title }}</h6>
          </b-media>
        </b-card>

      </b-col>
    </b-row>

  </b-container>
</template>

<script>
  import Draggable from 'vuedraggable';
  import YouTubeSearch from 'youtube-api-search';
  import YoutubeFrame from '@/components/YoutubeFrame';
  import {
    CLEAR_CURRENT_VIDEO,
    FETCH_CURRENT_VIDEO,
    FETCH_NEXT_VIDEO,
    FETCH_PLAYLIST,
    POP_PLAYLIST,
    PUSH_PLAYLIST
  } from "@/store/actions.type";
  import {mapGetters} from 'vuex';
  import {SET_PLAYLIST} from "../store/mutations.type";
  import {REORDER_PLAYLIST} from "../store/actions.type";

  export default {
    name: "YoutubePage",
    data() {
      return {
        searchResults: [],
        query: null,
      }
    },
    components: {
      YoutubeFrame,
      Draggable,
    },
    computed: {
      ...mapGetters(['currentVideo']),
      playlist: {
        get() {
          return this.$store.state.youtube.playlist
        },
        set(val) {
          this.$store.commit(SET_PLAYLIST, {playlist: val})
        }
      },
      selectedVideo() {
        if (!this.currentVideo) return null
        return this.currentVideo.video
      },
      startTime() {
        if (!this.currentVideo) return 0
        return this.currentVideo.startTime
      }
    },
    mounted() {
      this.fetchPlaylist();
    },
    methods: {
      fetchPlaylist() {
        Promise.all([
          this.$store.dispatch(FETCH_PLAYLIST),
          this.$store.dispatch(FETCH_CURRENT_VIDEO),
        ])
      },
      searchRequest() {
        YouTubeSearch({key: process.env.VUE_APP_BROWSER_YOUTUBE_API_KEY, term: this.query, limit: 25}, results => {
          this.searchResults = results;
        });
      },
      selectVideo(video) {
        this.$store.dispatch(PUSH_PLAYLIST, {video: video})
      },
      playNext() {
        const curVid = this.currentVideo
        this.$store.dispatch(CLEAR_CURRENT_VIDEO).then(() => {
          if (this.playlist.length > 0) {
            let oldStartTime = null
            if (!!curVid) oldStartTime = curVid.startTime
            this.$store.dispatch(FETCH_NEXT_VIDEO, {oldStartTime: oldStartTime});
          }
        })
      },
      removeVideo(index) {
        this.$store.dispatch(POP_PLAYLIST, {index: index});
      },
      onSort(evt) {
        this.$store.dispatch(REORDER_PLAYLIST, {oldIndex: evt.oldIndex, newIndex: evt.newIndex})
      }
    },
  }
</script>

<style scoped lang="scss">
  .card:hover {
    background-color: #eeeeee;
  }
</style>
