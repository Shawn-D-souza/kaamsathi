export default function PrivacyPage() {
  return (
    <article className="max-w-none">
      <header className="mb-10 border-b border-gray-100 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </header>

      <div className="space-y-8 text-base leading-7 text-gray-700 dark:text-gray-300">
        <section>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">1. Information We Collect</h3>
          <p className="mb-4">We collect the following types of information to provide our services:</p>
          <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
            <li><strong>Account Data:</strong> Full name, email address, and profile pictures provided during sign-up.</li>
            <li><strong>Location Data:</strong> Precise GPS location when you post a local job or define a Service Zone. This is stored in our database to match Seekers with Providers geographically.</li>
            <li><strong>Usage Data:</strong> Information about jobs posted, bids placed, and interactions with other users.</li>
            <li><strong>Communication:</strong> Messages sent via our in-app chat system are stored to facilitate coordination.</li>
          </ul>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">2. How We Use Your Data</h3>
          <p>
            We use your location data solely to calculate the distance between Job locations and Provider Service Zones 
            using PostGIS technology. Your exact coordinates are stored securely and are only processed to determine 
            the visibility of jobs. We do not sell your personal location data to third-party advertisers.
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">3. Data Retention & Account Deletion</h3>
          <p className="mb-2">
            We retain your profile, job history, and chat logs as long as your account is active to provide a seamless experience 
            and to maintain records of completed transactions in case of disputes.
          </p>
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/50">
            <p className="font-semibold text-brand-blue dark:text-blue-300">
              How to Delete Your Account:
            </p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              Currently, we do not support automated account deletion within the app. If you wish to permanently delete your 
              account and all associated data, please contact our support team at 
              <a href="mailto:kaamsaathiapp@gmail.com" className="ml-1 font-bold underline hover:text-brand-blue">
                kaamsaathiapp@gmail.com
              </a>. 
              We will review your request and process it as soon as possible.
            </p>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">4. Third-Party Services</h3>
          <p>
            We utilize trusted third-party services to operate our platform:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 marker:text-gray-400">
            <li><strong>Supabase:</strong> For authentication, database hosting, and file storage.</li>
            <li><strong>OpenStreetMap & Leaflet:</strong> For map rendering and visualization.</li>
          </ul>
          <p className="mt-2">
            These services may process data according to their own privacy policies. We encourage you to review them.
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">5. Security</h3>
          <p>
            We implement industry-standard security measures, including Row Level Security (RLS) in our database, 
            to protect your data from unauthorized access. However, no method of transmission over the internet is 
            100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">6. Changes to This Policy</h3>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
            Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>
      </div>
    </article>
  );
}