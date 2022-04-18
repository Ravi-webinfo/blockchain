const mongoose = require('mongoose')

const userTrackSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_account'
    },
    device_info: {
        type: String
    },
    ip_address: {
        type: String,
        required: true
    },
    visit_time: {
        type:String
    },
    visit_type: {
        type: String,
        requried: true
    }
}, { timestamps: true })

module.exports.user_track = mongoose.model('user_track', userTrackSchema);