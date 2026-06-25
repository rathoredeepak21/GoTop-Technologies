# NEXVORA TECHNOLOGIES - Product Management Platform

NEXVORA TECHNOLOGIES is a world-class technology company website and admin platform designed with a futuristic dark theme, neon blue accents, and glassmorphism. It enables publishing, cataloging, and updating application releases (APKs) under a single consolidated brand.

This platform has been migrated to a fully serverless **React + Supabase** architecture, removing all legacy MongoDB and Firebase dependencies.

---

## Technical Stack

* **Frontend:** React, Tailwind CSS, Framer Motion, Lucide Icons, React Router
* **Backend & Database:** Supabase (PostgreSQL, Supabase Auth, Supabase Storage, Row Level Security)
* **Hosting:** Static SPA Hosting (e.g., Vercel, Netlify)

---

## Directory Layout

```
MyWeb/
├── frontend/               # React client built on Vite
│   ├── public/             # Public assets (logos, placeholders, robots.txt)
│   ├── src/
│   │   ├── admin/          # Admin CRUD managers, Analytics SVG graphs, Settings
│   │   ├── components/     # Navbar, Footer, and Particle Canvas Background
│   │   ├── config/         # Supabase Client SDK initialization
│   │   ├── context/        # Supabase Auth and branding settings providers
│   │   ├── pages/          # Home, About, Services, Apps, Details, Downloads, Contact
│   │   └── utils/          # Client-side database seeder
│   ├── .env.example        # Environment variable template
│   ├── index.html          # SPA Root
│   ├── tailwind.config.js  # Styling guidelines
│   └── package.json        # Frontend NPM configuration
├── run-project.bat         # Centralized console control dashboard
└── README.md               # Main repository documentation
```

---

## Supabase Integration

All services connect directly from the React client to Supabase:
1. **Authentication:** Supabase Auth for secure Admin Login.
2. **Database:** Supabase PostgreSQL for apps, categories, announcements, admin records, and telemetry/analytics logs.
3. **Storage:** Supabase Storage for secure hosting of APK binaries, application logos, showcase screenshots, and company assets.
4. **Security:** Protected by PostgreSQL Row Level Security (RLS) policies and Storage policies.

---

## Getting Started

### 1. Supabase Setup
Please refer to the detailed `supabase_setup_guide.md` in the artifacts folder for step-by-step instructions on:
* Creating a Supabase project.
* Creating database tables using DDL scripts.
* Creating storage buckets (`apk-files`, `app-logos`, `screenshots`, `company-assets`).
* Enabling RLS and Storage policies.

### 2. Configure Environment Variables
Copy `.env.example` in the `frontend` folder to a new file `.env` and fill in your credentials:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Running in Development Mode
* Double-click `run-project.bat` in the root folder and select option `[2]`.
* Or run in your terminal:
  ```bash
  cd frontend
  npm run dev
  ```
* Open the browser at `http://localhost:3000`.

### 4. Database Seeding
To populate mock categories, default applications, news articles, and analytics logs:
* Log into the Admin Panel at `/admin/login` using your registered administrator credentials.
* Go to the Dashboard page (`/admin/dashboard`).
* Click the **"Seed Database"** button in the top-right header and confirm the action.

---

## Frontend Deployment

To compile the production-ready static bundle:
* Select option `[3]` in the `run-project.bat` menu, or run:
  ```bash
  cd frontend
  npm run build
  ```
* Deploy the compiled files in `frontend/dist` to any static hosting provider (e.g., Vercel, Netlify). Make sure to configure the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` variables in your provider's settings.
