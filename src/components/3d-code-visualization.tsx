'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Box, Sphere, Environment, Float, useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface CodeFaceProps {
  position: [number, number, number]
  rotation: [number, number, number]
  code: string
  label: string
  theme: Theme
  materialType: 'glass' | 'reflective' | 'matte' | 'glowing' | 'crystal' | 'metallic'
}

interface Theme {
  name: string
  background: string
  primary: string
  secondary: string
  accent: string
  text: string
  highlight: string
}

const themes: Theme[] = [
  {
    name: 'Cyberpunk',
    background: '#0a0a0a',
    primary: '#00ffff',
    secondary: '#ff00ff',
    accent: '#ffff00',
    text: '#ffffff',
    highlight: '#ff0080'
  },
  {
    name: 'Neon Dreams',
    background: '#1a0033',
    primary: '#ff00ff',
    secondary: '#00ffff',
    accent: '#ffff00',
    text: '#ffffff',
    highlight: '#ff6600'
  },
  {
    name: 'Matrix Rain',
    background: '#000000',
    primary: '#00ff00',
    secondary: '#00aa00',
    accent: '#66ff66',
    text: '#ffffff',
    highlight: '#00ff88'
  },
  {
    name: 'Fire Code',
    background: '#1a0a00',
    primary: '#ff6600',
    secondary: '#ff0000',
    accent: '#ffff00',
    text: '#ffffff',
    highlight: '#ff9900'
  },
  {
    name: 'Ocean Deep',
    background: '#001a33',
    primary: '#0099ff',
    secondary: '#00ccff',
    accent: '#66ffff',
    text: '#ffffff',
    highlight: '#0066cc'
  },
  {
    name: 'Purple Haze',
    background: '#1a0033',
    primary: '#9966ff',
    secondary: '#cc00ff',
    accent: '#ff99ff',
    text: '#ffffff',
    highlight: '#ff00ff'
  }
]

const GlassMaterial: React.FC<{ color: string; theme: Theme }> = ({ color, theme }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  return (
    <meshPhysicalMaterial
      ref={meshRef}
      color={color}
      transparent
      opacity={0.3}
      roughness={0}
      metalness={0.1}
      clearcoat={1.0}
      clearcoatRoughness={0}
      envMapIntensity={1.5}
      transmission={0.9}
      thickness={0.5}
      ior={1.5}
    />
  )
}

const ReflectiveMaterial: React.FC<{ color: string; theme: Theme }> = ({ color, theme }) => {
  return (
    <meshStandardMaterial
      color={color}
      roughness={0.1}
      metalness={1.0}
      envMapIntensity={2.0}
    />
  )
}

const MatteMaterial: React.FC<{ color: string; theme: Theme }> = ({ color, theme }) => {
  return (
    <meshStandardMaterial
      color={color}
      roughness={0.8}
      metalness={0.1}
    />
  )
}

const GlowingMaterial: React.FC<{ color: string; theme: Theme }> = ({ color, theme }) => {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.5}
      roughness={0.3}
      metalness={0.2}
    />
  )
}

const CrystalMaterial: React.FC<{ color: string; theme: Theme }> = ({ color, theme }) => {
  return (
    <meshPhysicalMaterial
      color={color}
      transparent
      opacity={0.6}
      roughness={0}
      metalness={0}
      clearcoat={1.0}
      clearcoatRoughness={0}
      transmission={0.95}
      thickness={1.0}
      ior={2.4}
      specularIntensity={1}
    />
  )
}

const MetallicMaterial: React.FC<{ color: string; theme: Theme }> = ({ color, theme }) => {
  return (
    <meshStandardMaterial
      color={color}
      roughness={0.2}
      metalness={0.9}
      envMapIntensity={1.8}
    />
  )
}

const getMaterial = (materialType: string, color: string, theme: Theme) => {
  switch (materialType) {
    case 'glass':
      return <GlassMaterial color={color} theme={theme} />
    case 'reflective':
      return <ReflectiveMaterial color={color} theme={theme} />
    case 'matte':
      return <MatteMaterial color={color} theme={theme} />
    case 'glowing':
      return <GlowingMaterial color={color} theme={theme} />
    case 'crystal':
      return <CrystalMaterial color={color} theme={theme} />
    case 'metallic':
      return <MetallicMaterial color={color} theme={theme} />
    default:
      return <GlassMaterial color={color} theme={theme} />
  }
}

const CodeFace: React.FC<CodeFaceProps> = ({ position, rotation, code, label, theme, materialType }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  return (
    <group position={position} rotation={rotation}>
      <Box ref={meshRef} args={[2, 2, 0.15]}>
        {getMaterial(materialType, theme.background, theme)}
      </Box>
      
      {/* Face border/frame for better visibility */}
      <Box args={[2.05, 2.05, 0.02]}>
        <meshStandardMaterial 
          color={theme.primary} 
          transparent 
          opacity={0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </Box>
      
      {/* Label background */}
      <Box position={[0, 0.85, 0.08]} args={[1.8, 0.25, 0.02]}>
        <meshStandardMaterial 
          color={theme.primary} 
          transparent 
          opacity={0.3}
        />
      </Box>
      
      <Text
        position={[0, 0.85, 0.09]}
        fontSize={0.18}
        color={theme.accent}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {label}
      </Text>
      
      <Text
        position={[0, 0, 0.09]}
        fontSize={0.09}
        color={theme.text}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.7}
        textAlign="center"
        lineHeight={1.3}
      >
        {code}
      </Text>
      
      {/* Corner accents */}
      {[[-0.9, 0.9, 0.08], [0.9, 0.9, 0.08], [-0.9, -0.9, 0.08], [0.9, -0.9, 0.08]].map((pos, i) => (
        <Box key={i} position={pos as [number, number, number]} args={[0.1, 0.1, 0.03]}>
          <meshStandardMaterial 
            color={theme.highlight} 
            emissive={theme.highlight}
            emissiveIntensity={0.5}
          />
        </Box>
      ))}
    </group>
  )
}

