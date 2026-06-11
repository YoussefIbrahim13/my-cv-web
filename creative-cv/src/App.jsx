import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import myProfileImg from './assets/me.jpg'; 

gsap.registerPlugin(ScrollTrigger);

const textData = {
  en: {
    langBtn: "[ EN // AR ]",
    heroTitle: "Welcome to Youssef's CV",
    heroSubtitle: "> SOFTWARE ENGINEER",
    sec1Title: "01 // CORE_MISSION",
    objectiveTitle: "[OBJECTIVE]",
    objectiveDesc: "A results-driven, deeply passionate Software Engineer with a relentless hunger for continuous learning and architectural excellence. Highly proficient in engineering robust backend ecosystems using ASP.NET Core and building modern, high-performance web applications and lightweight services with FastAPI. Expert at establishing ultra-fast real-time communication protocols via WebSockets, crafting interactive user interfaces with Blazor, and seamlessly embedding Artificial Intelligence capabilities into production-grade solutions. Heavily dedicated to clean code architecture and SOLID principles.",
    skillsTitle: "[TECHNICAL_SKILLS]",
    sec2Title: "02 // ENGINEERING_LOGS",
    expTitle: "[EXPERIENCE]",
    expCompany: "Microtec International (In-house)",
    expSub: "June 2025 – September 2025",
    expL1: "Gained hands-on experience in C# and SQL Server with a focus on query optimization, schema design, and data handling.",
    expL2: "Built modular and reusable components using OOP principles.",
    expL3: "Utilized LINQ for efficient and readable data operations.",
    expL4: "Developed a full-featured ASP.NET Core MVC application integrating front-end and back-end using the MVC pattern.",
    expL5: "Implemented secure and scalable RESTful APIs using ASP.NET Core.",
    expL6: "Worked with Entity Framework Core for database access and CRUD operations.",
    expL7: "Demonstrated exceptional performance in backend development (.NET Core & C#), focusing on strong problem-solving and analytical skills.",
    expL8: "Gained valuable Full Stack experience by building and integrating robust front-end components using Blazor.",
    expL9: "Maintained a high level of professionalism and contributed effectively through excellent teamwork and collaboration.",
    trainTitle: "[TRAINING]",
    trainCompany: "Route IT Training Center (Remote)",
    trainSub: "ASP.NET Core Advanced Diploma — 2024",
    trainL1: "Developed secure, end-to-end scalable RESTful APIs integrating industry-standard design workflows.",
    trainL2: "Mastered Entity Framework Core pipelines for professional relational database access and advanced CRUD operations.",
    trainL3: "Utilized clean OOP standards and LINQ utilities for clean and highly readable backend data operations.",
    sec3Title: "03 // ACADEMIC_LEADERSHIP",
    eduTitle: "[EDUCATION]",
    eduCompany: "El Shorouk Academy, Cairo",
    eduSub: "Bachelor of Science in Computer Science (Expected Graduation: June 2026)",
    eduCourse: "[RELEVANT_COURSEWORK]: Object-Oriented Programming (OOP), SOLID Principles, Software Design Patterns, Systems Analysis & Design, Relational Database Systems.",
    leadTitle: "[LEADERSHIP_SOFT_SKILLS]",
    leadCompany: "IEEE SHA Student Branch",
    leadSub: "Head of Media and Branding | Oct 2023 – Feb 2025",
    leadL1: "Led overall media and creative branding strategies, managing promotional digital assets.",
    leadL2: "Coordinated seamlessly with cross-functional technical teams to sustain a high-level public image.",
    leadL3: "[SOFT_SKILLS]: Agile problem solving, effective communication, and task coordination.",
    projTitle1: "PETZY",
    projDesc1: "Veterinary clinic booking, e-commerce ecosystem, and AI-powered diagnostic assistance backend built with Clean Architecture pattern.",
    projTag1: "GRADUATION PROJECT",
    projLink1: "https://github.com/Veterinaryclinics/Backend/tree/Devolpment", 
    projTitle2: "ATTENDANCE SYSTEM",
    projDesc2: "Full-stack employee management system with real-time tracking, dynamic validation, designed using the Factory Design Pattern.",
    projTag2: "SYSTEM PROJECT",
    projLink2: "https://github.com/YoussefIbrahim13/Attendance-and-departure-system", 
    projTitle3: "PEER CAR",
    projDesc3: "An ASP.NET Core MVC application for peer-to-peer car rentals featuring secure workflows, car listing management, and chatbot integration.",
    projTag3: "WEB APPLICATION",
    projLink3: "https://github.com/YoussefIbrahim13/PeerCar", 
  },
  ar: {
    langBtn: "[ AR // EN ]",
    heroTitle: "مرحباً بك في موقع يوسف",
    heroSubtitle: "> مهندس برمجيات",
    sec1Title: "01 // المهمة الأساسية",
    objectiveTitle: "[الهدف المهني]",
    objectiveDesc: "مهندس برمجيات استثنائي ذو شغف عارم بالتعلم المستمر ومواجهة التحديات المعمارية المعقدة. يتميز بكفاءة عالية في هندسة الأنظمة الخلفية القوية والآمنة باستخدام ASP.NET Core، وبناء الخدمات المصغرة (Microservices) وتطبيقات الويب فائقة السرعة والخفة عبر إطار العمل FastAPI. محترف في تمكين بروتوكولات الاتصال الفوري الحي باستخدام WebSockets، وتصميم واجهات مستخدم تفاعلية متطورة بواسطة Blazor وMudBlazor، بالإضافة إلى الدمج المتقدم لقدرات الذكاء الاصطناعي في بيئات الإنتاج الفعلية، مع الالتزام المطلق بمعايير الكود النظيف ومبادئ SOLID البرمجية.",
    skillsTitle: "[المهارات التقنية]",
    sec2Title: "02 // السجلات الهندسية",
    expTitle: "[الخبرة العملية]",
    expCompany: "مايكروتك الدولية (Microtec International)",
    expSub: "يونيو 2025 – سبتمبر 2025",
    expL1: "اكتساب خبرة عملية في C# وSQL Server مع التركيز على تحسين الاستعلامات، وتصميم الهياكل (Schema)، ومعالجة البيانات.",
    expL2: "بناء مكونات برمجية مجزأة وقابلة لإعادة الاستخدام باستخدام مبادئ ومفاهيم OOP.",
    expL3: "استخدم أداة LINQ لإجراء عمليات كفاءة وبيانات واضحة ومباشرة القراءة.",
    expL4: "تطوير تطبيق ASP.NET Core MVC متكامل الميزات يربط بين الواجهات الأمامية والخلفية باستخدام نمط الـ MVC.",
    expL5: "تنفيذ واجهات برمجة تطبيقات RESTful آمنة وقابلة للتوسع بالكامل باستخدام تقنيات ASP.NET Core.",
    expL6: "التعامل والربط المتقدم مع Entity Framework Core للوصول السلس لقواعد البيانات وعمليات CRUD.",
    expL7: "إظهار أداء استثنائي في تطوير الأنظمة الخلفية (.NET Core & C#) مع التركيز على المهارات التحليلية وحل المشكلات المعقدة.",
    expL8: "اكتساب خبرة Full Stack قيمة من خلال بناء ودمج مكونات واجهة مستخدم قوية وتفاعلية باستخدام Blazor.",
    expL9: "الحفاظ على مستوى عالٍ من الاحترافية والمساهمة الفعالة داخل بيئة العمل من خلال العمل الجماعي المتميز.",
    trainTitle: "[التدريب الاحترافي]",
    trainCompany: "مركز روت للتدريب (Route IT Center)",
    trainSub: "دبلومة ASP.NET Core المتقدمة — 2024",
    trainL1: "تطوير واجهات برمجة تطبيقات RESTful آمنة وقابلة للتوسع بالكامل مع دمج سير العمل القياسي.",
    trainL2: "إتقان التعامل مع Entity Framework Core للوصول الاحترافي إلى قواعد البيانات وتطوير عمليات CRUD المتقدمة.",
    trainL3: "استخدام معايير OOP النظيفة وأدوات LINQ لكتابة عمليات بيانات خلفية واضحة وعالية القراءة.",
    sec3Title: "03 // السجل الأكاديمي القيادي",
    eduTitle: "[التعليم]",
    eduCompany: "أكاديمية الشروق، القاهرة",
    eduSub: "بكالوريوس علوم الحاسب (التخرج المتوقع: يونيو 2026)",
    eduCourse: "[المواد الدراسية ذات الصلة]: البرمجة كائنية التوجه (OOP) ، أنماط التصميم البرمجي، تحليل وتصميم النظم، نظم قواعد البيانات العلاقاتية.",
    leadTitle: "[القدرات القيادية والشخصية]",
    leadCompany: "فرع IEEE SHA الطلابي",
    leadSub: "رئيس لجنة الميديا والبراندينج | أكتوبر 2023 – فبراير 2025",
    leadL1: "قيادة استراتيجيات الميديا الإبداعية وإدارة الأصول الرقمية الترويجية للمؤسسة.",
    leadL2: "التنسيق السلس مع الفرق التقنية المختلفة للحفاظ على صورة عامة قوية ومتناسقة للبراند.",
    leadL3: "[المهارات الشخصية]: حل المشكلات المعقدة بمرونة، التواصل الفعال، وتنسيق المهام والمشاريع.",
    projTitle1: "PETZY",
    projDesc1: "نظام متكامل لحجز عيادات الطب البيطري، والتجارة الإلكترونية، مع دعم التشخيص الذكي بالذكاء الاصطناعي مبني بنظام Clean Architecture.",
    projTag1: "مشروع التخرج",
    projLink1: "https://github.com/Veterinaryclinics/Backend",
    projTitle2: "ATTENDANCE SYSTEM",
    projDesc2: "نظام Full-stack لإدارة حضور وانصراف الموظفين مع تتبع فوري، وفحص ديناميكي، ومصمم باستخدام نمط Factory Design Pattern.",
    projTag2: "مشروع نظام متكامل",
    projLink2: "https://github.com/yy7692651/Attendance-and-departure-system",
    projTitle3: "PEER CAR",
    projDesc3: "تطبيق ASP.NET Core MVC لتأجير السيارات بين الأفراد يتميز بسير عمل آمن، وإدارة القوائم، ودمج الشات بوت الذكي.",
    projTag3: "تطبيق ويب",
    projLink3: "https://github.com/YoussefIbrahim13/PeerCar",
  }
};

