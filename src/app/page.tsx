export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100 dark:bg-zinc-900">
      <div className="w-full max-w-md rounded-lg bg-brand-bg p-8 shadow-md dark:bg-black border border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-brand-blue mb-4">
          KaamSaathi
        </h1>
        <p className="text-brand-text dark:text-gray-300 mb-6">
          Welcome to the marketplace.
        </p>
        
        <div className="space-y-4">
          <button className="w-full rounded-md bg-brand-orange px-4 py-2 font-bold text-white transition-opacity hover:opacity-90">
            Find Work (Provider)
          </button>
          <button className="w-full rounded-md bg-brand-blue px-4 py-2 font-bold text-white transition-opacity hover:opacity-90">
            Post a Job (Seeker)
          </button>
        </div>
      </div>
    </main>
  );
}