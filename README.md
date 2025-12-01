# **KaamSaathi**

A peer-to-peer marketplace where users can **post jobs**, **place bids**, and **hire providers** for local or remote tasks.  


**🔗 Live Demo:** https://kaamsaathi.netlify.app/

## 🧠 Core Concept

KaamSaathi is a simple and fast P2P marketplace optimized for everyday tasks—local or remote.

Every user can instantly switch between two roles:

- **Seeker** → Posts jobs needing help  
- **Provider** → Browses jobs & places bids  

**Flow:**

1. Seeker posts a job (with budget, description, location, radius).  
2. Providers within the visibility radius (or anywhere for remote jobs) can bid.  
3. Seeker accepts one or multiple bids.  
4. A private realtime chat opens.  
5. Job is completed → Provider gets rated.

## **🚀 Tech Stack**

* **Framework:** [Next.js 15+](https://nextjs.org/) (App Router, Server Actions, TypeScript)  
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)  
* **Backend & Auth:** [Supabase](https://supabase.com/) (Postgres, Auth, Realtime, Storage)  
* **Maps & Location:** [Leaflet](https://leafletjs.com/) (React Leaflet) \+ [PostGIS](https://postgis.net/) (Geospatial queries)  
* **Icons:** [Lucide React](https://lucide.dev/)  
* **Deployment:** [Netlify](https://www.netlify.com/) / [Vercel](https://vercel.com/)

## 🎨 Branding & UI

| Usage | Color |
|-------|--------|
| Primary | `#005A9C` |
| Accent | `#FF6700` |
| Background | `#F9FAFB` |

## 🛠️ Features

### 🔐 Authentication & User System

- Email/password signup & login (Supabase Auth)  
- Secure role-switching: Seeker ↔ Provider  
- Profile editing & avatar upload  
- Password reset flow  

### 📌 Marketplace — Seeker

- Post jobs with title, description, budget, deadline  
- Select job location on map  
- Control job visibility using **radius**  
- Hire multiple providers for the same job  
- Manage bids, accept/reject  
- Mark job as completed  
- Rate and review providers  

### 🎯 Marketplace — Provider

- Smart job feed filtered by:
  - Remote jobs  
  - Local jobs within your service zones  
- Define multiple **Service Zones** (circular radius areas)  
- Place and track bids  
- View bid status (Pending / Accepted / Rejected)

### 💬 Communication

- Realtime chat between Seekers & accepted Providers  
- Live status updates for bids and job completion  

## 🏃‍♂️ Getting Started Locally

### 1. Prerequisites

- Node.js v18+  
- npm / pnpm / yarn  
- A Supabase account  

### 2. Supabase Setup

1. **Create a new project** in the Supabase dashboard.  
2. **Run SQL scripts** from the `/supabase` folder in this order:

```
1. schema.sql
2. jobs.sql
3. bids.sql
4. messages.sql
5. reviews.sql
6. locations.sql
7. rpc.sql
8. storage.sql
```

3. **Storage Setup**
   - Create a **public bucket** named `avatars`
   - Limit file size to **2MB**
   - Allow MIME types: `image/*`

4. **API Keys**
   - Go to **Settings → API**
   - Copy:  
     - `Project URL`  
     - `Anon Key`

### 3. Install & Run the Project

#### Clone the repo

```bash
git clone https://github.com/Shawn-D-souza/kaamsathi.git
cd kaamsathi
```

#### Install dependencies

```bash
npm install
```

#### Create environment variables

Create a file: `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Start the development server

```bash
npm run dev
```
