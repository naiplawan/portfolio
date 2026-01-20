'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { ExternalLink, Github } from 'lucide-react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

interface ProjectCard3DProps {
  project: {
    id: number
    title: string
    description: string
    image: string
    technologies: string[]
    githubUrl?: string
    liveUrl?: string
    category: string
    highlights: string[]
  }
  className?: string
}

// 3D Background for card
const Card3DBackground = ({ isHovered }: { isHovered: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      if (isHovered) {
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1
        meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime) * 0.1
      } else {
        meshRef.current.rotation.x *= 0.95
        meshRef.current.rotation.y *= 0.95
      }
    }
  })

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, -1]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#B87C4C"
          transparent
          opacity={isHovered ? 0.1 : 0.05}
          wireframe={isHovered}
        />
      </mesh>

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <Sphere
          key={i}
          args={[0.05]}
          position={[
            Math.sin(i) * 1.5,
            Math.cos(i) * 1.5,
            -2
          ]}
        >
          <meshStandardMaterial
            color="#A8BBA3"
            transparent
            opacity={isHovered ? 0.3 : 0.1}
          />
        </Sphere>
      ))}
    </group>
  )
}

const ProjectCard3D = ({ project, className }: ProjectCard3DProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsFlipped(false)
      }}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: '1000px' }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%' }}>
        {/* Front of card */}
        <motion.div
          className="relative w-full h-full"
          style={{
            backfaceVisibility: 'hidden',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <Card className="h-full overflow-hidden group">
            <div className="relative overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* 3D Canvas overlay on hover */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Canvas
                      camera={{ position: [0, 0, 5], fov: 75 }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <Card3DBackground isHovered={isHovered} />
                    </Canvas>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-3">
                <Badge variant="secondary" className="text-xs">
                  {project.category}
                </Badge>
              </div>
              <CardTitle className="text-lg">{project.title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {project.technologies.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.technologies.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                {project.liveUrl && (
                  <Button size="sm" variant="outline" className="flex-1">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Live
                  </Button>
                )}
                {project.githubUrl && (
                  <Button size="sm" variant="ghost">
                    <Github className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Back of card - additional details */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: 'hidden',
            transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
          }}
        >
          <Card className="h-full bg-gradient-to-br from-terracotta/10 to-sage-beige/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>Project Details</span>
                <motion.div
                  animate={{ rotate: isFlipped ? 0 : 180 }}
                  className="text-xs text-muted-foreground"
                >
                  ← Back
                </motion.div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-sm">Key Features</h4>
                <ul className="space-y-1">
                  {project.highlights.map((highlight, index) => (
                    <li key={index} className="text-xs flex items-start">
                      <div className="w-1.5 h-1.5 bg-terracotta rounded-full mt-2 mr-2 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-sm">Technologies</h4>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {project.liveUrl && (
                  <Button asChild size="sm" className="flex-1 bg-terracotta hover:bg-terracotta/90">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Live
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button asChild size="sm" variant="outline">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsFlipped(false)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function ProjectCard3DWrapper({ project, className }: ProjectCard3DProps) {
  return (
    <div className={className}>
      <ProjectCard3D project={project} />
    </div>
  )
}