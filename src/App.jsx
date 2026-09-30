import { Component, lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, ChevronDown, Database, Mail, Menu, Network, Phone, Sparkles, Target, X } from 'lucide-react'
import { achievements, certifications, education, experience, focusAreas, GITHUB_URL, interests, involvement, languages, LINKEDIN_URL, profile, skills } from './data/portfolio'

const Scene = lazy(() => import('./components/Scene'))
const navItems = [['Home', 'home'], ['About', 'about'], ['Experience', 'experience'], ['Education', 'education'], ['Skills', 'skills'], ['Certifications', 'certifications'], ['Achievements', 'achievements'], ['Contact', 'contact']]
const focusIcons = [Target, Database, Network]

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <div className="scene-fallback" aria-hidden="true"><div className="fallback-orbit"/><span>INSIGHT · STRATEGY · GROWTH</span></div>
    return this.props.children
  }
}

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const reduce = useReducedMotion()
  const Component = motion[as] || motion.div
  return <Component className={className} initial={reduce ? false : { opacity: 0, y: 22, filter: 'blur(5px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduce ? 0 : .62, delay: reduce ? 0 : delay, ease: [.22, .68, .2, 1] }}>{children}</Component>
}

function Eyebrow({ index, children }) {
  return <div className="eyebrow"><span>{index}</span><i aria-hidden="true" />{children}</div>
}

function SectionHeading({ index, eyebrow, title, accent, description }) {
  return <div className="section-heading"><div><Eyebrow index={index}>{eyebrow}</Eyebrow><h2>{title} <em>{accent}</em></h2></div>{description && <p className="section-intro">{description}</p>}</div>
}

function Navbar({ active, setActive }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])
  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    setActive(id)
    setOpen(false)
  }
  return <header className={`nav-wrap ${scrolled ? 'nav-scrolled' : ''}`}><nav className="nav shell" aria-label="Main navigation">
    <button className="wordmark" onClick={() => go('home')} aria-label="Prateek Mishra, back to home"><span className="wordmark-mark">P<span>.</span></span><span className="wordmark-copy"><b>PRATEEK MISHRA</b><small>MARKETING × DATA</small></span></button>
    <div className={`nav-links ${open ? 'nav-open' : ''}`} id="primary-navigation">{navItems.map(([label, id], i) => <button key={id} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined} onClick={() => go(id)}><span className="nav-index">0{i + 1}</span>{label}</button>)}<button className="nav-contact" onClick={() => go('contact')}>Let’s connect <ArrowUpRight size={14} /></button></div>
    <button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
  </nav></header>
}

function Hero() {
  const reduce = useReducedMotion()
  const [sceneReady, setSceneReady] = useState(false)
  useEffect(() => {
    if (reduce) return undefined
    let idleHandle
    let timerHandle
    const loadScene = () => setSceneReady(true)
    if (window.requestIdleCallback) idleHandle = window.requestIdleCallback(loadScene, { timeout: 1100 })
    else timerHandle = window.setTimeout(loadScene, 650)
    return () => {
      if (idleHandle && window.cancelIdleCallback) window.cancelIdleCallback(idleHandle)
      if (timerHandle) window.clearTimeout(timerHandle)
    }
  }, [reduce])
  return <section id="home" className="hero section-anchor"><div className="hero-grid" aria-hidden="true" /><div className="hero-glow hero-glow-one" aria-hidden="true" /><div className="hero-glow hero-glow-two" aria-hidden="true" />
    <div className="shell hero-inner"><div className="hero-copy">
      <motion.div className="availability" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}><span /> OPEN TO OPPORTUNITIES <i>·</i> BANGALORE, INDIA</motion.div>
      <motion.p className="hero-kicker" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}>MBA <i>×</i> MARKETING <i>×</i> DATA ANALYTICS</motion.p>
      <motion.h1 initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .7 }}><span>Prateek</span><br /><em>Mishra<span className="hero-period">.</span></em></motion.h1>
      <motion.div className="hero-role" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55 }}><span className="role-rule" /> Marketing &amp; Data Analytics <span className="role-separator">/</span> MBA</motion.div>
      <motion.p className="hero-summary" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .62 }}>{profile.positioning}</motion.p>
      <motion.div className="hero-actions" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .72 }}>
        <a className="button button-primary" href="#experience">Explore my work <ArrowDownRight size={16} /></a><a className="button button-secondary" href="#experience">View experience <ArrowRight size={15} /></a><a className="button button-text" href="#contact">Let’s connect <ArrowUpRight size={15} /></a>
      </motion.div>
      <motion.div className="hero-meta" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .85 }}><span><b>01</b> / 08</span><i /><span>BUSINESS DEVELOPMENT</span><i /><span>DIGITAL MARKETING</span></motion.div>
    </div>
    <div className="hero-visual" aria-label="Interactive abstract 3D visualization of connected data and ideas"><div className="hero-visual-orbit hero-visual-orbit-a"/><div className="hero-visual-orbit hero-visual-orbit-b"/><div className="visual-crosshair visual-crosshair-a"/><div className="visual-crosshair visual-crosshair-b"/>
      {sceneReady ? <SceneBoundary><Suspense fallback={<div className="scene-fallback"><div className="fallback-orbit"/><span>INSIGHT · STRATEGY · GROWTH</span></div>}><Scene /></Suspense></SceneBoundary> : <div className="scene-fallback"><div className="fallback-orbit"/><span>INSIGHT · STRATEGY · GROWTH</span></div>}
      <div className="visual-tag visual-tag-top"><span className="tag-dot tag-dot-blue"/> INSIGHT</div><div className="visual-tag visual-tag-right"><span className="tag-dot tag-dot-violet"/> CONNECTION</div><div className="visual-tag visual-tag-bottom"><span className="tag-dot tag-dot-cyan"/> GROWTH</div>
      <div className="visual-caption"><span>ANALYTICAL THINKING</span><i>·</i><span>HUMAN CONNECTION</span></div>
    </div></div>
    <div className="hero-bottom shell"><span>01 — A POINT OF VIEW</span><a href="#about">SCROLL TO EXPLORE <ArrowDown size={13} /></a><span>MARKETING · DATA · BUSINESS</span></div>
  </section>
}