function App() {
  const containerRef = useRef();
  const [lang, setLang] = useState('en');
  const currentText = textData[lang];

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); };
  }, []);

  useGSAP(() => {
    gsap.to('.scene-1 .hero-box', {
      opacity: 0, scale: 0.3, y: -50,
      scrollTrigger: { trigger: '.scene-1', start: 'top top', end: 'bottom top', scrub: true, pin: true, pinSpacing: false }
    });
    gsap.to('.scene-2 .content-box', {
      opacity: 0, scale: 0.3, y: -50,
      scrollTrigger: { trigger: '.scene-2', start: 'top top', end: 'bottom top', scrub: true, pin: true, pinSpacing: false }
    });
    gsap.to('.scene-3 .content-box', {
      opacity: 0, scale: 0.3, y: -50,
      scrollTrigger: { trigger: '.scene-3', start: 'top top', end: 'bottom top', scrub: true, pin: true, pinSpacing: false }
    });
    gsap.to('.scene-4 .content-box', {
      opacity: 0, scale: 0.3, y: -50,
      scrollTrigger: { trigger: '.scene-4', start: 'top top', end: 'bottom top', scrub: true, pin: true, pinSpacing: false }
    });
    gsap.to('.scene-5 .content-box', {
      opacity: 0, scale: 0.3, y: -50,
      scrollTrigger: { trigger: '.scene-5', start: 'top top', end: 'bottom top', scrub: true, pin: true, pinSpacing: false }
    });
    const projects = gsap.utils.toArray('.project-card');
    gsap.to(projects, {
      xPercent: -100 * (projects.length - 1),
      ease: "none",
      scrollTrigger: { trigger: '.scene-6', pin: true, scrub: 1, start: 'top top', end: () => `+=${document.querySelector('.scene-6').offsetWidth}` }
    });
  }, { scope: containerRef });

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  return (
    <div ref={containerRef} className={`app-container ${lang === 'ar' ? 'rtl-mode' : ''}`}>
      
      <button className="lang-toggle-btn" onClick={toggleLanguage}>
        {currentText.langBtn}
      </button>
      
      <section className="scene scene-1">
        <div className="hero-box">
          <img src={myProfileImg} alt="Youssef Ibrahim" className="profile-img" />
          <div>
            <h1 className="hero-title">{currentText.heroTitle}</h1>
            <p className="hero-subtitle">{currentText.heroSubtitle}</p>
          </div>
        </div>
      </section>

      <section className="scene scene-2">
        <div className="content-box text-only">
          <h2>{currentText.sec1Title}</h2>
          <div className="info-block bio-block">
            <h3>{currentText.objectiveTitle}</h3>
            <p style={{ fontSize: '1.25rem', lineHeight: '1.7' }}>{currentText.objectiveDesc}</p>
            <div className="bio-meta">
              <span>LOC: Benha, Egypt</span>
              <span>STATUS: Active_Dev</span>
              <span>FIELD: Full_Stack_DotNet</span>
            </div>
          </div>
        </div>
      </section>

      <section className="scene scene-3">
        <div className="content-box">
          <h2>{currentText.skillsTitle}</h2>
          <div className="profile-grid eight-cards">
            
            <div className="info-block">
              <h3>[CORE_LANGUAGES]</h3>
              <div className="skills-tags">
                <span>C#</span><span>Python</span>
              </div>
            </div>

            <div className="info-block">
              <h3>[CS_FOUNDATIONS]</h3>
              <div className="skills-tags">
                <span>Data Structures</span><span>Algorithms</span><span>OOP</span>
              </div>
            </div>

            <div className="info-block">
              <h3>[BACKEND_FRAMEWORKS]</h3>
              <div className="skills-tags">
                <span>ASP.NET Core</span><span>Entity Framework Core</span><span>FastAPI</span>
              </div>
            </div>

            <div className="info-block">
              <h3>[API_COMMUNICATION]</h3>
              <div className="skills-tags">
                <span>RESTful APIs</span><span>WebSockets</span>
              </div>
            </div>

            <div className="info-block">
              <h3>[FRONTEND_UI]</h3>
              <div className="skills-tags">
                <span>Blazor</span><span>MudBlazor</span>
              </div>
            </div>

            <div className="info-block">
              <h3>[CLOUD_PLATFORMS]</h3>
              <div className="skills-tags">
                <span>Microsoft Azure</span>
              </div>
            </div>

            <div className="info-block">
              <h3>[ARCHITECTURE_PRINCIPLES]</h3>
              <div className="skills-tags">
                <span>Clean Architecture</span><span>SOLID Principles</span>
              </div>
            </div>

            <div className="info-block">
              <h3>[DATABASES]</h3>
              <div className="skills-tags">
                <span>SQL Server</span><span>Schema Design</span><span>Query Optimization</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="scene scene-4">
        <div className="content-box">
          <h2>{currentText.sec2Title}</h2>
          <div className="profile-grid">
            <div className="info-block">
              <h3>{currentText.expTitle}</h3>
              <p className="highlight">{currentText.expCompany}</p>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{currentText.expSub}</p>
              <ul className="terminal-list">
                <li>{currentText.expL1}</li>
                <li>{currentText.expL2}</li>
                <li>{currentText.expL3}</li>
                <li>{currentText.expL4}</li>
                <li>{currentText.expL5}</li>
                <li>{currentText.expL6}</li>
                <li>{currentText.expL7}</li>
                <li>{currentText.expL8}</li>
                <li>{currentText.expL9}</li>
              </ul>
            </div>
            <div className="info-block">
              <h3>{currentText.trainTitle}</h3>
              <p className="highlight">{currentText.trainCompany}</p>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{currentText.trainSub}</p>
              <ul className="terminal-list">
                <li>{currentText.trainL1}</li>
                <li>{currentText.trainL2}</li>
                <li>{currentText.trainL3}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="scene scene-5">
        <div className="content-box">
          <h2>{currentText.sec3Title}</h2>
          <div className="profile-grid">
            <div className="info-block">
              <h3>{currentText.eduTitle}</h3>
              <p className="highlight">{currentText.eduCompany}</p>
              <p>{currentText.eduSub}</p>
              <p style={{ marginTop: '10px', color: '#38bdf8', fontSize: '0.9rem' }}>{currentText.eduCourse}</p>
            </div>
            <div className="info-block">
              <h3>{currentText.leadTitle}</h3>
              <p className="highlight">{currentText.leadCompany}</p>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{currentText.leadSub}</p>
              <ul className="terminal-list">
                <li>{currentText.leadL1}</li>
                <li>{currentText.leadL2}</li>
                <li>{currentText.leadL3}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="scene scene-6">
        <div className="projects-wrapper">
          
          <a href={currentText.projLink1} target="_blank" rel="noopener noreferrer" className="project-card">
            <h3>{currentText.projTitle1}</h3>
            <p>{currentText.projDesc1}</p>
            <div className="card-tech">.NET Core / EF Core / AI Integration</div>
            <span>{currentText.projTag1}</span>
          </a>

          <a href={currentText.projLink2} target="_blank" rel="noopener noreferrer" className="project-card">
            <h3>{currentText.projTitle2}</h3>
            <p>{currentText.projDesc2}</p>
            <div className="card-tech">ASP.NET Core API / Blazor / SQL Server</div>
            <span>{currentText.projTag2}</span>
          </a>

          <a href={currentText.projLink3} target="_blank" rel="noopener noreferrer" className="project-card">
            <h3>{currentText.projTitle3}</h3>
            <p>{currentText.projDesc3}</p>
            <div className="card-tech">ASP.NET Core MVC / SQL Server</div>
            <span>{currentText.projTag3}</span>
          </a>

        </div>
      </section>

      <div className="mac-dock-container">
        <div className="mac-dock">
          <a href="https://github.com/YoussefIbrahim13" target="_blank" rel="noopener noreferrer" className="dock-item" title="GitHub">
            <svg viewBox="0 0 24 24" className="dock-icon"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.42 1.08 3 1 .09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69 1 .69 2.21v3.29c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
          </a>
          <div className="dock-separator"></div>
          <a href="https://www.linkedin.com/in/youssef-ibrahim-1322004sh192007" target="_blank" rel="noopener noreferrer" className="dock-item" title="LinkedIn">
            <svg viewBox="0 0 24 24" className="dock-icon"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
          </a>
        </div>
      </div>

    </div>
  );
}

export default App;