import { useState, useRef, useEffect, useCallback, Fragment } from 'react';
import { Analytics } from '@vercel/analytics/react';
import mePhoto from './assets/me.jpg';

const CV_URL = '/uploads/Youssef_Ibrahim_Backend_NET_CV.pdf';
const GITHUB_USER = 'https://github.com/YoussefIbrahim13';
const LINKEDIN = 'https://www.linkedin.com/in/youssef-ibrahim-1322004sh192007';
const EMAIL = 'yy7692651@gmail.com';
const ACCENT = '#38bdf8';

/* Copy only. Tech names read the same in both languages, so stacks, tags and
   the architecture diagrams live in PROJECTS rather than here. */
const TEXT = {
  en: {
    dir: 'ltr',
    langBtn: '[ EN // AR ]',
    navProjects: 'PROJECTS',
    navContact: 'CONTACT',
    resume: 'RESUME ↓',
    whoami: 'whoami',
    name: 'Youssef Ibrahim',
    role: 'Software Engineer — .NET · Python · Flutter',
    summary:
      'Computer Science graduate based in Cairo. I like taking a system the whole way — the data model, the architecture, and seeing it through to something that runs. Mostly backend services and APIs, with AI tooling and mobile apps alongside.',
    chipLoc: 'CAIRO, EGYPT',
    chipService: 'MILITARY SERVICE: EXEMPTED',
    ctaProjects: 'VIEW PROJECTS',
    ctaCv: 'DOWNLOAD CV',
    scroll: 'SCROLL',
    projectsKicker: 'PROJECTS',
    projectsTitle: 'Systems I designed and shipped',
    projectsIntro:
      'Each of these put a different architectural problem at its centre — bounded modules under one host, a rental lifecycle as a state machine, two APIs under one orchestrator, a hybrid AI fact-checker, an offline-first client, and an agent graph that validates what it finds.',
    flipHint: 'CLICK ANY CARD TO SEE ITS ARCHITECTURE',
    seeArch: 'SEE ARCHITECTURE',
    archLabel: 'MODULE MAP',
    moreOnGithub: 'MORE ON GITHUB',
    portraitOpen: 'View photo',
    portraitCaption: 'YOUSSEF IBRAHIM — GRADUATION, COMPUTER SCIENCE',
    close: 'Close',
  },
  ar: {
    dir: 'rtl',
    langBtn: '[ AR // EN ]',
    navProjects: 'المشاريع',
    navContact: 'التواصل',
    resume: 'السيرة ↓',
    whoami: 'من أنا',
    name: 'يوسف إبراهيم',
    role: 'مهندس برمجيات — ‎.NET · Python · Flutter',
    summary:
      'خريج علوم حاسب من القاهرة. بحب أمشي مع النظام من أوله لآخره — تصميم البيانات، واختيار المعمارية، وتنفيذها لحد ما تشتغل فعليًا. معظم شغلي في خدمات وواجهات الـ Backend، وجنبها أدوات الذكاء الاصطناعي وتطبيقات الموبايل.',
    chipLoc: 'القاهرة، مصر',
    chipService: 'الخدمة العسكرية: إعفاء',
    ctaProjects: 'استعرض المشاريع',
    ctaCv: 'تحميل السيرة',
    scroll: 'انزل',
    projectsKicker: 'المشاريع',
    projectsTitle: 'أنظمة صمّمتها ونفّذتها',
    projectsIntro:
      'كل واحد من دول وضع مشكلة معمارية مختلفة في قلبه: وحدات محدودة خلف مضيف واحد، دورة تأجير كآلة حالات، واجهتان تحت منسّق واحد، مدقّق حقائق هجين بالذكاء الاصطناعي، تطبيق يعمل دون اتصال، ووكيل يتحقق ممّا يجده قبل أن يعرضه.',
    flipHint: 'اضغط أي بطاقة لعرض معماريتها',
    seeArch: 'اعرض المعمارية',
    archLabel: 'خريطة الوحدات',
    moreOnGithub: 'المزيد على GITHUB',
    portraitOpen: 'عرض الصورة',
    portraitCaption: 'يوسف إبراهيم — التخرّج، علوم الحاسب',
    close: 'إغلاق',
  },
};

/* The hero graph is the shape of a backend in general — the layers and concerns
   that recur across every project below — rather than any one system's module
   map. Individual systems get their own diagram on their card.

   Laid out as the request actually travels: entry at the top, the database as
   the sink at the bottom, off-request-path concerns (workers, real-time, AI) to
   the sides.

   x/y place the node on the desktop hero, where the graph is a full-bleed
   backdrop and has to stay clear of the text column on the left. mx/my are the
   phone layout, where the graph gets its own short, full-width band under the
   copy and can therefore spread across the whole canvas. */
const NODES = [
  { id: 'api', label: 'API', x: 0.56, y: 0.10, mx: 0.10, my: 0.16, kind: 'gate' },
  { id: 'auth', label: 'Auth · JWT', x: 0.79, y: 0.09, mx: 0.36, my: 0.10, kind: 'svc' },
  { id: 'controllers', label: 'Controllers', x: 0.90, y: 0.23, mx: 0.68, my: 0.14, kind: 'svc' },
  { id: 'cqrs', label: 'CQRS', x: 0.70, y: 0.29, mx: 0.30, my: 0.42, kind: 'svc' },
  { id: 'domain', label: 'Domain', x: 0.58, y: 0.45, mx: 0.55, my: 0.46, kind: 'svc' },
  { id: 'cache', label: 'Cache', x: 0.87, y: 0.44, mx: 0.90, my: 0.34, kind: 'svc' },
  { id: 'realtime', label: 'Real-time', x: 0.76, y: 0.62, mx: 0.80, my: 0.60, kind: 'svc' },
  { id: 'workers', label: 'Workers', x: 0.56, y: 0.68, mx: 0.12, my: 0.66, kind: 'svc' },
  { id: 'ai', label: 'AI Services', x: 0.90, y: 0.75, mx: 0.85, my: 0.86, kind: 'svc' },
  { id: 'sql', label: 'SQL Server', x: 0.70, y: 0.89, mx: 0.45, my: 0.80, kind: 'db' },
];

