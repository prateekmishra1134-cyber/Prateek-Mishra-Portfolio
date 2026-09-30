import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'

const hubPoints = [[-1.55, .7, -.2], [-1.1, -.92, .32], [-.08, 1.55, -.1], [.96, 1.08, .35], [1.62, .1, -.3], [1.08, -.98, .15], [.05, -1.55, -.18], [-1.38, -.12, .16]]

function Core({ compact, reduceMotion }) {
  const group = useRef()
  const scrollDepth = useRef(0)
  useEffect(() => {
    const update = () => { scrollDepth.current = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1) }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  useFrame(({ pointer, clock }) => {
    if (!group.current || reduceMotion) return
    group.current.rotation.y += (pointer.x * .23 - group.current.rotation.y) * .025
    group.current.rotation.x += (-pointer.y * .15 - group.current.rotation.x) * .025
    group.current.rotation.z += (-pointer.x * .035 - group.current.rotation.z) * .015
    group.current.position.y = Math.sin(clock.elapsedTime * .48) * .075
    group.current.position.z = -scrollDepth.current * .38
  })
  return <group ref={group}>
    <mesh rotation={[.24, .38, .12]}><icosahedronGeometry args={[.93, compact ? 1 : 2]} /><meshPhysicalMaterial color="#96aaff" emissive="#364ba7" emissiveIntensity={.17} roughness={.12} metalness={.14} clearcoat={1} clearcoatRoughness={.08} transparent opacity={.46} depthWrite={false} /></mesh>
    <mesh rotation={[-.3, .62, .18]} scale={.72}><icosahedronGeometry args={[.93, 1]} /><meshPhysicalMaterial color="#d3b2ff" emissive="#6537bd" emissiveIntensity={.16} roughness={.14} metalness={.12} clearcoat={1} transparent opacity={.2} depthWrite={false} /></mesh>
    <mesh scale={.35}><icosahedronGeometry args={[.93, 1]} /><meshPhysicalMaterial color="#91e4f6" emissive="#4c94d8" emissiveIntensity={.26} roughness={.16} metalness={.08} clearcoat={1} transparent opacity={.31} depthWrite={false} /></mesh>
    <mesh rotation={[1.08, .4, -.12]}><torusGeometry args={[1.32, .012, 8, compact ? 72 : 120]} /><meshBasicMaterial color="#76e8ff" transparent opacity={.78} /></mesh>
    <mesh rotation={[.22, -.86, .93]}><torusGeometry args={[1.55, .009, 8, compact ? 72 : 120]} /><meshBasicMaterial color="#a782ff" transparent opacity={.62} /></mesh>
    <mesh rotation={[-.78, .18, .25]}><torusGeometry args={[1.72, .006, 6, compact ? 64 : 108]} /><meshBasicMaterial color="#5c8eff" transparent opacity={.35} /></mesh>
    {hubPoints.slice(0, compact ? 6 : hubPoints.length).map((position, i) => <group key={i} position={position}><mesh><sphereGeometry args={[i % 3 === 0 ? .052 : .036, 12, 12]} /><meshBasicMaterial color={i % 2 ? '#77eaff' : '#b491ff'} /></mesh><mesh scale={1.7}><sphereGeometry args={[.052, 8, 8]} /><meshBasicMaterial color={i % 2 ? '#77eaff' : '#b491ff'} transparent opacity={.12} /></mesh></group>)}
  </group>
}

function NetworkLines({ compact }) {
  const positions = useMemo(() => {
    const points = []
    const visible = hubPoints.slice(0, compact ? 6 : hubPoints.length)
    visible.forEach(([x, y, z]) => points.push(0, 0, 0, x, y, z))
    for (let i = 0; i < visible.length; i += 1) {
      const [x, y, z] = visible[i]
      const [nextX, nextY, nextZ] = visible[(i + 2) % visible.length]
      points.push(x, y, z, nextX, nextY, nextZ)
    }
    return new Float32Array(points)
  }, [compact])
  return <lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><lineBasicMaterial color="#7197ff" transparent opacity={.2} depthWrite={false} /></lineSegments>
}

function ParticleField({ compact }) {
  const field = useRef()
  const positions = useMemo(() => {
    const total = compact ? 64 : 132
    const values = new Float32Array(total * 3)
    for (let i = 0; i < total; i += 1) {
      const t = i * 2.39996
      const radius = 1.9 + (i % 13) * .105
      values[i * 3] = Math.cos(t) * radius
      values[i * 3 + 1] = Math.sin(t * .73) * (1.05 + (i % 5) * .12)
      values[i * 3 + 2] = Math.sin(t) * .9
    }
    return values
  }, [compact])
  useFrame(({ clock }) => { if (field.current) field.current.rotation.y = clock.elapsedTime * .027 })
  return <points ref={field}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#91aaff" size={compact ? .024 : .029} sizeAttenuation transparent opacity={.55} depthWrite={false} /></points>
}

function SceneContents({ compact, reduceMotion }) {
  return <>
    <ambientLight intensity={1.15} />
    <pointLight position={[3.5, 3, 4]} intensity={compact ? 10 : 17} color="#728eff" distance={9} />
    <pointLight position={[-3, -2, 2]} intensity={compact ? 6 : 10} color="#63e6ee" distance={8} />
    <pointLight position={[0, 2, -2]} intensity={7} color="#b66cff" distance={7} />
    <ParticleField compact={compact} />
    <NetworkLines compact={compact} />
    <Core compact={compact} reduceMotion={reduceMotion} />
  </>
}

export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch { return false }
}

export default function Scene({ compact = false }) {
  const [quality, setQuality] = useState({ compact, reduceMotion: false, enabled: true })
  useEffect(() => {
    const small = window.matchMedia('(max-width: 760px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const lowPower = typeof navigator !== 'undefined' && navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4
    const update = () => setQuality({ compact: compact || small.matches || lowPower, reduceMotion: reduced.matches, enabled: hasWebGL() })
    update()
    small.addEventListener?.('change', update)
    reduced.addEventListener?.('change', update)
    return () => { small.removeEventListener?.('change', update); reduced.removeEventListener?.('change', update) }
  }, [compact])
  if (!quality.enabled) return <div className="scene-fallback" aria-hidden="true"><div className="fallback-orbit" /><span>INSIGHT · STRATEGY · GROWTH</span></div>
  return <div className={`scene-canvas ${quality.compact ? 'scene-compact' : ''}`}><Canvas dpr={quality.compact ? 1 : [1, 1.35]} frameloop={quality.reduceMotion ? 'demand' : 'always'} camera={{ position: [0, 0, 5.9], fov: 38 }} gl={{ alpha: true, antialias: !quality.compact, powerPreference: 'low-power', stencil: false, depth: true }}><Suspense fallback={null}><SceneContents compact={quality.compact} reduceMotion={quality.reduceMotion} /></Suspense></Canvas></div>
}

