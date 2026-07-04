import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Grid } from '@react-three/drei'

const PARTICLE_COUNT = 120

function randomOnSphere(minR = 10, maxR = 15) {
  const r = minR + Math.random() * (maxR - minR)
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  ]
}

function Particles() {
  const pointsRef = useRef()

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const speeds = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const [x, y, z] = randomOnSphere()
      positions[i * 3]     = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      speeds[i] = 0.008 + Math.random() * 0.007
    }

    return { positions, speeds }
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position
    const arr = pos.array

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3
      const x = arr[ix], y = arr[ix + 1], z = arr[ix + 2]
      const dist = Math.sqrt(x * x + y * y + z * z)

      if (dist < 0.3) {
        const [nx, ny, nz] = randomOnSphere()
        arr[ix] = nx; arr[ix + 1] = ny; arr[ix + 2] = nz
      } else {
        const s = speeds[i]
        arr[ix]     -= x * s
        arr[ix + 1] -= y * s
        arr[ix + 2] -= z * s
      }
    }

    pos.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffffff"
        sizeAttenuation
        transparent
        opacity={0.85}
      />
    </points>
  )
}

function CoreGlow() {
  const meshRef = useRef()
  const lightRef = useRef()

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const intensity = 1.5 + Math.sin(clock.elapsedTime * 1.5) * 0.75
    meshRef.current.material.emissiveIntensity = intensity
    if (lightRef.current) lightRef.current.intensity = intensity
  })

  return (
    <>
      <pointLight ref={lightRef} position={[0, 0, 0]} color="white" intensity={3} distance={6} />
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
      </mesh>
    </>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <Particles />
      <CoreGlow />
      <Grid
        position={[0, -3, 0]}
        infiniteGrid
        cellSize={1}
        cellThickness={0.3}
        sectionSize={3}
        sectionThickness={0.8}
        sectionColor={[0.12, 0.12, 0.12]}
        fadeDistance={25}
      />
    </>
  )
}

export default function ForgeCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 5, 12], fov: 50 }}
      gl={{ antialias: true }}
      style={{ background: '#000000' }}
    >
      <Scene />
    </Canvas>
  )
}
