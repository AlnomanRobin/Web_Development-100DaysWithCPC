# Portfolio — Md. Alnoman Robin Mrida

This repository contains a responsive personal portfolio website built with HTML, CSS and JavaScript. It includes a simple Express contact endpoint and a PHP fallback for sending mail.

Structure

index.html
css/
  style.css
js/
  script.js
php/
  contact.php
node/
  server.js
  routes/contact.js
assets/
  profile.jpg
  CV_Alnoman_Robin.pdf
  favicon.png
  og-image.jpg
  projects/
  gallery/

Quick start (static preview)

1. Open `index.html` in your browser for a static preview.

Run Node API (optional)

1. Install Node.js (>=14) and npm.
2. From the project folder run:

```powershell
cd e:\CPC\Web_Development-100DaysWithCPC\phase-03\Day-30
npm init -y
npm install express cors multer
node node/server.js
```

3. Visit `http://localhost:3000` to preview the site and use the contact form (the server returns JSON and logs the submission). To actually send email, replace the placeholder in `node/routes/contact.js` with `nodemailer` configuration (example below).

Nodemailer example (optional)

Install: `npm install nodemailer`

Then inside the contact route, create a transporter and send mail using `transporter.sendMail(...)`.

PHP fallback

Upload the site to a PHP-enabled server and point the contact form `action` to `php/contact.php` (or leave the JS fallback which uses `mailto:` if server is unavailable).

Notes

- All social links and the CV download link are wired to the provided URLs and `assets/CV_Alnoman_Robin.pdf`.
- Theme preference is persisted in `localStorage`.
- Header hides on scroll down and reveals on scroll up.
- Images under `assets/` are lazy-loaded.

If you want, I can:

- Wire up an actual email sender with `nodemailer` and environment variables (I'll add example `.env` handling).
- Create a React single-file component version.
- Minify CSS/JS and bundle for production.
