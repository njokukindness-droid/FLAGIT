# 🚩 FLAGIT — HSE Field Observation Platform

![FLAGIT Banner](https://img.shields.io/badge/FLAGIT-HSE%20Platform-FF6B35?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik02IDNoMTJ2MTJsLTYtMy02IDN6Ii8+PC9zdmc+)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Ready-purple?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)
![Resend](https://img.shields.io/badge/Resend-Email-000000?style=for-the-badge)

---

> **FLAGIT** is a mobile-first Progressive Web App (PWA) for HSE (Health, Safety & Environment) field observation tracking. Built for frontline safety teams to flag hazards, track corrective actions, and drive safety compliance — powered by AI.

---

## 🌐 Live Demo

🔗 [https://getflagit.com](https://getflagit.com)

---

## ✨ Features

- 🔐 **Secure Authentication** — Supabase-powered login, registration & password reset
- 📋 **HSE Observation Tracking** — Log unsafe acts, unsafe conditions, near misses & more
- 🤖 **AI-Powered Corrective Actions** — Anthropic Claude API suggests corrective actions instantly
- 📧 **Live Email Notifications** — Resend + getflagit.com domain for professional emails
- 📱 **Mobile-First PWA** — Installable on any device, works offline
- 🎨 **FLAGIT Coral-Orange Brand** — Custom branded UI with HSE-focused design
- 📊 **Observation Dashboard** — Track, filter and manage all field observations
- 🔔 **Real-time Alerts** — Instant supervisor notifications on critical observations
- 🛡️ **Role-Based Access** — Observer, Supervisor and Admin roles
- 📍 **Location Tagging** — Tag observations with site and location details

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Architecture** | Single-file PWA (Progressive Web App) |
| **Authentication** | Supabase Auth |
| **Database** | Supabase (PostgreSQL) |
| **Email Service** | Resend via SMTP + getflagit.com domain |
| **AI Engine** | Anthropic Claude API |
| **Hosting** | Vercel |
| **Domain** | getflagit.com (Namecheap) |

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Safari, Firefox, Edge)
- [Supabase](https://supabase.com) account
- [Resend](https://resend.com) account
- [Anthropic](https://anthropic.com) API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/kindnessN/flagit-app.git
cd flagit-app
```

2. **Open the project**
```bash
# Open with VS Code Live Server
# Or simply open index.html in your browser
```

3. **Configure your credentials**

Inside `index.html` find the configuration section and update:

```javascript
// Supabase Configuration
const SUPABASE_URL = 'your-supabase-project-url';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';

// Anthropic API
const ANTHROPIC_API_KEY = 'your-anthropic-api-key';
```

4. **Set up Supabase**
- Create a new Supabase project
- Enable Email Auth under Authentication → Providers
- Configure SMTP settings with Resend credentials
- Set Site URL to your deployment URL

5. **Deploy to Vercel**
- Push to GitHub
- Connect repo to [Vercel](https://vercel.com)
- Deploy with one click ✅

---

## 📧 Email Configuration

FLAGIT uses **Resend** for transactional emails via custom SMTP:

```
Host:     smtp.resend.com
Port:     465
Username: resend
Password: YOUR_RESEND_API_KEY
Sender:   noreply@getflagit.com
```

Email types supported:
- ✅ User invitation emails
- ✅ Password reset emails
- ✅ Email confirmation
- ✅ HSE observation alerts *(coming soon)*

---

## 🤖 AI Corrective Actions

FLAGIT uses the **Anthropic Claude API** to automatically suggest corrective actions for flagged HSE observations:

```javascript
// Example AI prompt for corrective action
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `Suggest corrective actions for this HSE observation: ${observation}`
    }]
  })
});
```

---

## 📱 PWA Installation

FLAGIT is fully installable as a Progressive Web App:

1. Open [getflagit.com](https://getflagit.com) in Chrome or Safari
2. Tap **"Add to Home Screen"** when prompted
3. FLAGIT launches like a native app ✅

---

## 🗂️ Project Structure

```
flagit-app/
│
├── index.html          # Complete single-file PWA application
├── README.md           # Project documentation
└── assets/             # (optional) Icons and images
```

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `ANTHROPIC_API_KEY` | Your Anthropic Claude API key |
| `RESEND_API_KEY` | Your Resend email API key |

---

## 🗺️ Roadmap

- [x] Authentication flows (Login, Register, Reset Password)
- [x] HSE Observation submission form
- [x] AI-powered corrective action suggestions
- [x] Coral-orange FLAGIT brand design
- [x] Supabase backend integration
- [x] Resend email service integration
- [x] Custom domain (getflagit.com)
- [ ] Real-time observation dashboard
- [ ] Push notifications
- [ ] Offline mode & sync
- [ ] PDF observation reports
- [ ] Multi-site management
- [ ] Analytics & HSE metrics dashboard
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Kindness Njoku**
- GitHub: [@kindnessN](https://github.com/kindnessN)
- App: [getflagit.com](https://getflagit.com)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Supabase](https://supabase.com) — Backend & Authentication
- [Resend](https://resend.com) — Email Infrastructure
- [Anthropic](https://anthropic.com) — AI Engine (Claude)
- [Vercel](https://vercel.com) — Hosting & Deployment
- [Namecheap](https://namecheap.com) — Domain Registration

---

<div align="center">

**Built with ❤️ for HSE professionals worldwide**

🚩 **FLAGIT — Flag It. Fix It. Stay Safe.**

</div>
