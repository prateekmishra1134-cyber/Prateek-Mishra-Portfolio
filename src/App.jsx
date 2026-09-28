import { useEffect, useState, lazy, Suspense } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Menu, X, Mail, Phone, ChevronDown, Sparkles } from 'lucide-react'
import { achievements, certifications, education, experience, focusAreas, GITHUB_URL, interests, involvement, languages, LINKEDIN_URL, profile, skills } from './data/portfolio'

const Scene = lazy(() => import('./components/Scene'))
const navItems = [['Home','home'],['About','about'],['Experience','experience'],['Education','education'],['Skills','skills'],['Certifications','certifications'],['Achievements','achievements'],['Contact','contact']]

function Reveal({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion()
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.14 }} transition={{ duration: .62, delay, ease: [.22,.68,.2,1] }}>{children}</motion.div>
}

function Loader() {
  const [show, setShow] = useState(true)
  useEffect(() => { const timer = window.setTimeout(() => setShow(false), 420); return () => clearTimeout(timer) }, [])
  return <AnimatePresence>{show && <motion.div className="loader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .38 }}><div className="loader-mark">P<span>.</span></div><span className="loader-caption">PRATEEK MISHRA · PORTFOLIO</span><div className="loader-line"><i /></div></motion.div>}</AnimatePresence>
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const update = () => setScrolled(window.scrollY > 28); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update) }, [])
  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setOpen(false) }
  return <header className={`nav-wrap ${scrolled ? 'nav-scrolled' : ''}`}><nav className="nav shell" aria-label="Main navigation">
    <button className="wordmark" onClick={() => go('home')} aria-label="Back to home"><span>P<span>.</span></span><small>PRATEEK MISHRA</small></button>
    <div className={`nav-links ${open ? 'nav-open' : ''}`}>{navItems.map(([label,id]) => <button key={id} onClick={() => go(id)}>{label}</button>)}<button className="nav-contact" onClick={() => go('contact')}>Let’s talk <ArrowUpRight size={14}/></button></div>
    <button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
  </nav></header>
}

function SectionHeading({ index, eyebrow, title, accent }) {
  return <div className="section-heading"><div className="eyebrow"><span>{index}</span><i />{eyebrow}</div><h2>{title} <em>{accent}</em></h2></div>
}

function Hero() {
  const [sceneAvailable, setSceneAvailable] = useState(false)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    try {
      const canvas = document.createElement('canvas')
      if (window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))) setSceneAvailable(true)
    } catch { /* Keep the lightweight CSS visual when WebGL is unavailable. */ }
  }, [])
  return <section id="home" className="hero section-anchor"><div className="hero-grid" />
    <div className="shell hero-inner"><div className="hero-copy">
      <motion.div className="availability" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .52 }}><span /> OPEN TO OPPORTUNITIES</motion.div>
      <motion.p className="hero-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .62 }}>MARKETING <i>×</i> DATA <i>×</i> BUSINESS</motion.p>
      <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .7, duration: .75 }}><span>Ideas meet</span><br/><em>insight.</em></motion.h1>
      <motion.div className="hero-name" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .94 }}>PRATEEK MISHRA <span>—</span> MBA STUDENT</motion.div>
      <motion.p className="hero-summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>MBA student at ICFAI Business School, Bangalore, focused on marketing, data analytics and business development.<br className="desktop-break"/> Curious about what makes people, products, and decisions connect.</motion.p>
      <motion.div className="hero-actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.12 }}>
        <a className="button button-primary" href="#experience">Explore my work <ArrowDownRight size={16}/></a><a className="button button-quiet" href="#experience">View experience <ArrowDown size={15}/></a><a className="button button-quiet" href="#contact">Contact me <ArrowUpRight size={16}/></a>
      </motion.div>
      <motion.div className="hero-index" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}><span>01 / 08</span><i/><span>SCROLL TO EXPLORE</span></motion.div>
    </div>
    <div className="hero-art" aria-label="Abstract 3D glass form surrounded by points and orbiting rings"><div className="art-halo"/>{sceneAvailable?<Suspense fallback={<div className="scene-fallback"><div className="fallback-orbit"/></div>}><Scene/></Suspense>:<div className="scene-fallback" aria-hidden="true"><div className="fallback-orbit"/><span>INSIGHT · STRATEGY · GROWTH</span></div>}<div className="art-note"><span>01</span><div>TURNING<br/>CURIOSITY INTO<br/><b>CLARITY.</b></div></div><div className="art-coordinate">12°58′ N&nbsp; 77°35′ E</div></div>
    <div className="hero-bottom shell"><span>BASED IN BANGALORE, INDIA</span><span>SCROLL DOWN <ArrowDown size={13}/></span><span>AVAILABLE FOR INTERNSHIPS &amp; PLACEMENTS</span></div></div>
  </section>
}

