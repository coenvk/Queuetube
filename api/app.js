"use strict"
const express = require('express');
const bodyParser = require('body-parser');
const Yt = require('./youtube');

const yt = new Yt();
const app = express();
const router = express.Router();

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

// CORS middleware
const allowCrossDomain = function (req, res, next) {
  req.header('Access-Control-Allow-Origin', '*');
  req.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, HEAD, *');
  req.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, *');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, HEAD, *');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, *');
  next();
}

app.use(allowCrossDomain)

router.get('/youtube/playlist', (req, res) => {
  console.log('[api.PLAYLIST]: ' + JSON.stringify(req.body))
  yt.getPlaylist().then(({youtube}) => {
    return res.status(200).send({playlist: youtube.playlist});
  }).catch(error => {
    return res.status(500).send({error: '[api.PLAYLIST~ERROR]: ' + error})
  })
})

router.put('/youtube/playlist', (req, res) => {
  console.log('[api.PLAYLIST]: ' + JSON.stringify(req.body))
  yt.addVideo(req.body.video).then(({youtube}) => {
    return res.status(200).send({playlist: youtube.playlist, currentVideo: youtube.currentVideo});
  }).catch(error => {
    return res.status(500).send({error: '[api.PLAYLIST~ERROR]: ' + error})
  })
})

router.delete('/youtube/playlist/:index', (req, res) => {
  console.log('[api.PLAYLIST]: ' + JSON.stringify(req.body))
  yt.removeVideo(req.params.index).then(({youtube}) => {
    return res.status(200).send({playlist: youtube.playlist});
  }).catch(error => {
    return res.status(500).send({error: '[api.PLAYLIST~ERROR]: ' + error})
  })
})

router.put('/youtube/playlist/:oldIndex', (req, res) => {
  console.log('[api.PLAYLIST]: ' + JSON.stringify(req.body))
  yt.reorderVideo(req.params.oldIndex, req.body.newIndex).then(({youtube}) => {
    return res.status(200).send({playlist: youtube.playlist});
  }).catch(error => {
    return res.status(500).send({error: '[api.PLAYLIST~ERROR]: ' + error})
  })
})

router.get('/youtube/currentVideo', (req, res) => {
  console.log('[api.CURRENTVIDEO]: ' + JSON.stringify(req.body))
  yt.getCurrentVideo().then(({youtube}) => {
    return res.status(200).send({currentVideo: youtube.currentVideo});
  }).catch(error => {
    return res.status(500).send({error: '[api.CURRENTVIDEO~ERROR]: ' + error})
  })
})

router.get('/youtube/nextVideo/:oldStartTime', (req, res) => {
  console.log('[api.NEXTVIDEO]: ' + JSON.stringify(req.body))
  yt.getNextVideo(req.params.oldStartTime).then(({youtube}) => {
    return res.status(200).send({playlist: youtube.playlist, currentVideo: youtube.currentVideo});
  }).catch(error => {
    return res.status(500).send({error: '[api.NEXTVIDEO~ERROR]: ' + error})
  })
})

router.delete(`/youtube/currentVideo`, (req, res) => {
  console.log('[api.CURRENTVIDEO]: ' + JSON.stringify(req.body))
  yt.clearCurrentVideo().then(({youtube}) => {
    return res.status(200).send({playlist: youtube.playlist, currentVideo: youtube.currentVideo});
  }).catch(error => {
    return res.status(500).send({error: '[api.CURRENTVIDEO~ERROR]: ' + error})
  })
})

app.use(router)

const port = process.env.PORT || 3000;

const server = app.listen(port, function () {
  console.log('Express api listening on port ' + port)
});
