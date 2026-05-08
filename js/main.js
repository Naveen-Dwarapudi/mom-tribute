/* ============================================================
   FOR ANNAPURNA DWARAPUDI — A Tribute by Naveen Dwarapudi
   main.js — All Interactivity, Animations & Particles
   ============================================================ */

'use strict';

/* ── 1. LOADING SCREEN ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2000);
});

/* ── 2. CUSTOM CURSOR ── */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  }
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  if (follower) {
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .photo-slot, .quality-card, .photo-placeholder').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.transform = 'translate(-50%,-50%) scale(1.8)';
    if (follower) follower.style.width = follower.style.height = '54px';
  });
  el.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    if (follower) follower.style.width = follower.style.height = '36px';
  });
});

/* ── 3. PARTICLE CANVAS ── */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

/* Sparkle particles */
const SPARKLE_COUNT = 65;
const sparkles = Array.from({ length: SPARKLE_COUNT }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 2.2 + 0.5,
  phase: Math.random() * Math.PI * 2,
  phaseSpeed: Math.random() * 0.02 + 0.008,
  speedX: (Math.random() - 0.5) * 0.22,
  speedY: (Math.random() - 0.5) * 0.16,
  hue: Math.random() > 0.5 ? '80,160,220' : '160,210,245',
}));

