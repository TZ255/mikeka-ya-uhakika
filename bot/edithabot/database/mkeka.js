const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mkekaSchema = new Schema({
    mid: {
        type: Number,
    },
    brand: {
        type: 'String'
    }
}, {strict: false, timestamps: true })

const model = mongoose.connection.useDb('ohmyNew').model('mkekaModel', mkekaSchema)
module.exports = model