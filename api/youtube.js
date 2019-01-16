"use strict";

const axios = require('axios');
const config = require('./config');

const ROOT_URL = 'https://www.googleapis.com/youtube/v3/videos';

class Yt {
  constructor() {
    this.playlist = []; // [{video: x}]
    this.currentVideo = null; // {video: x, startTime: x, duration: x}
    this.timeoutId = null;
  }

  playNext() {
    return new Promise((resolve, reject) => {
      if (!this.playlist) return reject(new Error("Playlist is undefined!"));
      if (this.playlist.length === 0) return reject(new Error("No videos in playlist!"));
      const video = this.playlist.splice(0, 1)[0].video;
      const params = {
        id: video.id.videoId,
        part: 'contentDetails',
        key: config.youtube_key
      }
      axios.get(ROOT_URL, {params: params}).then(response => {
        let duration = response.data.items[0].contentDetails.duration;
        duration = duration.replace("PT", "")
        const hi = duration.indexOf("H");
        const hours = parseInt(duration.substr(0, hi));
        duration = duration.substr(hi + 1);
        const mi = duration.indexOf("M");
        const minutes = parseInt(duration.substr(0, mi));
        duration = duration.substr(mi + 1);
        const si = duration.indexOf("S");
        const seconds = parseInt(duration.substr(0, si));
        let timeout = 0;
        if (!!seconds) timeout += seconds * 1000;
        if (!!minutes) timeout += minutes * 60000;
        if (!!hours) timeout += hours * 3600000;
        this.currentVideo = {video: video, startTime: new Date().getTime(), duration: timeout};
        // this.timeoutId = setTimeout(this.playNext, timeout);
        resolve({youtube: {playlist: this.playlist, currentVideo: this.currentVideo}});
      }).catch(error => {
        reject(error);
      })
    })
  }

  addVideo(video) {
    console.log('Add video');
    return new Promise((resolve, reject) => {
      this.playlist.push({video: video});
      if (this.playlist.length === 1 && !this.currentVideo) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
        this.playNext().then(youtube => {
          resolve(youtube);
        }).catch(error => {
          console.error(error);
        })
      } else resolve({youtube: {playlist: this.playlist, currentVideo: this.currentVideo}});
    })
  }

  removeVideo(index) {
    console.log('Remove video');
    return new Promise((resolve, reject) => {
      this.playlist.splice(index, 1);
      resolve({youtube: {playlist: this.playlist, currentVideo: this.currentVideo}});
    })
  }

  clearCurrentVideo() {
    console.log('Clear current video');
    return new Promise((resolve, reject) => {
      this.currentVideo = null;
      resolve({youtube: {playlist: this.playlist, currentVideo: this.currentVideo}});
    })
  }

  reorderVideo(oldIndex, newIndex) {
    console.log('Reorder video');
    return new Promise((resolve, reject) => {
      const item = this.playlist.splice(oldIndex, 1)[0];
      this.playlist.splice(newIndex, 0, item);
      resolve({youtube: {playlist: this.playlist, currentVideo: this.currentVideo}});
    })
  }

  getPlaylist() {
    console.log('Get playlist');
    return new Promise((resolve, reject) => {
      resolve({youtube: {playlist: this.playlist, currentVideo: this.currentVideo}});
    });
  }

  getCurrentVideo() {
    console.log('Get current video');
    return new Promise((resolve, reject) => {
      resolve({youtube: {playlist: this.playlist, currentVideo: this.currentVideo}});
    });
  }

  getNextVideo(oldStartTime) {
    console.log('Get next video');
    return new Promise((resolve, reject) => {
      if (true) { // !!this.timeoutId
        clearTimeout(this.timeoutId);
        this.currentVideo = null;
        if (this.playlist.length > 0) {
          this.playNext().then(youtube => {
            resolve(youtube);
          }).catch(error => {
            console.error(error);
          })
        }
      } else {
        this._waitUntilNextVideoSet(oldStartTime).then(() => {
          resolve({youtube: {playlist: this.playlist, currentVideo: this.currentVideo}});
        })
      }
    });
  }

  _waitUntilNextVideoSet(oldStartTime) {
    return new Promise((resolve, reject) => {
      function checkFlag() {
        if (oldStartTime !== this.currentVideo.startTime) {
          resolve();
        } else {
          setTimeout(checkFlag, 50);
        }
      }

      checkFlag();
    })
  }

}

module.exports = Yt;
