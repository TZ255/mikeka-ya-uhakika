const mongoose = require('mongoose')
const Schema = mongoose.Schema

const deleteSchema = new Schema({
    chatid: {
        type: Number,
    },
    msgid: {
        type: Number,
    }
}, {strict: false, timestamps: true })

const ohMy = mongoose.connection.useDb('ohmyNew')
const model = ohMy.model('Messages to Delete', deleteSchema)
module.exports = model