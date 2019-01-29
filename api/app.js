"use strict"
const express = require('express');
const bodyParser = require('body-parser');
const Yt = require('./queuetube.remote');

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

router.get('/queuetube', (req, res) => {
    console.log('[api.ROOM]: ' + JSON.stringify(req.body))
    yt.getRooms().then(({rooms}) => {
        return res.status(200).send({rooms: rooms})
    }).catch(error => {
        return res.status(500).send({error: '[api.ROOM~ERROR]: ' + error})
    })
})

router.put('/queuetube', (req, res) => {
    console.log('[api.ROOM]: ' + JSON.stringify(req.body))
    yt.addRoom(req.body.roomName, req.body.hosting).then(({queuetube}) => {
        return res.sendStatus(200);
    }).catch(error => {
        return res.status(500).send({error: '[api.ROOM~ERROR]: ' + error})
    })
})

router.get('/queuetube/playlist', (req, res) => {
  console.log('[api.PLAYLIST]: ' + JSON.stringify(req.body))
  yt.getPlaylist().then(({queuetube}) => {
    return res.status(200).send({playlist: queuetube.playlist});
  }).catch(error => {
    return res.status(500).send({error: '[api.PLAYLIST~ERROR]: ' + error})
  })
})

router.put('/queuetube/playlist', (req, res) => {
  console.log('[api.PLAYLIST]: ' + JSON.stringify(req.body))
  yt.addVideo(req.body.video).then(({queuetube}) => {
    return res.status(200).send({playlist: queuetube.playlist, currentVideo: queuetube.currentVideo});
  }).catch(error => {
    return res.status(500).send({error: '[api.PLAYLIST~ERROR]: ' + error})
  })
})

router.delete('/queuetube/playlist/:index', (req, res) => {
  console.log('[api.PLAYLIST]: ' + JSON.stringify(req.body))
  yt.removeVideo(req.params.index).then(({queuetube}) => {
    return res.status(200).send({playlist: queuetube.playlist});
  }).catch(error => {
    return res.status(500).send({error: '[api.PLAYLIST~ERROR]: ' + error})
  })
})

router.put('/queuetube/playlist/:oldIndex', (req, res) => {
  console.log('[api.PLAYLIST]: ' + JSON.stringify(req.body))
  yt.reorderVideo(req.params.oldIndex, req.body.newIndex).then(({queuetube}) => {
    return res.status(200).send({playlist: queuetube.playlist});
  }).catch(error => {
    return res.status(500).send({error: '[api.PLAYLIST~ERROR]: ' + error})
  })
})

router.get('/queuetube/currentVideo', (req, res) => {
  console.log('[api.CURRENTVIDEO]: ' + JSON.stringify(req.body))
  yt.getCurrentVideo().then(({queuetube}) => {
    return res.status(200).send({currentVideo: queuetube.currentVideo});
  }).catch(error => {
    return res.status(500).send({error: '[api.CURRENTVIDEO~ERROR]: ' + error})
  })
})

router.get('/queuetube/nextVideo/:oldStartTime', (req, res) => {
  console.log('[api.NEXTVIDEO]: ' + JSON.stringify(req.body))
  yt.getNextVideo(req.params.oldStartTime).then(({queuetube}) => {
    return res.status(200).send({playlist: queuetube.playlist, currentVideo: queuetube.currentVideo});
  }).catch(error => {
    return res.status(500).send({error: '[api.NEXTVIDEO~ERROR]: ' + error})
  })
})

router.delete(`/queuetube/currentVideo`, (req, res) => {
  console.log('[api.CURRENTVIDEO]: ' + JSON.stringify(req.body))
  yt.clearCurrentVideo().then(({queuetube}) => {
    return res.status(200).send({playlist: queuetube.playlist, currentVideo: queuetube.currentVideo});
  }).catch(error => {
    return res.status(500).send({error: '[api.CURRENTVIDEO~ERROR]: ' + error})
  })
})

app.use(router)

const port = process.env.PORT || 3000;

const server = app.listen(port, function () {
  console.log('Express api listening on port ' + port)
});
