const mongoose = require('mongoose')
const Schema = mongoose.Schema

const keChannelsSchema = new Schema({
    ch_id: {
        type: Number,
    },
    ch_title: {
        type: String
    }
}, {strict: false, timestamps: true })

const model = mongoose.connection.useDb('ohmyNew').model('my_kenyan_channels', keChannelsSchema)
module.exports = model