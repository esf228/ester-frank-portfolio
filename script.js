/* ─── Background stars ──────────────────────────── */
window.addEventListener('load', function () {
  const container = document.getElementById('bg-stars');
  const COUNT   = 70;
  const PAD     = 28; // px buffer around each content box
  const contactWrap = document.getElementById('contact-wrap');

  // Collect bounding boxes of all content elements, excluding contact section
  const avoidRects = Array.from(document.querySelectorAll(
    'nav, .hero-content, .about-card, .xp-body, .win-bar, ' +
    '.skill-card, .proj-card, .blog-card, .section-title, .section-tag'
  ))
  .filter(el => !contactWrap || !contactWrap.contains(el))
  .map(el => {
    const r = el.getBoundingClientRect();
    return {
      top:    r.top    + window.scrollY - PAD,
      left:   r.left   + window.scrollX - PAD,
      bottom: r.bottom + window.scrollY + PAD,
      right:  r.right  + window.scrollX + PAD,
    };
  });

  const pageH = document.documentElement.scrollHeight;
  const pageW = window.innerWidth;

  function isClear(x, y) {
    return !avoidRects.some(r => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom);
  }

  let placed = 0, attempts = 0;
  while (placed < COUNT && attempts < COUNT * 40) {
    attempts++;
    const xPct = Math.random() * 100;
    const yPct = Math.random() * 100;
    if (!isClear((xPct / 100) * pageW, (yPct / 100) * pageH)) continue;

    const s = document.createElement('div');
    s.className = 'bg-star';
    const size = (Math.random() * 8 + 8).toFixed(1);
    const dur  = (Math.random() * 3 + 2).toFixed(2);
    const del  = (Math.random() * 5).toFixed(2);
    const op   = (Math.random() * 0.35 + 0.4).toFixed(2);
    s.style.cssText = `top:${yPct}%;left:${xPct}%;--size:${size}px;--dur:${dur}s;--delay:${del}s;--max-op:${op};`;
    s.textContent = '✦';
    container.appendChild(s);
    placed++;
  }
});

/* ─── Custom cursor ─────────────────────────────── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animCursor() {
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

/* ─── Parallax scroll ───────────────────────────── */
const cloudLayer1 = document.getElementById('cloud-layer-1');
const cloudLayer2 = document.getElementById('cloud-layer-2');
const cloudLayer3 = document.getElementById('cloud-layer-3');
const moon        = document.getElementById('moon');
const navbar      = document.getElementById('navbar');
const backTop     = document.getElementById('back-top');

function onScroll() {
  const sy = window.scrollY;

  // Clouds drift upward at different speeds — back=slow, front=fast
  // Returning to top brings them smoothly back down (transform resets to 0)
  cloudLayer1.style.transform = `translateY(${-sy * 0.25}px)`;
  cloudLayer2.style.transform = `translateY(${-sy * 0.45}px)`;
  cloudLayer3.style.transform = `translateY(${-sy * 0.65}px)`;
  moon.style.transform        = `translateY(${-sy * 0.18}px)`;

  // Nav opacity change after scrolling past hero
  navbar.classList.toggle('scrolled', sy > 60);

  // Back-to-top button visibility
  backTop.classList.toggle('visible', sy > 400);
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ─── Scroll reveal ─────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const w = bar.dataset.width;
        if (w) setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
    } else {
      entry.target.classList.remove('visible');
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = '0';
      });
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Also watch skill cards directly so bars animate even if the card
// itself isn't a .reveal element
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        const w = bar.dataset.width;
        if (w) setTimeout(() => { bar.style.width = w + '%'; }, 300);
      });
    } else {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = '0';
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

/* ─── Resume modal ──────────────────────────────── */
const resumeModal   = document.getElementById('resume-modal');
const resumeClose   = document.getElementById('resume-close');
const resumeTrigger = document.getElementById('resume-trigger');
const navResume     = document.getElementById('nav-resume-trigger');

function openResume(e) {
  e.preventDefault();
  resumeModal.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeResume() {
  resumeModal.hidden = true;
  document.body.style.overflow = '';
}

resumeTrigger.addEventListener('click', openResume);
navResume.addEventListener('click', openResume);
resumeClose.addEventListener('click', closeResume);
resumeModal.addEventListener('click', e => { if (e.target === resumeModal) closeResume(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeResume(); });

/* ─── Project filter ────────────────────────────── */
function filterProjects(btn, cat) {
  document.querySelectorAll('.proj-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.proj-card').forEach(card => {
    const show = cat === 'all' || card.dataset.cat === cat;
    card.style.opacity       = show ? '1'      : '0.25';
    card.style.pointerEvents = show ? ''       : 'none';
    card.style.transform     = show ? ''       : 'scale(0.97)';
    card.style.transition    = 'opacity 0.3s, transform 0.3s';
  });
}
