const mongoose = require('mongoose');

const dbName = process.env.DB_NAME || 'test';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '27017';
const options = {
  useNewUrlParser: true
};

mongoose.Promise = Promise;

exports.connect = () => mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, options);
exports.close = () => mongoose.connection.close();
