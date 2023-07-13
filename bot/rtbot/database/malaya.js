const mongoose = require('mongoose')
const Schema = mongoose.Schema

const malayaSchema = new Schema({
    mkoa: {
        type: String
    },
    poaId: {
        type: String
    }
}, {strict: false, timestamps: true })

const ohmyNew = mongoose.connection.useDb('ohmyNew')
const model = ohmyNew.model('malaya-db', malayaSchema)
module.exports = model