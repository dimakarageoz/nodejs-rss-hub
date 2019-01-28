const mongoose = require('mongoose');
const Parser = require('rss-parser');

const parser = new Parser();
const Schema = mongoose.Schema;

const channelSchema = new Schema({
    name: {
        type: String,
        maxLength: 100,
        required: true
    },
    source: {
        type: String,
        maxLength: 300,
        required: true
    },
    description: {
        type: String,
        default: '',
        maxLength: 884
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    subscribers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

channelSchema.methods.loadFeeds = function() {
    return new Promise((resolve, reject) => {
        parser.parseURL(this.source, (err, feeds) => {
            if (err) {
                reject('Server error: parse feeds error', 500);

                return;
            }

            resolve(feeds);
        });
    })
};

module.exports = mongoose.model('Channel', channelSchema);