function About() {
  return <section id="about" className="section about section-anchor"><div className="shell"><SectionHeading index="01" eyebrow="A LITTLE ABOUT ME" title="Grounded in people." accent="Guided by data." description="A people-first perspective, paired with an analytical approach to the questions that move businesses forward." />
    <div className="about-layout"><Reveal className="about-main"><div className="about-intro"><span className="big-quote" aria-hidden="true">“</span><p>I’m Prateek — an MBA student bringing together <strong>marketing instinct</strong> and <strong>analytical thinking</strong> to understand customers and solve business problems.</p></div><p className="about-objective">{profile.objective}</p><div className="about-meta"><div><span>CURRENTLY STUDYING</span><b>MBA · Marketing &amp; Data Analytics</b><small>ICFAI Business School, Bangalore · IFHE</small></div><ArrowDownRight className="about-arrow" size={22} aria-hidden="true" /></div></Reveal>
      <div className="focus-list" aria-label="Areas of focus">{focusAreas.map((item, i) => { const Icon = focusIcons[i]; return <Reveal key={item.title} delay={i * .07}><article className={`focus-card focus-card-${i + 1}`} tabIndex="0"><span className="focus-number">{item.number}</span><span className="focus-icon"><Icon size={20} strokeWidth={1.6} /></span><div><h3>{item.title}</h3><p>{item.copy}</p></div><ArrowUpRight size={16} className="focus-arrow" aria-hidden="true" /></article></Reveal> })}</div></div>
    <div className="about-ribbon" aria-label="Guiding principles"><span>THINK CLEARLY</span><i/><span>CONNECT THE DOTS</span><i/><span>MAKE IT MATTER</span><i/><span>STAY CURIOUS</span></div>
    <div className="thinking-grid"><Reveal className="thinking-copy"><div className="eyebrow"><span>FIELD NOTE 01</span><i/>A WAY OF THINKING</div><h3>Make sense of the signal.<br/><em>Stay close to people.</em></h3><p>Two abstract visual studies of the disciplines that shape my work. These visuals are illustrative concepts, not campaign results or business data.</p><div className="thinking-index"><span>01 / MARKETING SYSTEMS</span><span>02 / DATA PATTERNS</span></div></Reveal><Reveal className="study-panel marketing-study" delay={.08}><div className="study-panel-head"><span>01</span><div><b>Marketing as connection</b><small>Audience · Content · Engagement</small></div><Network size={17} /></div><div className="marketing-map" aria-label="Abstract marketing network: brand connected to audience, content, engagement, and business"><svg className="network-lines" viewBox="0 0 520 250" role="img" aria-label="Abstract connections between a brand, audience, content, engagement, and business"><path d="M259 122 C190 93 140 54 75 48 M259 122 C190 150 140 198 75 205 M259 122 C330 88 380 53 445 48 M259 122 C330 154 382 196 445 205 M259 122 L255 30 M259 122 L260 224"/><path className="network-line-bright" d="M75 48 C135 73 197 96 259 122 C325 147 386 180 445 205"/></svg><div className="network-node node-core"><span>BRAND</span><b>Core idea</b></div><div className="network-node node-audience"><span>01</span><b>Audience</b></div><div className="network-node node-content"><span>02</span><b>Content</b></div><div className="network-node node-engagement"><span>03</span><b>Engagement</b></div><div className="network-node node-business"><span>04</span><b>Business</b></div><div className="network-node node-insight"><span>INSIGHT</span></div><div className="network-node node-strategy"><span>STRATEGY</span></div></div><div className="study-foot"><span>ABSTRACT MARKETING NETWORK</span><span>ILLUSTRATIVE ONLY</span></div></Reveal>
      <Reveal className="study-panel data-study" delay={.14}><div className="study-panel-head"><span>02</span><div><b>Data as a landscape</b><small>Clusters · Curves · Relationships</small></div><Database size={17} /></div><div className="data-landscape" role="img" aria-label="Procedural abstract visualization of clusters and connected patterns, with no real business data"><div className="data-landscape-glow"/><svg viewBox="0 0 520 250" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="terrainLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5c7cff" stopOpacity=".2"/><stop offset=".5" stopColor="#56d8ee" stopOpacity=".8"/><stop offset="1" stopColor="#987bff" stopOpacity=".25"/></linearGradient></defs><path className="terrain-path terrain-path-back" d="M8 177 C75 138 97 181 155 142 S246 105 292 133 S373 184 512 84"/><path className="terrain-path terrain-path-mid" d="M8 203 C76 164 102 196 159 159 S247 124 293 150 S386 195 512 111"/><path className="terrain-path terrain-path-front" d="M8 222 C81 186 108 214 164 180 S248 148 296 169 S397 209 512 138"/>{Array.from({ length: 80 }, (_, i) => { const x = (i % 16) * 32 + 8; const row = Math.floor(i / 16); const y = 198 - row * 29 + Math.sin(i * 1.6) * 19 - (x / 520) * 43; return <circle key={i} className={`data-point data-point-${i % 4}`} cx={x} cy={y} r={1.5 + (i % 3) * .55} style={{ '--point-delay': `${(i % 13) * -.27}s` }} /> })}</svg><div className="data-label data-label-a">CLUSTER A</div><div className="data-label data-label-b">PATTERN</div><div className="data-label data-label-c">SIGNAL</div></div><div className="study-foot"><span>PROCEDURAL · ABSTRACT VISUAL</span><span>NO BUSINESS DATA</span></div></Reveal>
    </div>
  </div></section>
}

