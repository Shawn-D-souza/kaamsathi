# KaamSathi

> A peer-to-peer service marketplace where you can post jobs and find help, or bid on jobs to offer your services.

---

## Core Concept

KaamSathi is a P2P marketplace built on a bidding model, similar to Freelancer.com. The core of the app is a dual-role system where every user can be both a "Seeker" and a "Provider."

* **"Seekers"** post a job or task they need done.
* **"Providers"** browse available jobs and place bids.
* The **Seeker** reviews the bids and accepts one, creating a private chat to start the job.

## 🚀 Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (with App Router)
* **Backend & DB:** [Supabase](https://supabase.com/) (Auth, Postgres, Realtime, Storage)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Platform:** PWA (Progressive Web App)
* **Native Wrapper:** [CapacitorJS](https://capacitorjs.com/) (for eventual APK/iOS build)

## 🎨 Brand & UI

* **Primary (Blue):** `#005A9C` (Used for headers, nav bars)
* **Accent (Orange):** `#FF6700` (Used for all buttons and interactive actions)
* **Text (Dark Grey):** `#212121`
* **Background (White):** `#FFFFFF`

## 🏃‍♂️ Getting Started

### 1. Prerequisites

* Node.js (v18 or later)
* npm / pnpm / yarn
* A Supabase account (create one [here](https://supabase.com/))

### 2. Set Up Supabase

1.  Create a new project in your Supabase dashboard.
2.  Go to the **SQL Editor** and run any SQL scripts from this repo (we will add these later) to create your tables (`profiles`, `jobs`, `bids`, etc.).
3.  Go to **Project Settings** > **API**. You will need two values:
    * `Project URL`
    * `Project API Key (anon public)`

### 3. Install & Run Locally

1.  Clone the repository:
    ```bash
    git clone [https://github.com/Shawn-D-souza/kaamsathi.git](https://github.com/Shawn-D-souza/kaamsathi.git)
    cd kaam-sathi
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create your local environment file. Make a copy of `.env.local.example` (which we'll create soon) and name it `.env.local`. Add your Supabase keys:
    ```
    NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PROJECT_API_KEY
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.