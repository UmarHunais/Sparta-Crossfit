# 🏋️ MY FITNESS – Premium Gym Website

A complete, pixel-perfect gym website with neon green aesthetic, full animations, and email backend.

---

## 📁 File Structure

```
myfitness/
├── index.html          ← Homepage
├── about.html          ← About Us page
├── services.html       ← Services page
├── pricing.html        ← Pricing / Plans page
├── contact.html        ← Contact form page
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← Animations, slider, counters
├── server.js           ← Node.js + Express email backend
├── package.json
├── .env.example        ← Copy to .env with your credentials
└── .gitignore
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure email credentials
```bash
cp .env.example .env
```
Then edit `.env`:
```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
```

**How to get a Gmail App Password:**
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification (must be enabled)
3. App passwords → Create → Name it "MY FITNESS"
4. Copy the 16-character password into `.env`

### 3. Start the server
```bash
npm start
```

Visit: **http://localhost:3000**

---

## ✨ Features

- **5 full pages**: Home, About, Services, Pricing, Contact
- **Hero slider** with auto-advance and manual controls
- **Animated progress bars** triggered on scroll
- **Animated stat counters** (25+, 4K+, 150+, 50+)
- **Service cards** with neon hover effect
- **Sticky navbar** with scroll transparency
- **Mobile hamburger** nav with slide animation
- **Scroll reveal** fade-up animations
- **Button shine** hover effect
- **Parallax** hero image
- **Contact form** with loading state, success/error messages
- **Email backend** with beautiful HTML template sent to both addresses

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Accent | `#B11212` |
| Background | `#0D0D0D` |
| Secondary BG | `#111111` / `#1A1A1A` |
| Text Primary | `#FFFFFF` |
| Text Muted | `#B3B3B3` |
| Heading Font | Bebas Neue |
| Body Font | Poppins |

---

## 📧 Email Recipients

- **Primary:** umarhunais2023@gmail.com  
- **CC:** ucode464@gmail.com

---

## 🔒 Security Notes

- **NEVER** commit `.env` to Git (it's in `.gitignore`)
- Use Gmail App Passwords, not your real password
- Change your App Password immediately if accidentally exposed