const CodeSphere: React.FC<{ code: string; theme: Theme; materialType: string }> = ({ code, theme, materialType }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.x += 0.002
    }
  })

  return (
    <group>
      <Sphere ref={meshRef} args={[1.6, 64, 64]}>
        {getMaterial(materialType, theme.background, theme)}
      </Sphere>
      
      {/* Sphere equator ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.61, 1.63, 64]} />
        <meshStandardMaterial 
          color={theme.primary} 
          transparent 
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Code text wrapped around sphere */}
      <Text
        position={[0, 0, 1.7]}
        fontSize={0.11}
        color={theme.text}
        anchorX="center"
        anchorY="middle"
        maxWidth={3.2}
        textAlign="center"
        lineHeight={1.2}
      >
        {code}
      </Text>
      
      {/* Floating accent elements */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[2, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial 
            color={theme.highlight} 
            emissive={theme.highlight}
            emissiveIntensity={0.8}
          />
        </mesh>
      </Float>
    </group>
  )
}

const CodeCube: React.FC<{ faceCodes: string[]; theme: Theme; materialType: string }> = ({ faceCodes, theme, materialType }) => {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.003
      groupRef.current.rotation.y += 0.005
    }
  })

  const faceLabels = ['HTML', 'CSS', 'JS', 'HTML', 'CSS', 'JS']
  const facePositions: [number, number, number][] = [
    [0, 0, 1],   // front
    [1, 0, 0],   // right
    [0, 1, 0],   // top
    [0, 0, -1],  // back
    [-1, 0, 0],  // left
    [0, -1, 0]   // bottom
  ]
  const faceRotations: [number, number, number][] = [
    [0, 0, 0],     // front
    [0, Math.PI / 2, 0],     // right
    [-Math.PI / 2, 0, 0],    // top
    [0, Math.PI, 0],         // back
    [0, -Math.PI / 2, 0],    // left
    [Math.PI / 2, 0, 0]      // bottom
  ]

  return (
    <group ref={groupRef}>
      {faceCodes.map((code, index) => (
        <CodeFace
          key={index}
          position={facePositions[index]}
          rotation={faceRotations[index]}
          code={code}
          label={faceLabels[index]}
          theme={theme}
          materialType={materialType as any}
        />
      ))}
      
      {/* Central core glow */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color={theme.highlight} 
          emissive={theme.highlight}
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}

interface ThreeDVisualizationProps {
  codes: string[]
  theme: Theme
  shape: 'cube' | 'sphere'
  effects: {
    glow: boolean
    particles: boolean
    wireframe: boolean
  }
  materialType: 'glass' | 'reflective' | 'matte' | 'glowing' | 'crystal' | 'metallic'
}

const ThreeDVisualization: React.FC<ThreeDVisualizationProps> = ({ 
  codes, 
  theme, 
  shape, 
  effects,
  materialType
}) => {
  const { scene } = useThree()
  
  useEffect(() => {
    scene.fog = new THREE.Fog(theme.background, 5, 15)
  }, [scene, theme.background])

  return (
    <>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color={theme.primary} />
      <pointLight position={[-5, -5, -5]} intensity={1} color={theme.secondary} />
      <spotLight position={[0, 10, 0]} intensity={0.8} color={theme.accent} angle={0.3} penumbra={0.5} />
      
      {effects.glow && (
        <>
          <pointLight position={[0, 0, 5]} intensity={3} color={theme.highlight} />
          <pointLight position={[0, 0, -5]} intensity={2} color={theme.primary} />
        </>
      )}
      
      {/* Environment for realistic reflections */}
      <Environment preset="city" />
      
      {shape === 'cube' ? (
        <CodeCube faceCodes={codes} theme={theme} materialType={materialType} />
      ) : (
        <CodeSphere code={codes.join('\n')} theme={theme} materialType={materialType} />
      )}
      
      {effects.particles && (
        <Particles color={theme.primary} />
      )}
      
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
        minDistance={3}
        maxDistance={15}
      />
    </>
  )
}

const Particles: React.FC<{ color: string }> = ({ color }) => {
  const particlesRef = useRef<THREE.Points>(null)
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x += 0.001
      particlesRef.current.rotation.y += 0.002
    }
  })

  const particleCount = 300
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15
    
    // Vary particle colors
    colors[i * 3] = Math.random()
    colors[i * 3 + 1] = Math.random()
    colors[i * 3 + 2] = Math.random()
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.03} 
        vertexColors 
        transparent 
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

interface CodeVisualizationProps {
  codes: string[]
  currentTheme: number
  shape: 'cube' | 'sphere'
  effects: {
    glow: boolean
    particles: boolean
    wireframe: boolean
  }
  materialType: 'glass' | 'reflective' | 'matte' | 'glowing' | 'crystal' | 'metallic'
}

export const CodeVisualization: React.FC<CodeVisualizationProps> = ({
  codes,
  currentTheme,
  shape,
  effects,
  materialType
}) => {
  const theme = themes[currentTheme]

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: theme.background }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <ThreeDVisualization 
          codes={codes} 
          theme={theme} 
          shape={shape} 
          effects={effects}
          materialType={materialType}
        />
      </Canvas>
    </div>
  )
}

export { themes }
export type { Theme }