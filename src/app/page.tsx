import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-brand-bg p-8 shadow-md">
        <h1 className="text-3xl font-bold text-brand-blue mb-4">
          KaamSathi
        </h1>
        <p className="text-brand-text mb-6">
          Tailwind configuration test page.
        </p>
        
        <div className="space-y-4">
          <button className="w-full rounded-md bg-brand-orange px-4 py-2 font-bold text-white transition-opacity hover:opacity-90">
            Test Button (Accent)
          </button>
          <button className="w-full rounded-md bg-brand-blue px-4 py-2 font-bold text-white transition-opacity hover:opacity-90">
            Test Button (Primary)
          </button>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-brand-blue">Primary:</span> #005A9C
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-brand-orange">Accent:</span> #FF6700
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-brand-text">Text:</span> #212121
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-brand-text">BG:</span> #FFFFFF
          </p>
        </div>
      </div>
    </main>
  );
}