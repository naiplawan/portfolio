'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Smartphone, Download } from 'lucide-react'

export function PWABanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to install prompt: ${outcome}`)
      setDeferredPrompt(null)
      setShowBanner(false)
    } catch (error) {
      console.error('Error installing PWA:', error)
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
  }

  if (!showBanner || !deferredPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-terracotta to-sage-beige dark:from-terracotta/90 dark:to-sage-beige/90 border border-terracotta/30 rounded-lg shadow-lg p-4 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center space-x-3">
        <Smartphone className="w-6 h-6 text-foreground" />
        <div>
          <p className="font-semibold text-foreground">Install Portfolio App</p>
          <p className="text-sm text-muted-foreground">Install for a better experience</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={handleInstallClick}
          className="bg-terracotta hover:bg-terracotta/90 text-white"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Install
        </Button>
        <Button
          onClick={handleDismiss}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          Dismiss
        </Button>
      </div>
    </div>
  )
}