/* Every edge is a real dependency, written upstream → downstream so the packets
   animating along them read as work flowing toward the database. */
const EDGE_IDS = [
  // The request path, in pipeline order.
  ['api', 'auth'],            // authentication middleware runs on every request
  ['auth', 'controllers'],    // an authenticated request reaches routing
  ['controllers', 'cqrs'],    // the controller dispatches a command or query
  ['cqrs', 'domain'],         // the handler invokes the domain's business rules
  ['domain', 'sql'],          // state is persisted through EF Core
  ['cqrs', 'sql'],            // read handlers project straight out of EF Core
  // Caching sits in front of the store.
  ['cqrs', 'cache'],          // query handlers read through the cache first
  ['cache', 'sql'],           // a miss falls through to the database
  // Background work: hosted services in the same host, off the request path.
  ['api', 'workers'],         // IHostedService instances live in the API host
  ['workers', 'domain'],      // timers apply domain state-machine transitions
  ['workers', 'sql'],         // each tick resolves its own scoped DbContext
  ['workers', 'realtime'],    // finished jobs notify connected clients
  // Real-time and AI.
  ['auth', 'realtime'],       // hubs authenticate off the same bearer token
  ['domain', 'realtime'],     // domain events fan out to subscribers
  ['controllers', 'realtime'],// endpoints broadcast through IHubContext
  ['realtime', 'ai'],         // the hub proxies a model and streams the reply
  ['controllers', 'ai'],      // direct request/response AI endpoints
  // Identity's own persistence.
  ['auth', 'sql'],            // the ASP.NET Core Identity user store
];

const EDGES = EDGE_IDS.map(([a, b]) => [
  NODES.findIndex((n) => n.id === a),
  NODES.findIndex((n) => n.id === b),
]);

/* One request's trip through an ASP.NET Core host, in the order it actually
   happens: the server accepts it, the middleware pipeline runs (the JWT bearer
   handler among it), the endpoint's action is invoked, it hands off to the
   application layer, and the write reaches the database through EF Core. */
const PIPELINE = [
  'KESTREL',
  'MIDDLEWARE',
  'AUTH · JWT',
  'CONTROLLER',
  'HANDLER',
  'EF CORE',
  'SQL SERVER',
];

/* Petzy's eight modules, and the two Youssef owned end to end — highlighted on
   the card so the claim in the copy is visible in the module map too. */
const PETZY_MODULES = ['Security', 'Clinics', 'Pets', 'Appointments', 'E-commerce', 'Chat', 'Chatbot', 'Video Calls'];
const PETZY_OWNED = ['Security', 'Chatbot'];

