const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pipySchema = new Schema({
    chatid: {
        type: Number,
    },
    username: {
        type: String
    },
    refferer: {
        type: String,
        default: 'Dayo'
    },
    promo: {
        type: String,
        default: 'unknown'
    },
    blocked: {type: Boolean, default: false}
}, {strict: false, timestamps: true })

const ohMy = mongoose.connection.useDb('ohmyNew')
const model = ohMy.model('Dayo-Users', pipySchema)
module.exports = model