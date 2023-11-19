const multer  = require('multer')

/**
 * Storage to save images in uploads directory.
 * On file saving, it assigns a unique filename by stamping current date-time.
 * A CDN (content delivery network) integration is a must to save media files.
 * According to price and security, any CDN can be selected to serve public media files later on.
 * @type {DiskStorage}
 */
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.png')
    }
})
const upload = multer({storage: storage})

const User = require('../models/User')

module.exports = {
    upload
}