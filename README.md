# **KaamSaathi**

A peer-to-peer service marketplace where students can post jobs and find help, or bid on jobs to offer their services.

**Live Demo:** [https://kaamsaathi.netlify.app/](https://kaamsaathi.netlify.app/)

## **Core Concept**

KaamSaathi is a P2P marketplace built on a bidding model, similar to Freelancer.com but tailored for students. The core of the app is a **dual-role system** where every user can be both a "Seeker" and a "Provider," toggled instantly from their profile.

* **"Seekers"** post a job or task they need done (e.g., "Need assignment help").  
* **"Providers"** browse available jobs and place bids.  
* The **Seeker** reviews the bids and accepts one, creating a private chat to start the job.

## **🚀 Tech Stack**

* **Framework:** [Next.js 15+](https://nextjs.org/) (App Router, TypeScript)  
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)  
* **Backend & Auth:** [Supabase](https://supabase.com/) (Postgres, Auth with @supabase/ssr, Realtime)  
* **Icons:** [Lucide React](https://lucide.dev/)  
* **Deployment:** [Netlify](https://www.netlify.com/)  
* **Mobile Wrapper:** [CapacitorJS](https://capacitorjs.com/) (Planned for APK build)

## **🎨 Brand & UI**

* **Primary (Blue):** \#005A9C (Used for headers, active states)  
* **Accent (Orange):** \#FF6700 (Used for buttons, call-to-actions)  
* **Background:** White / Light Gray (\#F9FAFB)  
* **Dark Mode:** Fully supported 🌙

## **🛠️ Features (Current Status)**

* \[x\] **Authentication:** Sign up/in with Email & Password (Supabase Auth).  
* \[x\] **Password Reset:** Full flow with email confirmation and secure update page.  
* \[x\] **Profile Management:** View user details and avatar.  
* \[x\] **Role Switching:** One-tap toggle between "Seeker" and "Provider" modes.  
* \[x\] **Responsive UI:** Mobile-first design with a bottom navigation bar.  
* \[ \] **Job Posting:** (Coming Soon)  
* \[ \] **Bidding System:** (Coming Soon)  
* \[ \] **Realtime Chat:** (Coming Soon)

## **🏃‍♂️ Getting Started Locally**

### **1\. Prerequisites**

* Node.js (v18 or later)  
* npm / pnpm / yarn  
* A Supabase account

### **2\. Set Up Supabase**

1. Create a new project in your Supabase dashboard.  
2. Go to the **SQL Editor** and run the schema scripts provided in supabase/schema.sql to create the profiles table and triggers.  
3. Go to **Settings** \> **API**. You will need:  
   * Project URL  
   * Project API Key (anon public)

### **3\. Install & Run**

1. Clone the repository:  
   git clone \[https://github.com/Shawn-D-souza/kaamsathi.git\](https://github.com/Shawn-D-souza/kaamsathi.git)  
   cd kaamsathi

2. Install dependencies:  
   npm install

3. Create your environment file:  
   Create a .env.local file in the root directory and add your Supabase keys:  
   NEXT\_PUBLIC\_SUPABASE\_URL=your\_supabase\_project\_url  
   NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=your\_supabase\_anon\_key

4. Run the development server:  
   npm run dev

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to see the app.