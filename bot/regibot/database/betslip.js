const mongoose = require('mongoose')
const Schema = mongoose.Schema

const slipSchema = new Schema({
    date: {
        type: String,
    },
    match: {
        type: String,
    },
    tip: {
        type: String,
    },
    odd: {
        type: String,
    },
}, {strict: false, timestamps: true })

const mkeka_wa_leo = mongoose.connection.useDb('mkeka-wa-leo')
let model = mkeka_wa_leo.model('betslip', slipSchema)
module.exports = model