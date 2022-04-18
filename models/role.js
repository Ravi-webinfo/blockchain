const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports.roles = mongoose.model('role', roleSchema);