function Experience() {
  const [expanded, setExpanded] = useState(0)
  const groups = useMemo(() => {
    const map = new Map()
    experience.forEach((item, index) => { const year = item.dates.match(/20\d{2}/)?.[0] || ''; if (!map.has(year)) map.set(year, []); map.get(year).push({ ...item, sourceIndex: index }) })
    return Array.from(map, ([year, entries]) => ({ year, entries })).sort((a, b) => Number(b.year) - Number(a.year))
  }, [])
  return <section id="experience" className="section experience section-anchor"><div className="shell"><SectionHeading index="02" eyebrow="WHERE I’VE CONTRIBUTED" title="Experience with" accent="intention." description="From customer-facing retail to business development, each role has added a new perspective on how people and businesses meet." />
    <div className="experience-bar"><span><CalendarDays size={15} /> 2020 — 2026</span><i/><span>BUSINESS DEVELOPMENT · RETAIL · MARKETING</span><span className="experience-count">05 EXPERIENCES</span></div>
    <div className="timeline">{groups.map((group) => <div className="timeline-year" key={group.year}><div className="timeline-year-mark"><span>{group.year}</span><i/></div><div className="timeline-year-items">{group.entries.map((item) => { const index = item.sourceIndex; const open = expanded === index; return <Reveal key={item.company} className={`experience-card ${item.featured ? 'experience-featured' : ''} ${open ? 'expanded' : ''}`}><article><button className="experience-trigger" onClick={() => setExpanded(open ? -1 : index)} aria-expanded={open} aria-controls={`experience-detail-${index}`}><span className="timeline-index">0{index + 1}</span><span className="experience-company"><b>{item.company}</b><small>{item.title}</small></span><span className="experience-date">{item.dates}</span><span className="experience-meta">{item.meta || 'Professional experience'}</span><span className="experience-chevron"><ChevronDown size={17}/></span></button><AnimatePresence initial={false}>{open && <motion.div id={`experience-detail-${index}`} className="experience-details" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .28 }}><ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></motion.div>}</AnimatePresence></article></Reveal> })}</div></div>)}</div>
  </div></section>
}