function About() {
  return <section id="about" className="section about section-anchor"><div className="shell"><SectionHeading index="01" eyebrow="A LITTLE ABOUT ME" title="Grounded in people." accent="Guided by data."/>
    <div className="about-layout"><Reveal className="about-main"><div className="about-intro"><span className="big-quote">“</span><p>I’m Prateek — an MBA student bringing together <strong>marketing instinct</strong> and <strong>analytical thinking</strong> to understand customers and solve business problems.</p></div><p className="about-objective">{profile.objective}</p><div className="about-meta"><div><span>STUDYING</span><b>MBA · Marketing &amp; Data Analytics</b><small>ICFAI Business School, Bangalore · IFHE</small></div><ArrowDownRight className="about-arrow" size={22}/></div></Reveal>
      <div className="focus-list">{focusAreas.map((item,i)=><Reveal key={item.title} delay={i*.08}><article className="focus-card"><span className="focus-number">{item.number}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div><ArrowUpRight size={16}/></article></Reveal>)}</div></div>
    <div className="about-ribbon"><span>THINK CLEARLY</span><i/><span>CONNECT THE DOTS</span><i/><span>MAKE IT MATTER</span><i/><span>STAY CURIOUS</span></div>
  </div></section>
}

function Experience() {
  const [expanded,setExpanded] = useState(0)
  return <section id="experience" className="section experience section-anchor"><div className="shell"><SectionHeading index="02" eyebrow="WHERE I’VE CONTRIBUTED" title="Experience with" accent="intention."/>
    <div className="experience-lead"><p>From customer-facing retail to business development, each role has added a new perspective on how people and businesses meet.</p><span>05 EXPERIENCES</span></div>
    <div className="timeline">{experience.map((item,i)=><Reveal key={item.company} delay={i*.055}><article className={`experience-card ${item.featured?'experience-featured':''} ${expanded===i?'expanded':''}`}>
      <button className="experience-trigger" onClick={()=>setExpanded(expanded===i?-1:i)} aria-expanded={expanded===i}>
        <span className="timeline-index">0{i+1}</span><span className="experience-company"><b>{item.company}</b><small>{item.title}</small></span><span className="experience-date">{item.dates}</span><span className="experience-meta">{item.meta || 'Professional experience'}</span><span className="experience-chevron"><ChevronDown size={18}/></span>
      </button>
      <AnimatePresence initial={false}>{expanded===i&&<motion.div className="experience-details" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.28}}><ul>{item.details.map(d=><li key={d}>{d}</li>)}</ul></motion.div>}</AnimatePresence>
    </article></Reveal>)}</div>
  </div></section>
}

function Education() {
  return <section id="education" className="section education section-anchor"><div className="shell"><SectionHeading index="03" eyebrow="THE LEARNING SO FAR" title="Always in" accent="progress."/><div className="education-grid">{education.map((item,i)=><Reveal key={item.degree+i} delay={i*.07}><article className={`education-card ${item.current?'education-current':''}`}><div className="education-top"><span>{item.university}</span><span>{item.year}</span></div><div className="education-degree">{item.degree}</div>{item.field&&<div className="education-field">{item.field}</div>}<div className="education-rule"/><p>{item.school}</p><div className="education-bottom"><span>{item.current?'IN PROGRESS':'COMPLETED'}</span><b>{item.result}</b></div></article></Reveal>)}</div></div></section>
}

function Skills() {
  return <section id="skills" className="section skills section-anchor"><div className="shell"><SectionHeading index="04" eyebrow="WHAT I BRING" title="A toolkit for" accent="the whole picture."/><div className="skills-layout"><div className="skills-orbit-wrap"><div className="skills-ring-label">CAPABILITIES, IN ORBIT</div><div className="orbit-visual"><div className="orbit-dash orbit-dash-one"/><div className="orbit-dash orbit-dash-two"/><div className="orbit-core"><span>PM</span></div>{[...skills.technical,...skills.soft.slice(0,3)].map((s,i)=><span key={s} className={`orbit-chip orbit-chip-${i}`}>{s}</span>)}</div><p className="orbit-hint">Skills shaped through study and experience</p></div><div className="skill-groups"><SkillGroup title="Technical skills" number="01" skills={skills.technical}/><SkillGroup title="Soft skills" number="02" skills={skills.soft}/><SkillGroup title="Strengths" number="03" skills={skills.strengths}/></div></div></div></section>
}
function SkillGroup({title,number,skills:list}) { return <Reveal><div className="skill-group"><div className="skill-group-head"><span>{number}</span><h3>{title}</h3><i/></div><div className="skill-tags">{list.map(s=><span key={s}>{s}</span>)}</div></div></Reveal> }

function Certifications() {
  return <section id="certifications" className="section certifications section-anchor"><div className="shell"><SectionHeading index="05" eyebrow="LEARNING, IN PRACTICE" title="Curiosity, with" accent="credentials."/><div className="cert-list">{certifications.map(([name,year,status],i)=><Reveal key={name} delay={i*.025}><article className="cert-row"><span className="cert-index">{String(i+1).padStart(2,'0')}</span><span className="cert-name">{name}{status&&<small>{status}</small>}</span><span className="cert-year">{year}</span><Sparkles size={14}/></article></Reveal>)}</div></div></section>
}

