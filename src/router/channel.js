const express = require('express');
const channelService = require('../schema/channel/channelService');

const router = express.Router();

router.get('/channel', (req, res) => {
    channelService
        .getUserChannels(req.session.userInfo._id)
        .then((channels) => {
            res.send(channels)
        })
        .catch((err, errorStatus) => {
            res.send(err)
        })
    ;
});

router.post('/channel', (req, res) => {
    channelService
        .create(req.body, req.session.userInfo._id)
        .then((channel) => {
            res.send(channel)
        })
        .catch((err, errorStatus) => {
            res.send(err)
        })
    ;
});

router.get('/channel/:id/feeds', (req, res) => {
   channelService.getFeeds(req.params.id)
       .then((channel) => {
           res.send(channel)
       })
       .catch((err, errorStatus) => {
           res.send(err)
       })
    ;
});

module.exports = router;
