import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import portraitUrl from '../../assets/prateek-mishra.jpeg'

const hubPoints = [[-1.55, .7, -.2], [-1.1, -.92, .32], [-.08, 1.55, -.1], [.96, 1.08, .35], [1.62, .1, -.3], [1.08, -.98, .15], [.05, -1.55, -.18], [-1.38, -.12, .16]]

function CinematicCamera({ reduceMotion }) {
  const finished = useRef(false)
  const { invalidate } = useThree()
  useEffect(() => {
    const skip = () => { finished.current = true }
    window.addEventListener('portfolio:skip-intro', skip)
    return () => window.removeEventListener('portfolio:skip-intro', skip)
  }, [])
  useFrame(({ camera, clock, pointer }) => {
    const elapsed = clock.elapsedTime
    const progress = reduceMotion || finished.current ? 1 : Math.min(1, Math.max(0, (elapsed - .25) / 2.15))
    const eased = progress * progress * (3 - 2 * progress)
    const angle = (1 - eased) * .92
    const targetX = Math.sin(angle) * 3.2 + pointer.x * .15
    const targetY = (1 - eased) * .18 + pointer.y * -.1
    const targetZ = 5.9 + Math.sin(progress * Math.PI) * .42 + (1 - progress) * .18
    camera.position.x += (targetX - camera.position.x) * .045
    camera.position.y += (targetY - camera.position.y) * .045
    camera.position.z += (targetZ - camera.position.z) * .045
    camera.lookAt(0, 0, 0)
    if (progress < 1 || Math.abs(camera.position.x - targetX) > .01 || Math.abs(camera.position.z - targetZ) > .01) invalidate()
  })
  return null
}

function PortraitFrame({ compact, onReady }) {
  const group = useRef()
  const ready = useRef(false)
  const texture = useLoader(THREE.TextureLoader, portraitUrl)
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    if (!ready.current) { ready.current = true; onReady?.() }
  }, [texture, onReady])
  useFrame(({ pointer }) => {
    if (!group.current) return
    group.current.rotation.y += (pointer.x * .11 - group.current.rotation.y) * .035
    group.current.rotation.x += (-pointer.y * .075 - group.current.rotation.x) * .035
  })
  const bar = compact ? .075 : .09
  return <group ref={group}>
    <mesh position={[0, 0, -.16]}><boxGeometry args={[2.52, 3.64, .12]} /><meshPhysicalMaterial color="#7893e8" metalness={.5} roughness={.2} transparent opacity={.27} clearcoat={1} /></mesh>
    <mesh position={[0, 0, -.04]}><planeGeometry args={[2.22, 3.16]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
    <mesh position={[0, 0, .015]}><planeGeometry args={[2.36, 3.32]} /><meshPhysicalMaterial color="#9cc5ff" roughness={.1} metalness={.15} transparent opacity={.08} side={THREE.DoubleSide} clearcoat={1} /></mesh>
    <mesh position={[0, 1.69, .08]}><boxGeometry args={[2.5, bar, .14]} /><meshPhysicalMaterial color="#9bb8ff" emissive="#334a9a" emissiveIntensity={.32} metalness={.58} roughness={.24} clearcoat={1} /></mesh>
    <mesh position={[0, -1.69, .08]}><boxGeometry args={[2.5, bar, .14]} /><meshPhysicalMaterial color="#7de3ed" emissive="#246179" emissiveIntensity={.2} metalness={.52} roughness={.24} clearcoat={1} /></mesh>
    <mesh position={[-1.2, 0, .08]}><boxGeometry args={[bar, 3.4, .14]} /><meshPhysicalMaterial color="#8299ee" metalness={.55} roughness={.25} clearcoat={1} /></mesh>
    <mesh position={[1.2, 0, .08]}><boxGeometry args={[bar, 3.4, .14]} /><meshPhysicalMaterial color="#ae8aff" emissive="#5434a1" emissiveIntensity={.18} metalness={.55} roughness={.25} clearcoat={1} /></mesh>
    {[[-1.45,1.55,.04],[1.5,.6,-.18],[-1.45,-1.05,.12],[.9,-1.9,-.25]].map(([x,y,z],i)=><mesh key={i} position={[x,y,z]}><sphereGeometry args={[i === 1 ? .055 : .035,12,12]}/><meshBasicMaterial color={i%2?'#83e9f3':'#c5a4ff'}/></mesh>)}
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

function SceneContents({ compact, reduceMotion, onReady }) {
  return <>
    <ambientLight intensity={1.15} />
    <pointLight position={[3.5, 3, 4]} intensity={compact ? 10 : 17} color="#728eff" distance={9} />
    <pointLight position={[-3, -2, 2]} intensity={compact ? 6 : 10} color="#63e6ee" distance={8} />
    <pointLight position={[0, 2, -2]} intensity={7} color="#b66cff" distance={7} />
    <ParticleField compact={compact} />
    <NetworkLines compact={compact} />
    <CinematicCamera reduceMotion={reduceMotion} />
    <PortraitFrame compact={compact} onReady={onReady} />
  </>
}

export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch { return false }
}

export default function Scene({ compact = false, onReady }) {
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
  return <div className={`scene-canvas ${quality.compact ? 'scene-compact' : ''}`}><Canvas dpr={quality.compact ? 1 : [1, 1.35]} frameloop="demand" camera={{ position: [0, 0, 5.9], fov: 38 }} gl={{ alpha: true, antialias: !quality.compact, powerPreference: 'low-power', stencil: false, depth: true }}><Suspense fallback={null}><SceneContents compact={quality.compact} reduceMotion={quality.reduceMotion} onReady={onReady} /></Suspense></Canvas></div>
}

