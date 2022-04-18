const Router = require('express').Router();
const passport = require('passport');
const path = require('path');
const fs = require('fs');

const {nft} = require('../models/nft');

var supportedExtension = [".jpeg", ".jpg", ".png"];

Router.post('/', passport.authenticate('jwt', {session:false, failureRedirect: '/unauthorized'}), (req, res) => {
    const errors = {
        nftImage: [],
        item_name: [],
        general: []
    }
    if(Object.keys(req.files).length === 0) {
        errors.nftImage.push("NFT image is required.");
        return res.status(403).json({success:false, errors: errors});
    }
    if(typeof req.body.item_name === 'undefined' || req.body.item_name === '') {
        errors.item_name.push("Item name is required.");
        return res.status(403).json({success:false, errors: errors});
    }
    else {
        let ImageFile = req.files.ImageFile;
        let timestamp = Math.floor(+new Date() / 1000);
        if(supportedExtension.includes(path.extname(ImageFile.name))) {
            let filename = timestamp.toString()+path.extname(ImageFile.name);
            ImageFile.mv(path.join(__dirname, '../', 'public', 'NFTS', filename), function(err) {
                if(err) {
                    return res.status(403).json({success:false, message: err.message});
                } else {
                    nft.create({
                        user_id: req.user.id,
                        item_name: req.body.item_name,
                        image_path: process.env.BASE_URL + '/nfts/images?image_id=' + timestamp,
                        nft_id: timestamp,
                        file_extension: path.extname(ImageFile.name)
                    }).then(function(newNft) {
                        return res.status(201).json({success:true, message: "Nft has been created."});
                    }).catch(function(err) {
                        errors.general.push(err.message);
                        return res.status(403).json({success:false, errors:errors});
                    })
                }
            });
        } else {
            errors.nftImage.push("File should be an Image file.");
            return res.status(403).json({success:false, errors: errors});
        }
    }
})

Router.get("/images", (req, res) => {
    const errors = {
        image_id: [],
        general: []
    }
    if(typeof req.query.image_id === 'undefined' || req.query.image_id === "") {
        errors.image_id.push("Image id is required.");
        return res.status(403).json({success:false, errors:errors});
    } else {
        nft.findOne({nft_id: req.query.image_id}).then(function(nft) {
            if(!nft) {
                errors.image_id.push("Image id is invalid.");
                return res.status(403).json({success: false, errors:errors});
            } else {
                fs.readFile(path.join(__dirname, '..', 'public','NFTS' , nft.nft_id+nft.file_extension), function(err, data) {
                    if(err) {
                        errors.image_id.push(err.message);
                        return res.status(404).json({success:false, errors:errors});
                    } else {
                        res.writeHead(200, {'Content-Type': +nft.file_extension.substring(1, nft.file_extension.length)});
                        res.end(data);
                    }
                })
            }
        })
    }
})

Router.get('/all', passport.authenticate('jwt', {session: false, failureRedirect: '/unauthorized'}), (req, res) => {
    nft.find({user_id: req.user.id}).then(function(nfts) {
        return res.status(200).json({success:true, data: nfts});
    })
})

Router.put('/', passport.authenticate('jwt', {session: false, failureRedirect: '/unauthorized'}), (req, res) => {
    const errors = {
        nftImage: [],
        item_name: [],
        general: []
    }
    const oldNft = {
        id: '',
        nftFile: null,
        nftFilename: '',
        item_name: '',
        nft_id: '',
        file_extension: ''
    }
    if (typeof req.body.item_name !== 'undefined' || req.body.item_name !== "") {
        oldNft.item_name = req.body.item_name
    }
    if (Object.keys(req.files ? req.files : {}).length > 0) {
        oldNft.nftFile = req.files.ImageFile
        if(supportedExtension.includes(path.extname(oldNft.nftFile.name))) {
            let timestamp = Math.floor(+new Date() / 1000);
            oldNft.timestamp = timestamp;
            oldNft.file_extension = path.extname(oldNft.nftFile.name);
            let filename = timestamp.toString()+path.extname(oldNft.nftFile.name);
            oldNft.nftFile.mv(path.join(__dirname,'../','public', 'NFTS', filename), function(err) {
                if(err) {
                    errors.general.push(err.message);
                    return res.status(403).json({success:false, errors:errors});
                }
            })
        } else {
            errors.nftImage.push("File type is supported.");
            return res.status(403).json({success:false, errors:errors});
        }
    }
    if(typeof req.body.id !== 'undefined' || req.body.id !== '') {
        oldNft.id = req.body.id;
        nft.findOne({_id: oldNft.id}).then(foundNft => {
            if(foundNft) {
                foundNft.item_name = oldNft.item_name !== "" ? oldNft.item_name : foundNft.item_name;
                if(oldNft.nftFile) {
                    let imagePath = process.env.BASE_URL + '/nfts/images?image_id=' + oldNft.timestamp;
                    foundNft.image_path = imagePath;
                    foundNft.nft_id = oldNft.timestamp;
                    foundNft.file_extension = oldNft.file_extension
                }
                foundNft.save().then(function(nft) {
                    if(nft) {
                        return res.status(201).json({success:true, message: "NFT Updated successfully", data: {nft}});
                    } else {
                        return res.status(403).json({success:false, message: "cant update document."})
                    }
                }).catch(function(error) {
                    return res.status(403).json({success:false, message: "something went wrong.", error: error.message});
                });
            } else {
                errors.general.push("Nft not found.");
                return res.status(403).json({success:false, errors:errors});
            }
        }).catch(error => {
            errors.general.push(error.message);
            return res.status(403).json({success:false, errors:errors})
        })
        
    } else {
        errors.general.push("NFT-id is required.");
        return res.status(403).json({success:false, errors:errors});
    }
    
})

module.exports = Router;