const PROJECTS = [
  {
    id: 'petzy',
    num: '01',
    title: 'Petzy',
    wide: true,
    repo: 'https://github.com/Veterinaryclinics/Backend',
    archId: '01 · PETZY',
    tech: ['.NET 8', 'ASP.NET CORE WEB API', 'MODULAR MONOLITH', 'EF CORE', 'SQL SERVER', 'SIGNALR'],
    en: {
      tag: 'GRADUATION PROJECT',
      sub: 'Backend Developer · veterinary care platform',
      desc: 'The backend for a full veterinary platform serving a Flutter client and an AI service: eight bounded modules behind a single API host, with cross-cutting concerns in a shared Building Blocks layer. I owned Security and Chatbot end to end — Identity with JWT refresh tokens, Google sign-in, role seeding and audit logs; and a chatbot that streams AI tokens over SignalR through a MediatR stream.',
      note: 'Modular monolith — module boundaries enforced in code, one deployable, one database.',
    },
    ar: {
      tag: 'مشروع التخرج',
      sub: 'مطوّر Backend · منصة رعاية بيطرية',
      desc: 'الواجهة الخلفية لمنصة رعاية بيطرية متكاملة تخدم تطبيق Flutter وخدمة ذكاء اصطناعي: ثماني وحدات محدودة خلف مضيف API واحد، مع الاهتمامات المشتركة في طبقة Building Blocks. توليت وحدتَي Security و Chatbot بالكامل — Identity مع JWT ورموز التحديث، وتسجيل الدخول بجوجل، وتهيئة الأدوار وسجلّات التدقيق؛ وروبوت محادثة يبثّ ردود الذكاء الاصطناعي عبر SignalR من خلال تدفّق MediatR.',
      note: 'Modular Monolith — حدود الوحدات مفروضة في الكود، نشر واحد وقاعدة بيانات واحدة.',
    },
  },
  {
    id: 'peercar',
    num: '02',
    title: 'PeerCar',
    repo: 'https://github.com/YoussefIbrahim13/PeerCar',
    archId: '02 · PEERCAR',
    tech: ['ASP.NET CORE MVC', 'CLEAN ARCHITECTURE', 'SIGNALR', 'IDENTITY · OAUTH 2.0', 'BACKGROUND WORKERS'],
    en: {
      tag: 'PERSONAL PROJECT',
      sub: 'Peer-to-peer car rental marketplace',
      desc: 'Clean Architecture marketplace where the rental lifecycle is modelled as a state machine and enforced by two background workers — one auto-completing finished bookings, one cancelling expired ones. Identity with Google OAuth 2.0, role-based access for Admin / Owner / Renter, and an AI assistant streaming replies over SignalR.',
      note: 'One deployable, four layers — domain entities stay plain POCOs with no framework types.',
    },
    ar: {
      tag: 'مشروع شخصي',
      sub: 'سوق تأجير سيارات بين الأفراد',
      desc: 'سوق مبني على Clean Architecture، حيث تُنمذج دورة حياة التأجير كآلة حالات ينفّذها عاملان في الخلفية: أحدهما يُكمل الحجوزات المنتهية تلقائيًا والآخر يلغي المنتهية صلاحيتها. مع ASP.NET Core Identity و Google OAuth 2.0 وصلاحيات لأدوار المسؤول والمالك والمستأجر، ومساعد ذكاء اصطناعي يبثّ الردود عبر SignalR.',
      note: 'نشر واحد بأربع طبقات — كيانات الـ Domain تبقى POCO بلا أي أنواع من إطار العمل.',
    },
  },
  {
    id: 'attendance',
    num: '03',
    title: 'Attendance & Departure',
    titleSmall: true,
    repo: 'https://github.com/YoussefIbrahim13/Attendance-and-departure-system',
    archId: '03 · HR SYSTEM',
    tech: ['.NET ASPIRE', 'CQRS + MEDIATR', 'BLAZOR WASM', 'JWT · RBAC', 'CSV PIPELINE'],
    en: {
      tag: 'TEAM PROJECT',
      sub: 'HR attendance, hours and leave requests',
      desc: 'Two APIs — Auth and File-Import — orchestrated by a .NET Aspire AppHost and structured around CQRS with MediatR. A CSV bulk-import pipeline validates dynamically and calculates working hours, surfaced through daily, monthly and yearly views behind JWT and role-based authorisation.',
      note: 'Aspire AppHost wires service discovery, configuration and the dashboard.',
    },
    ar: {
      tag: 'مشروع جماعي',
      sub: 'نظام حضور وساعات عمل وإجازات',
      desc: 'واجهتا API — المصادقة واستيراد الملفات — ينسّقهما ‎.NET Aspire AppHost وتُبنى حول CQRS مع MediatR. خط استيراد CSV يتحقق ديناميكيًا ويحسب ساعات العمل، ويُعرض في تقارير يومية وشهرية وسنوية خلف JWT وصلاحيات قائمة على الأدوار.',
      note: 'Aspire AppHost يربط اكتشاف الخدمات والإعدادات ولوحة المتابعة.',
    },
  },
  {
    id: 'bedoonhabd',
    num: '04',
    title: 'Bedoon Habd',
    alt: true,
    repo: 'https://github.com/YoussefIbrahim13/Bdoon-habd',
    archId: '04 · بدون هبد',
    tech: ['FASTAPI', 'GROQ LLAMA 3.3', 'WEBSOCKETS', 'JWT · GOOGLE AUTH', 'FLUTTER RTL'],
    en: {
      tag: 'AI + BACKEND',
      sub: 'FastAPI service for an Arabic party game',
      desc: 'A country-facts game — pass-and-play locally or in online rooms over WebSockets — where a human judge can consult a "Smart Judge". The FastAPI backend classifies each claim, then routes it: objective claims are answered by Llama 3.3 grounded in a structured country fact sheet, general ones by a compound model with live web search. Verdicts are advisory — the human always decides.',
      note: 'Three quota layers — per-IP limit, global budget, shared app token — keep the free tier alive.',
    },
    ar: {
      tag: 'ذكاء اصطناعي + Backend',
      sub: 'خدمة FastAPI لِلعبة عربية',
      desc: 'لعبة معلومات عن الدول — تُلعب بتمرير الهاتف محليًا أو في غرف أونلاين عبر WebSockets — ويستطيع الحكم البشري استشارة «الحكم الذكي». الخدمة الخلفية تصنّف كل ادعاء ثم توجهه: الادعاءات الموضوعية يجيب عنها Llama 3.3 مستندًا إلى بطاقة بيانات منظّمة للدولة، والعامة يجيب عنها نموذج مركّب مع بحث ويب مباشر. الأحكام استشارية — القرار النهائي للإنسان.',
      note: 'ثلاث طبقات حماية للحصة — حد لكل IP، وميزانية عامة، ورمز تطبيق مشترك.',
    },
  },
  {
    id: 'awradi',
    num: '05',
    title: 'Awradi',
    alt: true,
    repo: 'https://github.com/YoussefIbrahim13/Awradi_app',
    archId: '05 · AWRADI',
    tech: ['FLUTTER', 'RIVERPOD', 'DRIFT · SQLITE', 'SCHEDULED NOTIFICATIONS', 'SHA-256 INTEGRITY'],
    en: {
      tag: 'MOBILE · OFFLINE-FIRST',
      sub: 'Daily Islamic ritual tracker',
      desc: 'An offline-first Flutter app with no server: Drift/SQLite for daily progress and khatmah tracking, a timezone-aware notification scheduler for reminders, an offline Quran pack downloaded and verified by SHA-256 before extraction, and a qibla compass from device sensors and geolocation.',
      note: 'Domain logic — progress, khatmah, notification ids, qibla math — is unit tested.',
    },
    ar: {
      tag: 'موبايل · يعمل دون اتصال',
      sub: 'متتبّع أوراد يومية',
      desc: 'تطبيق Flutter يعمل دون اتصال ودون سيرفر: قاعدة Drift/SQLite لتتبّع التقدّم اليومي والخَتْمَة، ومجدول إشعارات يراعي المنطقة الزمنية، وحزمة قرآن تُنزَّل ويُتحقق من سلامتها بـ SHA-256 قبل فكّها، وبوصلة قبلة من مستشعرات الجهاز والموقع.',
      note: 'منطق النطاق — التقدّم والخَتْمَة ومعرّفات الإشعارات وحساب القبلة — مغطّى باختبارات.',
    },
  },
  {
    id: 'recruitbot',
    num: '06',
    title: 'RecruitBot',
    wide: true,
    alt: true,
    repo: 'https://github.com/YoussefIbrahim13/Job_Search-_Agent',
    archId: '06 · RECRUITBOT',
    tech: ['LANGGRAPH', 'GROQ LLAMA 3.3 70B', 'TAVILY SEARCH', 'FASTAPI', 'PYMUPDF · PYTHON-DOCX'],
    en: {
      tag: 'AGENTIC AI',
      sub: 'Job search agent that validates what it finds',
      desc: 'An agent that finds real, currently open postings rather than zombie listings. A LangGraph state machine drives Llama 3.3 70B, which fires two parallel Tavily queries per turn across eleven approved job boards. Every result then runs a five-layer quality pipeline ending in a live 8KB head fetch that catches closure badges before the sidebar noise corrupts the signal.',
      note: 'Skills are harvested by pre-compiled regex before the prompt is built — the model never invents a skill.',
    },
    ar: {
      tag: 'وكيل ذكاء اصطناعي',
      sub: 'وكيل بحث عن وظائف يتحقق ممّا يجده',
      desc: 'وكيل يبحث عن إعلانات وظائف مفتوحة فعلًا لا إعلانات ميتة. آلة حالات على LangGraph تقود Llama 3.3 70B، الذي يطلق استعلامَي Tavily متوازيين في كل دورة عبر أحد عشر موقع توظيف معتمد. ثم تمرّ كل نتيجة على خط جودة من خمس طبقات ينتهي بجلب حي لأول 8 كيلوبايت يكشف شارات الإغلاق قبل أن تلوّث ضوضاء الصفحة الإشارة.',
      note: 'المهارات تُستخرج بتعبيرات نمطية مُجهّزة قبل بناء الطلب — النموذج لا يخترع مهارة أبدًا.',
    },
  },
];

