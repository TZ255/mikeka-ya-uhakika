const mongoose = require('mongoose')
const Schema = mongoose.Schema

const binSchema = new Schema({
    chatid: {type: Number},
    nano: {type: String},
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '4h'
    }
}, {strict: false})

const ohymy = mongoose.connection.useDb('ohmyNew')
const model = ohymy.model('RTUSERS-BIN', binSchema)
module.exports = model