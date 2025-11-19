# **KaamSaathi**

A peer-to-peer service marketplace where students can post jobs and find help, or bid on jobs to offer their services.

**Live Demo:** [https://kaamsaathi.netlify.app/](https://kaamsaathi.netlify.app/)

## **Core Concept**

KaamSaathi is a P2P marketplace built on a bidding model, similar to Freelancer.com but tailored for students. The core of the app is a **dual-role system** where every user can be both a "Seeker" and a "Provider," toggled instantly from their profile.

* **"Seekers"** post a job or task they need done (e.g., "Need assignment help").  
* **"Providers"** browse available jobs and place bids.  
* The **Seeker** reviews the bids and accepts one, creating a private realtime chat to start the job.  
* Once the work is done, the Seeker can **Mark as Complete**.

## **🚀 Tech Stack**

* **Framework:** [Next.js 15+](https://nextjs.org/) (App Router, Server Actions, TypeScript)  
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)  
* **Backend & Auth:** [Supabase](https://supabase.com/) (Postgres, Auth, Realtime, Storage)  
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
* **Manage Bids:** View all incoming bids for your jobs.  
* **Acceptance Logic:** Accepting a bid automatically rejects competing bids.  
* **Job Completion:** Mark jobs as "Done" to close the loop.

### **Marketplace (Provider)**

* **Job Feed:** Browse open jobs posted by other students.  
* **Bidding:** Place competitive bids on jobs you want to do.  
* **My Bids:** Track the status of your sent bids (Pending/Accepted/Rejected).

### **Communication**

* **Realtime Chat:** Instant 1-on-1 messaging between Seeker and Provider upon job acceptance.  
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
   5. storage.sql (Storage policies)  
3. **Storage:**  
   * Go to **Storage** and create a new public bucket named avatars.  
   * Set file size limit to 2MB and allowed MIME types to image/\*.  
4. **Env Keys:** Go to **Settings** \> **API** and copy your URL and Anon Key.

### **3\. Install & Run**

1. Clone the repository:  
   git clone [https://github.com/Shawn-D-souza/kaamsathi.git](https://github.com/Shawn-D-souza/kaamsathi.git) 
   cd kaamsathi

2. Install dependencies:  
   npm install

3. Create your environment file:  
   Create a .env.local file in the root directory:  
   NEXT\_PUBLIC\_SUPABASE\_URL=your\_supabase\_project\_url  
   NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=your\_supabase\_anon\_key

4. Run the development server:  
   npm run dev

