const mongoose = require('mongoose')
const Schema = mongoose.Schema

const kenyaSchema = new Schema({
    chatid: {
        type: Number,
    },
    username: {
        type: String
    },
    blocked: {
        type: Boolean,
        default: false
    }
}, {strict: false, timestamps: true })

const KenyanNyumbuModel = mongoose.connection.useDb('ohmyNew').model('kenyan Nyumbu', kenyaSchema)
module.exports = KenyanNyumbuModel