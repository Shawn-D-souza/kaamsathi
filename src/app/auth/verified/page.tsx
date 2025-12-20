import React from 'react';

export default function VerifiedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-white dark:bg-slate-900">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Account Verified
      </h1>
      <p className="text-slate-600 dark:text-slate-400">
        Your email has been successfully confirmed.
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-500 mt-8">
        You can now close this window and return to the app.
      </p>
    </div>
  );
}