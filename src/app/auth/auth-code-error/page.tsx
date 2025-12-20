import React from 'react';

export default function AuthCodeError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-white dark:bg-slate-900">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
        Link No Longer Active
      </h1>
      
      <div className="text-slate-600 dark:text-slate-400 max-w-md space-y-4">
        <p>
          This verification link has either expired or has already been used.
        </p>
        <p>
          <strong>Please return to the app and try logging in.</strong>
        </p>
        <p className="text-sm">
          (If you cannot log in, you can request a new verification email from the login screen.)
        </p>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-600 mt-12">
        You can close this window.
      </p>
    </div>
  );
}