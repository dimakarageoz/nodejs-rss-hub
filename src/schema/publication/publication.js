const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const publicationSchema = new Schema({

});


module.exports = mongoose.Model('Publication', publicationSchema);
