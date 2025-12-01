export default function TermsPage() {
  return (
    <article className="max-w-none">
      <header className="mb-10 border-b border-gray-100 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </header>

      <div className="space-y-8 text-base leading-7 text-gray-700 dark:text-gray-300">
        <section>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">1. Introduction</h3>
          <p>
            Welcome to KaamSaathi. By accessing or using our platform, you agree to be bound by these Terms of Service. 
            KaamSaathi is a peer-to-peer marketplace that connects users seeking help ("Seekers") with users offering services ("Providers").
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">2. Relationship of Parties</h3>
          <p>
            <strong>KaamSaathi is not an employer.</strong> Providers are independent contractors and not employees, partners, 
            or agents of KaamSaathi. We provide the digital infrastructure to facilitate connections, but the contract for any 
            job is directly between the Seeker and the Provider. We do not control or direct the Provider's performance of services.
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">3. User Responsibilities</h3>
          <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
            <li>You must be at least 18 years old to use this service.</li>
            <li>Seekers are responsible for providing a safe working environment for on-site jobs.</li>
            <li>Providers are responsible for performing services professionally, safely, and efficiently.</li>
            <li>You agree not to use the platform for illegal tasks, harassment, fraud, or hate speech.</li>
            <li>You are responsible for the accuracy of the information in your profile and job posts.</li>
          </ul>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">4. Payments and Fees</h3>
          <p>
            KaamSaathi currently facilitates the connection. Payments agreed upon in the "Budget" section are to be settled 
            directly between users upon completion of the work, unless otherwise specified by a future secure payment gateway integration. 
            KaamSaathi is not liable for non-payment, late payment, or payment disputes between users.
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">5. Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by applicable law, KaamSaathi shall not be liable for any indirect, incidental, special, 
            consequential, or punitive damages, including physical injury, property damage, loss of data, or loss of profits resulting 
            from the services obtained through the platform. You use the service at your own risk.
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">6. Location Services</h3>
          <p>
            Our service requires the use of location data to function effectively (e.g., matching "Service Zones" with "Job Locations"). 
            By using the app, you explicitly consent to the collection and use of your location data as described in our Privacy Policy.
          </p>
        </section>

        <section>
          <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">7. Account Termination</h3>
          <p>
            We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe 
            violates these Terms or is harmful to other users of the platform, us, or third parties, or for any other reason.
          </p>
        </section>
      </div>
    </article>
  );
}