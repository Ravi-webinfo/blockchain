const mongoose = require('mongoose')

const NFTSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        require:true
    },
    item_name: {
        type: String,
        require: true
    },
    image_path: {
        type:String,
        require: true
    },
    file_extension: {
        type: String,
        require: true
    },
    nft_id: {
        type: String,
        require: true
    },
    mint_id: {
        type: Number
    }
}, {timestamps: true})

module.exports.nft = mongoose.model('nft', NFTSchema);