function Education() {
  return <section id="education" className="section education section-anchor"><div className="shell"><SectionHeading index="03" eyebrow="THE LEARNING SO FAR" title="Always in" accent="progress." description="The study and experiences that continue to shape a people-focused, data-aware approach."/><div className="education-grid">{education.map((item, i) => <Reveal key={`${item.degree}-${item.year}`} delay={i * .05}><article className={`education-card ${item.current ? 'education-current' : ''}`} tabIndex="0"><div className="education-top"><span>{item.university}</span><span>{item.year}</span></div><div className="education-degree">{item.degree}</div>{item.field && <div className="education-field">{item.field}</div>}<div className="education-rule"/><p>{item.school}</p><div className="education-bottom"><span>{item.current ? 'IN PROGRESS' : 'COMPLETED'}</span><b>{item.result}</b></div></article></Reveal>)}</div></div></section>
}

function Skills() {
  const orbitSkills = [...skills.technical, ...skills.soft]
  return <section id="skills" className="section skills section-anchor"><div className="shell"><SectionHeading index="04" eyebrow="WHAT I BRING" title="A toolkit for" accent="the whole picture." description="A mix of tools, ways of working, and strengths shaped through study and experience."/><div className="skills-layout"><Reveal className="skills-orbit-wrap"><div className="skills-ring-label"><span className="ring-pip"/> CAPABILITIES, IN ORBIT</div><div className="orbit-visual" aria-label="Interactive orbit of technical and soft skills"><div className="orbit-track orbit-track-one"/><div className="orbit-track orbit-track-two"/><div className="orbit-track orbit-track-three"/><div className="orbit-core"><span>PM</span><small>TOOLKIT</small></div>{orbitSkills.map((skill, i) => <span key={skill} className={`orbit-chip orbit-chip-${i}`} style={{ '--i': i }}>{skill}</span>)}</div><p className="orbit-hint">Skills shaped through study and experience</p></Reveal><div className="skill-groups"><SkillGroup title="Technical skills" number="01" skillsList={skills.technical}/><SkillGroup title="Soft skills" number="02" skillsList={skills.soft}/><SkillGroup title="Strengths" number="03" skillsList={skills.strengths}/></div></div></div></section>
}

function SkillGroup({ title, number, skillsList }) {
  return <Reveal><div className="skill-group"><div className="skill-group-head"><span>{number}</span><h3>{title}</h3><i/></div><div className="skill-tags">{skillsList.map((skill) => <span key={skill}>{skill}</span>)}</div></div></Reveal>
}

function Certifications() {
  return <section id="certifications" className="section certifications section-anchor"><div className="shell"><SectionHeading index="05" eyebrow="LEARNING, IN PRACTICE" title="Curiosity, with" accent="credentials." description="A growing collection of learning across analytics, sustainability, project management, and digital marketing."/><div className="cert-list">{certifications.map(([name, year, status], i) => <Reveal key={name} delay={i * .025}><article className="cert-row" tabIndex="0"><span className="cert-index">{String(i + 1).padStart(2, '0')}</span><span className="cert-name">{name}{status && <small>{status}</small>}</span><span className="cert-year">{year}</span><Sparkles size={14} aria-hidden="true"/></article></Reveal>)}</div></div></section>
}

function Achievements() {
  return <section id="achievements" className="section achievements section-anchor"><div className="shell"><SectionHeading index="06" eyebrow="MOMENTS THAT MATTER" title="A few proud" accent="milestones." description="Competition results that reflect curiosity, teamwork, and a willingness to step forward."/><div className="achievement-grid">{achievements.map((item, i) => <Reveal key={item} delay={i * .055}><article className={`achievement-card achievement-card-${i + 1}`} tabIndex="0"><span className="achievement-count">0{i + 1}</span><div className="achievement-object" aria-hidden="true"><span/><i/><b/></div><h3>{item}</h3><span className="achievement-line"/></article></Reveal>)}</div></div></section>
}

function Community() {
  return <section className="section community"><div className="shell community-layout"><div><SectionHeading index="07" eyebrow="BEYOND THE CLASSROOM" title="Showing up &" accent="getting involved."/><p className="community-copy">Leadership and extracurricular involvement across college life.</p></div><div className="community-nodes">{involvement.map((item, i) => <Reveal key={item} delay={i * .06}><article className="community-node"><span>{String(i + 1).padStart(2, '0')}</span><b>{item}</b><ArrowUpRight size={15}/></article></Reveal>)}</div></div></section>
}

