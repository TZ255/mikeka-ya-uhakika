const mongoose = require('mongoose')
const Schema = mongoose.Schema

const graphSchema = new Schema({
    link: {
        type: String,
    },
    siku: {
        type: String
    },
    loaded: {
        type: Number,
        default: 1
    },
    tiktok: {
        type: Number,
        default: 1
    }
}, {strict: false })

const mkeka_wa_leo = mongoose.connection.useDb('mkeka-wa-leo')
let model = mkeka_wa_leo.model('graph-tips', graphSchema)
module.exports = model