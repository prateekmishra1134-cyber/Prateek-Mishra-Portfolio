import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const ZONE_STEP = 4.35
const SECTION_COUNT = 10

function CameraJourney() {
  const { camera, invalidate } = useThree()
  const pointer = useRef({ x: 0, y: 0 })
  const focus = useRef(null)
  const lastScroll = useRef(0)
  useEffect(() => {
    const onScroll = () => { lastScroll.current = window.scrollY; invalidate() }
    const onFocus = (event) => { focus.current = event.detail || null; invalidate() }
    const onPointer = (event) => {
      pointer.current.x = (event.clientX / Math.max(window.innerWidth, 1) - .5) * 2
      pointer.current.y = (event.clientY / Math.max(window.innerHeight, 1) - .5) * 2
      invalidate()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('portfolio:focus', onFocus)
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointer, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('portfolio:focus', onFocus)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [invalidate])
  useFrame((_, delta) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
    const progress = reduced ? 0 : THREE.MathUtils.clamp(lastScroll.current / maxScroll, 0, 1)
    const targetZ = 8 - progress * ZONE_STEP * (SECTION_COUNT - 1)
    const focusX = focus.current?.section === 'experience' && focus.current.index >= 0 ? (focus.current.index % 2 ? .42 : -.42) : 0
    const before = camera.position.z
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.15, delta)
    camera.position.x = THREE.MathUtils.damp(camera.position.x, reduced ? 0 : pointer.current.x * .22, 1.8, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, reduced ? 0 : -pointer.current.y * .13, 1.8, delta)
    camera.lookAt(reduced ? 0 : pointer.current.x * .11 + focusX * .45, reduced ? 0 : -pointer.current.y * .06, camera.position.z - 8 + (focusX ? .35 : 0))
    if (Math.abs(camera.position.z - targetZ) > .012 || Math.abs(camera.position.x - ((reduced ? 0 : pointer.current.x * .22) + focusX)) > .01 || Math.abs(before - camera.position.z) > .002) invalidate()
  })
  return null
}

function Rail({ points, color = '#78dfea', opacity = .24 }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)))
    return new THREE.TubeGeometry(curve, Math.max(32, points.length * 10), .009, 5, false)
  }, [points])
  return <mesh geometry={geometry}><meshBasicMaterial color={color} transparent opacity={opacity} /></mesh>
}

function GlassPanel({ position, size = [1.05, 1.4, .08], tint = '#8ba6ff' }) {
  return <group position={position}>
    <mesh><boxGeometry args={size} /><meshPhysicalMaterial color={tint} roughness={.22} metalness={.16} transparent opacity={.18} clearcoat={1} /></mesh>
    <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(...size)]} /><lineBasicMaterial color={tint} transparent opacity={.5} /></lineSegments>
  </group>
}

function FocusableExperience({ index, selected }) {
  const ref = useRef()
  const { invalidate } = useThree()
  const baseZ = -index * .52
  useFrame((_, delta) => {
    if (!ref.current) return
    const focused = selected?.section === 'experience' && selected.index === index
    ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, baseZ + (focused ? 1.15 : 0), 5, delta)
    const scale = focused ? 1.14 : 1
    ref.current.scale.setScalar(THREE.MathUtils.damp(ref.current.scale.x, scale, 5, delta))
    if (Math.abs(ref.current.position.z - (baseZ + (focused ? 1.15 : 0))) > .01 || Math.abs(ref.current.scale.x - scale) > .01) invalidate()
  })
  return <group ref={ref} position={[index % 2 ? 2.55 : -2.55, .9 - index * .48, baseZ]}>
    <GlassPanel position={[0, 0, 0]} size={[1.2, .7, .08]} tint={index === 0 ? '#80e7f0' : '#91a4ff'} />
    <mesh position={[0, 0, .08]}><sphereGeometry args={[.055, 14, 14]} /><meshBasicMaterial color={index === 0 ? '#82eff4' : '#b59aff'} /></mesh>
  </group>
}

function SkillNodes() {
  const points = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2
    return [Math.cos(angle) * (1.3 + (i % 3) * .12), Math.sin(angle) * (1 + (i % 2) * .2), 0]
  }), [])
  const linePositions = useMemo(() => new Float32Array(points.flatMap(([x, y, z], i) => [x, y, z, points[(i + 1) % points.length][0], points[(i + 1) % points.length][1], points[(i + 1) % points.length][2]])), [points])
  return <group position={[2.4, .1, 0]}>
    <lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[linePositions, 3]} /></bufferGeometry><lineBasicMaterial color="#74dce9" transparent opacity={.25} /></lineSegments>
    {points.map((p, i) => <mesh key={i} position={p}><icosahedronGeometry args={[i % 3 === 0 ? .14 : .09, 1]} /><meshPhysicalMaterial color={i % 2 ? '#819eff' : '#a88aff'} emissive={i % 2 ? '#435dba' : '#5736a3'} emissiveIntensity={.18} roughness={.25} metalness={.1} /></mesh>)}
    <mesh><torusGeometry args={[1.58, .012, 6, 90]} /><meshBasicMaterial color="#9f8bff" transparent opacity={.3} /></mesh>
  </group>
}

