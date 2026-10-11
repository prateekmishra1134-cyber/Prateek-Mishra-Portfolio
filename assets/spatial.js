const THREE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.171.0/build/three.module.js'
const portraitURL = new URL('../assets/prateek-mishra.jpeg', import.meta.url).href
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const coarsePointer = window.matchMedia('(pointer: coarse)').matches

function webglAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch { return false }
}

function line(THREE, a, b, color = '#8aa5ff', opacity = .3) {
  const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...a), new THREE.Vector3(...b)])
  return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity }))
}

function panel(THREE, parent, position, size, color = '#90a5ff') {
  const group = new THREE.Group()
  group.position.set(...position)
  const material = new THREE.MeshPhysicalMaterial({ color, metalness: .22, roughness: .24, transparent: true, opacity: .2, clearcoat: 1 })
  const frameMaterial = new THREE.MeshStandardMaterial({ color, metalness: .55, roughness: .28, emissive: color, emissiveIntensity: .08 })
  const glass = new THREE.Mesh(new THREE.BoxGeometry(...size), material)
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(glass.geometry), new THREE.LineBasicMaterial({ color, transparent: true, opacity: .5 }))
  group.add(glass, edges)
  parent.add(group)
  return group
}

async function startScene() {
  if (document.body.classList.contains('react-active') || !webglAvailable()) return
  let THREE
  try { THREE = await import(/* @vite-ignore */ THREE_CDN) } catch { return }
  if (document.body.classList.contains('react-active')) return

  const canvas = document.createElement('canvas')
  canvas.className = 'spatial-three-canvas'
  canvas.setAttribute('aria-hidden', 'true')
  document.body.prepend(canvas)
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !coarsePointer, powerPreference: 'low-power', stencil: false })
  } catch {
    canvas.remove()
    return
  }
  const compact = window.matchMedia('(max-width: 760px)').matches || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1 : 1.35))
  renderer.setSize(window.innerWidth, window.innerHeight, false)
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, .1, 100)
  camera.position.set(0, 0, 8)
  scene.add(new THREE.AmbientLight(0x9bacff, 1.15))
  const key = new THREE.PointLight(0x718fff, compact ? 8 : 13, 19); key.position.set(3, 4, 5); scene.add(key)
  const rim = new THREE.PointLight(0x66deed, compact ? 5 : 9, 18); rim.position.set(-3, -1, -7); scene.add(rim)
  const violet = new THREE.PointLight(0xa984ff, 6, 18); violet.position.set(1, 2, -30); scene.add(violet)

  const zones = []
  const zone = (index) => {
    const group = new THREE.Group()
    group.position.z = -index * 5.1
    scene.add(group)
    zones[index] = group
    return group
  }
  const hero = zone(0)
  const portrait = new THREE.Group()
  portrait.position.set(compact ? .72 : 2.05, 0, 0)
  hero.add(portrait)
  const back = new THREE.Mesh(new THREE.BoxGeometry(2.57, 3.67, .13), new THREE.MeshPhysicalMaterial({ color: 0x7995e7, metalness: .52, roughness: .22, transparent: true, opacity: .34, clearcoat: 1 }))
  back.position.z = -.12
  portrait.add(back)
  const textureLoader = new THREE.TextureLoader()
  textureLoader.load(portraitURL, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy())
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(2.28, 3.25), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }))
    photo.position.z = -.025
    portrait.add(photo)
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(2.42, 3.39), new THREE.MeshPhysicalMaterial({ color: 0xb7d5ff, roughness: .08, metalness: .1, transparent: true, opacity: .08, side: THREE.DoubleSide, clearcoat: 1 }))
    glass.position.z = .025
    portrait.add(glass)
    if(!compact) document.body.classList.add('spatial-three-ready')
    requestRender()
  }, undefined, () => {})
  const rails = [
    [0,1.72,.04,2.58,.085,.13,'#97b6ff'],
    [0,-1.72,.04,2.58,.085,.13,'#79e5ef'],
    [-1.24,0,.04,.085,3.42,.13,'#8199ee'],
    [1.24,0,.04,.085,3.42,.13,'#ae8aff'],
  ]
  rails.forEach(([x,y,z,w,h,d,color])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,metalness:.52,roughness:.26,emissive:color,emissiveIntensity:.07}));m.position.set(portrait.position.x+x,y,z);portrait.add(m)})
  ;[0,1].forEach((i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(2.08+i*.22,.012,6,90),new THREE.MeshBasicMaterial({color:i?'#a984ff':'#66deed',transparent:true,opacity:.45}));ring.position.set(portrait.position.x,0,-.35);ring.rotation.set(.95,i*.8,-.2);hero.add(ring)})
  ;[[-1,1.3,0],[1.5,.9,-.3],[-1.4,-1.4,.2],[.8,-1.8,-.4]].forEach(([x,y,z],i)=>{const dot=new THREE.Mesh(new THREE.SphereGeometry(i === 1 ? .055 : .035,12,12),new THREE.MeshBasicMaterial({color:i%2?'#78e9f1':'#c4a0ff'}));dot.position.set(x,y,z);hero.add(dot)})

  const about=zone(1)
  const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.75,1),new THREE.MeshPhysicalMaterial({color:'#7489e4',wireframe:true,transparent:true,opacity:.32}))
  core.position.x=-2.5;about.add(core)
  const skillRing=new THREE.Group();skillRing.position.set(2.2,0,0);about.add(skillRing)
  for(let i=0;i<9;i++){const t=i/9*Math.PI*2;const p=new THREE.Mesh(new THREE.IcosahedronGeometry(i % 3 === 0 ? .14 : .09,1),new THREE.MeshStandardMaterial({color:i%2?'#839fff':'#74deea',metalness:.25,roughness:.3}));p.position.set(Math.cos(t)*1.25,Math.sin(t)*.95,Math.sin(t*2)*.14);skillRing.add(p);skillRing.add(line(THREE,[0,0,0],p.position.toArray(),i%2?'#8198ff':'#70dce9',.22))}

  const experience=zone(2)
  const timeline= new THREE.Group();experience.add(timeline)
  timeline.add(line(THREE,[0,1.8,0],[0,-1.8,0],'#66deed',.4))
  const experiences=[]
  for(let i=0;i<5;i++){const item=panel(THREE,timeline,[i%2?2.5:-2.5,.95-i*.47,-i*.36],[1.18,.66,.07],i===0?'#76e5ed':'#8e9eff');experiences.push(item);timeline.add(line(THREE,[0,.95-i*.47,0],[i%2?2.5:-2.5,.95-i*.47,-i*.36],i===0?'#74deea':'#9785ff',.28))}
  const education=zone(3)
  for(let i=0;i<4;i++){const x=-2.7+i*1.8;const orb=new THREE.Mesh(new THREE.DodecahedronGeometry(.26,0),new THREE.MeshStandardMaterial({color:i%2?'#8ca4ff':'#73dfea',metalness:.32,roughness:.3}));orb.position.set(x,Math.sin(i*1.2)*.42,0);education.add(orb);if(i)education.add(line(THREE,[-2.7+(i-1)*1.8,Math.sin((i-1)*1.2)*.42,0],[x,Math.sin(i*1.2)*.42,0],'#9a8aff',.24))}
  const skills=zone(4)
  const skillNodes=new THREE.Group();skillNodes.position.set(2.45,0,0);skills.add(skillNodes)
  for(let i=0;i<12;i++){const t=i/12*Math.PI*2;const p=new THREE.Mesh(new THREE.SphereGeometry(i % 3 === 0 ? .13 : .085,12,12),new THREE.MeshPhysicalMaterial({color:i%2?'#87a3ff':'#6de1ed',metalness:.35,roughness:.28}));p.position.set(Math.cos(t)*1.35,Math.sin(t)*1.05,Math.sin(t*3)*.2);skillNodes.add(p);skillNodes.add(line(THREE,[0,0,0],p.position.toArray(),'#82dbe7',.24))}
  const certs=zone(5)
  for(let i=0;i<5;i++)panel(THREE,certs,[-2.5+i*1.25,Math.sin(i)*.3,-i*.24],[.78,1.04,.055],i%2?'#7cdaea':'#9c89ff')
  const highlights=zone(6)
  const podium=new THREE.Group();podium.position.set(-2.35,-.15,0);highlights.add(podium)
  ;[[-.58,-.24,.42,.45], [0,.04,.48,.9], [.58,-.36,.42,.28]].forEach(([x,y,w,h],i)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,.4),new THREE.MeshStandardMaterial({color:['#273867','#3c4d8e','#29355f'][i],metalness:.42,roughness:.3}));b.position.set(x,y,0);podium.add(b)})
  const award=new THREE.Mesh(new THREE.TorusGeometry(.25,.055,10,40),new THREE.MeshStandardMaterial({color:'#89cde9',metalness:.6,roughness:.22}));award.position.set(0,.73,0);podium.add(award)
  const interests=new THREE.Group();interests.position.set(2.25,0,0);highlights.add(interests)
  const chess=new THREE.Group();chess.position.set(-1.25,0,0);interests.add(chess)
  const chessBase=new THREE.Mesh(new THREE.CylinderGeometry(.28,.34,.12,20),new THREE.MeshStandardMaterial({color:'#99a9f2',metalness:.45}));chessBase.position.y=-.4;chess.add(chessBase)
  const chessBody=new THREE.Mesh(new THREE.CylinderGeometry(.13,.22,.48,18),new THREE.MeshStandardMaterial({color:'#bba2ff',metalness:.35}));chessBody.position.y=-.04;chess.add(chessBody)
  const movie=new THREE.Mesh(new THREE.BoxGeometry(.72,.58,.12),new THREE.MeshPhysicalMaterial({color:'#7690da',metalness:.35,roughness:.25,clearcoat:1}));movie.position.set(0,0,0);interests.add(movie)
  const bike=new THREE.Group();bike.position.x=1.15;interests.add(bike)
  ;[-.28,.28].forEach(x=>{const wheel=new THREE.Mesh(new THREE.TorusGeometry(.2,.035,8,28),new THREE.MeshStandardMaterial({color:'#78dce9',metalness:.5}));wheel.position.set(x,-.3,0);bike.add(wheel)})
  bike.add(line(THREE,[-.28,-.3,0],[0,.04,0],'#b39aff',.8),line(THREE,[0,.04,0],[.28,-.3,0],'#b39aff',.8),line(THREE,[0,.04,0],[-.1,-.16,0],'#b39aff',.8))
  const contact=zone(7)
  ;[0,1,2].forEach(i=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(1.1+i*.38,.012,6,80),new THREE.MeshBasicMaterial({color:i===1?'#73e4ef':'#9984ff',transparent:true,opacity:.34}));ring.rotation.set(.5+i*.35,.2,-.2);contact.add(ring)})
  const particles=new Float32Array((compact?54:118)*3)
  for(let i=0;i<particles.length/3;i++){const a=i*2.39996,r=2.1+(i%7)*.2;particles[i*3]=Math.cos(a)*r;particles[i*3+1]=Math.sin(a*.73)*(1.3+(i%4)*.17);particles[i*3+2]=-(i%45)*.85+2}
  const pointsGeo=new THREE.BufferGeometry();pointsGeo.setAttribute('position',new THREE.BufferAttribute(particles,3))
  scene.add(new THREE.Points(pointsGeo,new THREE.PointsMaterial({color:'#91b8ff',size:compact ? .02 : .027,transparent:true,opacity:.37,sizeAttenuation:true,depthWrite:false})))

  const focusables=Array.from(document.querySelectorAll('.timeline-card'))
  const focusState={section:'',index:-1}
  focusables.forEach((el,index)=>{
    el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label','Focus experience panel '+(index+1))
    const select=()=>{const same=focusState.section==='experience'&&focusState.index===index;focusState.section=same?'': 'experience';focusState.index=same?-1:index;window.dispatchEvent(new CustomEvent('portfolio:focus',{detail:{section:focusState.section,index:focusState.index}}));requestRender()}
    el.addEventListener('click',select);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select()}})
    el.addEventListener('pointerenter',()=>{if(!coarsePointer){experience.userData.hover=index;requestRender()}})
    el.addEventListener('pointerleave',()=>{experience.userData.hover=-1;requestRender()})
  })
  const skillNotes={'Microsoft Excel':'Spreadsheet tool for organizing, calculating, and reviewing data.','Power BI':'Business intelligence tool for visual reports.','Microsoft Office':'Productivity tools listed in the technical skills set.','Google Workspace':'Cloud productivity and collaboration tools.','Communication & Presentation':'Sharing information and presenting ideas clearly.','Strategic Thinking':'Considering options and planning toward goals.','Team Collaboration':'Working with others toward shared tasks.','Leadership':'Guiding and coordinating group effort.','Creativity':'Generating and developing ideas.'}
  const focusCards=Array.from(document.querySelectorAll('.chip'))
  focusCards.forEach((el,index)=>{
    el.tabIndex=0;el.setAttribute('role','button')
    el.addEventListener('click',()=>{const on=el.getAttribute('aria-pressed')==='true';focusCards.forEach(node=>node.setAttribute('aria-pressed','false'));if(!on)el.setAttribute('aria-pressed','true');skillNodes.userData.selected=on?-1:index;const panel=el.closest('.skill-panel');let note=panel.querySelector('.skill-note');if(!note){note=document.createElement('p');note.className='skill-note';note.setAttribute('aria-live','polite');panel.appendChild(note)}note.textContent=on?'':(skillNotes[el.textContent.trim()]||'Skill listed in the portfolio.');requestRender()})
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click()}})
  })

  const mouse={x:0,y:0}
  const initialAngle=reduceMotion?0:.38
  let introStart=performance.now()
  let targetZ=8
  let running=false
  let frame=0
  let previous=performance.now()
  let focusZ=0
  const setScrollTarget=()=>{
    const sections=Array.from(document.querySelectorAll('main section[id]'))
    const max=Math.max(document.documentElement.scrollHeight-window.innerHeight,1)
    const progress=reduceMotion?0:Math.min(1,Math.max(0,window.scrollY/max))
    targetZ=8-progress*5.1*Math.max(sections.length-1,0)
    requestRender()
  }
  function render(now){
    running=true
    const delta=Math.min((now-previous)/1000,.05);previous=now
    const sections=Array.from(document.querySelectorAll('main section[id]'))
    const max=Math.max(document.documentElement.scrollHeight-window.innerHeight,1)
    const progress=reduceMotion?0:Math.min(1,Math.max(0,window.scrollY/max))
    const desiredZ=8-progress*5.1*Math.max(sections.length-1,0)
    camera.position.z=THREE.MathUtils.damp(camera.position.z,desiredZ,2.2,delta)
    const intro=Math.min(1,Math.max(0,(now-introStart-180)/1650))
    const eased=intro*intro*(3-2*intro)
    const angle=initialAngle*(1-eased)
    const px=reduceMotion||coarsePointer?0:mouse.x*.2
    const py=reduceMotion||coarsePointer?0:mouse.y*-.12
    const focusX=focusState.section==='experience'&&focusState.index>=0?(focusState.index%2 ? .48 : -.48):0
    const desiredX=Math.sin(angle)*2.1+px+focusX
    camera.position.x=THREE.MathUtils.damp(camera.position.x,desiredX,2.8,delta)
    camera.position.y=THREE.MathUtils.damp(camera.position.y,py,2.8,delta)
    camera.lookAt(reduceMotion?0:px*.4+focusX*.45,reduceMotion?0:py*.3,camera.position.z-8+(focusX ? .35 : 0))
    const focused=focusState.section==='experience'?focusState.index:experience.userData.hover
    experiences.forEach((item,index)=>{
      const z=-index*.36+((index===focused)?1.05:0)
      item.position.z=THREE.MathUtils.damp(item.position.z,z,4.8,delta)
      const scale=index===focused?1.1:1
      item.scale.setScalar(THREE.MathUtils.damp(item.scale.x,scale,4.8,delta))
    })
    const skillScale=skillNodes.userData.selected>=0?1.12:1
    skillNodes.scale.setScalar(THREE.MathUtils.damp(skillNodes.scale.x,skillScale,4.5,delta))
    renderer.render(scene,camera)
    const moving=intro<1||Math.abs(camera.position.z-desiredZ)>.008||Math.abs(camera.position.x-desiredX)>.008||Math.abs(camera.position.y-py)>.008||experiences.some((item,index)=>Math.abs(item.position.z-(-index*.36+(index===focused?1.05:0)))>.01)||Math.abs(skillNodes.scale.x-skillScale)>.01
    if(moving){frame=requestAnimationFrame(render)}else{running=false}
  }
  function requestRender(){if(!running){running=true;previous=performance.now();frame=requestAnimationFrame(render)}}
  function onPointer(event){mouse.x=event.clientX/Math.max(window.innerWidth,1)-.5;mouse.y=event.clientY/Math.max(window.innerHeight,1)-.5;requestRender()}
  function onResize(){camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight,false);portrait.position.x=window.innerWidth < 760 ? .72 : 2.05;requestRender()}
  const skip=()=>{introStart=performance.now()-1900;requestRender()}
  window.addEventListener('scroll',setScrollTarget,{passive:true})
  window.addEventListener('resize',onResize,{passive:true})
  if(!coarsePointer&&!reduceMotion)window.addEventListener('pointermove',onPointer,{passive:true})
  window.addEventListener('portfolio:skip-intro',skip)
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);running=false}else requestRender()})
  setScrollTarget()
}

if(document.readyState==='complete'||document.readyState==='interactive') {
  const run=()=>startScene().catch(()=>{})
  if(window.requestIdleCallback)window.requestIdleCallback(run,{timeout:1800})
  else window.setTimeout(run,700)
} else window.addEventListener('DOMContentLoaded',()=>window.setTimeout(()=>startScene().catch(()=>{}),450),{once:true})
