/**
 * SPARTA – Express Email Server
 * POST /contact → sends styled HTML email via Nodemailer
 *
 * Setup:
 *   1. npm install
 *   2. Copy .env.example to .env and fill in your credentials
 *   3. node server.js
 */

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// CORS Middleware (allows requests from Live Server on port 5500)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ── Nodemailer Transporter ────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // your Gmail address
    pass: process.env.EMAIL_PASS    // Gmail App Password (NOT your real password)
  }
});

// ── Email HTML Template ───────────────────────────────────────────────────────
function buildEmailHTML({ name, email, phone, service, message }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0D0D0D; font-family: 'Arial', sans-serif; color: #ffffff; }
    .wrapper { max-width: 620px; margin: 0 auto; }
    .header {
      background: #0D0D0D;
      padding: 40px 48px;
      border-bottom: 3px solid #B11212;
      text-align: center;
    }
    .logo {
      font-size: 36px;
      font-weight: 900;
      letter-spacing: 4px;
      color: #B11212;
    }
    .tagline { font-size: 12px; color: #B3B3B3; letter-spacing: 3px; margin-top: 6px; }
    .body { background: #111111; padding: 48px; }
    .title {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 8px;
    }
    .subtitle { font-size: 14px; color: #B3B3B3; margin-bottom: 36px; }
    .field { margin-bottom: 24px; }
    .field-label {
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #B11212;
      margin-bottom: 6px;
      font-weight: 700;
    }
    .field-value {
      font-size: 15px;
      color: #ffffff;
      background: #1A1A1A;
      padding: 14px 18px;
      border-left: 3px solid #B11212;
      border-radius: 2px;
      line-height: 1.6;
    }
    .divider { height: 1px; background: rgba(255,255,255,0.08); margin: 32px 0; }
    .footer-email {
      background: #0D0D0D;
      padding: 28px 48px;
      text-align: center;
      border-top: 1px solid rgba(255,255,255,0.08);
    }
    .footer-email p { font-size: 12px; color: #B3B3B3; line-height: 1.8; }
    .footer-email a { color: #B11212; }
    .badge {
      display: inline-block;
      background: #B11212;
      color: #000;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      padding: 4px 14px;
      border-radius: 20px;
      margin-bottom: 24px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">SPARTA</div>
      <div class="tagline">ELITE CROSSFIT BOX</div>
    </div>
    <div class="body">
      <span class="badge">NEW ENQUIRY</span>
      <div class="title">New Contact Form Submission</div>
      <div class="subtitle">You have received a new message from your website contact form.</div>

      <div class="field">
        <div class="field-label">Full Name</div>
        <div class="field-value">${name}</div>
      </div>
      <div class="field">
        <div class="field-label">Email Address</div>
        <div class="field-value"><a href="mailto:${email}" style="color:#B11212">${email}</a></div>
      </div>
      <div class="field">
        <div class="field-label">Phone Number</div>
        <div class="field-value">${phone || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="field-label">Service Interested In</div>
        <div class="field-value">${service || 'General Enquiry'}</div>
      </div>
      <div class="divider"></div>
      <div class="field">
        <div class="field-label">Message</div>
        <div class="field-value">${message.replace(/\n/g, '<br/>')}</div>
      </div>
    </div>
    <div class="footer-email">
      <p>
        This email was sent from the SPARTA website contact form.<br />
        Reply directly to <a href="mailto:${email}">${email}</a> to respond to this enquiry.<br /><br />
        © 2026 SPARTA · Colombo, Sri Lanka
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// ── Validation ────────────────────────────────────────────────────────────────
function validateContactData({ name, email, message }) {
  const errors = [];
  if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email is required.');
  if (!message || message.trim().length < 10) errors.push('Message must be at least 10 characters.');
  return errors;
}

// ── Routes ────────────────────────────────────────────────────────────────────

// Contact form submission
app.post('/contact', async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  // Validate
  const errors = validateContactData({ name, email, message });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    // Compose mail options
    const mailOptions = {
      from: `"SPARTA Website" <${process.env.EMAIL_USER}>`,
      to: 'umarhunais2023@gmail.com',
      cc: 'ucode464@gmail.com',
      replyTo: email,
      subject: `[SPARTA] New Enquiry from ${name}`,
      html: buildEmailHTML({ name, email, phone, service, message }),
      text: `
New Contact Form Submission – SPARTA
==========================================
Name:    ${name}
Email:   ${email}
Phone:   ${phone || 'Not provided'}
Service: ${service || 'General Enquiry'}

Message:
${message}

Sent via SPARTA website contact form.
      `.trim()
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Email sent from ${email} (${name})`);
    return res.status(200).json({ success: true, message: 'Email sent successfully.' });

  } catch (err) {
    console.error('✗ Email error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to send email. Please try again.' });
  }
});

// Serve index for all other routes (SPA-style fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏋️  SPARTA server running at http://localhost:${PORT}`);
  console.log(`    Press Ctrl+C to stop.\n`);
});
