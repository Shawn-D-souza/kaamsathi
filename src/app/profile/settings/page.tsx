import { getNotificationSettings } from './actions'
import SettingsForm from './form'
import Link from 'next/link'
import { ArrowLeft, Bell } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const { success, data } = await getNotificationSettings()

  if (!success || !data) {
    redirect('/auth')
  }

  return (
    <main className="min-h-dvh pb-24 pt-[calc(0.2rem+env(safe-area-inset-top))] md:pt-0">
      <div className="mx-auto max-w-screen-xl px-4 py-4 md:px-6 md:pt-24">
        
        {/* Navigation - Simple and clean */}
        <div className="mb-6 md:mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-brand-blue dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8 lg:items-start">
            
            {/* Left Column: Header & Context */}
            <div className="lg:col-span-1">
                 {/* FIX: Adaptive Styling
                    - Mobile: Plain text (no shadow/border) to feel like a page header.
                    - Desktop: 'card-surface' to look like a sidebar panel.
                 */}
                 <div className="px-2 md:card-surface md:rounded-3xl md:p-8">
                    <div className="flex items-center gap-4 md:block">
                        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-brand-blue dark:bg-blue-500/10 dark:text-blue-400 md:mb-4">
                            <Bell size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--foreground)] md:text-3xl">
                                Notification Settings
                            </h1>
                            {/* Show summary on mobile, detailed text on desktop */}
                            <p className="text-sm text-[var(--muted)] md:hidden">
                                Manage your alerts.
                            </p>
                        </div>
                    </div>
                    
                    <p className="mt-4 hidden text-[var(--muted)] leading-relaxed md:block">
                        Control how and when you want to be notified. 
                        We recommend keeping push notifications on for messages so you don't miss any work opportunities.
                    </p>
                 </div>
            </div>

            {/* Right Column: The Settings Form */}
            <div className="lg:col-span-2">
                <SettingsForm initialSettings={data} />
            </div>

        </div>
        
      </div>
    </main>
  )
}