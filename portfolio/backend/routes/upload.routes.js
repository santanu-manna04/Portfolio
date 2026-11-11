const express = require('express');
const { param } = require('express-validator');
const { adminOnly } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { projectUpload, certificateUpload } = require('../middleware/uploads');
const controller = require('../controllers/upload.controller');

const router = express.Router();
const id = [param('id').isMongoId().withMessage('Invalid id'), validate];

router.post('/projects/:id/thumbnail', adminOnly, id, projectUpload.single('file'), controller.uploadThumbnail);
router.delete('/projects/:id/thumbnail', adminOnly, id, controller.removeThumbnail);
router.post('/projects/:id/screenshots', adminOnly, id, projectUpload.array('files', 10), controller.uploadScreenshots);
router.delete('/projects/:id/screenshots/:index', adminOnly, id, param('index').isInt({ min: 0, max: 9 }).toInt(), validate, controller.removeScreenshot);
router.post('/certificates/:id/file', adminOnly, id, certificateUpload.single('file'), controller.uploadCertificateFile);
router.delete('/certificates/:id/file', adminOnly, id, controller.removeCertificateFile);

module.exports = router;