/* ── Portrait ────────────────────────────────────────────────────────────
   A cropped thumbnail in the nav that opens the full photograph. Built on the
   native <dialog>, so Escape-to-close, focus trapping and the inert background
   come from the platform rather than being re-implemented here. */
function Portrait({ t }) {
  const dialogRef = useRef(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button type="button" className="avatar" onClick={open} title={t.portraitOpen} aria-label={t.portraitOpen}>
        <img src={mePhoto} alt="" width="30" height="30" />
      </button>
      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={t.name}
        /* Clicking the backdrop targets the dialog element itself. */
        onClick={(e) => { if (e.target === dialogRef.current) close(); }}
        /* <dialog> closes on Escape on its own, but that path depends on the
           browser issuing a close request. Handling the key directly makes the
           behaviour unconditional; a second close() on a shut dialog is a no-op. */
        onKeyDown={(e) => { if (e.key === 'Escape') close(); }}
      >
        <figure className="lightbox-frame">
          <img src={mePhoto} alt={t.name} />
          <button type="button" className="lightbox-close" onClick={close} aria-label={t.close}>✕</button>
          <figcaption className="lightbox-caption">
            <span className="dot" aria-hidden="true" />
            {t.portraitCaption}
          </figcaption>
        </figure>
      </dialog>
    </>
  );
}

/* ── Hero canvas ─────────────────────────────────────────────────────────
   A live service graph: packets travel the edges, nodes pulse on arrival and
   the three nearest nodes trace to the cursor. Paused when the hero scrolls
   away so it costs nothing once the visitor is reading the projects. */
