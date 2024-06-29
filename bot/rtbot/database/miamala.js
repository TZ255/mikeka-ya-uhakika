const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MiamalaSchema = new Schema({
    txid: { type: String },
    phone: { type: String },
    name: { type: String },
    amt: { type: Number },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: '3d'
    }
}, { strict: false, timestamps: false });

const ohymy = mongoose.connection.useDb('ohmyNew');
const model = ohymy.model('Miamala', MiamalaSchema);
module.exports = model;