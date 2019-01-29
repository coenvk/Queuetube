"use strict";

const axios = require('axios');
const config = require('./config');

const ROOT_URL = 'https://www.googleapis.com/youtube/v3/videos';

class Yt {
  constructor() {
    this.rooms = []; // [{name: x, playlist: [{video: x}], currentVideo: {video: x, startTime: x, duration: x, pauseTime: x}}]
    // this.timeoutId = null;
  }

  getRooms() {
    return new Promise((resolve, reject) => {
      resolve({rooms: this.rooms})
    })
  }

  addRoom(name, hosting) {
    return new Promise((resolve, reject) => {
      let room = this._getRoom(name);
      if (room !== undefined && room !== null) {
        if (hosting) {
          reject(new Error("Room already exists"))
        } else {
          resolve(room)
        }
      } else {
        if (hosting) {
          room = {name: name, playlist: [], currentVideo: null};
          this.rooms.push(room);
          resolve(room);
        } else {
          reject(new Error("Room doesn't exist"));
        }
      }
    })
  }

  _getRoom(name) {
    return this.rooms.find(item => {
      return item.name === name;
    })
  }

  playNext(name) {
    return new Promise((resolve, reject) => {
      const room = this._getRoom(name);
      if (!room.playlist) return reject(new Error("Playlist is undefined!"));
      if (room.playlist.length === 0) return reject(new Error("No videos in playlist!"));
      const video = room.playlist.splice(0, 1)[0].video;
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
        room.currentVideo = {video: video, startTime: new Date().getTime(), duration: timeout};
        // this.timeoutId = setTimeout(this.playNext, timeout);
        resolve({queuetube: {playlist: room.playlist, currentVideo: room.currentVideo}});
      }).catch(error => {
        reject(error);
      })
    })
  }

  addVideo(name, video) {
    console.log('Add video');
    return new Promise((resolve, reject) => {
      const room = this._getRoom(name);
      room.playlist.push({video: video});
      if (room.playlist.length === 1 && !room.currentVideo) {
        // clearTimeout(this.timeoutId);
        // this.timeoutId = null;
        this.playNext(name).then(queuetube => {
          resolve(queuetube);
        }).catch(error => {
          console.error(error);
        })
      } else resolve({queuetube: {playlist: room.playlist, currentVideo: room.currentVideo}});
    })
  }

  removeVideo(name, index) {
    console.log('Remove video');
    return new Promise((resolve, reject) => {
      const room = this._getRoom(name);
      room.playlist.splice(index, 1);
      resolve({queuetube: {playlist: room.playlist, currentVideo: room.currentVideo}});
    })
  }

  clearCurrentVideo(name) {
    console.log('Clear current video');
    return new Promise((resolve, reject) => {
      const room = this._getRoom(name);
      room.currentVideo = null;
      resolve({queuetube: {playlist: room.playlist, currentVideo: room.currentVideo}});
    })
  }

  reorderVideo(name, oldIndex, newIndex) {
    console.log('Reorder video');
    return new Promise((resolve, reject) => {
      const room = this._getRoom(name);
      const item = room.playlist.splice(oldIndex, 1)[0];
      room.playlist.splice(newIndex, 0, item);
      resolve({queuetube: {playlist: room.playlist, currentVideo: room.currentVideo}});
    })
  }

  getPlaylist(name) {
    console.log('Get playlist');
    return new Promise((resolve, reject) => {
      const room = this._getRoom(name);
      resolve({queuetube: {playlist: room.playlist, currentVideo: room.currentVideo}});
    });
  }

  getCurrentVideo(name) {
    console.log('Get current video');
    return new Promise((resolve, reject) => {
      const room = this._getRoom(name);
      resolve({queuetube: {playlist: room.playlist, currentVideo: room.currentVideo}});
    });
  }

  getNextVideo(name, oldStartTime) {
    console.log('Get next video');
    return new Promise((resolve, reject) => {
      const room = this._getRoom(name);
      if (true) { // !!this.timeoutId
        // clearTimeout(this.timeoutId);
        room.currentVideo = null;
        if (room.playlist.length > 0) {
          this.playNext(name).then(queuetube => {
            resolve(queuetube);
          }).catch(error => {
            console.error(error);
          })
        }
      } else {
        this._waitUntilNextVideoSet(room, oldStartTime).then(() => {
          resolve({queuetube: {playlist: room.playlist, currentVideo: room.currentVideo}});
        })
      }
    });
  }

  _waitUntilNextVideoSet(room, oldStartTime) {
    return new Promise((resolve, reject) => {
      function checkFlag() {
        if (oldStartTime !== room.currentVideo.startTime) {
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
