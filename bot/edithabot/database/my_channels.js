const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ugChannelsSchema = new Schema({
    ch_id: {
        type: Number,
    },
    ch_title: {
        type: String
    }
}, {strict: false, timestamps: true })

const model = mongoose.connection.useDb('ohmyNew').model('my_ugandan_channels', ugChannelsSchema)
module.exports = model