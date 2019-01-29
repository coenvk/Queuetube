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

        <queuetube-frame v-if="selectedVideo" :video="selectedVideo" :startTime="startTime"
                       :duration="currentVideo.duration" @ended="playNext" @skip="playNext"></queuetube-frame>
        <div v-else>
          <h4>Select a video</h4>
        </div>

        <draggable v-model="playlist" @sort="onSort" class="playlist-wrapper">
          <b-card class="playlist-card mt-2 ml-0" v-for="(result, index) in playlist" :key="index" :value="result"
                  :id="'playlist-item-' + index" @click.prevent="removeVideo(index)">
            <b-media right-align class="playlist-media">
              <b-img fluid slot="aside" :src="result.video.snippet.thumbnails.default.url" alt=""></b-img>
              <h6>{{ result.video.snippet.title }}</h6>
            </b-media>
            <div class="playlist-overlay"><v-icon name="minus" scale="2"/></div>
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
import Draggable from 'vuedraggable'
import YouTubeSearch from 'youtube-api-search'
import QueuetubeFrame from '@/components/QueuetubeFrame'
import {
  CLEAR_CURRENT_VIDEO,
  FETCH_CURRENT_VIDEO,
  FETCH_NEXT_VIDEO,
  FETCH_PLAYLIST,
  POP_PLAYLIST,
  PUSH_PLAYLIST,
  REORDER_PLAYLIST
} from '@/store/actions.type'
import {mapGetters} from 'vuex'
import {SET_PLAYLIST} from '@/store/mutations.type'

export default {
  name: 'RemotePage',
  data () {
    return {
      searchResults: [],
      query: null
    }
  },
  components: {
    QueuetubeFrame,
    Draggable
  },
  computed: {
    ...mapGetters(['currentVideo', 'roomName']),
    playlist: {
      get () {
        return this.$store.state.remote.playlist
      },
      set (val) {
        this.$store.commit(SET_PLAYLIST, {playlist: val})
      }
    },
    selectedVideo () {
      if (!this.currentVideo) return null
      return this.currentVideo.video
    },
    startTime () {
      if (!this.currentVideo) return 0
      return this.currentVideo.startTime
    }
  },
  mounted () {
    this.fetchPlaylist()
  },
  methods: {
    fetchPlaylist () {
      Promise.all([
        this.$store.dispatch(FETCH_PLAYLIST, {roomName: this.roomName}),
        this.$store.dispatch(FETCH_CURRENT_VIDEO, {roomName: this.roomName})
      ])
    },
    searchRequest () {
      YouTubeSearch({key: process.env.VUE_APP_BROWSER_YOUTUBE_API_KEY, term: this.query, limit: 25}, results => {
        this.searchResults = results
      })
    },
    selectVideo (video) {
      this.$store.dispatch(PUSH_PLAYLIST, {roomName: this.roomName, video: video})
    },
    playNext () {
      const curVid = this.currentVideo
      this.$store.dispatch(CLEAR_CURRENT_VIDEO, {roomName: this.roomName}).then(() => {
        if (this.playlist.length > 0) {
          let oldStartTime = null
          if (curVid) oldStartTime = curVid.startTime
          this.$store.dispatch(FETCH_NEXT_VIDEO, {roomName: this.roomName, oldStartTime: oldStartTime})
        }
      })
    },
    removeVideo (index) {
      this.$store.dispatch(POP_PLAYLIST, {roomName: this.roomName, index: index})
    },
    onSort (evt) {
      this.$store.dispatch(REORDER_PLAYLIST, {roomName: this.roomName, oldIndex: evt.oldIndex, newIndex: evt.newIndex})
    }
  }
}
</script>

<style scoped lang="scss">
  .card:hover {
    background-color: #eeeeee;
  }

  .playlist-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 100%;
    width: 100%;
    opacity: 0;
    transition: .5s ease;
    background-color: #ee2040;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    & .fa-icon {
      margin: 20px;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }

  .playlist-card:hover .playlist-overlay {
    opacity: 0.8;
  }
</style>