function Achievements() {
  return <section id="achievements" className="section achievements section-anchor"><div className="shell"><SectionHeading index="06" eyebrow="MOMENTS THAT MATTER" title="A few proud" accent="milestones."/><div className="achievement-grid">{achievements.map((item,i)=><Reveal key={item} delay={i*.07}><article className="achievement-card"><span className="achievement-count">0{i+1}</span><div className="achievement-symbol">✳</div><h3>{item}</h3><span className="achievement-line"/></article></Reveal>)}</div></div></section>
}

function Community() {
  return <section className="section community"><div className="shell community-layout"><div><SectionHeading index="07" eyebrow="BEYOND THE CLASSROOM" title="Showing up &" accent="getting involved."/><p className="community-copy">Leadership and extracurricular involvement across college life.</p></div><div className="community-nodes">{involvement.map((item,i)=><Reveal key={item} delay={i*.08}><article className="community-node"><span>{String(i+1).padStart(2,'0')}</span><b>{item}</b><i/></article></Reveal>)}</div></div></section>
}

function LanguagesInterests() {
  return <section className="section personal"><div className="shell personal-grid"><div className="languages"><div className="eyebrow"><span>08</span><i/>LANGUAGES</div><h2>Words that<br/><em>bring us closer.</em></h2><div className="language-list">{languages.map(([name,ability])=><div key={name}><b>{name}</b><span>{ability}</span><i/></div>)}</div></div><div className="interests"><div className="eyebrow"><span>09</span><i/>OFF THE CLOCK</div><h2>Room for<br/><em>the things I love.</em></h2><div className="interest-cards">{interests.map((item,i)=><article key={item.title} className={`interest-card interest-${i}`}><span className="interest-mark">{item.mark}</span><b>{item.title}</b><small>{item.copy}</small></article>)}</div></div></div></section>
}

function Contact() {
  const socialLinks = [['LinkedIn',LINKEDIN_URL],['GitHub',GITHUB_URL]]
  return <section id="contact" className="contact section-anchor"><div className="contact-ornament"/><div className="shell contact-inner"><div className="eyebrow"><span>10</span><i/>A GOOD PLACE TO START</div><h2>Let’s<br/><em>connect.</em></h2><p>Interested in marketing, data analytics, or a good conversation? I’d love to hear from you.</p><div className="contact-links"><a className="contact-email" href={`mailto:${profile.email}`}><Mail size={17}/>{profile.email}<ArrowUpRight size={16}/></a><a href={`tel:${profile.phone}`}><Phone size={16}/>{profile.phone}</a></div><div className="social-links">{socialLinks.map(([label,url])=>url?<a href={url} target="_blank" rel="noreferrer" key={label}>{label}<ArrowUpRight size={13}/></a>:<span key={label} title={`${label} profile URL to be added in src/data/portfolio.js`}>{label}<small>URL to be added</small></span>)}</div></div></section>
}

function Footer() {
  return <footer className="footer"><div className="shell footer-main"><a className="footer-brand" href="#home">PRATEEK<br/><em>MISHRA</em><span>.</span></a><div className="footer-caption">MARKETING<br/> &amp; DATA ANALYTICS</div><div className="footer-contact"><a href={`mailto:${profile.email}`}>{profile.email}</a><a href={`tel:${profile.phone}`}>{profile.phone}</a><div className="footer-socials">{[['LinkedIn',LINKEDIN_URL],['GitHub',GITHUB_URL]].map(([name,url])=>url?<a key={name} href={url} target="_blank" rel="noreferrer">{name}</a>:<span key={name}>{name} · add URL</span>)}</div></div><a className="back-top" href="#home">BACK TO TOP <ArrowUpRight size={14}/></a></div><div className="shell footer-bottom"><span>© 2026 PRATEEK MISHRA</span><span>MADE WITH INTENTION <i>✳</i></span><span>BANGALORE, INDIA</span></div></footer>
}

function Cursor() {
  useEffect(()=>{ if(window.matchMedia('(pointer: coarse)').matches||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return; const cursor=document.querySelector('.cursor'); const move=e=>{cursor.style.transform=`translate(${e.clientX}px, ${e.clientY}px)`}; const over=e=>{if(e.target.closest('a,button'))cursor.classList.add('cursor-hover');else cursor.classList.remove('cursor-hover')}; window.addEventListener('pointermove',move); window.addEventListener('pointerover',over); return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerover',over)} },[])
  return <div className="cursor" aria-hidden="true"><span/></div>
}

export default function App() {
  return <><Loader/><Cursor/><Navbar/><main><Hero/><About/><Experience/><Education/><Skills/><Certifications/><Achievements/><Community/><LanguagesInterests/><Contact/></main><Footer/></>
}

