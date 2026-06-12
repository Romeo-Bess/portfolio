<div align="center">

<img src="public/assets/logo.png" alt="Romeo Bessenaar" width="100" style="border-radius: 50%;" />

# Romeo Bessenaar — Portfolio

**Network & Systems Engineer · Salesforce Developer · Lab Automation Specialist**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-backend-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[🌐 Live Demo](https://romeo-bess.github.io/portfolio) · [📧 Contact](mailto:bessenaarr@gmail.com) · [💼 LinkedIn](https://linkedin.com/in/romeo-bessenaar-b21044209)

</div>

---

## 📸 Overview

A fully custom-built, production-grade personal portfolio showcasing my professional journey as a Network & Systems Engineer with hands-on experience in Salesforce development, lab automation, and full-stack web engineering.

Built from scratch using **React 19 + TypeScript + Vite**, with a Supabase backend powering dynamic projects, blog posts, and a contact form — all wrapped in a polished, multi-theme UI.

---

## ✨ Features

- 🎨 **5 switchable themes** — Luminous, Obsidian, Aurora, Ocean, Sunset
- 🤖 **AI-style Chatbot Assistant** — Answers questions about my background, skills, and projects with a rich knowledge base
- 🎥 **Cinematic Hero** — Personal video background with smooth overlays
- 📊 **Live GitHub Dashboard** — Fetches real-time repo data via GitHub API
- 🗂️ **Dynamic Project Case Studies** — Supabase-powered with live interactive demos
- 📝 **Technical Blog** — Full markdown-style articles stored in Supabase
- 📬 **Contact Form** — Validated with React Hook Form + Zod, submitted via Supabase
- 🔍 **Global Search** (`Ctrl+K`) — Command palette to navigate anywhere instantly
- 📱 **Fully Responsive** — Mobile-first design, works on all screen sizes
- ⚡ **Blazing Fast** — Vite build with code splitting and asset optimisation

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 + custom design tokens |
| State | Zustand |
| Animations | Framer Motion |
| Backend / DB | Supabase (PostgreSQL) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | Lucide React + Material Symbols |
| Deployment | GitHub Pages (`gh-pages`) |

---

## 🗂️ Project Structure

```
portfolio/
├── public/
│   └── assets/             # Static assets (logo, video)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── ChatbotWidget.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   └── CommandPalette.tsx
│   ├── pages/              # Route-level page components
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── Blog.tsx
│   │   ├── Contact.tsx
│   │   ├── Skills.tsx
│   │   ├── Resume.tsx
│   │   ├── GitHub.tsx
│   │   └── Experience.tsx
│   ├── store/              # Zustand global state
│   ├── supabase/           # Supabase client
│   └── App.tsx             # Router + theme setup
├── .env.example            # Environment variable template
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- A free [Supabase](https://supabase.com) project

### 1. Clone the repository

```bash
git clone https://github.com/Romeo-Bess/portfolio.git
cd portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Then fill in your values in `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_GITHUB_USERNAME=your_github_username
```

### 4. Run the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🗄️ Supabase Database Schema

The portfolio requires the following Supabase tables:

```sql
-- Projects table
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  long_description text,
  technologies text[],
  thumbnail text,
  category text,
  featured boolean default false,
  github_url text,
  live_url text,
  created_at timestamptz default now()
);

-- Blog posts table
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  published_at timestamptz default now(),
  reading_time int
);

-- Contact messages table
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz default now()
);
```

---

## 🌐 Deployment to GitHub Pages

This project is pre-configured for GitHub Pages deployment.

### 1. Update `vite.config.ts`

If your repo is at `github.com/Romeo-Bess/portfolio`, update the base:

```ts
base: "/portfolio/",
```

> If using a custom domain, keep `base: "./"`.

### 2. Deploy

```bash
npm run deploy
```

This builds the project and pushes the `dist/` folder to the `gh-pages` branch automatically.

### 3. Enable GitHub Pages

In your repo → **Settings → Pages → Source**: select the `gh-pages` branch.

---

## 🤖 Chatbot Knowledge Base

The AI-style chatbot (`ChatbotWidget.tsx`) comes with a built-in knowledge base covering:

| Topic | Keywords |
|---|---|
| 🌐 Networking | network, CCNA, VLAN, DHCP, routing, switching |
| 🎓 Education | CPUT, Cape Peninsula, diploma, ICT |
| 🏥 Groote Schuur | hospital, internship, endpoints, GSH |
| 💼 Salesforce | Apex, LWC, SOQL, Micronetbd, CRM |
| 🔬 Lab Work | Umane, pathology, histology, automation |
| 🗂️ Projects | demo, runner, scraper, snake, music |
| ⚡ Tech Stack | skills, stack, technologies |
| 📞 Contact | email, phone, LinkedIn, hire |

To extend the chatbot, add entries to the `KB` object in `ChatbotWidget.tsx`.

---

## 📄 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Build + deploy to GitHub Pages |

---

## 📝 License

This project is licensed under the **MIT License** — feel free to use it as inspiration for your own portfolio, but please don't copy it verbatim.

---

<div align="center">

Designed & built by **Romeo Bessenaar** — Cape Town, South Africa 🇿🇦

[bessenaarr@gmail.com](mailto:bessenaarr@gmail.com) · [LinkedIn](https://linkedin.com/in/romeo-bessenaar-b21044209)

</div>
