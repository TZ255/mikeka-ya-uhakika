const mongoose = require('mongoose')
const Schema = mongoose.Schema

const rtSchema = new Schema({
    chatid: {type: Number,},
    username: {type: String},
    refferer: {type: String},
    handle: {type: String},
    movie: {type: Number, default: 0},
    shows: {type: Number, default: 0},
    points: {type: Number, default: 500},
    paid: {type: Boolean, default: false},
    payHistory: {type: Array},
    malipo: {type: Object}
}, {strict: false, timestamps: true })

const ohymy = mongoose.connection.useDb('ohmyNew')
const model = ohymy.model('rtbot-starter', rtSchema)
module.exports = model