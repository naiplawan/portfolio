'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GitBranch, Star, Users, AlertCircle } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { useGitHubStats } from '@/lib/hooks/use-github-stats'
import { GitHubStatsSkeleton } from '@/components/portfolio/GitHubStatsSkeleton'

export default function GitHubStats() {
  const stats = useGitHubStats()


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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

  const StatCard = ({ icon: Icon, title, value, subtitle }: { 
    icon: any, 
    title: string, 
    value: string | number, 
    subtitle?: string 
  }) => (
    <motion.div variants={itemVariants}>
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Icon className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-muted-foreground">{title}</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {subtitle && <div className="text-sm text-muted-foreground">{subtitle}</div>}
        </CardContent>
      </Card>
    </motion.div>
  )

  // Loading state
  if (stats.isLoading) {
    return (
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              GitHub Activity
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Loading real-time GitHub statistics...
            </p>
          </motion.div>

          <GitHubStatsSkeleton />
        </div>
      </section>
    )
  }

  // Error state
  if (stats.error) {
    return (
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              GitHub Activity
            </h2>
          </motion.div>
          
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Unable to Load GitHub Stats</h3>
              <p className="text-muted-foreground mb-4">{stats.error}</p>
              <Badge variant="outline" className="px-4 py-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                API Temporarily Unavailable
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            GitHub Activity
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time insights into my development activity and contribution patterns
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard 
            icon={FaGithub} 
            title="Repositories" 
            value={stats.totalRepos} 
            subtitle="Public projects"
          />
          <StatCard 
            icon={Star} 
            title="Stars Earned" 
            value={stats.totalStars} 
            subtitle="Community recognition"
          />
          <StatCard 
            icon={GitBranch} 
            title="Total Commits" 
            value={stats.totalCommits} 
            subtitle="This year"
          />
          <StatCard 
            icon={Users} 
            title="Contributions" 
            value={stats.contributions} 
            subtitle="Last 365 days"
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaGithub className="w-5 h-5" />
                Top Programming Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topLanguages.map((lang, index) => (
                  <motion.div
                    key={lang.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: lang.color }}
                        />
                        <span className="font-medium">{lang.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {lang.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: lang.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${lang.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8 text-center"
        >
          <Badge variant="outline" className="px-4 py-2">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Live data from GitHub API
          </Badge>
        </motion.div>
      </div>
    </section>
  )
}