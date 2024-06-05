const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    msgid: {
        type: Number,
    },
    times: {
        type: Number,
        default: 0
    },
    chid: {
        type: Number
    },
    title: {
        type: String
    }
}, {strict: false, timestamps: true })

const ohMy = mongoose.connection.useDb('ohmyNew')
const model = ohMy.model('Z Link List', postSchema)
module.exports = model