function HeroGraph({ accent, rtl }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let compact = false;
    let heroVisible = true;
    const mouse = { x: -9999, y: -9999, on: false };
    const nodes = NODES.map((n) => ({ ...n, ox: 0, oy: 0, px: 0, py: 0, pulse: 0 }));
    const packets = [];
    const density = 5;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      if (!w || !h) return;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      /* Below the phone breakpoint the graph is an in-flow band rather than a
         backdrop, so it uses the full-width layout instead of hugging the
         right. Re-read on every resize so a rotation switches layouts. */
      compact = w < 620;
      nodes.forEach((n) => {
        const base = compact ? n.mx : n.x;
        /* Mirror for RTL. On desktop the layout hugs one side to leave the
           text column clear — in Arabic the text moves to the right, so the
           graph has to move to the left or it reads straight through the copy.
           It also keeps the flow running with the reading direction. */
        n.cx = rtl ? 1 - base : base;
        n.cy = compact ? n.my : n.y;
        n.px = n.cx * w;
        n.py = n.cy * h;
      });
      // Paint one frame straight away so the graph is never blank between
      // layout and the first animation frame (which a background tab defers).
      render(performance.now());
    };
    const parent = cv.parentElement;
    const onMove = (e) => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.on = true;
    };
    const onLeave = () => {
      mouse.on = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    parent.addEventListener('mousemove', onMove);
    parent.addEventListener('mouseleave', onLeave);

    /* Touch equivalents, bound to the canvas itself rather than the hero, so a
       finger anywhere else on the page doesn't drag the graph around. Nothing
       calls preventDefault — the page must still scroll normally under the
       finger; the graph just reacts while it passes. */
    const touchAt = (e) => {
      const t0 = e.touches[0];
      if (!t0) return;
      const r = cv.getBoundingClientRect();
      mouse.x = t0.clientX - r.left;
      mouse.y = t0.clientY - r.top;
      mouse.on = true;
    };
    const onTouchStart = (e) => {
      touchAt(e);
      // A tap pulses the nearest node and pushes packets out along its edges.
      let best = -1;
      let bestD = Infinity;
      nodes.forEach((n, i) => {
        const d = Math.hypot(mouse.x - n.px, mouse.y - n.py);
        if (d < bestD) { bestD = d; best = i; }
      });
      if (best >= 0 && bestD < 120) {
        nodes[best].pulse = 1;
        EDGES.filter(([a, b]) => a === best || b === best)
          .slice(0, 3)
          .forEach(([a, b]) => packets.push({
            a: a === best ? a : b,
            b: a === best ? b : a,
            p: 0,
            sp: 0.006 + Math.random() * 0.004,
          }));
      }
    };
    const onTouchEnd = () => { mouse.on = false; mouse.x = -9999; mouse.y = -9999; };
    cv.addEventListener('touchstart', onTouchStart, { passive: true });
    cv.addEventListener('touchmove', touchAt, { passive: true });
    cv.addEventListener('touchend', onTouchEnd, { passive: true });
    cv.addEventListener('touchcancel', onTouchEnd, { passive: true });

    const spawn = () => {
      const e = EDGES[Math.floor(Math.random() * EDGES.length)];
      packets.push({ a: e[0], b: e[1], p: 0, sp: 0.0035 + Math.random() * 0.006 });
    };
    for (let i = 0; i < density * 2; i++) spawn();

    const hexA = (hex, a) => {
      const m = hex.replace('#', '');
      const n = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
      const r = parseInt(n.slice(0, 2), 16);
      const g = parseInt(n.slice(2, 4), 16);
      const b = parseInt(n.slice(4, 6), 16);
      return `rgba(${r},${g},${b},${a})`;
    };

    let last = 0;
    function render(t) {
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(233,233,237,0.032)';
      ctx.lineWidth = 1;
      const step = 56;
      ctx.beginPath();
      for (let x = (w % step) / 2; x < w; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = (h % step) / 2; y < h; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      nodes.forEach((n, i) => {
        const bx = n.cx * w;
        const by = n.cy * h;
        let tx = 0;
        let ty = 0;
        if (mouse.on) {
          const dx = mouse.x - bx;
          const dy = mouse.y - by;
          const d = Math.hypot(dx, dy);
          if (d < 320) {
            const f = (1 - d / 320) * 16;
            tx = (dx / (d || 1)) * f;
            ty = (dy / (d || 1)) * f;
          }
        }
        const drift = reduce ? 0 : Math.sin(t / 2600 + i * 1.7) * 4;
        n.ox += (tx - n.ox) * 0.06;
        n.oy += (ty - n.oy) * 0.06;
        n.px = bx + n.ox;
        n.py = by + n.oy + drift;
        n.pulse *= 0.94;
      });

      EDGES.forEach(([a, b]) => {
        const A = nodes[a];
        const B = nodes[b];
        let alpha = 0.13;
        if (mouse.on) {
          const mx = (A.px + B.px) / 2;
          const my = (A.py + B.py) / 2;
          const d = Math.hypot(mouse.x - mx, mouse.y - my);
          if (d < 240) alpha += (1 - d / 240) * 0.4;
        }
        ctx.strokeStyle = hexA(accent, alpha);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(A.px, A.py);
        ctx.lineTo(B.px, B.py);
        ctx.stroke();
      });

      if (mouse.on) {
        const near = nodes
          .map((n, i) => ({ i, d: Math.hypot(mouse.x - n.px, mouse.y - n.py) }))
          .sort((p, q) => p.d - q.d)
          .slice(0, 3);
        near.forEach(({ i, d }) => {
          if (d > 420) return;
          ctx.strokeStyle = hexA(accent, 0.3 * (1 - d / 420));
          ctx.setLineDash([3, 5]);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(nodes[i].px, nodes[i].py);
          ctx.stroke();
          ctx.setLineDash([]);
        });
      }

      if (!reduce) {
        for (let i = packets.length - 1; i >= 0; i--) {
          const pk = packets[i];
          pk.p += pk.sp;
          const A = nodes[pk.a];
          const B = nodes[pk.b];
          if (pk.p >= 1) {
            nodes[pk.b].pulse = 1;
            packets.splice(i, 1);
            if (packets.length < density * 2) spawn();
            continue;
          }
          const x = A.px + (B.px - A.px) * pk.p;
          const y = A.py + (B.py - A.py) * pk.p;
          const tail = Math.max(0, pk.p - 0.1);
          const tx = A.px + (B.px - A.px) * tail;
          const ty = A.py + (B.py - A.py) * tail;
          const g = ctx.createLinearGradient(tx, ty, x, y);
          g.addColorStop(0, hexA(accent, 0));
          g.addColorStop(1, hexA(accent, 0.9));
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.fillStyle = hexA(accent, 0.95);
          ctx.fillRect(x - 1.6, y - 1.6, 3.2, 3.2);
        }
      }

      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      nodes.forEach((n) => {
        const hover = mouse.on && Math.hypot(mouse.x - n.px, mouse.y - n.py) < 90;
        const size = n.kind === 'gate' ? 7 : n.kind === 'db' ? 8 : 5;
        const boost = n.pulse * 0.5 + (hover ? 0.35 : 0);
        ctx.strokeStyle = hexA(accent, 0.42 + boost);
        ctx.fillStyle = 'rgba(22,24,38,0.92)';
        ctx.lineWidth = 1.2;
        if (n.kind === 'gate') {
          ctx.beginPath();
          ctx.arc(n.px, n.py, size + 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = hexA(accent, 0.18 + boost);
          ctx.beginPath();
          ctx.arc(n.px, n.py, size + 9 + n.pulse * 7, 0, Math.PI * 2);
          ctx.stroke();
        } else if (n.kind === 'db') {
          ctx.beginPath();
          ctx.rect(n.px - 13, n.py - 8, 26, 16);
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(n.px - 13, n.py - 2);
          ctx.lineTo(n.px + 13, n.py - 2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.rect(n.px - size, n.py - size, size * 2, size * 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.fillStyle = hover || n.pulse > 0.25 ? hexA(accent, 0.95) : 'rgba(233,233,237,0.42)';
        ctx.fillText(n.label, n.px, n.py + (n.kind === 'db' ? 24 : 20));
      });
    }

    /* The pump: capped at ~30fps and idle while the hero is scrolled away, so
       the graph costs nothing once the visitor is reading the projects. */
    const draw = (t) => {
      raf = requestAnimationFrame(draw);
      if (!heroVisible || !w || !h || t - last < 32) return;
      last = t;
      render(t);
    };

    /* A ResizeObserver, not a window listener: the effect can run before the
       canvas has been laid out, and a window-only listener would leave the
       backing store at 0 until the visitor happened to resize. The timeout is
       a second chance for that same first measurement — ResizeObserver
       callbacks are delivered with the rendering steps, which a backgrounded
       tab suspends, so a page opened in a background tab would otherwise show
       an unsized canvas until it was focused. */
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    resize();
    const settle = setTimeout(resize, 0);

    let heroIo;
    const hero = document.getElementById('hero');
    if (hero && 'IntersectionObserver' in window) {
      heroIo = new IntersectionObserver(([e]) => {
        heroVisible = e.isIntersecting;
      }, { threshold: 0.02 });
      heroIo.observe(hero);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      ro.disconnect();
      parent.removeEventListener('mousemove', onMove);
      parent.removeEventListener('mouseleave', onLeave);
      cv.removeEventListener('touchstart', onTouchStart);
      cv.removeEventListener('touchmove', touchAt);
      cv.removeEventListener('touchend', onTouchEnd);
      cv.removeEventListener('touchcancel', onTouchEnd);
      if (heroIo) heroIo.disconnect();
    };
  }, [accent, rtl]);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}

/* ── Architecture diagrams ───────────────────────────────────────────────
   One per project, drawn from the real repository layout. */

function PetzyArch({ t }) {
  /* Short labels for the compact host box; the lit pair is the same one the
     front of the card marks, so both faces agree on what he owned. */
  const mods = ['Security', 'Clinics', 'Pets', 'Appts', 'Shop', 'Chat', 'Bot', 'Calls'];
  const owned = ['Security', 'Bot'];
  return (
    <>
      <div className="arch-cols">
        <div className="arch-stack">
          <span className="node node-md">Flutter mobile client</span>
          <span className="node node-md">AI service</span>
          <span className="arrow">REST · JWT →</span>
        </div>
        <div className="host">
          <span className="host-label">SINGLE API HOST</span>
          <div className="mods mods-sm">
            {mods.map((m) => (
              <span className={`mod${owned.includes(m) ? ' mod-lit' : ''}`} key={m}>{m}</span>
            ))}
          </div>
          <span className="node node-dash" style={{ fontSize: 9 }}>BUILDING BLOCKS — cross-cutting</span>
        </div>
        <div className="arch-stack">
          <span className="arrow">→ EF Core 8</span>
          <span className="node node-md node-accent">
            SQL Server
            <span className="node-sub">one database · DbContext per module</span>
          </span>
          <span className="node node-md">
            SignalR
            <span className="node-sub">chat · chatbot</span>
          </span>
          <span className="node node-md">
            Azure Communication
            <span className="node-sub">video calls</span>
          </span>
        </div>
      </div>
      <p className="arch-note">{t.note}</p>
    </>
  );
}

function PeerCarArch({ t }) {
  return (
    <>
      <div className="arch-flow">
        <span className="node node-accent">PRESENTATION — MVC · SignalR hub</span>
        <span className="arrow">↓</span>
        <span className="node">APPLICATION — use cases · DTOs</span>
        <span className="arrow">↓</span>
        <span className="node node-dash">DOMAIN — entities · rental state machine</span>
        <span className="arrow">↑</span>
        <span className="node">INFRASTRUCTURE — EF Core · generic repo</span>
      </div>
      <div className="grid2" style={{ marginTop: 2 }}>
        <span className="cell">Worker · auto-complete finished bookings</span>
        <span className="cell">Worker · cancel expired bookings</span>
        <span className="cell">Identity · Google OAuth · RBAC</span>
        <span className="cell">Soft delete flags · GUID keys</span>
      </div>
      <p className="arch-note">{t.note}</p>
    </>
  );
}

function AttendanceArch({ t }) {
  return (
    <>
      <span className="node">Blazor WebAssembly clients — Auth · Import</span>
      <span className="arrow">↓ JWT bearer</span>
      <div className="host">
        <span className="host-label">.NET ASPIRE APPHOST</span>
        <div className="grid2" style={{ fontSize: 10 }}>
          <span className="cell">Auth API</span>
          <span className="cell">File-Import API</span>
        </div>
        <span className="node node-dash" style={{ fontSize: 9 }}>CQRS · MediatR commands / queries</span>
      </div>
      <div className="grid3">
        <span className="cell">CSV import + validation</span>
        <span className="cell">Working-hours calc</span>
        <span className="cell">Daily / monthly / yearly views</span>
      </div>
      <span className="node node-accent">SQL Server</span>
      <p className="arch-note">{t.note}</p>
    </>
  );
}

function BedoonHabdArch({ t }) {
  return (
    <>
      <span className="node">Flutter judge app · Arabic-first RTL</span>
      <span className="arrow arrow-sm">↓ REST + WS /ws/game/&#123;room&#125;</span>
      <div className="host host-alt">
        <span className="host-label-alt">FASTAPI SERVICE</span>
        <span className="node node-dash-ac" style={{ borderStyle: 'dashed' }}>Keyword classifier (ar + en)</span>
        <div className="grid2">
          <span className="cell">Objective → Llama 3.3 over country fact sheet</span>
          <span className="cell">General → compound + live web search</span>
        </div>
      </div>
      <div className="grid3">
        <span className="cell">LRU verdict cache</span>
        <span className="cell">Rate limit 20/min per IP</span>
        <span className="cell">Global budget 60/min</span>
      </div>
      <span className="node node-accent" style={{ fontSize: 9.5 }}>
        194 countries — merged from 3 keyless sources, cached for offline restarts
      </span>
      <p className="arch-note">{t.note}</p>
    </>
  );
}

function AwradiArch({ t }) {
  return (
    <>
      <span className="node node-accent-2">FLUTTER UI — offline-first, no server</span>
      <span className="arrow arrow-sm">↓ Riverpod providers</span>
      <div className="grid2" style={{ fontSize: 9.5 }}>
        <span className="cell cell-tall cell-accent">
          Drift / SQLite
          <span className="cell-sub">daily progress · khatmah</span>
        </span>
        <span className="cell cell-tall">
          Notification scheduler
          <span className="cell-sub">tz-aware reminder ids</span>
        </span>
      </div>
      <div className="grid2">
        <span className="cell">Offline Quran pack — zip download, SHA-256 verify, extract</span>
        <span className="cell">Qibla — sensors + geolocation math</span>
      </div>
      <span className="node node-dash-ac" style={{ fontSize: 9.5 }}>
        Unit-tested domain: progress, khatmah, notification ids, qibla math
      </span>
      <p className="arch-note">{t.note}</p>
    </>
  );
}

function RecruitBotArch({ t }) {
  const layers = [
    'Domain blacklist — zombie aggregators',
    'Content pollution — forums, Q&A, blogs',
    'Path gate — canonical listing URLs only',
    'Staleness scan — age badges, ar + en',
    'Live probe — 8KB head fetch',
  ];
  return (
    <>
      <div className="arch-cols">
        <div className="arch-stack">
          <span className="node node-md">
            CV upload — PDF / DOCX / TXT
            <span className="node-sub">size guard · magic bytes</span>
          </span>
          <span className="node node-md">Targeted search — title + location</span>
          <span className="arrow">FastAPI →</span>
        </div>
        <div className="host host-alt">
          <span className="host-label-alt">LANGGRAPH STATE MACHINE</span>
          <div className="grid2">
            <span className="cell">llm_node — Groq Llama 3.3 70B</span>
            <span className="cell">tool_node — Tavily + scrape</span>
            <span className="cell">coerce_internship_node</span>
            <span className="cell">graceful_exit_node</span>
          </div>
          <span className="node node-dash-ac" style={{ fontSize: 9 }}>
            2 parallel Tavily queries per turn · 11 approved boards
          </span>
        </div>
        <div className="arch-stack">
          <span className="arrow">→ 5-LAYER FILTER</span>
          <div className="arch-flow" style={{ fontSize: 9 }}>
            {layers.map((l, i) => (
              <span className="node" key={l} style={{ padding: '6px 5px', letterSpacing: 'normal' }}>
                {i + 1}. {l}
              </span>
            ))}
          </div>
          <span className="node node-md node-accent" style={{ fontSize: 9.5 }}>
            Match score 0–100
            <span className="node-sub">title 50 · location 30 · info 20</span>
          </span>
        </div>
      </div>
      <p className="arch-note">{t.note}</p>
    </>
  );
}

const ARCH = {
  petzy: PetzyArch,
  peercar: PeerCarArch,
  attendance: AttendanceArch,
  bedoonhabd: BedoonHabdArch,
  awradi: AwradiArch,
  recruitbot: RecruitBotArch,
};

/* ── Project card ────────────────────────────────────────────────────────
   Front is the pitch, back is the architecture. The whole card is the flip
   control, so it carries button semantics and an Enter/Space handler; the
   GitHub link on the back stops propagation so it doesn't flip back. */
function ProjectCard({ project, lang, t, flipped, onFlip, index }) {
  const copy = project[lang];
  const Arch = ARCH[project.id];
  const cardRef = useRef(null);
  /* Reduced motion — or a browser with no IntersectionObserver — opts out of
     the reveal entirely and the card simply stays visible, so no effect has to
     correct the state after the first render. */
  const [skipReveal] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window),
  );
  const [inView, setInView] = useState(skipReveal);

  useEffect(() => {
    if (skipReveal) return;
    const el = cardRef.current;
    if (!el) return;
    /* Deliberately not one-shot: the observer stays connected and tracks the
       card both ways, so it fades back out on the way up and returns coming
       down. That also removes the need for the old "never leave it stuck
       invisible" timeout — the first callback always reports the true state. */
    let delivered = false;
    const io = new IntersectionObserver(
      ([e]) => { delivered = true; setInView(e.isIntersecting); },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    /* If the observer never reports at all, show the card rather than leave it
       permanently invisible. Conditioned on having heard nothing, so it can't
       fight the observer once that is working. */
    const guard = setTimeout(() => { if (!delivered) setInView(true); }, 3000);
    return () => { io.disconnect(); clearTimeout(guard); };
  }, [skipReveal]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onFlip();
    }
  };

  const tagClass = project.alt ? 'tech-tag-alt' : 'tech-tag';

  return (
    <article
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${project.title} — ${t.seeArch}`}
      onClick={onFlip}
      onKeyDown={onKeyDown}
      /* Cards sit two-up, so staggering by column lets a pair land one after
         the other instead of together. */
      style={{ '--reveal-delay': `${(index % 2) * 90}ms` }}
      className={[
        'card',
        project.wide ? 'card-wide' : '',
        'reveal',
        inView ? 'is-in' : '',
        flipped ? 'is-flipped' : '',
      ].filter(Boolean).join(' ')}
    >
      <div className="card-inner">
        <div className="face face-front">
          <div className="card-col">
            <div className="card-head">
              <span className="card-num">{project.num}</span>
              <span className="card-tag">{copy.tag}</span>
            </div>
            <h3 className={`card-title${project.titleSmall ? ' card-title-sm' : ''}`}>{project.title}</h3>
            <p className="card-sub">{copy.sub}</p>
            <p className="card-desc">{copy.desc}</p>
            <div className="tech">
              {project.tech.map((tag) => (
                <span className={tagClass} key={tag}>{tag}</span>
              ))}
            </div>
            <span className="see-arch">
              <span className="see-arch-icon" aria-hidden="true">⤿</span>
              {t.seeArch}
            </span>
          </div>
          {project.id === 'petzy' && (
            <div className="wide-side">
              <p className="wide-side-label">8 BOUNDED MODULES</p>
              <div className="mods">
                {PETZY_MODULES.map((m) => (
                  <span className={`mod${PETZY_OWNED.includes(m) ? ' mod-lit' : ''}`} key={m}>{m}</span>
                ))}
              </div>
              <p className="wide-side-foot">↳ Building Blocks · one API host · Stripe inside E-commerce</p>
            </div>
          )}
          {project.id === 'recruitbot' && (
            <div className="wide-side">
              <p className="wide-side-label">5-LAYER QUALITY PIPELINE</p>
              <div className="arch-flow">
                <span className="node node-accent-2">Tavily results in</span>
                <span className="arrow">↓</span>
                <span className="node">Blacklist → pollution → path gate</span>
                <span className="arrow">↓</span>
                <span className="node">Staleness scan (ar + en)</span>
                <span className="arrow">↓</span>
                <span className="node node-dash-ac">Live 8KB probe — closure badges</span>
              </div>
              <p className="wide-side-foot">↳ only validated, currently-open listings survive</p>
            </div>
          )}
        </div>

        <div className={`face face-back${project.alt ? ' face-back-alt' : ''}`}>
          <div className="arch-head">
            <span className={project.alt ? 'arch-id-alt' : 'arch-id'}>{project.archId}</span>
            {project.id === 'petzy' && <span>{t.archLabel}</span>}
            <span className="spacer" />
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="arch-link"
              onClick={(e) => e.stopPropagation()}
            >
              github ↗
            </a>
          </div>
          <Arch t={copy} />
        </div>
      </div>
    </article>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function App() {
  const [lang, setLang] = useState('en');
  const [flipped, setFlipped] = useState({});
  const t = TEXT[lang];
  /* The pipeline is a flex row, so RTL lays it out right-to-left — a "→" would
     then point back up the pipeline instead of along it. */
  const arrow = t.dir === 'rtl' ? '←' : '→';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
  }, [lang, t.dir]);

  const toggleFlip = useCallback((id) => {
    setFlipped((s) => ({ ...s, [id]: !s[id] }));
  }, []);

  return (
    <div className="page" dir={t.dir}>
      <nav className="nav">
        <Portrait t={t} />
        <a href="#hero" className="nav-brand">
          <span className="nav-mark" aria-hidden="true" />
          YI
        </a>
        <span className="nav-spacer" />
        <div className="nav-actions">
          <a href="#projects" className="nav-link">{t.navProjects}</a>
          <a href={`mailto:${EMAIL}`} className="nav-link">{t.navContact}</a>
          <button type="button" className="nav-btn" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}>
            {t.langBtn}
          </button>
          <a href={CV_URL} target="_blank" rel="noopener noreferrer" className="nav-cta">{t.resume}</a>
        </div>
      </nav>

      <section id="hero" className="hero">
        <HeroGraph accent={ACCENT} rtl={t.dir === 'rtl'} />
        <div className="hero-veil" />

        <div className="hero-inner">
          <div className="hero-content">
            <p className="prompt">
              <span className="prompt-host">youssef@dev:~$</span>
              {t.whoami}
              <span className="caret" aria-hidden="true" />
            </p>
            <h1 className="hero-name">{t.name}</h1>
            <p className="hero-role">{t.role}</p>
            <p className="hero-summary">{t.summary}</p>
            <div className="chips">
              <span className="chip">{t.chipLoc}</span>
              <span className="chip">{t.chipService}</span>
              <span className="chip">.NET 8 · ASP.NET CORE</span>
              <span className="chip">CLEAN ARCH · CQRS</span>
              <span className="chip">PYTHON · FASTAPI · LLM</span>
              <span className="chip">FLUTTER</span>
            </div>
            <div className="btn-row">
              <a href="#projects" className="btn-accent">
                {t.ctaProjects}
                <span className="glyph" aria-hidden="true">↓</span>
              </a>
              <a href={CV_URL} target="_blank" rel="noopener noreferrer" className="btn-quiet">{t.ctaCv}</a>
            </div>
          </div>
        </div>

        <div className="pipeline">
          <div className="pipeline-rail">
            <span className="pipeline-dot" aria-hidden="true" />
          </div>
          <div className="pipeline-row">
            <span className="pipe-endpoint">GET /api/{'{resource}'}</span>
            <span className="pipe-arrow">{arrow}</span>
            {PIPELINE.map((stage, i) => (
              <Fragment key={stage}>
                <span className="pipe-stage" style={{ animationDelay: `${0.15 + i * 0.6}s` }}>{stage}</span>
                {i < PIPELINE.length - 1 && <span className="pipe-arrow">{arrow}</span>}
              </Fragment>
            ))}
            <span className="pipe-gap" />
            <span className="pipe-status">200 OK · JSON</span>
          </div>
        </div>

        <span className="scrollhint">{t.scroll}</span>
      </section>

      <section id="projects" className="projects">
        <div className="projects-inner">
          <p className="kicker">02 // {t.projectsKicker}</p>
          <h2 className="section-title">{t.projectsTitle}</h2>
          <p className="section-intro">{t.projectsIntro}</p>
          <p className="flip-hint">{t.flipHint}</p>

          <div className="grid">
            {PROJECTS.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                lang={lang}
                t={t}
                flipped={!!flipped[p.id]}
                onFlip={() => toggleFlip(p.id)}
              />
            ))}
          </div>

          <div className="footer">
            <p className="footer-note">{t.moreOnGithub}</p>
            <span className="footer-spacer" />
            <div className="social">
              <a href={GITHUB_USER} target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub" aria-label="GitHub">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.42 1.08 3 1 .09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69 1 .69 2.21v3.29c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" /></svg>
              </a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" /></svg>
              </a>
              <a href={`mailto:${EMAIL}`} className="social-link" title={EMAIL} aria-label="Email">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 4.24-8 4.76-8-4.76V6l8 4.75L20 6v2.24z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Analytics />
    </div>
  );
}
