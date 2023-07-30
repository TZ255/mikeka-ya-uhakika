const mongoose = require('mongoose')
const Schema = mongoose.Schema

const supatipSchema = new Schema({
    time: {
        type: String,
    },
    siku: {
        type: String
    },
    league: {
        type: String
    },
    match: {
        type: String
    },
    league: {
        type: String
    },
    matokeo: {
        type: String,
        default: '-:-'
    },
    status: {
        type: String,
        default: 'pending'
    },
    tip: {
        type: String
    },
    nano: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30m'
    },
    UTC3: {
        type: Number,
        default: null
    }
}, {strict: false, timestamps: true })

const mkeka_wa_leo = mongoose.connection.useDb('mkeka-wa-leo')
let model = mkeka_wa_leo.model('bin-supatips', supatipSchema)
module.exports = model