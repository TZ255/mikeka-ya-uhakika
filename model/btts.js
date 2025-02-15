const mongoose = require('mongoose')
const Schema = mongoose.Schema

const megaSchema = new Schema({
    match: {type: String},
    league: {type: String},
    expl: {type: String, default: '0 stats'},
    time: {type: String},
    date: {type: String},
    bet: {type: String},
    status: {type: String, default: 'Pending'},
}, {strict: false, timestamps: true})

const model = mongoose.model('btts-tip', megaSchema)
module.exports = model