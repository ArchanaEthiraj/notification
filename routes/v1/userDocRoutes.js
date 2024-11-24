const express = require('express')
const { authenticating, checkVendor } = require('../../middleware/userAuthenticate')
const { createDocument, updateDocument } = require('../../controller/userDocumentController')
const upload = require('../../middleware/upload')
const router = express.Router()

router.post('/create', authenticating, checkVendor, upload.single('files'), createDocument)
router.get('/update', updateDocument)

module.exports = router
