'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Plane } from '@react-three/drei'
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

// Floating particles with mobile optimization
const FloatingParticles = ({ count = 50 }: { count?: number }) => {
  const meshRef = useRef<THREE.Points>(null)
  const isMobile = useIsMobile()
  const particleCount = isMobile ? Math.min(count, 15) : count // Reduce particles on mobile

  const pointsData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  }, [particleCount])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.05
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[pointsData, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#B87C4C" transparent opacity={0.6} sizeAttenuation={false} />
    </points>
  )
}

// Interactive floating cube
const FloatingCube = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * (clicked ? 0.5 : 0.2)
      meshRef.current.rotation.y = state.clock.elapsedTime * (clicked ? 0.5 : 0.2)
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={clicked ? 1.5 : 1}
      onClick={() => setClicked(!clicked)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial
        color={hovered ? '#C4885C' : '#A8BBA3'}
        emissive={hovered ? '#C4885C' : '#000000'}
        emissiveIntensity={0.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

// Floating sphere with mobile optimization
const FloatingSphere = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const isMobile = useIsMobile()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.3, isMobile ? 16 : 32, isMobile ? 16 : 32]} />
      <meshStandardMaterial
        color={hovered ? '#C4885C' : '#B87C4C'}
        transparent
        opacity={0.7}
        wireframe={hovered}
      />
    </mesh>
  )
}

// 3D Scene with mobile optimization
const HeroScene = () => {
  const isMobile = useIsMobile()

  return (
    <>
      <ambientLight intensity={isMobile ? 0.3 : 0.4} />
      <pointLight position={[10, 10, 10]} intensity={isMobile ? 0.5 : 0.8} color="#B87C4C" />
      <pointLight position={[-10, -10, -10]} intensity={isMobile ? 0.2 : 0.3} color="#A8BBA3" />

      <FloatingParticles count={isMobile ? 20 : 30} />

      {!isMobile && (
        <>
          <FloatingCube position={[2, 0, 0]} />
          <FloatingCube position={[-2, 1, -2]} />
          <FloatingCube position={[0, -1, 2]} />

          <FloatingSphere position={[3, 2, 1]} />
          <FloatingSphere position={[-3, -2, -1]} />
          <FloatingSphere position={[1, 3, -3]} />
        </>
      )}

      {isMobile && (
        <>
          <FloatingCube position={[2, 0, 0]} />
          <FloatingSphere position={[-2, 1, -2]} />
        </>
      )}

      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <meshStandardMaterial color="#F7F1DE" transparent opacity={0.1} />
      </Plane>
    </>
  )
}

export default function ParallaxHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) return // Disable mouse tracking on mobile for performance

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-cream to-terracotta/5">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: 'transparent' }}
          dpr={isMobile ? [1, 1.5] : [1, 2]} // Limit pixel ratio on mobile
          performance={{ min: 0.5 }} // Allow performance degradation
        >
          <HeroScene />
        </Canvas>
      </div>

      {/* Content overlay */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          transform: `
            perspective(1000px)
            rotateX(${mousePosition.y * 5}deg)
            rotateY(${mousePosition.x * 5}deg)
          `
        }}
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