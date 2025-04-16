const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')

cloudinary.config()

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'stpericial',
        allowed_format: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'pdf'],
        resource_type: 'auto',
    }
})

module.exports = {storage}