import { useState, useEffect, useRef } from "react";
import * as THREE from "three"; // npm i three
import logo from "./logo.png";

const ME = {
  name: "Md Nasim",
  email: "mdnasim4234@gmail.com",
  linkedin: "https://www.linkedin.com/in/mohd-nasim-752105152/",
  whatsapp: "https://wa.me/919911846140",
};

const PROJECTS = [
  { t: "Dimas", k: "Web", d: "E-commerce catalog and order management for a Saudi Arabia client.", s: "React, Redux Toolkit, Tailwind", url: "https://dimas.com.sa" },
  { t: "Khayyal Admin", k: "Web", d: "Admin platform for a ride-booking and marketplace product.", s: "React, RTK Query, Tailwind", url: "https://admin.khayyal.app" },
  { t: "Khayyal", k: "Mobile", d: "Ride booking and buy/sell app, live on the Play Store.", s: "React Native, Redux Toolkit" },
  { t: "Waddi", k: "Mobile", d: "Logistics marketplace with 1 to 90+ day truck reservations, live on the Play Store.", s: "React Native, RTK Query" },
  { t: "Capnolearning", k: "Web", d: "US healthcare platform that turns breathing O2/CO2 data into insights.", s: "React, Node.js, MySQL", url: "https://capnolearning.com" },
  { t: "Resume Reviewer", k: "AI", d: "Upload a PDF resume and get an ATS score and improvement tips.", s: "Next.js, Gemini API, PDF.js" },
  { t: "Interview Q&A", k: "AI", d: "Role-specific questions and answers with adjustable difficulty.", s: "Next.js, TypeScript, Gemini API" },
  { t: "Email Writer", k: "AI", d: "Professional emails from a purpose, with tones and regenerate.", s: "Next.js, TypeScript, Gemini API" },
];

// Prices are starting points. Adjust to your market.
const PACKAGES = [
  { name: "Launch", tag: "Landing page or portfolio", usd: 59, inr: 4999, time: "5-7 days", c: "from-amber-300 to-orange-400",
    items: ["Up to 5 sections, custom design", "React or Next.js + Tailwind CSS", "Mobile-first, fast, SEO-ready", "Contact form or WhatsApp button", "Deployed on Vercel or Netlify", "1 round of revisions"] },
  { name: "Build", tag: "Business site or web app", usd: 99, inr: 8999, time: "2-4 weeks", c: "from-cyan-300 to-blue-500", hot: true,
    items: ["Up to 10 pages or screens from your Figma", "Next.js, TypeScript, Redux Toolkit / RTK Query", "REST API integration, login and roles", "Admin dashboard or CMS hookup", "Performance pass (SSR/SSG, lazy loading)", "2 rounds of revisions + 14 days support"] },
  { name: "Product", tag: "Full-stack MVP or mobile app", usd: 3500, inr: 290000, time: "6-10 weeks", c: "from-pink-300 to-violet-500",
    items: ["Web app + React Native mobile app", "Node.js / Python backend, MySQL or PostgreSQL", "Auth, payments, notifications, WebSockets", "Reusable component library", "Store-ready build and release help", "Weekly demos + 30 days support"] },
];

const STEPS = [["Talk", "A free 20-minute call. You explain the goal, I tell you what it takes."], ["Scope", "A written scope, fixed price and timeline before any work starts."], ["Build", "Weekly demos on a live preview link, so you see progress as it happens."], ["Launch", "Deployment, handover and a support window after release."]];
const STACK = ["React.js", "Next.js", "React Native", "TypeScript", "Redux Toolkit", "RTK Query", "Tailwind CSS", "Node.js", "Django", "PostgreSQL", "Docker", "Gemini API"];
const money = (p, c) => (c === "USD" ? `$${p.usd.toLocaleString("en-US")}` : `₹${p.inr.toLocaleString("en-IN")}`);

