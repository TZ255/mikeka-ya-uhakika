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
        default: 'Pipy'
    }
}, {strict: false, timestamps: true })

const ohMy = mongoose.connection.useDb('ohmyNew')
const model = ohMy.model('PipyTida-Users', pipySchema)
module.exports = model