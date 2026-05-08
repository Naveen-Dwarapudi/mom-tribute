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
    cursor.style.top  = mouseY + 'px';
  }
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  if (follower) {
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .photo-slot, .quality-card, .photo-placeholder').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor)   cursor.style.transform   = 'translate(-50%,-50%) scale(1.8)';
    if (follower) follower.style.width = follower.style.height = '54px';
  });
  el.addEventListener('mouseleave', () => {
    if (cursor)   cursor.style.transform   = 'translate(-50%,-50%) scale(1)';
    if (follower) follower.style.width = follower.style.height = '36px';
  });
});

/* ── 3. PARTICLE CANVAS ── */
const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

/* Sparkle particles */
const SPARKLE_COUNT = 65;
const sparkles = Array.from({ length: SPARKLE_COUNT }, () => ({
  x:          Math.random() * window.innerWidth,
  y:          Math.random() * window.innerHeight,
  r:          Math.random() * 2.2 + 0.5,
  phase:      Math.random() * Math.PI * 2,
  phaseSpeed: Math.random() * 0.02 + 0.008,
  speedX:     (Math.random() - 0.5) * 0.22,
  speedY:     (Math.random() - 0.5) * 0.16,
  hue:        Math.random() > 0.5 ? '80,160,220' : '160,210,245',
}));

/* Floating emoji petals */
const PETAL_EMOJIS = ['🌸','💙','✨','🌼','💫','⭐','🌺','❄️'];
const PETAL_COUNT  = 32;
const petals = Array.from({ length: PETAL_COUNT }, () => ({
  x:         Math.random() * window.innerWidth,
  y:         Math.random() * window.innerHeight,
  size:      Math.random() * 14 + 7,
  speedY:    Math.random() * 0.55 + 0.2,
  speedX:    (Math.random() - 0.5) * 0.45,
  sway:      Math.random() * Math.PI * 2,
  swaySpeed: Math.random() * 0.013 + 0.004,
  opacity:   Math.random() * 0.45 + 0.15,
  emoji:     PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)],
  rotation:  Math.random() * Math.PI * 2,
  rotSpeed:  (Math.random() - 0.5) * 0.025,
}));

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* sparkles */
  sparkles.forEach(s => {
    s.phase  += s.phaseSpeed;
    s.x      += s.speedX;
    s.y      += s.speedY;
    if (s.x < 0) s.x = canvas.width;
    if (s.x > canvas.width)  s.x = 0;
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
    p.sway     += p.swaySpeed;
    p.y        += p.speedY;
    p.x        += p.speedX + Math.sin(p.sway) * 0.4;
    p.rotation += p.rotSpeed;

    if (p.y > window.innerHeight + 24) { p.y = -24; p.x = Math.random() * window.innerWidth; }
    if (p.x < -24) p.x = window.innerWidth + 24;
    if (p.x > window.innerWidth + 24) p.x = -24;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.font        = `${p.size}px serif`;
    ctx.textAlign   = 'center';
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
const heroFileInput   = document.getElementById('heroFileInput');
const heroImg         = document.getElementById('heroImg');
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

/* ── 6. GRID PHOTO UPLOAD + LIGHTBOX ── */
let activeSlot = null;
const gridFileInput = document.getElementById('gridFileInput');
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');

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
      activeSlot.querySelector('.slot-lbl').style.display  = 'none';
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
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  heroGlow.style.transform = `translate(calc(-50% + ${dx * 22}px), calc(-50% + ${dy * 22}px))`;
});

/* ── 8. SMOOTH ACTIVE NAV HIGHLIGHT ── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

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
  crown.style.transform = `rotate(${tilt * 0.3}deg) translateY(${Math.sin(Date.now()/800)*8}px)`;
});

/* ── 13. FOOTER YEAR ── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