/* ---------- 3D scenes: one per theme. The camera reacts to scroll and mouse. ---------- */
const THEMES = {
  nebula: { label: "Nebula", a1: "#22d3ee", a2: "#8b5cf6" },
  galaxy: { label: "Galaxy", a1: "#fbbf24", a2: "#f43f5e" },
  synth: { label: "Synthwave", a1: "#ff3ea5", a2: "#ffa63d" },
  city: { label: "Data city", a1: "#34d399", a2: "#38bdf8" },
};

const mat = (c, wire) => new THREE.MeshStandardMaterial({ color: c, metalness: 0.7, roughness: 0.25, emissive: c, emissiveIntensity: 0.15, wireframe: !!wire });

function dust(n, w, y0, ySpan, z0, zSpan, color = 0x9be7ff) {
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * w; pos[i * 3 + 1] = y0 - Math.random() * ySpan; pos[i * 3 + 2] = z0 + Math.random() * zSpan; }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ size: 0.05, color, transparent: true, opacity: 0.8 }));
}

const BUILD = {
  /* Metallic knot, then the camera dives through crystals, a ring and a torus */
  nebula(scene, cam, wide) {
    scene.fog = new THREE.Fog(0x020617, 9, 30);
    const hero = new THREE.Group();
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.3, 0.4, 180, 24), mat(0x22d3ee));
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(2.6, 1), mat(0x8b5cf6, true));
    hero.add(knot, shell);
    const tiers = new THREE.Group();
    [[0xfbbf24, 0.7, -3.4], [0x22d3ee, 1, 0], [0xf472b6, 1.4, 3.6]].forEach(([c, sz, x]) => { const m = new THREE.Mesh(new THREE.OctahedronGeometry(sz), mat(c)); m.position.x = x; tiers.add(m); });
    tiers.position.y = -11;
    const ring = new THREE.Group();
    for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2; const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 0), mat(i % 2 ? 0x22d3ee : 0xf472b6)); m.position.set(Math.cos(a) * 3, 0, Math.sin(a) * 3); ring.add(m); }
    ring.position.y = -22;
    const tor = new THREE.Mesh(new THREE.TorusGeometry(2, 0.5, 24, 100), mat(0xf472b6));
    const torW = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.05, 8, 120), mat(0x22d3ee));
    const end = new THREE.Group(); end.add(tor, torW); end.position.y = -32;
    const stars = dust(1000, 28, 6, 48, -8, 12);
    scene.add(hero, tiers, ring, end, stars);
    return {
      resize() { const w = wide(); hero.position.x = w ? 3.4 : 0; ring.position.x = w ? -3.4 : 0; end.position.x = w ? 3.4 : 0; tiers.scale.setScalar(w ? 1 : 0.7); },
      update(s, p, mx, my) {
        cam.position.y += (-p * 34 - cam.position.y) * 0.08; cam.position.x += (mx * 1.6 - cam.position.x) * 0.05; cam.lookAt(0, cam.position.y - my * 0.8, 0);
        knot.rotation.set(s * 0.4, s * 0.6, 0); shell.rotation.set(-s * 0.15, s * 0.2, 0);
        tiers.children.forEach((m, i) => { m.rotation.y = s * (0.5 + i * 0.2); m.rotation.x = s * 0.3; m.position.y = Math.sin(s + i) * 0.4; });
        ring.rotation.y = s * 0.4; ring.children.forEach((m) => (m.rotation.x = s));
        tor.rotation.set(s * 0.5, s * 0.3, 0); torW.rotation.set(s * 0.2, -s * 0.4, 0); stars.rotation.y = s * 0.01;
      },
    };
  },

  /* A spiral galaxy of 9,000 stars. Scrolling tilts it and flies you toward the core */
  galaxy(scene, cam, wide) {
    const N = 9000, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
    const c1 = new THREE.Color(0xfde68a), c2 = new THREE.Color(0xf43f5e), c3 = new THREE.Color(0x8b5cf6), c = new THREE.Color();
    for (let i = 0; i < N; i++) {
      const r = Math.pow(Math.random(), 1.5) * 13, a = r * 0.55 + (i % 3) * 2.094, sp = (Math.random() - 0.5) * (0.3 + r * 0.14);
      pos[i * 3] = Math.cos(a) * r + sp; pos[i * 3 + 1] = (Math.random() - 0.5) * 0.7 * (1 - r / 15); pos[i * 3 + 2] = Math.sin(a) * r + sp;
      const k = r / 13; k < 0.5 ? c.copy(c1).lerp(c2, k * 2) : c.copy(c2).lerp(c3, (k - 0.5) * 2);
      col.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.07, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), new THREE.MeshBasicMaterial({ color: 0xfff1b8 }));
    const grp = new THREE.Group(); grp.add(pts, core); scene.add(grp);
    return {
      resize() { grp.position.x = wide() ? 4.5 : 0; },
      update(s, p, mx, my) {
        grp.rotation.y = s * 0.06; grp.rotation.x = 0.7 + p * 0.55; grp.rotation.z = -0.15;
        cam.position.x += (mx * 2 - cam.position.x) * 0.05; cam.position.y += (3 + my * 1.5 - p * 5 - cam.position.y) * 0.06; cam.position.z = 15 - p * 6;
        cam.lookAt(grp.position.x * 0.4, 0, 0); core.scale.setScalar(1 + Math.sin(s * 2) * 0.08);
      },
    };
  },

  /* A neon wave grid with a setting sun. Scrolling flies you forward over it */
  synth(scene, cam, wide) {
    scene.fog = new THREE.Fog(0x020617, 10, 42);
    const geo = new THREE.PlaneGeometry(80, 60, 64, 48);
    const grid = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xff3ea5, wireframe: true, transparent: true, opacity: 0.85 }));
    grid.rotation.x = -Math.PI / 2; grid.position.set(0, -2.5, -10);
    const sun = new THREE.Group();
    [[5, 0xffa63d], [6.4, 0xff3ea5]].forEach(([r, c], i) => { const m = new THREE.Mesh(new THREE.CircleGeometry(r, 64), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: i ? 0.18 : 1, fog: false })); m.position.z = -i * 0.1; sun.add(m); });
    sun.position.set(0, 3.5, -30);
    const stars = dust(500, 70, 22, 18, -40, 6, 0xffd0ec);
    scene.add(grid, sun, stars);
    const p0 = geo.attributes.position;
    return {
      resize() { sun.position.x = wide() ? 7 : 0; },
      update(s, p, mx, my) {
        for (let i = 0; i < p0.count; i++) { const x = p0.getX(i), y = p0.getY(i); p0.setZ(i, Math.sin(x * 0.35 + s) * 0.9 + Math.cos(y * 0.3 + s * 1.2) * 0.9); }
        p0.needsUpdate = true;
        cam.position.x += (mx * 2.5 - cam.position.x) * 0.05; cam.position.y = 1.8 - my * 0.8; cam.position.z = 9 - p * 10; cam.lookAt(0, 1.5, -14);
        sun.scale.setScalar(1 + Math.sin(s) * 0.02);
      },
    };
  },

  /* A city of 361 bars that rise and fall like live data. Scrolling orbits the camera */
  city(scene, cam, wide) {
    scene.fog = new THREE.Fog(0x020617, 14, 44);
    const n = 19, cnt = n * n, box = new THREE.InstancedMesh(new THREE.BoxGeometry(0.72, 1, 0.72), new THREE.MeshStandardMaterial({ metalness: 0.5, roughness: 0.3 }), cnt);
    const d = new THREE.Object3D(), col = new THREE.Color();
    for (let i = 0; i < cnt; i++) { const x = (i % n) - n / 2, z = Math.floor(i / n) - n / 2; box.setColorAt(i, col.setHSL(0.42 + Math.min(Math.hypot(x, z) / 14, 1) * 0.2, 0.8, 0.5)); }
    const gridH = new THREE.GridHelper(n + 6, n + 6, 0x38bdf8, 0x1e3a5f); gridH.position.y = -0.01;
    const city = new THREE.Group(); city.add(box, gridH); scene.add(city);
    return {
      resize() { city.position.x = wide() ? 5 : 0; },
      update(s, p, mx, my) {
        for (let i = 0; i < cnt; i++) {
          const x = (i % n) - n / 2, z = Math.floor(i / n) - n / 2, h = Math.max(0.2, 2.4 + 2.2 * Math.sin(x * 0.45 + s * 1.2) * Math.cos(z * 0.45 + s));
          d.position.set(x + 0.5, h / 2, z + 0.5); d.scale.set(1, h, 1); d.updateMatrix(); box.setMatrixAt(i, d.matrix);
        }
        box.instanceMatrix.needsUpdate = true; if (box.instanceColor) box.instanceColor.needsUpdate = true;
        const a = p * Math.PI * 0.9 + mx * 0.6 + s * 0.03;
        cam.position.set(city.position.x + Math.sin(a) * 17, 9 - p * 3 - my * 2, Math.cos(a) * 17); cam.lookAt(city.position.x, 1, 0);
      },
    };
  },
};

