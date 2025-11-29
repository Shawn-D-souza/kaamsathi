# **KaamSaathi**

A peer-to-peer service marketplace where users can post jobs and find help, or bid on jobs to offer their services.

**Live Demo:** [https://kaamsaathi.netlify.app/](https://kaamsaathi.netlify.app/)

## **Core Concept**

KaamSaathi is a P2P marketplace built on a bidding model, similar to Freelancer.com but simplified for quick local or remote tasks. The core of the app is a **dual-role system** where every user can be both a "Seeker" and a "Provider," toggled instantly from their profile.

* **"Seekers"** post a job or task they need done (e.g., "Need help moving furniture" or "Fix my script").  
* **"Providers"** browse available jobs—filtered by their service zones—and place bids.  
* The **Seeker** reviews bids and accepts one (or more), creating a private realtime chat to start the job.  
* Once the work is done, the Seeker can **Mark as Complete**.

## **🚀 Tech Stack**

* **Framework:** [Next.js 15+](https://nextjs.org/) (App Router, Server Actions, TypeScript)  
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)  
* **Backend & Auth:** [Supabase](https://supabase.com/) (Postgres, Auth, Realtime, Storage)  
* **Maps & Location:** [Leaflet](https://leafletjs.com/) (React Leaflet) \+ [PostGIS](https://postgis.net/) (Geospatial queries)  
* **Icons:** [Lucide React](https://lucide.dev/)  
* **Deployment:** [Netlify](https://www.netlify.com/) / [Vercel](https://vercel.com/)

## **🎨 Brand & UI**

* **Primary (Blue):** \#005A9C (Used for headers, active states)  
* **Accent (Orange):** \#FF6700 (Used for buttons, call-to-actions)  
* **Background:** White / Light Gray (\#F9FAFB)  
* **Dark Mode:** Fully supported 🌙

## **🛠️ Features**

### **Authentication & User**

* **Secure Auth:** Sign up/in with Email & Password (Supabase Auth).  
* **Role Switching:** One-tap toggle between "Seeker" and "Provider" modes.  
* **Profile Management:** Edit name and upload Profile Picture (Supabase Storage).  
* **Password Reset:** Full flow with email confirmation.

### **Marketplace (Seeker)**

* **Post a Job:** Create listings with title, description, budget, and deadline.  
* **Interactive Maps:** Pinpoint the exact job location on a map and set a **Visibility Radius** (e.g., 5km) to control who sees the job.  
* **Multi-Hire:** Specify the number of people needed (e.g., "Need 3 people for moving"). You can accept multiple bids for a single job until all spots are filled.  
* **Manage Bids:** View all incoming bids, check provider profiles, and accept the best offers.  
* **Job Completion:** Mark jobs as "Done" to close the loop.

### **Marketplace (Provider)**

* **Smart Job Feed:** Jobs are filtered automatically based on:  
  1. **Remote Jobs:** Visible to everyone globally.  
  2. **Local Jobs:** Only visible if they overlap with your defined "Service Zones."  
* **Service Zones:** Providers can define multiple circular zones on the map (center \+ radius) where they are willing to work.  
* **Bidding:** Place competitive bids on jobs you want to do.  
* **My Bids:** Track the status of your sent bids (Pending/Accepted/Rejected).

### **Communication**

* **Realtime Chat:** Instant 1-on-1 messaging between Seeker and Provider(s) upon job acceptance.  
* **Status Updates:** Live updates when jobs are completed or bids are accepted.

## **🏃‍♂️ Getting Started Locally**

### **1\. Prerequisites**

* Node.js (v18 or later)  
* npm / pnpm / yarn  
* A Supabase account

### **2\. Set Up Supabase**

1. **Create Project:** Create a new project in your Supabase dashboard.  
2. **Database:** Go to the **SQL Editor** and run the scripts found in the /supabase folder of this repo in the following order:  
   1. schema.sql (Profiles & Triggers)  
   2. jobs.sql (Jobs table & Policies)  
   3. bids.sql (Bids table & Policies)  
   4. messages.sql (Chat system)  
   5. locations.sql (Provider Zones & PostGIS setup)  
   6. rpc.sql (Geospatial filtering function)  
   7. storage.sql (Storage policies)  
3. **Storage:**  
   * Go to **Storage** and create a new public bucket named avatars.  
   * Set file size limit to 2MB and allowed MIME types to image/\*.  
4. **Env Keys:** Go to **Settings** \> **API** and copy your URL and Anon Key.

### **3\. Install & Run**

1. Clone the repository:  
   git clone \[https://github.com/Shawn-D-souza/kaamsathi.git\](https://github.com/Shawn-D-souza/kaamsathi.git)  
   cd kaamsathi

2. Install dependencies:  
   \# Install dependencies  
   npm install

3. Create your environment file:  
   Create a .env.local file in the root directory:  
   NEXT\_PUBLIC\_SUPABASE\_URL=your\_supabase\_project\_url  
   NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=your\_supabase\_anon\_key

4. Run the development server:  
   npm run dev  
