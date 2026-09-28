import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'

function Core() {
  const group = useRef()
  useFrame(({ pointer, clock }) => {
    if (!group.current) return
    group.current.rotation.y += (pointer.x * 0.18 - group.current.rotation.y) * 0.025
    group.current.rotation.x += (-pointer.y * 0.12 - group.current.rotation.x) * 0.025
    group.current.position.y = Math.sin(clock.elapsedTime * 0.55) * 0.08
  })
  return <group ref={group}>
    <mesh rotation={[0.2, 0.3, 0.2]}><icosahedronGeometry args={[1.14, 1]} /><meshPhysicalMaterial color="#b7cf83" roughness={0.23} metalness={0.24} clearcoat={0.85} transparent opacity={0.76} /></mesh>
    <mesh rotation={[1.1, 0.4, 0]}><torusGeometry args={[1.54, 0.012, 8, 120]} /><meshBasicMaterial color="#c9f06a" transparent opacity={0.6} /></mesh>
    <mesh rotation={[0.3, -0.8, 0.9]}><torusGeometry args={[1.76, 0.008, 8, 120]} /><meshBasicMaterial color="#dce3ce" transparent opacity={0.28} /></mesh>
    {[[-1.65, .7, .1], [1.42, .84, -.1], [1.5, -.85, .1], [-1.55, -.78, 0]].map((p, i) => <mesh key={i} position={p}><sphereGeometry args={[.055, 16, 16]} /><meshBasicMaterial color="#c9f06a" /></mesh>)}
  </group>
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch { return false }
}

export default function Scene({ compact = false }) {
  const [enabled] = useState(() => typeof window !== 'undefined' && hasWebGL() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [smallScreen, setSmallScreen] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches)
  useEffect(() => { const media = window.matchMedia('(max-width: 760px)'); const update = () => setSmallScreen(media.matches); media.addEventListener?.('change', update); return () => media.removeEventListener?.('change', update) }, [])
  compact = compact || smallScreen
  const points = useMemo(() => Array.from({ length: compact ? 12 : 24 }, (_, i) => [Math.sin(i * 9.7) * 2.55, Math.cos(i * 4.3) * 1.8, Math.sin(i * 2.8) * 1.4]), [compact])
  if (!enabled) return <div className="scene-fallback" aria-hidden="true"><div className="fallback-orbit" /><span>INSIGHT · STRATEGY · GROWTH</span></div>
  return <div className={`scene-canvas ${compact ? 'scene-compact' : ''}`}><Canvas dpr={compact ? 1 : [1, 1.35]} camera={{ position: [0, 0, 6.1], fov: 37 }} gl={{ alpha: true, antialias: !compact, powerPreference: 'low-power' }}>
    <Suspense fallback={null}>
      <ambientLight intensity={1.5} /><pointLight position={[4, 4, 5]} intensity={25} color="#d5f28f" /><pointLight position={[-3, -3, 3]} intensity={12} color="#9badbd" />
      <Core />
      <group>{points.slice(0, compact ? 12 : 24).map((p, i) => <mesh key={i} position={p} scale={.018 + (i % 3) * .009}><sphereGeometry args={[1, 8, 8]} /><meshBasicMaterial color="#c9f06a" transparent opacity={.45} /></mesh>)}</group>
    </Suspense>
  </Canvas><span className="scene-label scene-label-one">INSIGHT</span><span className="scene-label scene-label-two">STRATEGY</span><span className="scene-label scene-label-three">GROWTH</span></div>
}


