const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RTdeleteSchema = new Schema({
    userid: {
        type: Number,
    },
    msgid: {
        type: Number,
    },
    bot: {
        type: String,
    }
}, {strict: false, timestamps: true })

const ohMy = mongoose.connection.useDb('ohmyNew')
const model = ohMy.model('RT Delete Msgs', RTdeleteSchema)
module.exports = model