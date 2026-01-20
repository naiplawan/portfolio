'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Plane, Environment, ContactShadows, Float, Icosahedron, Torus } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// Nature-inspired floating elements (like leaves, petals, bubbles)
const NatureElement = ({
  position,
  scale = 1,
  color = '#7A8B7A',
  speed = 1,
  shape = 'sphere'
}: {
  position: [number, number, number]
  scale?: number
  color?: string
  speed?: number
  shape?: 'sphere' | 'icosahedron' | 'torus'
}) => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * speed
      // Very slow, natural floating - like leaves on air
      meshRef.current.position.y = position[1] + Math.sin(time * 0.2) * 0.5
      meshRef.current.position.x = position[0] + Math.cos(time * 0.15) * 0.2
      meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.2
      meshRef.current.rotation.y = time * 0.08
      meshRef.current.rotation.z = Math.cos(time * 0.12) * 0.15
    }
  })

  const commonMaterial = (
    <meshStandardMaterial
      color={color}
      transparent
      opacity={0.4}
      roughness={1}
      metalness={0}
    />
  )

  const geometry = shape === 'icosahedron' ? (
    <Icosahedron args={[scale * 0.25, 0]} ref={meshRef} position={position} />
  ) : shape === 'torus' ? (
    <Torus args={[scale * 0.2, scale * 0.08, 8, 24]} ref={meshRef} position={position} />
  ) : (
    <Sphere args={[scale * 0.3, 24, 24]} ref={meshRef} position={position} />
  )

  return (
    <Float speed={speed * 0.3} rotationIntensity={0.1} floatIntensity={0.15}>
      {geometry}
      {commonMaterial}
    </Float>
  )
}

// Floating leaf-like particles (pollen, spores, tiny leaves)
const NatureParticles = ({ count = 40 }: { count?: number }) => {
  const isMobile = useIsMobile()
  const particleCount = isMobile ? 15 : count

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, () => {
      // Nature-inspired colors: greens, browns, earth tones
      const natureColors = [
        [0.48, 0.55, 0.45], // Soft green #7A8B72
        [0.62, 0.55, 0.42], // Earth tone #9E8B6A
        [0.71, 0.68, 0.58], // Sage #B5AD94
        [0.85, 0.78, 0.65], // Beige #D9C7A6
        [0.55, 0.48, 0.42], // Brown #8C7A6A
      ]
      const color = natureColors[Math.floor(Math.random() * natureColors.length)]

      return {
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5
        ] as [number, number, number],
        scale: Math.random() * 0.08 + 0.02,
        speed: Math.random() * 0.3 + 0.1,
        color: color
      }
    })
  }, [particleCount])

  return (
    <>
      {particles.map((p, i) => (
        <NatureElement
          key={i}
          position={p.position}
          scale={p.scale}
          color={`rgb(${p.color[0] * 255}, ${p.color[1] * 255}, ${p.color[2] * 255})`}
          speed={p.speed}
          shape={i % 3 === 0 ? 'sphere' : i % 3 === 1 ? 'icosahedron' : 'torus'}
        />
      ))}
    </>
  )
}

// Large organic nature form (like a floating seed pod or large leaf)
const OrganicNatureForm = ({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) => {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      // Very slow breathing/pulsing
      const pulse = Math.sin(time * 0.3) * 0.05 + 1
      groupRef.current.scale.setScalar(scale * pulse)
      groupRef.current.rotation.y = time * 0.05
    }
  })

  return (
    <Float speed={0.2} rotationIntensity={0.05} floatIntensity={0.1}>
      <group ref={groupRef} position={position}>
        {/* Main form */}
        <Icosahedron args={[0.4, 1]} scale={scale}>
          <meshStandardMaterial
            color="#8B9A83"
            transparent
            opacity={0.35}
            roughness={1}
            metalness={0}
            flatShading
          />
        </Icosahedron>
        {/* Outer glow layer */}
        <Sphere args={[0.5, 16, 16]} scale={scale}>
          <meshBasicMaterial
            color="#9AAA90"
            transparent
            opacity={0.08}
          />
        </Sphere>
      </group>
    </Float>
  )
}

// Natural scene with earthy, organic feel
const NaturalScene = () => {
  const isMobile = useIsMobile()

  return (
    <>
      {/* Natural sunlight-like ambient lighting */}
      <ambientLight intensity={0.7} color="#FFF8E8" />

      {/* Directional sunlight */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.4}
        color="#FFF4E0"
        castShadow
      />

      {/* Soft fill light from opposite side */}
      <directionalLight
        position={[-3, 2, -3]}
        intensity={0.15}
        color="#E8DED0"
      />

      {/* Natural environment (warm daylight) */}
      <Environment preset="dawn" />

      {/* Soft, natural ground shadows */}
      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.25}
        scale={12}
        blur={3}
        far={4}
        color="#8B7355"
      />

      {/* Nature-inspired floating elements */}
      <NatureParticles count={isMobile ? 20 : 35} />

      {/* Large organic forms - like floating seeds or natural formations */}
      <OrganicNatureForm position={[2, 0.5, 1]} scale={1.3} />
      <OrganicNatureForm position={[-1.5, -0.5, -1]} scale={0.9} />
      {!isMobile && (
        <>
          <NatureElement
            position={[3, 1.5, -2]}
            scale={1.5}
            color="#8B9A83"
            speed={0.4}
            shape="icosahedron"
          />
          <NatureElement
            position={[-3, -1, 2]}
            scale={1.2}
            color="#A8B090"
            speed={0.3}
            shape="sphere"
          />
        </>
      )}

      {/* Natural ground with earthy feel */}
      <Plane args={[25, 25]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
        <meshStandardMaterial
          color="#E8DDD0"
          transparent
          opacity={0.15}
          roughness={1}
          metalness={0}
        />
      </Plane>
    </>
  )
}

export default function ParallaxHero() {
  const isMobile = useIsMobile()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-cream to-terracotta/5">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: 'transparent' }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          <NaturalScene />
        </Canvas>
      </div>

      {/* Content overlay */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-terracotta via-sage-beige to-terracotta bg-clip-text text-transparent">
            Hi, I'm
          </span>
        </motion.h1>

        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="text-gray-900 dark:text-white">Rachaphol</span>
        </motion.h2>

        <motion.div
          className="text-xl sm:text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <span className="bg-gradient-to-r from-terracotta to-sage-beige bg-clip-text text-transparent">
            Performance-First Fullstack Architect
          </span>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            className="bg-terracotta hover:bg-terracotta/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.button>
          <motion.button
            className="border-2 border-terracotta text-terracotta hover:bg-terracotta/10 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg
          className="w-6 h-6 text-gray-600 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  )
}