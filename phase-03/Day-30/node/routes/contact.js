const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Accept file uploads to a temp folder (memory storage could be used too)
const upload = multer({ dest: path.join(__dirname, '../../tmp-uploads') });

// Basic POST /api/contact
router.post('/contact', upload.single('attach'), (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ success:false, error: 'Missing required fields' });

  // TODO: Integrate nodemailer or other mail service here.
  console.log('Contact form received:', { name, email, subject });
  if (req.file) console.log('Attachment:', req.file.originalname, req.file.path);

  // Respond success for now
  return res.json({ success:true });
});

module.exports = router;
