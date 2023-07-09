const mongoose = require('mongoose')
const Schema = mongoose.Schema

const nyumbuSchema = new Schema({
    chatid: {
        type: Number,
    },
    cha_id: {
        type: Number
    }
}, {strict: false, timestamps: true })

const ohMy = mongoose.connection.useDb('ohmyNew')
const model = ohMy.model('tempChats', nyumbuSchema)
module.exports = model