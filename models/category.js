var mongoose = require('mongoose')

var categorySchema = mongoose.Schema({
    name: String,
    userId: mongoose.Schema.Types.ObjectId,
    channels: [String]
});

module.exports = mongoose.model('Category', categorySchema);