function Podium() {
  return <group position={[2.4, -.2, 0]}>
    <mesh position={[-.62, -.36, 0]}><boxGeometry args={[.48, .5, .42]} /><meshStandardMaterial color="#263b72" metalness={.45} roughness={.34} /></mesh>
    <mesh position={[0, -.12, .1]}><boxGeometry args={[.5, .98, .5]} /><meshStandardMaterial color="#384b8a" metalness={.42} roughness={.3} /></mesh>
    <mesh position={[.62, -.47, 0]}><boxGeometry args={[.48, .28, .42]} /><meshStandardMaterial color="#27315e" metalness={.42} roughness={.35} /></mesh>
    <mesh position={[0, .62, 0]}><torusGeometry args={[.28, .055, 10, 40]} /><meshStandardMaterial color="#8ccfe8" metalness={.65} roughness={.22} /></mesh>
    <mesh position={[0, .87, 0]}><cylinderGeometry args={[.045, .045, .48, 10]} /><meshStandardMaterial color="#9bcaf5" metalness={.6} roughness={.24} /></mesh>
  </group>
}

function InterestObjects() {
  return <group position={[2.5, 0, 0]}>
    <group position={[-1.15, 0, 0]}>
      <mesh position={[0, -.38, 0]}><cylinderGeometry args={[.32, .37, .13, 24]} /><meshStandardMaterial color="#90a8ff" metalness={.45} roughness={.3} /></mesh>
      <mesh position={[0, -.04, 0]}><cylinderGeometry args={[.17, .23, .55, 20]} /><meshStandardMaterial color="#a9baff" metalness={.4} roughness={.25} /></mesh>
      <mesh position={[0, .32, 0]}><sphereGeometry args={[.18, 18, 18]} /><meshStandardMaterial color="#c7b5ff" metalness={.25} roughness={.25} /></mesh>
    </group>
    <group position={[0, 0, 0]}>
      <mesh rotation={[.16, .26, -.1]}><boxGeometry args={[.95, .65, .1]} /><meshPhysicalMaterial color="#647fce" metalness={.4} roughness={.24} clearcoat={1} /></mesh>
      <mesh position={[0, .34, .03]} rotation={[0, 0, -.14]}><boxGeometry args={[1.02, .09, .13]} /><meshStandardMaterial color="#a6bbff" metalness={.25} /></mesh>
    </group>
    <group position={[1.25, -.05, 0]}>
      <mesh position={[-.32, -.32, 0]}><torusGeometry args={[.25, .045, 8, 32]} /><meshStandardMaterial color="#84dfea" metalness={.5} roughness={.27} /></mesh>
      <mesh position={[.34, -.32, 0]}><torusGeometry args={[.25, .045, 8, 32]} /><meshStandardMaterial color="#84dfea" metalness={.5} roughness={.27} /></mesh>
      <Rail points={[[-.32,-.32,0],[0,.08,0],[.18,.04,0],[.34,-.32,0],[.03,-.1,0],[-.32,-.32,0]]} color="#9b8aff" opacity={.7} />
      <mesh position={[.07, .05, .02]}><sphereGeometry args={[.1, 12, 12]} /><meshStandardMaterial color="#b1a0ff" metalness={.35} /></mesh>
    </group>
  </group>
}