function LanguagesInterests() {
  return <section className="section personal"><div className="shell personal-grid"><div className="languages"><Eyebrow index="08">LANGUAGES</Eyebrow><h2>Words that<br/><em>bring us closer.</em></h2><div className="language-list">{languages.map(([name, ability]) => <div key={name}><b>{name}</b><span>{ability}</span><i/></div>)}</div></div><div className="interests"><Eyebrow index="09">OFF THE CLOCK</Eyebrow><h2>Room for<br/><em>the things I love.</em></h2><div className="interest-cards">{interests.map((item, i) => <article key={item.title} className={`interest-card interest-${i}`} tabIndex="0"><div className="interest-art" aria-hidden="true"><span className="interest-shape">{item.mark}</span><i/><b/></div><div className="interest-card-copy"><b>{item.title}</b><small>{item.copy}</small></div><ArrowUpRight size={14} className="interest-arrow" aria-hidden="true"/></article>)}</div></div></div></section>
}

function Contact() {
  const socialLinks = [['LinkedIn', LINKEDIN_URL], ['GitHub', GITHUB_URL]]
  return <section id="contact" className="contact section-anchor"><div className="contact-light" aria-hidden="true"/><div className="shell contact-inner"><div className="contact-orbit contact-orbit-one"/><div className="contact-orbit contact-orbit-two"/><Eyebrow index="10">A GOOD PLACE TO START</Eyebrow><h2>Let’s<br/><em>connect.</em></h2><p>Interested in marketing, data analytics, or a good conversation? I’d love to hear from you.</p><div className="contact-links"><a className="contact-email" href={`mailto:${profile.email}`}><Mail size={17}/><span>{profile.email}</span><ArrowUpRight size={16}/></a><a href={`tel:${profile.phone}`}><Phone size={16}/><span>{profile.phone}</span></a></div><div className="social-links">{socialLinks.map(([label, url]) => url ? <a href={url} target="_blank" rel="noreferrer" key={label}>{label}<ArrowUpRight size={13}/></a> : <span key={label}>{label}<small>URL to be added</small></span>)}</div></div></section>
}

function Footer() {
  return <footer className="footer"><div className="shell footer-main"><a className="footer-brand" href="#home">PRATEEK<br/><em>MISHRA</em><span>.</span></a><div className="footer-caption">MARKETING<br/>&amp; DATA ANALYTICS</div><div className="footer-contact"><a href={`mailto:${profile.email}`}>{profile.email}</a><a href={`tel:${profile.phone}`}>{profile.phone}</a><div className="footer-socials">{[['LinkedIn', LINKEDIN_URL], ['GitHub', GITHUB_URL]].map(([name, url]) => url ? <a key={name} href={url} target="_blank" rel="noreferrer">{name}</a> : <span key={name}>{name} · add URL</span>)}</div></div><a className="back-top" href="#home">BACK TO TOP <ArrowUpRight size={14}/></a></div><div className="shell footer-bottom"><span>© 2026 PRATEEK MISHRA</span><span>MADE WITH INTENTION <i>✳</i></span><span>BANGALORE, INDIA</span></div></footer>
}

function ScrollProgress() {
  useEffect(() => {
    const bar = document.querySelector('.scroll-progress')
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  return <div className="scroll-progress" aria-hidden="true" />
}

function Cursor() {
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce || window.matchMedia('(pointer: coarse)').matches) return
    const cursor = document.querySelector('.cursor')
    if (!cursor) return
    const move = (event) => { cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)` }
    const over = (event) => { cursor.classList.toggle('cursor-hover', Boolean(event.target.closest('a,button,[tabindex="0"]'))) }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', over) }
  }, [reduce])
  return <div className="cursor" aria-hidden="true"><span/></div>
}

export default function App() {
  const [active, setActive] = useState('home')
  useEffect(() => {
    const sections = navItems.map(([, id]) => document.getElementById(id)).filter(Boolean)
    let frame = 0
    let current = 'home'
    const update = () => {
      frame = 0
      const marker = Math.max(110, window.innerHeight * .36)
      const section = sections.reduce((latest, item) => item.getBoundingClientRect().top <= marker ? item.id : latest, 'home')
      if (section !== current) { current = section; setActive(section) }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [])
  return <div className="portfolio"><ScrollProgress/><div className="ambient ambient-left" aria-hidden="true"/><div className="ambient ambient-right" aria-hidden="true"/><Cursor/><Navbar active={active} setActive={setActive}/><main><Hero/><About/><Experience/><Education/><Skills/><Certifications/><Achievements/><Community/><LanguagesInterests/><Contact/></main><Footer/></div>
}

