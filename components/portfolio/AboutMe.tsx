'use client'

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Code, Database, Cloud, Smartphone, Briefcase, GraduationCap, Award, TrendingUp } from "lucide-react";

export default function AboutMe() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

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
  };

  const expertise = [
    {
      icon: Code,
      title: "Frontend Development",
      description: "Building beautiful, responsive interfaces",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js"]
    },
    {
      icon: Database,
      title: "Backend Development", 
      description: "Scalable server-side applications",
      skills: ["Node.js", "Express", "Python", "Django", "PostgreSQL", "MongoDB"]
    },
    {
      icon: Cloud,
      title: "Cloud & DevOps",
      description: "Modern deployment and infrastructure",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Cloudflare", "DigitalOcean"]
    },
    {
      icon: Smartphone,
      title: "Mobile & AI",
      description: "Cross-platform and intelligent applications",
      skills: ["React Native", "PWA", "LLM Integration", "RAG Systems"]
    }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10 sm:space-y-12 md:space-y-16"
        >
          <motion.div variants={itemVariants} className="text-center space-y-4 sm:space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              About Me
            </h2>
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground px-2">
              <p>
                <strong className="text-foreground">Crafting exceptional digital experiences.</strong> 
                As a Frontend Developer at Unixdev Co., Ltd., I design and implement innovative user-facing 
                features that enhance digital product functionality. My expertise spans modern frontend 
                technologies including React, Next.js, and TypeScript, with expanding skills in Go and Flutter.
              </p>
              
              <p>
                <strong className="text-foreground">Performance & Architecture Expert.</strong> I specialize in 
                architecting modular, scalable code solutions with focus on reusability and maintainability. 
                Through advanced technical implementations and proactive performance engineering, I strategically 
                optimize applications for maximum efficiency and user satisfaction.
              </p>
              
              <p>
                <strong className="text-foreground">Cross-Functional Collaborator.</strong> I excel at facilitating 
                collaboration between design, development, and product management teams to deliver cohesive 
                technological solutions. My approach bridges technical expertise with business requirements 
                to create impactful digital products.
              </p>
              
              <p>
                <strong className="text-foreground">Innovation Driver & Tech Explorer.</strong> I proactively research, 
                evaluate, and integrate emerging web development technologies and industry trends. My diverse skill 
                set now includes backend development with Go Fiber and mobile development with Flutter, 
                demonstrating continuous growth and adaptability.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center space-y-6 sm:space-y-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Technical Expertise</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {expertise.map((area) => (
                <motion.div
                  key={area.title}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-card rounded-lg sm:rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-lg flex items-center justify-center mx-auto">
                      <area.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    
                    <div className="space-y-1 sm:space-y-2">
                      <h4 className="text-sm sm:text-base font-semibold text-foreground">{area.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-tight">{area.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                      {area.skills.map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="secondary"
                          className="bg-muted text-muted-foreground hover:bg-muted/80 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center space-y-6 sm:space-y-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Work Experience</h3>
            <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
              <div className="bg-card rounded-lg sm:rounded-lg p-4 sm:p-6 md:p-8 shadow-sm border-l-4 border-primary">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="text-left space-y-1 sm:space-y-2 min-w-0 flex-1">
                    <h4 className="text-lg sm:text-xl font-semibold text-foreground">Frontend Developer</h4>
                    <p className="text-sm sm:text-base text-primary font-medium">Unixdev Co., Ltd. • Feb 2025 - Present</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Bangkok City, Thailand • On-site</p>
                    <div className="text-sm sm:text-base text-muted-foreground space-y-2 sm:space-y-3 mt-3 sm:mt-4">
                      <p>• <strong>Design and implement innovative user-facing features</strong> that enhance digital product functionality and user experience</p>
                      <p>• <strong>Architect modular, scalable code solutions</strong> with focus on reusability, maintainability, and industry best practices</p>
                      <p>• <strong>Strategically optimize application performance</strong> through advanced technical implementations and proactive performance engineering</p>
                      <p>• <strong>Facilitate cross-functional collaboration</strong> bridging design, development, and product management teams</p>
                      <p>• <strong>Drive continuous technological innovation</strong> by researching and integrating emerging web development technologies</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg sm:rounded-lg p-4 sm:p-6 md:p-8 shadow-sm">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg sm:rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                  </div>
                  <div className="text-left space-y-1 sm:space-y-2 min-w-0 flex-1">
                    <h4 className="text-lg sm:text-xl font-semibold text-foreground">Junior Full Stack Software Developer</h4>
                    <p className="text-sm sm:text-base text-muted-foreground font-medium">Turfmapp • Jan 2024 - Jan 2025</p>
                    <div className="text-sm sm:text-base text-muted-foreground space-y-2 sm:space-y-3 mt-3 sm:mt-4">
                      <p>• <strong>Built scalable web applications</strong> using React.js, Node.js, Express.js, and Django, serving thousands of users with 99.9% uptime</p>
                      <p>• <strong>Architected robust database solutions</strong> with MongoDB and PostgreSQL, optimizing queries for 40% faster data retrieval</p>
                      <p>• <strong>Led cloud deployment initiatives</strong> on DigitalOcean with Cloudflare CDN, improving page load speeds by 60%</p>
                      <p>• <strong>Pioneered AI integration</strong> implementing LLM and RAG systems that reduced manual processing time by 75%</p>
                      <p>• <strong>Established API testing protocols</strong> with Postman, creating comprehensive documentation that improved developer onboarding by 50%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center space-y-6 sm:space-y-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              <div className="bg-card rounded-lg sm:rounded-lg p-4 sm:p-6 shadow-sm">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg sm:rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="text-left space-y-1 sm:space-y-2 min-w-0 flex-1">
                    <h4 className="text-base sm:text-lg font-semibold text-foreground">Coding Bootcamp</h4>
                    <p className="text-sm sm:text-base text-primary font-medium">TechUp, Bangkok</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">June 2023 – October 2023</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {["HTML", "CSS", "JavaScript", "Node.js", "Express.js", "MongoDB", "PostgreSQL", "Git"].map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs px-1.5 py-0.5">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg sm:rounded-lg p-4 sm:p-6 shadow-sm">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg sm:rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="text-left space-y-1 sm:space-y-2 min-w-0 flex-1">
                    <h4 className="text-base sm:text-lg font-semibold text-foreground">Bachelor's Degree</h4>
                    <p className="text-sm sm:text-base text-primary font-medium">Mahidol University, Bangkok</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">2015 – 2018</p>
                    <p className="text-xs sm:text-sm text-foreground/80 mt-1 sm:mt-2">Biology/Biological Sciences</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center space-y-8">
            <h3 className="text-2xl font-semibold text-foreground">Key Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-card rounded-lg p-6 shadow-sm border-l-4 border-primary">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Performance Leader</h4>
                    <p className="text-sm text-muted-foreground">Improved application performance by 60% through cloud optimization and CDN integration</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm border-l-4 border-success">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-success" />
                  </div>
                  <div className="text-left space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">AI Pioneer</h4>
                    <p className="text-sm text-muted-foreground">Successfully integrated LLM & RAG systems, reducing manual workload by 75%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm border-l-4 border-accent">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-left space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Database Optimizer</h4>
                    <p className="text-sm text-muted-foreground">Optimized database queries achieving 40% faster data retrieval across all applications</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm border-l-4 border-secondary">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-secondary/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Code className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="text-left space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">System Reliability</h4>
                    <p className="text-sm text-muted-foreground">Maintained 99.9% uptime across production applications serving thousands of users</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-card rounded-lg p-8 max-w-4xl mx-auto shadow-sm">
              <blockquote className="text-xl text-foreground/80 font-light italic leading-relaxed">
                "I'm passionate about leveraging cutting-edge AI technologies to solve real-world problems. 
                My goal is to build intelligent systems that not only meet today's needs but anticipate 
                tomorrow's challenges. Let's create the future of web development together."
              </blockquote>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
