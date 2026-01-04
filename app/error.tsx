'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Home, RefreshCw, AlertTriangle, Mail } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  const handleContactClick = useCallback(() => {
    router.push(ROUTES.CONTACT);
  }, [router]);

  useEffect(() => {
    console.error(error)
  }, [error])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24
      }
    }
  }

  const shakeVariants = {
    shake: {
      x: [-5, 5, -5, 5, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-destructive/5 flex items-center justify-center px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-2xl mx-auto"
      >
        <motion.div
          variants={shakeVariants}
          animate="shake"
          className="mb-8"
        >
          <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Something went wrong
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
            We encountered an unexpected error. This has been logged and our team 
            will look into it. Please try again or contact support if the problem persists.
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <Button 
            onClick={reset}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button 
            asChild
            variant="outline" 
            size="lg"
            className="border-border text-muted-foreground px-8 py-3 rounded-full font-medium hover:bg-accent transition-all duration-200"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12">
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Need help?
            </h3>
            <p className="text-muted-foreground mb-4">
              If this error continues to occur, please reach out to us with details 
              about what you were trying to do.
            </p>
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleContactClick}
                className="text-primary hover:bg-primary/10"
              >
                Contact Support
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 p-4 bg-muted rounded-lg text-xs text-muted-foreground overflow-auto">
                  {error.message}
                  {error.stack && (
                    <>
                      {'\n\n'}
                      {error.stack}
                    </>
                  )}
                </pre>
              </details>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}