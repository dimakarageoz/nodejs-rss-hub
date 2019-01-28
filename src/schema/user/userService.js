const bcrypt = require('bcrypt');

const User = require('./user');
const utils = require('../../utils/validation');

exports.create = function (fields) {
    return new Promise((resolve, reject) => {
        const errorField = utils.checkRequiredFields(fields, 'email', 'password', 'confirmPassword');

        if (errorField) {
            reject(`Field "${errorField}" is require`);
        }

        if (fields['password'] !== fields['confirmPassword']) {
            reject('Confirm password does not match');
        }

        utils.checkUniqueFields(User, {email: fields['email']})
            .then(() => {
                User.create(fields)
                    .then((user) => resolve(user))
                    .catch((err) => {
                        reject(err.message, 500);
                    })
                ;
            })
            .catch((err, errorCode) => {
                reject(err, errorCode);
            })
        ;
    });
};

exports.login = (fields) => {
    return new Promise((resolve, reject) => {
        const errorField = utils.checkRequiredFields(fields, 'email', 'password');

        if (errorField) {
            reject(`Field "${errorField}" is require`);
        }

        const {password, email} = fields;

        User.findOne({ email })
            .select('+password')
            .then((user) => {
                if (!user) {
                    reject('Incorrect email or password.');
                }

                bcrypt.compare(password, user.password)
                    .then(res => {
                        res ? resolve(user)
                            : reject('Incorrect email or password.')
                        ;
                    })
                    .catch(err => {
                        reject(err.message)
                    })
                ;
            })
            .catch(err => reject(err.message, 500))
        ;
    });
};