/* Floating emoji petals */
const PETAL_EMOJIS = ['🌸', '💙', '✨', '🌼', '💫', '⭐', '🌺', '❄️'];
const PETAL_COUNT = 32;
const petals = Array.from({ length: PETAL_COUNT }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  size: Math.random() * 14 + 7,
  speedY: Math.random() * 0.55 + 0.2,
  speedX: (Math.random() - 0.5) * 0.45,
  sway: Math.random() * Math.PI * 2,
  swaySpeed: Math.random() * 0.013 + 0.004,
  opacity: Math.random() * 0.45 + 0.15,
  emoji: PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)],
  rotation: Math.random() * Math.PI * 2,
  rotSpeed: (Math.random() - 0.5) * 0.025,
}));

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* sparkles */
  sparkles.forEach(s => {
    s.phase += s.phaseSpeed;
    s.x += s.speedX;
    s.y += s.speedY;
    if (s.x < 0) s.x = canvas.width;
    if (s.x > canvas.width) s.x = 0;
    if (s.y < 0) s.y = canvas.height;
    if (s.y > canvas.height) s.y = 0;

    const alpha = (Math.sin(s.phase) * 0.5 + 0.5) * 0.5 + 0.05;
    const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 8);
    g.addColorStop(0, `rgba(${s.hue},${alpha})`);
    g.addColorStop(1, `rgba(${s.hue},0)`);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * 8, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  });

  /* petals */
  petals.forEach(p => {
    p.sway += p.swaySpeed;
    p.y += p.speedY;
    p.x += p.speedX + Math.sin(p.sway) * 0.4;
    p.rotation += p.rotSpeed;

    if (p.y > window.innerHeight + 24) { p.y = -24; p.x = Math.random() * window.innerWidth; }
    if (p.x < -24) p.x = window.innerWidth + 24;
    if (p.x > window.innerWidth + 24) p.x = -24;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.font = `${p.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.emoji, 0, 0);
    ctx.restore();
  });

  requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* ── 4. SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

/* ── 5. HERO PHOTO UPLOAD ── */
const heroFileInput = document.getElementById('heroFileInput');
const heroImg = document.getElementById('heroImg');
const heroPlaceholder = document.getElementById('heroPlaceholder');

if (heroFileInput) {
  heroFileInput.addEventListener('change', function () {
    if (!this.files[0]) return;
    const url = URL.createObjectURL(this.files[0]);
    heroImg.src = url;
    heroImg.style.display = 'block';
    if (heroPlaceholder) heroPlaceholder.style.display = 'none';
    this.value = '';
  });
}

function triggerHeroUpload() {
  if (heroFileInput) heroFileInput.click();
}

function setImageElement(img, src) {
  if (!img || !src) return;
  img.src = src;
  img.style.display = 'block';

  const slot = img.closest('.photo-slot');
  if (slot) {
    const slotIcon = slot.querySelector('.slot-icon');
    const slotLabel = slot.querySelector('.slot-lbl');
    if (slotIcon) slotIcon.style.display = 'none';
    if (slotLabel) slotLabel.style.display = 'none';
  }

  img.addEventListener('click', e => {
    e.stopPropagation();
    openLightbox(src);
  });
}

function initializeInitialImages() {
  if (heroImg && heroImg.dataset.initialSrc) {
    setImageElement(heroImg, heroImg.dataset.initialSrc);
    if (heroPlaceholder) heroPlaceholder.style.display = 'none';
  }

  document.querySelectorAll('.photo-slot img').forEach(img => {
    const initialSrc = img.dataset.initialSrc;
    if (initialSrc) {
      setImageElement(img, initialSrc);
    }
  });
}

initializeInitialImages();
const translations = {
  en: {
    pageTitle: 'For Annapurna Dwarapudi💙 — My Queen, My Everything',
    heroQueenLabel: 'My Queen · My Everything',
    heroSubtitle: "A Son's Greatest Gift",
    heroHeading: 'For <span>Annapurna</span><br />My Whole World',
    heroTagline: 'To the most beautiful soul I know — every single line of this page was written with love, just for you, Amma.',
    heroNameTag: 'Annapurna Dwarapudi',
    heroPlaceholderLabel: 'Add her photo',
    scrollHint: 'Scroll',
    sectionLabelMemories: 'Her Beautiful Journey',
    sectionTitleMemories: 'Moments That Made <em>Us</em>',
    slotLbl: 'Add Photo',
    slotCaption1: 'Her Smile',
    slotCaption2: 'Our Moments',
    slotCaption3: 'Her Joy',
    slotCaption4: 'Our Family',
    slotCaption5: 'Her Strength',
    galleryNote: '📷 Click any frame to add a photo — they stay just for this session',
    messageText: 'You raised <strong>two sons</strong> on your own, and never once let us feel the weight you carried. Every meal you cooked, every sacrifice you made, every sleepless night you spent — you gave it all <strong>without asking for anything in return.</strong><br /><br />You are not just a mother, Amma. You are our <strong>strength, our home, and our greatest hero.</strong> Watching you face life with grace, with courage, and with an unbreakable smile has been the most powerful lesson of my life.<br /><br />This page is my small way of saying what words alone can never fully capture &mdash; <strong>Thank you, Annapurna. I am so incredibly proud and blessed to be your son, Naveen.</strong>',
    sectionLabelQualities: 'What She Means To Us',
    sectionTitleQualities: 'Her <em>Superpowers</em>',
    quality1Title: 'Unbreakable Strength',
    quality1Desc: 'She faced every storm alone and never once let it break her smile. Her resilience is our foundation.',
    quality2Title: 'Endless Love',
    quality2Desc: 'Her heart has no limits — she gave us everything she had and more, every single day without fail.',
    quality3Title: 'Our North Star',
    quality3Desc: 'In every confusing moment, in every dark road, she was always the light that showed us the way forward.',
    quality4Title: 'Our Protector',
    quality4Desc: 'She shielded us from pain we never even knew existed, carrying our burdens so we could carry our dreams.',
    quality5Title: 'Graceful & Kind',
    quality5Desc: 'Even under immense pressure, her grace never wavered. Her kindness toward others is truly rare beauty.',
    quality6Title: 'Our Greatest Teacher',
    quality6Desc: 'Everything good in us — every value, every virtue — she planted it with patience, love, and quiet wisdom.',
    sectionLabelJourney: 'The Story of a Queen',
    sectionTitleJourney: 'Her <em>Journey</em>',
    timelineYear1: 'The Beginning',
    timelineTitle1: 'A Woman of Courage',
    timelineDesc1: 'She chose to face the world on her own terms — with dignity, with grace, and with an unwavering spirit that inspired everyone around her.',
    timelineYear2: 'The Journey',
    timelineTitle2: 'Raising Two Sons Alone',
    timelineDesc2: 'As a single mother she carried the world on her shoulders — working tirelessly, sacrificing endlessly, yet always showing up with a warm smile and open arms.',
    timelineYear3: 'Every Day',
    timelineTitle3: 'Sacrifice Without Complaint',
    timelineDesc3: 'She never once asked for credit. Every sacrifice was silent, every struggle was hidden — her only wish was to see her sons happy and whole.',
    timelineYear4: 'Today & Always',
    timelineTitle4: 'Our Forever Hero',
    timelineDesc4: 'Today her sons stand proud because of her. Everything we are, everything we will become — it all began with Annapurna Dwarapudi.',
    dedicationHeading: 'I Love You, Amma',
    dedicationSub: 'Forever & always — your proud son, Naveen',
    dedicationMessage: 'You didn\'t just raise us, Amma — <strong>you built us.</strong> Every version of us that is good, that is kind, that is strong — it came from you. <strong>Annapurna Dwarapudi</strong>, you are our queen, our universe, and our greatest blessing. 🌸',
    signature: '— Made with all my love, Naveen Dwarapudi 💛',
    footerName: 'For Annapurna Dwarapudi — Our Queen',
    footerCopy: '&copy; <span id="year"></span> Naveen Dwarapudi. Made with &hearts; for the woman who gave us everything. All rights reserved.',
  },
  te: {
    pageTitle: 'అన్నపూర్ణ ద్వారపూడి కోసం💙 — నా రాణి, నా అంతా',
    heroQueenLabel: 'నా రాణి · నా అంతా',
    heroSubtitle: 'కొడుక ఇచ్చిన గొప్ప బహుమతి',
    heroHeading: '<span>అన్నపూర్ణకు</span><br />నా సంపూర్ణ ప్రపంచం',
    heroTagline: 'నాకు తెలిసిన అదృశ్యమైన మాతృఆత్మకి — ఈ పేజీని ప్రేమతో, నీకోసమే రాశాను, అమ్మ.',
    heroNameTag: 'అన్నపూర్ణ ద్వారపూడి',
    heroPlaceholderLabel: 'ఆమె ఫోటో జోడించండి',
    scrollHint: 'స్క్రోల్ చేయండి',
    sectionLabelMemories: 'ఆమె అందమైన ప్రయాణం',
    sectionTitleMemories: 'మమ్మల్ని నిర్మించిన <em>క్షణాలు</em>',
    slotLbl: 'ఫోటో జోడించండి',
    slotCaption1: 'ఆమె నవ్వు',
    slotCaption2: 'మన క్షణాలు',
    slotCaption3: 'ఆమె ఆనందం',
    slotCaption4: 'మన కుటుంబం',
    slotCaption5: 'ఆమె శక్తి',
    galleryNote: '📷 ఏ ఫ్రేమ్ క్లిక్ చేయండి, ఫోటో జోడించండి — ఇవి ఈ సెషన్‌లోనే నిలుస్తాయి',
    messageText: 'మీరు <strong>రెండు కొడుకులను</strong> ఒంటరిగా పెంచారు, మరియు మీరు తీసుకున్న భారాన్ని మాకు ఎప్పుడూ అనిపించలేదు. మీరు అన్నివేళలా వండిన ప్రతి భోజనం, మీరు చేసిన ప్రతి త్యాగం, మీరు గడిపిన ప్రతి నిద్రలేకపోయే రాత్రి — ఇవన్నీ మీరు ఇచ్చారు <strong>ఏమీ తిరిగి కోరలేదు.</strong><br /><br />మీరు కేవలం తల్లి కాదు, అమ్మ. మీరు మా <strong>బలం, మా ఇల్లు, మా గొప్ప వీరత</strong>. మీరు సౌమ్యత, ధైర్యం మరియు అసమాధాన చిరునవ్వుతో జీవించడం చూస్తూ నేను జీవితం లోనే బలమైన పాఠం నేర్చుకున్నాను.<br /><br />ఈ పేజీ మీకు నా చిన్న ప్రయత్నమే, ఇది మాటలే చెప్పలేనివి చెప్పడానికి.<br /><strong>ధన్యవాదాలు, అన్నపూర్ణ. నేను నీ కొడుకు నవీన్, నాతో చాలా గర్వంగా, ఆశీర్వదింపుగా ఉన్నాను.</strong>',
    sectionLabelQualities: 'ఆమె మనకు ఏమిటో',
    sectionTitleQualities: 'ఆమె యొక్క <em>సూపర్‌పవర్స్</em>',
    quality1Title: 'తొడగని బలం',
    quality1Desc: 'ఆమె ప్రతి తుఫాను ఒంటరిగా ఎదుర్కొంది, ఆమె చిరునవ్వు ఎప్పుడూ మా ముందే నిలిచింది. ఆమె స్థిరత్వమే మా బలమైన పునాది.',
    quality2Title: 'అపార ప్రేమ',
    quality2Desc: 'ఆమె హృదయం పరిమితులు తెలియదు — ప్రతి రోజు, ఒక్కసారైనా తగ్గకుండా, ఆమె మాకు ఉన్నన్నీ ఇచ్చింది.',
    quality3Title: 'మా ఉత్తర నక్షత్రం',
    quality3Desc: 'ప్రతి అయోమయ సమయంలో, ప్రతి చీకటి మార్గంలో, ఆమె వెలుగు మాకు దారి చూపించింది.',
    quality4Title: 'మా రక్షకుడు',
    quality4Desc: 'మాకు తెలియనిది కూడా బాధల నుంచి ఆమె రక్షించింది, మా కలలను నెరవేర్చడానికి భారం తీసుకుని నడిచింది.',
    quality5Title: 'అలంకారమైన &amp; దయగల',
    quality5Desc: 'గొప్ప ఒత్తిడిలో కూడా ఆమె సొగసు కొద్దీ పడలేదు. ఇతరుల పట్ల ఆమె దయ సాహిత్యమైన అందం.',
    quality6Title: 'మా గొప్ప గురువు',
    quality6Desc: 'మా లోని ప్రతి మంచి, ప్రతి విలువ, ప్రతి గొప్ప ఉపకారం — ఆమె సహనంతో, ప్రేమతో, నిశ్శబ్ద జ్ఞానంతో నాటింది.',
    sectionLabelJourney: 'ఒక రాణి కథ',
    sectionTitleJourney: 'ఆమె <em>ప్రయాణం</em>',
    timelineYear1: 'ప్రారంభం',
    timelineTitle1: 'ధైర్యవంతురాలు',
    timelineDesc1: 'ఆమె తన నిబంధనలతో ప్రపంచాన్ని ఎదుర్కొన్నది — గౌరవంతో, సౌమ్యత్వంతో, చుట్టుపక్కల వారందరికి ప్రేరణగా నిలిచే ఆత్మతో.',
    timelineYear2: 'ప్రయాణం',
    timelineTitle2: 'రెండు కుమారులను ఒంటరిగా పెంచటం',
    timelineDesc2: 'ఒక ఒంటరి తల్లి లాగా ఆమె ప్రపంచాన్ని భుజాలపై మోస్తూ నడిచింది — అలసినట్టే లేకుండా పని చేసి, మరుపులేని త్యాగంతో, చిరునవ్వుతో మాకు వచ్చేసింది.',
    timelineYear3: 'ప్రతి రోజు',
    timelineTitle3: 'అయ్యోచనలేని త్యాగం',
    timelineDesc3: 'ఆమె ఒకసారి కూడా గుర్తింపు కోరలేదు. ప్రతి త్యాగం మౌనంగా, ప్రతి పోరాటం దాచిపెట్టినది — ఆమె ఏకైక కోరిక: తన కుమారులు సంతోషంగా, సంపూర్ణంగా ఉండాలి.',
    timelineYear4: 'ఈరోజు &amp; ఎల్లప్పుడూ',
    timelineTitle4: 'మా శాశ్వత వీరుడు',
    timelineDesc4: 'ఈ రోజు మా విజయానికి కారణం ఆమెనే. మనం ఉన్నది, మనం అవతలివ్వబోయేది — అన్నపూర్ణ ద్వారపూడితోనే మొదలైంది.',
    dedicationHeading: 'నిన్ను ప్రేమిస్తున్నాను, అమ్మ',
    dedicationSub: 'ఎప్పుడూ &amp; నిత్యం — నీ గర్వమైన కొడుకు, నవీన్',
    dedicationMessage: 'నువ్వు మమ్మల్ని మాత్రమే పెంచలేదు, అమ్మ — <strong>నువ్వే మమ్మల్ని నిర్మించావు.</strong> మనలో ప్రతీ మంచితనం, ప్రతీ దయ, ప్రతీ బలం — అది నీ ఇచ్చింది. <strong>అన్నపూర్ణ ద్వారపూడి</strong>, నువ్వే మా రాణి, మా విశ్వం, మా గొప్ప ఆశీర్వాదం. 🌸',
    signature: '— నా అన్ని ప్రేమతో, నవీన్ ద్వారపూడి 💛',
    footerName: 'అన్నపూర్ణ ద్వారపూడి కోసం — మన రాణి',
    footerCopy: '&copy; <span id="year"></span> నవీన్ ద్వారపూడి. మనకు అన్నీ ఇచ్చిన అమ్మకు ప్రేమతో తయారుచేసింది. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.',
  },
};

function translatePage(lang) {
  const elements = document.querySelectorAll('[data-i18n-key]');
  elements.forEach(el => {
    const key = el.dataset.i18nKey;
    const translation = translations[lang]?.[key];
    if (!translation) return;
    el.innerHTML = translation;
  });

  document.documentElement.lang = lang;
  document.title = translations[lang]?.pageTitle || document.title;
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  localStorage.setItem('selectedLanguage', lang);
}

function setupLanguageSwitch() {
  document.querySelectorAll('.lang-option').forEach(button => {
    button.addEventListener('click', () => {
      const lang = button.dataset.lang;
      translatePage(lang);
    });
  });
}

setupLanguageSwitch();
const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
translatePage(savedLanguage);
/* ── 6. GRID PHOTO UPLOAD + LIGHTBOX ── */
let activeSlot = null;
const gridFileInput = document.getElementById('gridFileInput');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function triggerUpload(slot) {
  activeSlot = slot;
  if (gridFileInput) gridFileInput.click();
}

if (gridFileInput) {
  gridFileInput.addEventListener('change', function () {
    if (!this.files[0] || !activeSlot) return;
    const url = URL.createObjectURL(this.files[0]);
    const img = activeSlot.querySelector('img');
    if (img) {
      img.src = url;
      img.style.display = 'block';
      activeSlot.querySelector('.slot-icon').style.display = 'none';
      activeSlot.querySelector('.slot-lbl').style.display = 'none';
      /* clicking uploaded photo opens lightbox */
      img.addEventListener('click', e => {
        e.stopPropagation();
        openLightbox(url);
      });
    }
    this.value = '';
  });
}

function openLightbox(src) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

if (lightbox) {
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* ── 7. PARALLAX ON HERO GLOW ── */
const heroGlow = document.querySelector('.hero-glow');
document.addEventListener('mousemove', e => {
  if (!heroGlow) return;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  heroGlow.style.transform = `translate(calc(-50% + ${dx * 22}px), calc(-50% + ${dy * 22}px))`;
});

/* ── 8. SMOOTH ACTIVE NAV HIGHLIGHT ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => sectionObserver.observe(s));

/* ── 9. QUALITY CARDS STAGGER ── */
const qualityCards = document.querySelectorAll('.quality-card');
qualityCards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.08}s`;
});

/* ── 10. TITLE TYPEWRITER on "I Love You, Amma" ── */
function typeWriter(el, text, speed = 80) {
  let i = 0;
  el.textContent = '';
  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

const dedicationTitle = document.querySelector('.dedication h2');
if (dedicationTitle) {
  const original = dedicationTitle.textContent.trim();
  const dedObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        typeWriter(dedicationTitle, original, 75);
        dedObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  dedObs.observe(dedicationTitle);
}

/* ── 11. SCROLL-TRIGGERED COUNTER for years (future use) ── */
function animateNumber(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start);
  }, 16);
}

/* ── 12. CROWN TILT on device orientation (mobile) ── */
window.addEventListener('deviceorientation', e => {
  const crown = document.querySelector('.crown-above');
  if (!crown) return;
  const tilt = Math.max(-20, Math.min(20, e.gamma || 0));
  crown.style.transform = `rotate(${tilt * 0.3}deg) translateY(${Math.sin(Date.now() / 800) * 8}px)`;
});

/* ── 13. FOOTER YEAR ── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
