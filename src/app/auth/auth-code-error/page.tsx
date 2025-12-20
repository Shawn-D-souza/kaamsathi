import Link from 'next/link';

export default function AuthCodeError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-white dark:bg-slate-900">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Link Expired</h1>
      <p className="text-slate-600 dark:text-slate-300 max-w-md mb-8">
        This verification link is invalid or has already been used. 
        If you have already verified your email, you can simply sign in.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/auth" 
          className="px-6 py-3 bg-[#005A9C] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Sign In
        </Link>
        <Link 
          href="/" 
          className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}