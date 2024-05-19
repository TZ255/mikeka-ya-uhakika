const mongoose = require('mongoose')
const Schema = mongoose.Schema

const vrfySchema = new Schema({
    chatid: {
        type: Number,
    },
    username: {
        type: String,
        default: 'unknown'
    },
    fname: {
        type: String,
        default: 'unknown'
    },
    paid: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'dada'
    },
    again: {
        type: Number,
        default: 173
    }
}, {strict: false, timestamps: true })

const ohMy = mongoose.connection.useDb('ohmyNew')
const model = ohMy.model('Veified List', vrfySchema)
module.exports = model