function SectionWorld({ selected }) {
  const experiencePanels = useMemo(() => Array.from({ length: 5 }, (_, index) => index), [])
  return <>
    <group position={[0, 0, -ZONE_STEP * 2]}>
      <mesh position={[-2.7, .1, 0]}><icosahedronGeometry args={[.78, 1]} /><meshPhysicalMaterial color="#647ee0" wireframe transparent opacity={.42} /></mesh>
      <SkillNodes />
      <Rail points={[[-3,-1,0],[-1.8,.9,.3],[0,-.45,-.2],[1.7,.8,.1],[3,-.7,0]]} color="#8b7dff" />
    </group>
    <group position={[0, 0, -ZONE_STEP}]>
      <Rail points={[[0,1.6,0],[0,.8,0],[0,0,0],[0,-.8,0],[0,-1.6,0]]} color="#79e3ee" opacity={.36} />
      {experiencePanels.map((index) => <FocusableExperience key={index} index={index} selected={selected} />)}
    </group>
    <group position={[0, 0, -ZONE_STEP * 3]}>
      <Rail points={[[-2.7,1.1,0],[-1.4,.4,.1],[0,-.2,0],[1.4,-.8,-.1],[2.7,-1.3,0]]} color="#9087ff" opacity={.3} />
      {[-2,-.65,.65,2].map((x,i)=><group key={x} position={[x,Math.sin(i*1.4)*.4,0]}><mesh><dodecahedronGeometry args={[.28,0]} /><meshPhysicalMaterial color={i%2?'#8fa6ff':'#75dce9'} metalness={.35} roughness={.28} /></mesh><mesh position={[0,-.5,0]}><cylinderGeometry args={[.035,.035,.55,8]} /><meshBasicMaterial color="#7892ec" transparent opacity={.45}/></mesh></group>)}
    </group>
    <group position={[0,0,-ZONE_STEP*4]}><SkillNodes/><mesh position={[-2.5,0,0]}><torusGeometry args={[1.15,.015,6,70]}/><meshBasicMaterial color="#66deed" transparent opacity={.3}/></mesh></group>
    <group position={[0,0,-ZONE_STEP*5]}>
      {[[-2.4,.55,0],[-.8,-.28,-.2],[.8,.38,.1],[2.4,-.25,0]].map((p,i)=><group key={i} position={p}><GlassPanel position={[0,0,0]} size={[.8,1.05,.055]} tint={i%2?'#83e0eb':'#a78aff'}/></group>)}
      <Rail points={[[-3,-1,0],[-1,0,0],[1,0,0],[3,-.8,0]]} opacity={.2}/>
    </group>
    <group position={[0,0,-ZONE_STEP*6]}><Podium/><mesh position={[-2.5,.4,0]}><octahedronGeometry args={[.7,0]}/><meshPhysicalMaterial color="#8b9fff" wireframe transparent opacity={.25}/></mesh></group>
    <group position={[0,0,-ZONE_STEP*7]}>
      {[-2.4,-.8,.8,2.4].map((x,i)=><group key={i} position={[x,Math.sin(i)*.45,0]}><mesh><sphereGeometry args={[.18,20,20]}/><meshStandardMaterial color={i%2?'#8a9fff':'#73dfe9'} metalness={.35}/></mesh><mesh position={[0,-.35,0]}><cylinderGeometry args={[.012,.012,.7,6]}/><meshBasicMaterial color="#7289dd" transparent opacity={.3}/></mesh></group>)}
      <Rail points={[[-3,-.7,0],[-1,1,0],[1,-.8,0],[3,.7,0]]} color="#86dce9"/>
    </group>
    <group position={[0,0,-ZONE_STEP*8]}><InterestObjects/><mesh position={[-2.5,.2,0]}><torusGeometry args={[.9,.018,6,64]}/><meshBasicMaterial color="#9b81ff" transparent opacity={.35}/></mesh></group>
    <group position={[0,0,-ZONE_STEP*9]}>
      {[0,1,2].map(i=><mesh key={i} rotation={[.4+i*.5,.3,0]}><torusGeometry args={[1.15+i*.45,.012,6,84]}/><meshBasicMaterial color={i===1?'#79e4ef':'#9581ff'} transparent opacity={.32-i*.05}/></mesh>)}
      <mesh position={[2.4,.2,0]}><icosahedronGeometry args={[.82,1]}/><meshPhysicalMaterial color="#7895ff" wireframe transparent opacity={.36}/></mesh>
    </group>
  </>
}

function ParticleDrift({ compact }) {
  const points = useMemo(() => {
    const count = compact ? 55 : 110
    const positions = new Float32Array(count * 3)
    for (let i=0;i<count;i++) {
      const a=i*2.39996, z=-(i%60)*.72+3
      positions[i*3]=Math.cos(a)*(2.1+(i%7)*.22)
      positions[i*3+1]=Math.sin(a*.73)*(1.5+(i%5)*.18)
      positions[i*3+2]=z
    }
    return positions
  }, [compact])
  return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[points,3]}/></bufferGeometry><pointsMaterial color="#92bbff" size={compact ? .018 : .026} transparent opacity={.42} sizeAttenuation depthWrite={false}/></points>
}

function WorldContents({ selected, compact }) {
  return <>
    <ambientLight intensity={1.25}/>
    <pointLight position={[2,3,4]} intensity={compact?5:9} color="#728eff" distance={16}/>
    <pointLight position={[-3,-2,-18]} intensity={compact?3:6} color="#59d8ed" distance={20}/>
    <pointLight position={[2,1,-38]} intensity={5} color="#a476ff" distance={16}/>
    <ParticleDrift compact={compact}/>
    <SectionWorld selected={selected}/>
  </>
}

export default function Journey() {
  const [selected,setSelected]=useState(null)
  const compact=typeof window!=='undefined'&&window.matchMedia('(max-width: 760px)').matches
  useEffect(()=>{
    const onFocus=(event)=>setSelected(event.detail||null)
    window.addEventListener('portfolio:focus',onFocus)
    return()=>window.removeEventListener('portfolio:focus',onFocus)
  },[])
  if(typeof window!=='undefined'&&!window.WebGLRenderingContext)return null
  return <div className="journey-world" aria-hidden="true">
    <Canvas dpr={compact?1:[1,1.3]} camera={{position:[0,0,8],fov:38,near:.1,far:100}} frameloop="demand" gl={{alpha:true,antialias:!compact,powerPreference:'low-power',stencil:false,depth:true}}>
      <CameraJourney/>
      <WorldContents selected={selected} compact={compact}/>
    </Canvas>
  </div>
}
