import { useState, useEffect, useRef } from "react";
import {
  Globe, Smartphone, Monitor, Code2, Wrench,
  MapPin, Phone, Mail, Link, GitBranch, ExternalLink,
  Briefcase, Menu, X, ChevronRight, Download, Eye, Star, Cpu,
} from "lucide-react";
import "./index.css";

const NAV = ["Home","Services","Experience","Projects","Skills","About","Contact"];
const CRIMSON = "hsl(348,83%,47%)";

/* ── Scroll reveal hook ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1, rootMargin: "-60px" }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── Typing effect hook ── */
function useTyping(text: string, speed = 65) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx >= text.length) return;
    const t = setTimeout(() => setIdx(v => v + 1), speed);
    return () => clearTimeout(t);
  }, [idx, text, speed]);
  return text.slice(0, idx);
}

/* ── Progress bar ── */
function ProgressBar() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setW(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="progress-bar" style={{ width: `${w}%` }} />;
}

/* ── Animated ring ── */
function Ring({ size, opacity, duration, dir }: { size: number; opacity: number; duration: number; dir: 1 | -1 }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let angle = 0;
    let raf: number;
    const animate = () => {
      angle += (dir * 0.3) / duration;
      if (ref.current) ref.current.style.transform = `rotate(${angle}deg)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [dir, duration]);
  return (
    <div ref={ref} className="ring" style={{
      width: size, height: size,
      border: `1px solid hsla(348,83%,47%,${opacity})`,
      left: "50%", top: "50%",
      marginLeft: -size/2, marginTop: -size/2,
      position: "absolute",
    }} />
  );
}

/* ── Animated counter ── */
function Counter({ target, suffix = "+" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1600, steps = 60, step = dur / steps;
        let i = 0;
        const t = setInterval(() => {
          i++;
          setVal(Math.round((target * i) / steps));
          if (i >= steps) clearInterval(t);
        }, step);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <div ref={ref}><span className="stat-val">{val}{suffix}</span></div>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const typed = useTyping("Lindelani Ndlangamandla");
  useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div style={{ background: "var(--bg)", color: "white", minHeight: "100vh", overflowX: "hidden" }}>
      <ProgressBar />

      {/* ── NAVBAR ── */}
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-inner">
          <button className="nav-logo" onClick={() => scrollTo("home")}>
            <span className="crimson">LI</span>NDE<span className="crimson">LA</span>NI
          </button>
          <ul className="nav-links">
            {NAV.map(n => (
              <li key={n}>
                <button onClick={() => scrollTo(n.toLowerCase())}>{n}</button>
              </li>
            ))}
          </ul>
          <button className="hamburger" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : "closed"}`}>
        <nav>
          {NAV.map(n => (
            <button key={n} onClick={() => scrollTo(n.toLowerCase())}>
              <span className="crimson" style={{ marginRight: "0.5rem" }}>›</span> {n}
            </button>
          ))}
        </nav>
      </div>

      {/* ── HERO ── */}
      <section id="home" className="hero" style={{ padding: 0 }}>
        {/* Background rings */}
        <Ring size={350} opacity={0.06} duration={20} dir={1} />
        <Ring size={520} opacity={0.04} duration={28} dir={-1} />
        <Ring size={700} opacity={0.025} duration={35} dir={1} />

        {/* FLOATING PROFILE IMAGE — desktop right side */}
        <div className="hero-profile-float">
          <img src="/profile.png" alt="Lindelani Nottary Ndlangamandla" />
        </div>

        <div className="hero-content">
          <p className="hero-eyebrow">Software Engineer &amp; Systems Developer</p>
          <h1 className="hero-greeting">Hello, I'm</h1>
          <div className="hero-name">
            {typed}<span className="hero-cursor">|</span>
          </div>
          <p className="hero-desc">
            Building scalable, efficient and user-friendly software solutions —
            from full-stack web apps and REST APIs to IoT systems and digital marketplaces.
          </p>
          <div className="hero-btns">
            <button className="cta-btn" onClick={() => scrollTo("projects")}>View Portfolio</button>
            <button className="cta-btn filled" onClick={() => scrollTo("contact")}>Hire Me</button>
          </div>
          <div className="hero-stats">
            {[
              { value: 7, label: "Projects Built" },
              { value: 5, label: "Services Offered" },
              { value: 3, label: "Years Experience" },
              { value: 12, label: "Tech Skills" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <Counter target={s.value} />
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <button className="scroll-indicator" onClick={() => scrollTo("services")}>
          <span>Scroll</span>
          <ChevronRight size={14} style={{ transform: "rotate(90deg)" }} />
        </button>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="section-alt">
        <div className="container">
          <h2 className="section-title reveal">Serv<span>i</span>ces</h2>
          <p className="reveal" style={{ textAlign: "center", color: "var(--muted)", maxWidth: 600, margin: "0 auto 3rem", fontSize: "0.9rem", lineHeight: 1.8 }}>
            Professional software development services focused on building scalable, efficient
            and user-friendly solutions.
          </p>
          <div className="services-grid">
            {[
              { icon: Globe, title: "Web Design & Development", desc: "Responsive, modern websites and web apps using React, TypeScript, Angular, Flask and Node.js." },
              { icon: Smartphone, title: "Mobile App Development", desc: "Cross-platform mobile applications with a focus on performance, clean UI and smooth user experience." },
              { icon: Monitor, title: "Desktop Application Dev", desc: "Robust desktop applications using Java and other technologies with focus on functionality and reliability." },
              { icon: Code2, title: "Full Stack Development", desc: "End-to-end solutions with clean UI/UX and powerful backend systems including REST APIs and database integration." },
              { icon: Cpu, title: "IoT & Systems Dev", desc: "Real-time monitoring systems, sensor integration, data collection dashboards and automation solutions." },
              { icon: Wrench, title: "Software Engineering", desc: "System analysis, design, testing and maintenance of high-quality applications following best practices." },
            ].map((s, i) => (
              <div key={s.title} className="service-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="service-icon"><s.icon size={20} /></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience">
        <div className="container">
          <h2 className="section-title reveal">Exper<span>i</span>ence</h2>
          <div className="timeline">
            {[
              {
                title: "Freelance Software Developer",
                company: "Self-Employed · Fiverr & Upwork",
                period: "2024 – 2025",
                location: "Remote",
                active: true,
                points: [
                  "Delivered web and mobile solutions for international clients on Fiverr and Upwork.",
                  "Built and maintained frontend applications with a focus on usability, performance and clean code.",
                  "Collaborated directly with clients to gather requirements, translate ideas into technical solutions and deliver projects end-to-end.",
                ],
              },
              {
                title: "IT Systems Support & Deployment",
                company: "Election & Boundaries Commission of Eswatini (EBC)",
                period: "2023",
                location: "Eswatini",
                active: false,
                points: [
                  "Assisted in the development, testing and deployment of an IT system for national internal operations.",
                  "Supported database setup, system configuration and maintenance.",
                  "Participated in user testing, data validation and troubleshooting.",
                  "Worked with cross-functional teams to ensure system reliability and performance.",
                ],
              },
              {
                title: "AI, IoT & Full Stack Internships",
                company: "CodeAlpha (Remote)",
                period: "2026",
                location: "Remote",
                active: false,
                points: [
                  "Selected for the Artificial Intelligence Internship — explored AI concepts, intelligent systems and practical AI applications.",
                  "Selected for the Internet of Things Internship — gained exposure to connected devices, sensors and IoT architectures.",
                  "Selected for the Full Stack Development Internship — built and deployed web applications using frontend and backend technologies.",
                ],
              },
            ].map((exp, i) => (
              <div key={exp.title} className="timeline-item reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                <div className="timeline-dot" style={{ background: exp.active ? CRIMSON : "hsl(222,30%,25%)" }} />
                <div className="timeline-line" />
                <div className="exp-card">
                  <div className="exp-header">
                    <div>
                      <div className="exp-title">{exp.title}</div>
                      <div className="exp-company">{exp.company}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span className="exp-badge">{exp.period}</span>
                      <div className="exp-location"><MapPin size={10} style={{ display: "inline", marginRight: 3 }} />{exp.location}</div>
                    </div>
                  </div>
                  <ul className="exp-points">
                    {exp.points.map((pt, j) => (
                      <li key={j}>
                        <ChevronRight size={13} className="exp-chevron" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="section-alt">
        <div className="container">
          <h2 className="section-title reveal">Recent <span>Projects</span></h2>
          <div className="projects-list">
            {[
              {
                title: "Eswatini Market",
                sub: "Full Stack Marketplace Platform · 2026",
                desc: "Independently designed and built a complete digital marketplace connecting buyers and sellers across Eswatini. Features include user authentication, product listing management, search and category-based browsing, and a fully responsive interface.",
                tags: ["React", "TypeScript", "Vite", "Node.js", "REST API", "MySQL"],
                link: "https://github.com/Mlindo-cell",
                reverse: false,
              },
              {
                title: "Automated Trading System",
                sub: "Real-Time Automation · 2026",
                desc: "Developed an automated trading system that processes live market data and executes trades. Implemented real-time data handling, strategy logic, risk management features, and API integrations to support decision-making.",
                tags: ["Python", "REST API", "Automation", "Data Processing"],
                link: "https://github.com/Mlindo-cell",
                reverse: true,
              },
              {
                title: "IoT Monitoring System",
                sub: "Sensor & Dashboard · 2025",
                desc: "Designed and simulated an IoT system for real-time monitoring and data collection using sensors. Implemented communication between devices and a live web dashboard with automation and data acquisition.",
                tags: ["IoT", "Sensors", "Python", "Real-Time", "Dashboard"],
                link: null,
                reverse: false,
              },
              {
                title: "Java Web Applications",
                sub: "Full-Stack Java · 2022",
                desc: "Developed multiple Java-based web applications featuring secure authentication, full CRUD functionality, role-based access control and relational database integration. Deployed on Apache Tomcat.",
                tags: ["Java", "JSP", "Servlets", "MySQL", "JDBC", "Tomcat"],
                link: "https://github.com/Mlindo-cell",
                reverse: true,
              },
              {
                title: "Flask RESTful APIs",
                sub: "Backend Development · 2024",
                desc: "Designed and built RESTful APIs with structured endpoints for efficient data handling. Integrated SQLite for storage and implemented form validation, error handling and Postman testing.",
                tags: ["Python", "Flask", "SQLite", "REST API", "Postman"],
                link: "https://github.com/Mlindo-cell",
                reverse: false,
              },
            ].map((p, i) => (
              <div key={p.title} className={`project-item reveal ${p.reverse ? "reverse" : ""}`} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="project-img">
                  <div className="project-img-placeholder">
                    <div style={{ textAlign: "center" }}>
                      <Code2 size={32} style={{ marginBottom: "0.5rem", display: "block", margin: "0 auto 0.5rem" }} />
                      {p.title}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-sub">{p.sub}</p>
                  <p className="project-desc">{p.desc}</p>
                  <div className="project-tags">
                    {p.tags.map(t => <span key={t} className="project-tag">{t}</span>)}
                  </div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-link">
                      <ExternalLink size={12} /> View on GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills">
        <div className="container">
          <h2 className="section-title reveal">Tech<span>nical</span> Skills</h2>
          <div className="skills-grid">
            {[
              { cat: "Programming Languages", items: ["Java","Python","JavaScript","TypeScript","PHP","SQL","C#"] },
              { cat: "Frameworks & Libraries", items: ["React","Flask","Node.js","Angular","Bootstrap","Vite","JSP","Servlets"] },
              { cat: "Databases", items: ["MySQL","Oracle DB","SQLite","Firebase"] },
              { cat: "Development Tools", items: ["Git","GitHub","VS Code","Eclipse","NetBeans","XAMPP","Apache Tomcat","Postman"] },
              { cat: "IoT & Emerging Tech", items: ["IoT — Sensor Integration","Real-Time Monitoring","AI-Assisted Dev Tools","Machine Learning Basics","Data Analytics"] },
              { cat: "Other Skills", items: ["REST API Design","System Analysis & Design","OOP","Software Testing","Technical Documentation","Fiverr & Upwork"] },
            ].map((s, i) => (
              <div key={s.cat} className="skill-card reveal" style={{ transitionDelay: `${i * 0.07}s` }}>
                <div className="skill-cat">{s.cat}</div>
                <div className="skill-tags">
                  {s.items.map(item => <span key={item} className="skill-tag">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="section-alt">
        <div className="container">
          <div className="about-grid">
            <div className="reveal">
              <div className="about-img-wrap">
                <div className="corner tl" />
                <img src="/profile.png" alt="Lindelani" className="about-img" />
                <div className="about-badge"><Star size={11} /> Available for Work</div>
                <div className="corner br" />
              </div>
            </div>
            <div>
              <h2 className="section-title reveal" style={{ textAlign: "left" }}>About <span>Me</span></h2>
              <div className="about-text reveal">
                <p>
                  I am Lindelani Nottary Ndlangamandla, a Software Engineer and Systems Developer from
                  Matsapha, Eswatini. I hold an Advanced Diploma in Software Engineering (ADSE) under
                  the Aptech Certified Computer Professional (ACCP) programme at the Royal Science and
                  Technology Park, Eswatini.
                </p>
                <p>
                  With hands-on experience delivering projects for international clients on Fiverr and
                  Upwork, I bring both technical expertise and strong client communication to every
                  engagement. My work spans full-stack web development, REST APIs, database-driven
                  systems, and IoT monitoring solutions.
                </p>
                <p>
                  I am passionate about building technology that solves real problems — especially for
                  people and businesses in Eswatini. I am currently planning to pursue a BSc in Data
                  Science to deepen my skills in AI and data-driven systems.
                </p>
              </div>
              <div className="about-btns reveal">
                <a href="/CV_Lindelani_Updated_2026.pdf" download="CV_Lindelani_Ndlangamandla" className="cta-btn">
                  <Download size={14} /> Download CV
                </a>
                <a href="/CV_Lindelani_Updated_2026.pdf" target="_blank" rel="noopener noreferrer" className="cta-btn">
                  <Eye size={14} /> View CV
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact">
        <div className="container">
          <h2 className="section-title reveal">Contact <span>Info</span></h2>
          <div className="contact-grid">
            {[
              { icon: Phone, label: "Phone", val: "(+268) 7841 7269", href: "tel:+26878417269" },
              { icon: Mail, label: "Email", val: "lindelaninndlangamandla78@gmail.com", href: "mailto:lindelaninndlangamandla78@gmail.com" },
              { icon: MapPin, label: "Location", val: "Matsapha, Eswatini", href: null },
              { icon: Link, label: "LinkedIn", val: "lindelanisoftwareengineer", href: "https://www.linkedin.com/in/lindelanisoftwareengineer/" },
              { icon: GitBranch, label: "GitHub", val: "github.com/Mlindo-cell", href: "https://github.com/Mlindo-cell" },
              { icon: Briefcase, label: "Freelance", val: "Available on Fiverr & Upwork", href: null },
            ].map((ct, i) => {
              const inner = (
                <div className="contact-card reveal" style={{ transitionDelay: `${i * 0.07}s`, textDecoration: "none", color: "inherit" }}>
                  <div className="contact-icon"><ct.icon size={18} /></div>
                  <div>
                    <div className="contact-label">{ct.label}</div>
                    <div className="contact-val">{ct.val}</div>
                  </div>
                </div>
              );
              return ct.href
                ? <a key={ct.label} href={ct.href} target={ct.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ textDecoration: "none" }}>{inner}</a>
                : <div key={ct.label}>{inner}</div>;
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-logo">
          <span className="crimson">LI</span>NDEL<span className="crimson">A</span>NI
        </div>
        <p className="footer-sub">Software Engineer · Systems Developer · Eswatini</p>
        <div className="footer-socials">
          <a href="https://www.linkedin.com/in/lindelanisoftwareengineer/" target="_blank" rel="noopener noreferrer" className="footer-social"><Link size={16} /></a>
          <a href="https://github.com/Mlindo-cell" target="_blank" rel="noopener noreferrer" className="footer-social"><GitBranch size={16} /></a>
        </div>
        <p className="footer-copy">Copyright &copy; 2026 Lindelani Ndlangamandla. All rights reserved.</p>
      </footer>
    </div>
  );
}
