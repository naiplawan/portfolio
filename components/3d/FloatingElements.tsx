'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Plane, Environment, ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'

// Soft floating bubble with natural movement
const SoftBubble = ({
  position,
  scale = 1,
  speed = 1,
  color = '#C4A484'
}: {
  position: [number, number, number]
  scale?: number
  speed?: number
  color?: string
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * speed
      // Gentle, organic floating
      meshRef.current.position.y = position[1] + Math.sin(time * 0.4) * 0.4
      meshRef.current.position.x = position[0] + Math.cos(time * 0.3) * 0.15
      meshRef.current.rotation.y = time * 0.15
      meshRef.current.rotation.z = Math.sin(time * 0.2) * 0.1

      // Smooth scale on hover
      const targetScale = scale * (hovered ? 1.1 : 1)
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <Float speed={speed * 0.5} rotationIntensity={0.15} floatIntensity={0.2}>
      <Sphere
        ref={meshRef}
        args={[scale * 0.35, 32, 32]}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? '#D4B89C' : color}
          transparent
          opacity={0.5}
          roughness={0.9}
          metalness={0}
        />
      </Sphere>
      {/* Soft glow layer */}
      <Sphere args={[scale * 0.4, 32, 32]} position={position}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
        />
      </Sphere>
    </Float>
  )
}

// Soft particle system with natural drift
const SoftParticleBackground = ({ count = 40 }: { count?: number }) => {
  const meshRef = useRef<THREE.Points>(null)

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2

      // Soft pastel colors
      const colorVariants = [
        [0.77, 0.64, 0.52], // #C4A484 - Sand
        [0.66, 0.73, 0.65], // #A8BBA3 - Sage
        [0.83, 0.77, 0.71], // #D4C4B4 - Blush
      ]
      const variant = colorVariants[i % 3]
      colors[i * 3] = variant[0]
      colors[i * 3 + 1] = variant[1]
      colors[i * 3 + 2] = variant[2]

      sizes[i] = Math.random() * 0.08 + 0.04
    }

    return { positions, colors, sizes }
  }, [count])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[particles.sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

// Scene for soft floating elements
const FloatingScene = ({ show }: { show: boolean }) => {
  if (!show) return null

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
      gl={{
        antialias: true,
        alpha: true,
      }}
    >
      {/* Soft ambient lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} color="#FFF8F0" />
      <directionalLight position={[-5, -5, -5]} intensity={0.2} color="#E8DED2" />

      {/* Soft environment */}
      <Environment preset="sunset" />

      {/* Soft shadows */}
      <ContactShadows
        position={[0, -3, 0]}
        opacity={0.2}
        scale={15}
        blur={2.5}
        far={3}
      />

      {/* Soft particles */}
      <SoftParticleBackground count={35} />

      {/* Floating soft bubbles */}
      <SoftBubble position={[3, 1.5, -1]} scale={1.2} color="#C4A484" speed={0.6} />
      <SoftBubble position={[-2.5, 0.5, 1]} scale={0.9} color="#A8BBA3" speed={0.8} />
      <SoftBubble position={[0, -1.5, -2]} scale={1} color="#D4C4B4" speed={0.7} />
      <SoftBubble position={[4, -0.5, 2]} scale={0.7} color="#B8C4B8" speed={0.9} />
      <SoftBubble position={[-3.5, 2, 0]} scale={1.1} color="#C8B8A8" speed={0.5} />

      {/* Soft ground plane */}
      <Plane args={[25, 25]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <meshStandardMaterial
          color="#F7F1DE"
          transparent
          opacity={0.2}
          roughness={1}
          metalness={0}
        />
      </Plane>
    </Canvas>
  )
}

export default function FloatingElements() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('floating-elements-container')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div id="floating-elements-container" className="relative">
      <FloatingScene show={isVisible} />
    </div>
  )
}