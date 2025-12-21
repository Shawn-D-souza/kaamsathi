'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { NotificationPreferences } from '@/types/supabase'
import { updateNotificationSettings } from './actions'

interface SettingsFormProps {
  initialSettings: NotificationPreferences
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState<NotificationPreferences>(initialSettings)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggle = (
    category: keyof NotificationPreferences['notifications'],
    type: 'push' | 'email'
  ) => {
    const newSettings = { ...settings }
    newSettings.notifications[category][type] = !newSettings.notifications[category][type]
    setSettings(newSettings)

    startTransition(async () => {
      const result = await updateNotificationSettings(newSettings)
      if (!result.success) {
        setSettings(initialSettings)
        alert('Failed to save settings: ' + result.error)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <div className="card-surface rounded-2xl md:rounded-3xl overflow-hidden shadow-sm">
      
      {/* Messages Section */}
      {/* FIX: p-5 on mobile (tighter), p-8 on desktop (spacious) */}
      <div className="p-5 md:p-8">
        <SectionHeader title="Messages" description="Chat messages from seekers or providers." />
        <div className="mt-4 space-y-4">
            <ToggleRow 
              label="Push Notifications" 
              checked={settings.notifications.messages.push} 
              onChange={() => handleToggle('messages', 'push')} 
              disabled={isPending}
            />
            <ToggleRow 
              label="Email Notifications" 
              checked={settings.notifications.messages.email} 
              onChange={() => handleToggle('messages', 'email')} 
              disabled={isPending}
            />
        </div>
      </div>

      <Divider />

      {/* Bids Section */}
      <div className="p-5 md:p-8">
        <SectionHeader title="New Bids" description="Updates on bids and proposals." />
        <div className="mt-4 space-y-4">
            <ToggleRow 
              label="Push Notifications" 
              checked={settings.notifications.bids.push} 
              onChange={() => handleToggle('bids', 'push')} 
              disabled={isPending}
            />
            <ToggleRow 
              label="Email Notifications" 
              checked={settings.notifications.bids.email} 
              onChange={() => handleToggle('bids', 'email')} 
              disabled={isPending}
            />
        </div>
      </div>

      <Divider />

      {/* Jobs Section */}
      <div className="p-5 md:p-8">
        <SectionHeader title="Job Updates" description="Status changes (Started, Completed)." />
        <div className="mt-4 space-y-4">
            <ToggleRow 
              label="Push Notifications" 
              checked={settings.notifications.job_updates.push} 
              onChange={() => handleToggle('job_updates', 'push')} 
              disabled={isPending}
            />
            <ToggleRow 
              label="Email Notifications" 
              checked={settings.notifications.job_updates.email} 
              onChange={() => handleToggle('job_updates', 'email')} 
              disabled={isPending}
            />
        </div>
      </div>

    </div>
  )
}

// --- Helper Components ---

function SectionHeader({ title, description }: { title: string, description: string }) {
    return (
        <div className="mb-3 md:mb-2">
            <h3 className="text-lg font-bold text-[var(--foreground)]">{title}</h3>
            <p className="text-sm text-[var(--muted)]">{description}</p>
        </div>
    )
}

function Divider() {
    return <div className="h-px bg-[var(--card-border)] w-full" />
}

function ToggleRow({ label, checked, onChange, disabled }: { label: string, checked: boolean, onChange: () => void, disabled: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
      <button
        onClick={onChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          checked ? 'bg-[var(--primary)]' : 'bg-gray-200 dark:bg-slate-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}