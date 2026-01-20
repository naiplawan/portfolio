'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Plane } from '@react-three/drei'
import * as THREE from 'three'

interface FloatingElementProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  speed?: number
  type?: 'cube' | 'sphere' | 'torus'
  color?: string
  opacity?: number
  wireframe?: boolean
}

const FloatingElement = ({
  position,
  scale = 1,
  speed = 1,
  type = 'sphere',
  color = '#B87C4C',
  opacity = 0.7,
  wireframe = false,
}: FloatingElementProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3
      meshRef.current.rotation.x += 0.01 * speed
      meshRef.current.rotation.y += 0.01 * speed

      // Mouse interaction scale
      meshRef.current.scale.setScalar(scale * (hovered ? 1.2 : 1))
    }
  })

  const commonProps = {
    ref: meshRef,
    position,
    onPointerOver: () => setHovered(true),
    onPointerOut: () => setHovered(false),
    scale,
  }

  const materialProps = {
    color: hovered ? '#C4885C' : color,
    transparent: true,
    opacity,
    wireframe,
  }

  let geometry
  switch (type) {
    case 'cube':
      geometry = <boxGeometry args={[0.5, 0.5, 0.5]} />
      break
    case 'torus':
      geometry = <torusGeometry args={[0.3, 0.1, 16, 100]} />
      break
    default:
      geometry = <sphereGeometry args={[0.3, 32, 32]} />
  }

  return (
    <mesh {...commonProps}>
      {geometry}
      <meshStandardMaterial {...materialProps} />
    </mesh>
  )
}

// Background particle system
const ParticleBackground = ({ count = 100 }: { count?: number }) => {
  const meshRef = useRef<THREE.Points>(null)
  const pointsRef = useRef<Float32Array>(new Float32Array())
  const colorsRef = useRef<Float32Array>(new Float32Array())

  useEffect(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20

      colors[i * 3] = 0.72 // R
      colors[i * 3 + 1] = 0.49 // G
      colors[i * 3 + 2] = 0.3 // B
    }

    pointsRef.current = positions
    colorsRef.current = colors
  }, [count])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.01
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[pointsRef.current, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colorsRef.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors sizeAttenuation />
    </points>
  )
}

// Mouse-reactive container
const MouseReactiveContainer = ({ children }: { children: React.ReactNode }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      style={{
        transform: `
          perspective(1000px)
          rotateX(${mousePosition.y * 2}deg)
          rotateY(${mousePosition.x * 2}deg)
        `,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {children}
    </div>
  )
}

// Scene for floating elements
const FloatingScene = ({ show }: { show: boolean }) => {
  if (!show) return null

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#B87C4C" />

      <ParticleBackground count={50} />

      {/* Floating elements */}
      <FloatingElement position={[3, 2, -2]} type="cube" speed={0.8} />
      <FloatingElement position={[-3, 1, 1]} type="sphere" speed={1.2} color="#A8BBA3" />
      <FloatingElement position={[0, -2, -3]} type="torus" speed={0.6} />
      <FloatingElement position={[4, -1, 2]} type="cube" speed={1} color="#C4885C" />
      <FloatingElement position={[-4, 3, -1]} type="sphere" speed={0.9} />

      <Plane args={[30, 30]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <meshStandardMaterial color="#F7F1DE" transparent opacity={0.05} />
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
    <MouseReactiveContainer>
      <div id="floating-elements-container" className="relative">
        <FloatingScene show={isVisible} />
      </div>
    </MouseReactiveContainer>
  )
}