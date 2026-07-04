'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

function AnimatedBox({ initialPosition, mousePosition }) {
  const meshRef = useRef(null)
  const [targetPosition, setTargetPosition] = useState(
    new THREE.Vector3(...initialPosition)
  )
  const currentPosition = useRef(
    new THREE.Vector3(...initialPosition)
  )

  const getAdjacentIntersection = (current) => {
    const directions = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
    ]
    const randomDirection =
      directions[Math.floor(Math.random() * directions.length)]
    return new THREE.Vector3(
      current.x + randomDirection[0] * 3,
      -1.5,
      current.z + randomDirection[1] * 3
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newPosition = getAdjacentIntersection(
        currentPosition.current
      )
      newPosition.x = Math.max(-15, Math.min(15, newPosition.x))
      newPosition.z = Math.max(-15, Math.min(15, newPosition.z))
      setTargetPosition(newPosition)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useFrame((state, delta) => {
    if (meshRef.current) {
      currentPosition.current.lerp(targetPosition, 0.1)
      meshRef.current.position.copy(currentPosition.current)

      const distToMouse = currentPosition.current.distanceTo(mousePosition.current)
      const repulsionRadius = 4
      const repulsionStrength = 3

      if (distToMouse < repulsionRadius && distToMouse > 0) {
        const repulsionDir = currentPosition.current
          .clone()
          .sub(mousePosition.current)
          .normalize()

        const repulsionAmount = (repulsionRadius - distToMouse) / repulsionRadius

        currentPosition.current.add(
          repulsionDir.multiplyScalar(repulsionStrength * repulsionAmount * delta)
        )

        currentPosition.current.x = Math.max(-15, Math.min(15, currentPosition.current.x))
        currentPosition.current.z = Math.max(-15, Math.min(15, currentPosition.current.z))

        meshRef.current.position.copy(currentPosition.current)
      }
    }
  })

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#ffffff"
        opacity={0.9}
        transparent
      />
      <lineSegments>
        <edgesGeometry
          attach="geometry"
          args={[new THREE.BoxGeometry(1, 1, 1)]}
        />
        <lineBasicMaterial
          attach="material"
          color="#000000"
          linewidth={2}
        />
      </lineSegments>
    </mesh>
  )
}

function Scene({ mousePosition }) {
  const initialPositions = [
    [-9, -1.5, -9], [-3, -1.5, -3],
    [0, -1.5, 0],   [3, -1.5, 3],
    [9, -1.5, 9],   [-6, -1.5, 6],
    [6, -1.5, -6],  [-12, -1.5, 0],
    [12, -1.5, 0],  [0, -1.5, 12],
  ]

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Grid
        renderOrder={-1}
        position={[0, -2, 0]}
        infiniteGrid
        cellSize={1}
        cellThickness={0.5}
        sectionSize={3}
        sectionThickness={1}
        sectionColor={[0.5, 0.5, 0.5]}
        fadeDistance={50}
      />
      {initialPositions.map((position, index) => (
        <AnimatedBox key={index} initialPosition={position} mousePosition={mousePosition} />
      ))}
    </>
  )
}

export default function SceneCanvas() {
  const mousePosition = useRef(new THREE.Vector3(0, 0, 0))

  return (
    <Canvas
      shadows
      camera={{ position: [0, 18, 28], fov: 50 }}
      style={{ background: '#000000' }}
      onPointerMove={(e) => {
        if (e.point) {
          mousePosition.current.set(e.point.x, 0.5, e.point.z)
        }
      }}
    >
      <Scene mousePosition={mousePosition} />
    </Canvas>
  )
}