function Scene({ variant }) {
  const host = useRef(null);
  useEffect(() => {
    const el = host.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    cam.position.set(0, 0, 9);
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const l1 = new THREE.PointLight(0x22d3ee, 2.2, 40); l1.position.set(5, 6, 6);
    const l2 = new THREE.PointLight(0xa855f7, 2.2, 40); l2.position.set(-6, 3, 6);
    scene.add(l1, l2);
    const world = BUILD[variant](scene, cam, () => innerWidth >= 768);
    let mx = 0, my = 0, raf;
    const place = () => { renderer.setSize(el.clientWidth, el.clientHeight); cam.aspect = el.clientWidth / el.clientHeight; cam.updateProjectionMatrix(); world.resize(); };
    const move = (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; };
    place(); addEventListener("resize", place); addEventListener("pointermove", move);
    const tick = (t) => {
      const max = document.documentElement.scrollHeight - innerHeight;
      world.update(reduce ? 0 : t / 1000, max > 0 ? scrollY / max : 0, reduce ? 0 : mx, reduce ? 0 : my);
      renderer.render(scene, cam);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf); removeEventListener("resize", place); removeEventListener("pointermove", move);
      scene.traverse((o) => { o.geometry && o.geometry.dispose(); o.material && o.material.dispose && o.material.dispose(); });
      renderer.dispose(); el.removeChild(renderer.domElement);
    };
  }, [variant]);
  return <div ref={host} className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />;
}

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setOn(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`rv ${on ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/* Card that tilts toward the cursor in 3D, with a moving glare */
function Tilt({ children, className = "", max = 9 }) {
  const ref = useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `rotateY(${x * max * 2}deg) rotateX(${-y * max * 2}deg)`;
    ref.current.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    ref.current.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };
  return (
    <div style={{ perspective: 1000 }} className={className}>
      <div ref={ref} onMouseMove={move} onMouseLeave={() => (ref.current.style.transform = "")} className="tilt relative h-full" style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}

/* Rotating 3D ring of project cards */
function Carousel() {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const [cw, setCw] = useState(280);
  const n = PROJECTS.length, step = 360 / n;
  useEffect(() => {
    const f = () => setCw(innerWidth < 640 ? 230 : 290);
    f(); addEventListener("resize", f); return () => removeEventListener("resize", f);
  }, []);
  useEffect(() => {
    if (hold || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => v + 1), 3800);
    return () => clearInterval(id);
  }, [hold]);
  const r = cw / 2 / Math.tan(Math.PI / n) + 20;
  const cur = ((i % n) + n) % n;
  const p = PROJECTS[cur];
  return (
    <div onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
      <div className="relative mx-auto h-[330px] sm:h-[350px]" style={{ perspective: 1300 }}>
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: `translateZ(${-r}px) rotateY(${-i * step}deg)`, transition: "transform 1s cubic-bezier(.2,.8,.2,1)" }}>
          {PROJECTS.map((x, k) => (
            <button key={x.t} onClick={() => setI(i + ((k - cur + n + n / 2) % n) - n / 2)} aria-label={x.t}
              className={`panel absolute top-6 flex h-[270px] flex-col justify-between rounded-2xl p-5 text-left ${k === cur ? "ring-2 ring-[color:var(--a1)]" : "opacity-80"}`}
              style={{ width: cw, left: `calc(50% - ${cw / 2}px)`, transform: `rotateY(${k * step}deg) translateZ(${r}px)`, backfaceVisibility: "hidden" }}>
              <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[color:var(--a1)]">{x.k}</span>
              <span className="head text-2xl font-extrabold text-white">{x.t}</span>
              <span className="text-sm text-slate-300">{x.s}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="panel mx-auto mt-6 max-w-2xl rounded-2xl p-6 text-center">
        <h3 className="head text-xl font-bold text-white">{p.t}</h3>
        <p className="mt-2 text-slate-300">{p.d}</p>
        {p.url && <a href={p.url} target="_blank" rel="noreferrer" className="mt-3 inline-block font-bold text-[color:var(--a1)] underline underline-offset-4">Visit {p.url.replace("https://", "")}</a>}
      </div>
      <div className="mt-5 flex items-center justify-center gap-4">
        <button onClick={() => setI(i - 1)} aria-label="Previous project" className="panel h-11 w-11 rounded-full text-xl text-white hover:bg-white/10">‹</button>
        <span className="text-sm text-slate-400">{cur + 1} / {n}</span>
        <button onClick={() => setI(i + 1)} aria-label="Next project" className="panel h-11 w-11 rounded-full text-xl text-white hover:bg-white/10">›</button>
      </div>
    </div>
  );
}

const Check = () => <svg className="mt-1 h-4 w-4 flex-none text-[color:var(--a1)]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" /></svg>;

export default function Portfolio3D() {
  const [cur, setCur] = useState("USD");
  const [theme, setTheme] = useState(() => { try { return THEMES[localStorage.getItem("theme")] ? localStorage.getItem("theme") : "nebula"; } catch { return "nebula"; } });
  const pick = (k) => { setTheme(k); try { localStorage.setItem("theme", k); } catch {} };
  const TH = THEMES[theme];
  const hire = (n) => `mailto:${ME.email}?subject=${encodeURIComponent("Project enquiry: " + n)}`;
  return (
    <div className="relative isolate min-h-screen bg-slate-950 text-slate-200 antialiased" style={{ fontFamily: "'Manrope', system-ui, sans-serif", "--a1": TH.a1, "--a2": TH.a2 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;800&family=Manrope:wght@400;500;700&display=swap');
        .head{font-family:'Sora',system-ui,sans-serif;letter-spacing:-0.02em}
        html{scroll-behavior:smooth}
        .panel{background:rgba(2,6,23,.55);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.14);box-shadow:0 20px 50px rgba(0,0,0,.4)}
        .tilt{transition:transform .2s ease-out}
        .tilt::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:radial-gradient(circle at var(--gx,50%) var(--gy,0%),rgba(255,255,255,.16),transparent 55%)}
        .glowtxt{background:linear-gradient(90deg,var(--a1),var(--a2),var(--a1));background-size:300% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:shine 8s linear infinite}
        @keyframes shine{to{background-position:300% center}}
        .rv{opacity:0;transform:translateY(30px);transition:opacity .8s,transform .8s}.rv.in{opacity:1;transform:none}
        .bob{animation:bob 2s ease-in-out infinite}@keyframes bob{50%{transform:translateY(8px)}}
        @media (prefers-reduced-motion:reduce){.rv{opacity:1;transform:none;transition:none}.glowtxt,.bob{animation:none}}
      `}</style>
      <Scene variant={theme} />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-r from-slate-950/75 via-slate-950/25 to-transparent" aria-hidden="true" />
      <div role="group" aria-label="3D theme" className="panel fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-1 rounded-full p-1.5 text-xs font-bold sm:text-sm">
        {Object.entries(THEMES).map(([k, t]) => (
          <button key={k} onClick={() => pick(k)} aria-pressed={theme === k} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${theme === k ? "bg-white text-slate-900" : "text-slate-300 hover:text-white"}`}>
            <i className="h-2.5 w-2.5 rounded-full" style={{ background: `linear-gradient(135deg,${t.a1},${t.a2})` }} />{t.label}
          </button>
        ))}
      </div>

      <header className="panel sticky top-0 z-30 rounded-none border-x-0 border-t-0">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#top" className="head text-lg font-extrabold text-white"><img src={logo} alt="Logo" className="h-12 w-12" /></a>
          <div className="hidden gap-7 text-sm font-semibold text-slate-300 md:flex">
            {[["Work", "#work"], ["Packages", "#packages"], ["Process", "#process"], ["Stack", "#stack"]].map(([l, h]) => <a key={l} href={h} className="hover:text-[color:var(--a1)]">{l}</a>)}
          </div>
          <a href="#contact" className="rounded-lg bg-gradient-to-r from-[color:var(--a1)] to-[color:var(--a2)] px-4 py-2 text-sm font-bold text-slate-950 hover:brightness-110">Hire me</a>
        </nav>
      </header>

      <section id="top" className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-5 py-16">
        <div className="max-w-2xl">
          <p className="panel inline-block rounded-full px-4 py-1.5 text-sm font-semibold text-[color:var(--a1)]">Open for freelance projects</p>
          <h1 className="head mt-6 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            Fullstack developer turning ideas into <span className="glowtxt">live products</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            Six years of web and mobile apps for clients in Saudi Arabia, the US and India. Move your mouse, scroll down and switch the 3D theme at the bottom of the screen.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#packages" className="rounded-lg bg-gradient-to-r from-[color:var(--a1)] to-[color:var(--a2)] px-6 py-3 font-bold text-slate-950 shadow-lg shadow-white/20 hover:brightness-110">See packages</a>
            <a href="#work" className="panel rounded-lg px-6 py-3 font-bold text-white hover:bg-white/10">View my work</a>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-4 gap-4">
            {[["6+", "years"], ["8+", "web/apps"], ["4", "Play Store"], ["100+", "APIs"]].map(([n, l]) => (
              <div key={l}><dt className="head text-3xl font-extrabold text-white">{n}</dt><dd className="text-xs text-slate-400">{l}</dd></div>
            ))}
          </dl>
        </div>
        <p className="bob mt-14 text-sm text-slate-400">Scroll to fly through ↓</p>
      </section>

      <section id="work" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
        <Reveal><h2 className="head text-3xl font-extrabold text-white md:text-5xl">Work that's live</h2>
          <p className="mt-3 max-w-xl text-lg text-slate-300">Spin the ring. Click any card to bring it to the front.</p></Reveal>
        <div className="mt-10"><Carousel /></div>
      </section>

      <section id="packages" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <Reveal><h2 className="head text-3xl font-extrabold text-white md:text-5xl">Fixed-price packages</h2>
            <p className="mt-3 max-w-xl text-lg text-slate-300">Written scope, fixed price and a delivery date. Hover a card to tilt it.</p></Reveal>
          <div role="group" aria-label="Currency" className="panel flex rounded-lg p-1 text-sm font-bold">
            {["USD", "INR"].map((c) => <button key={c} onClick={() => setCur(c)} aria-pressed={cur === c} className={`rounded-md px-4 py-1.5 ${cur === c ? "bg-white text-slate-900" : "text-slate-300 hover:text-white"}`}>{c}</button>)}
          </div>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {PACKAGES.map((p, i) => (
            <Reveal key={p.name} delay={i * 130}>
              <Tilt className="h-full">
                <article className={`panel flex h-full flex-col rounded-2xl p-7 ${p.hot ? "ring-2 ring-[color:var(--a1)]" : ""}`}>
                  <div style={{ transform: "translateZ(40px)" }}>
                    <div className="flex items-center justify-between">
                      <h3 className="head text-2xl font-extrabold text-white">{p.name}</h3>
                      {p.hot && <span className="rounded-full bg-[color:var(--a1)] px-3 py-0.5 text-xs font-bold text-slate-950">Most chosen</span>}
                    </div>
                    <p className="mt-1 text-sm text-slate-300">{p.tag}</p>
                    <p className={`head mt-5 bg-gradient-to-r ${p.c} bg-clip-text text-5xl font-extrabold text-transparent`}>{money(p, cur)}</p>
                    <p className="mt-1 text-sm text-slate-400">Starting price · {p.time}</p>
                  </div>
                  <ul className="mt-6 flex-1 space-y-3 text-sm" style={{ transform: "translateZ(20px)" }}>
                    {p.items.map((it) => <li key={it} className="flex gap-2.5"><Check />{it}</li>)}
                  </ul>
                  <a href={hire(p.name)} style={{ transform: "translateZ(50px)" }} className={`mt-8 rounded-lg bg-gradient-to-r ${p.c} px-5 py-3 text-center font-bold text-slate-950 hover:brightness-110`}>Start with {p.name}</a>
                </article>
              </Tilt>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="panel mt-8 flex flex-col justify-between gap-4 rounded-2xl p-6 sm:flex-row sm:items-center">
            <div><h3 className="head text-xl font-bold text-white">Monthly retainer</h3>
              <p className="mt-1 text-slate-300">A dedicated React developer for ongoing features, fixes and code review. From {cur === "USD" ? "$209" : "₹20,000"} per month.</p></div>
            <a href={hire("Monthly retainer")} className="flex-none rounded-lg border border-white/50 px-5 py-3 text-center font-bold text-white hover:bg-white hover:text-slate-900">Ask about a retainer</a>
          </div>
        </Reveal>
      </section>

      <section id="process" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
        <Reveal><h2 className="head text-3xl font-extrabold text-white md:text-5xl">How a project runs</h2></Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {STEPS.map(([t, d], i) => (
            <Reveal key={t} delay={i * 120}>
              <Tilt className="h-full" max={12}>
                <div className="panel h-full rounded-2xl p-6">
                  <span className="head text-5xl font-extrabold text-[color:var(--a1)]" style={{ transform: "translateZ(40px)", display: "inline-block" }}>{i + 1}</span>
                  <h3 className="head mt-3 text-xl font-bold text-white">{t}</h3>
                  <p className="mt-2 text-sm text-slate-300">{d}</p>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="stack" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
        <Reveal>
          <h2 className="head text-3xl font-extrabold text-white md:text-5xl">What I build with</h2>
          <div className="mt-8 flex flex-wrap gap-3">{STACK.map((t) => <span key={t} className="panel rounded-full px-4 py-2 text-sm font-bold text-white">{t}</span>)}</div>
          <p className="mt-8 max-w-2xl text-slate-300">I use Claude and Cursor AI daily to move faster. You get the speed, and a senior engineer still reviews every line.</p>
        </Reveal>
      </section>

      <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-5 pb-32 pt-10">
        <Reveal>
          <div className="panel rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-8 md:p-14">
            <h2 className="head max-w-3xl text-3xl font-extrabold text-white md:text-5xl">Have a project in mind? Let's build it.</h2>
            <p className="mt-4 max-w-xl text-lg text-slate-200">I reply within one working day. Share your idea, budget and deadline, and I'll suggest the right package.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={`mailto:${ME.email}`} className="rounded-lg bg-white px-6 py-3 font-bold text-slate-900 hover:bg-cyan-200">Email {ME.email}</a>
              <a href={ME.whatsapp} target="_blank" rel="noreferrer" className="rounded-lg border border-white/50 px-6 py-3 font-bold text-white hover:bg-white/10">WhatsApp</a>
              <a href={ME.linkedin} target="_blank" rel="noreferrer" className="rounded-lg border border-white/50 px-6 py-3 font-bold text-white hover:bg-white/10">LinkedIn</a>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-400">© {new Date().getFullYear()} {ME.name}. Delhi, India. Working with clients worldwide.</footer>
    </div>
  );
}
