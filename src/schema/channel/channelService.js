const Channel = require('./channel');
const User = require('../user/user');
const utils = require('../../utils/validation');

exports.create = (fields, id) => {
    return new Promise((resolve, reject) => {
        const errorField = utils.checkRequiredFields(fields, 'name', 'source');

        if (errorField) {
            reject(`Field "${errorField}" is require`);
        }

        let channel;

        Channel.create({...fields, creatorId: id, subscribers: [id]})
            .then(newChannel => {
                channel = newChannel;

                return User.findByIdAndUpdate(id, { $push: { channels: channel._id }})
            })
            .then(() => resolve(channel))
            .catch((err) => {
                reject(err.message, 500);
            })
        ;
    });
};

exports.getFeeds = (id) => {
    return new Promise((resolve ,reject) => {
        Channel.findById(id)
            .then(channel => {
                if (!channel) {
                    reject(`Channel with id:${id} not found.`)
                }

                channel.loadFeeds()
                    .then((feeds) => {
                        resolve(feeds);
                    })
                    .catch(err => reject(err))
                ;
            })
            .catch(err => {
                reject(err.message, 500)
            })
        ;
    });
};

exports.getUserChannels = (id) => {
    return new Promise((resolve, reject) => {
        User.findById(id)
            .populate('channels')
            .then(channels => {
                if (!channels) {
                    reject('No result')
                }

                resolve(channels);
            })
            .catch(err => reject(err.message))
        ;
    });
};
