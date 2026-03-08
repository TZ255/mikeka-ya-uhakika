const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tgSchema = new Schema({
    uniqueId: {
        type: String
    },
    fileId: {
        type: String
    },
    fileType: {
        type: String,
    },
    caption: {
        type: String
    },
    caption_entities: {
        type: Array, default: []
    },
    nano: {
        type: String,
        unique: true
    },
    msgId: {
        type: Number
    },
    backup: {
        type: Number
    }

}, { timestamps: true })

const ohymy = mongoose.connection.useDb('ohmyNew')
const model = ohymy.model('tgDb', tgSchema)
module.exports = model