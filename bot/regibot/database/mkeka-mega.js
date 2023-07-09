const mongoose = require('mongoose')
const Schema = mongoose.Schema

const megaSchema = new Schema({
    match: {type: String},
    odds: {type: Number},
    time: {type: String},
    date: {type: String},
    bet: {type: String},
    status: {type: String, default: 'Pending'},
}, {strict: false, timestamps: true})

const mega = mongoose.connection.useDb('mkeka-wa-leo')
const model = mega.model('Accumulator', megaSchema)
module.exports = model