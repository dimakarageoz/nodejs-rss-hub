const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Channel = require('../channel/channel');

const Schema = mongoose.Schema;
const SALT_ROUNDS = 10;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        maxLength: 100,
        unique: true
    },
    firstName: {
        type: String,
        maxLength: 100
    },
    secondName: {
        type: String,
        maxLength: 100
    },
    password: {
        type: String,
        maxLength: 120,
        select: false,
        required: true
    },
    channels: [{
        type: Schema.Types.ObjectId,
        ref: 'Channel',
        select: false
    }]
});

userSchema.methods.hashPassword = (password) => {
    return bcrypt
        .genSalt(SALT_ROUNDS)
        .then((salt) => bcrypt.hash(password, salt))
    ;
};

userSchema.pre('save', function (next) {
    return this.hashPassword(this.password)
        .then(hash => {
            this.password = hash;
            next()
        })
        .catch(err => {
            throw err
        })
    ;
});

userSchema.pre('remove', function (next) {
    this.channels.for
});

module.exports = mongoose.model('User', userSchema);
