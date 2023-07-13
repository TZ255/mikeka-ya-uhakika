const mongoose = require('mongoose')
const Schema = mongoose.Schema

const aliSchema = new Schema({
    msgid: {type: Number},
    affLink: {type: String}
}, {strict: false, timestamps: false })

const ohymy = mongoose.connection.useDb('ohmyNew')
const model = ohymy.model('AliexpressDB', aliSchema)
module.exports = model