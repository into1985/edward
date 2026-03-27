/* ============================================================
   EDWARDI JUUKSESTUUDIO — Premium Interaktsioonid
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== CUSTOM CURSOR ===== */
  const cursor    = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor-dot');

  if (cursor && cursorDot) {
    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top  = my + 'px';
    });

    (function tick() {
      cx += (mx - cx) * 0.14;
      cy += (my - cy) * 0.14;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
      requestAnimationFrame(tick);
    })();

    document.querySelectorAll('a, button, .team-card, .gallery-thumb, .service-row, .ge-item, .team-profile').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
  }

  /* ===== SCROLL PROGRESS + NAV STATE ===== */
  const progress = document.querySelector('.scroll-progress');
  const nav      = document.querySelector('.nav');

  const onScroll = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ===== MOBILE MENU ===== */
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ===== ACTIVE NAV LINK ===== */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === currentFile ||
       (currentFile === '' && a.getAttribute('href') === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ===== GALLERY DRAG SCROLL ===== */
  document.querySelectorAll('.gallery-track').forEach(track => {
    let isDown = false, startX, scrollLeft;
    track.addEventListener('mousedown', e => {
      isDown = true;
      track.classList.add('dragging');
      startX     = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => { isDown = false; track.classList.remove('dragging'); });
    track.addEventListener('mouseup',    () => { isDown = false; track.classList.remove('dragging'); });
    track.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      track.scrollLeft = scrollLeft - (e.pageX - track.offsetLeft - startX) * 1.6;
    });

    // Center the gallery so partial items show on both sides on narrow screens
    const initGalleryScroll = () => {
      if (!track || track.scrollWidth === undefined) return;
      if (track.scrollWidth > track.clientWidth + 10) {
        const thumbs = track.querySelectorAll('.gallery-thumb');
        if (thumbs && thumbs.length >= 3) {
          const mid = thumbs[Math.floor(thumbs.length / 2)];
          if (mid && mid.offsetLeft !== undefined) {
            track.scrollLeft = mid.offsetLeft - (track.clientWidth - mid.offsetWidth) / 2;
          }
        }
      }
    };
    // Run after layout is ready
    if (document.readyState === 'complete') {
      initGalleryScroll();
    } else {
      window.addEventListener('load', initGalleryScroll, { once: true });
    }
  });

  /* ===== GALLERY FILTER ===== */
  const gnavItems = document.querySelectorAll('.gnav-item');
  const geItems   = document.querySelectorAll('.ge-item');
  gnavItems.forEach(btn => {
    btn.addEventListener('click', () => {
      gnavItems.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      geItems.forEach(item => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ===== FOOTER SPOTLIGHT ===== */
  const footerEl = document.querySelector('.footer');
  if (footerEl) {
    let fx = 35, fy = 55, tx = 35, ty = 55;
    footerEl.addEventListener('mousemove', e => {
      const r = footerEl.getBoundingClientRect();
      if (r && r.width > 0 && r.height > 0) {
        tx = ((e.clientX - r.left) / r.width)  * 100;
        ty = ((e.clientY - r.top)  / r.height) * 100;
      }
    });
    footerEl.addEventListener('mouseleave', () => { tx = 35; ty = 55; });
    (function tickFooter() {
      fx += (tx - fx) * 0.055;
      fy += (ty - fy) * 0.055;
      if (footerEl) {
        footerEl.style.setProperty('--fmx', fx.toFixed(2) + '%');
        footerEl.style.setProperty('--fmy', fy.toFixed(2) + '%');
      }
      requestAnimationFrame(tickFooter);
    })();
  }

  /* ===== CONTACT FORM ===== */
  const form = document.querySelector('.booking-form-el');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn  = form.querySelector('.form-submit');
      const orig = btn.textContent;
      
      // Collect form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      // Validate required fields
      if (!data.fname || !data.email || !data.message) {
        alert('Palun täida kõik kohustuslikud väljad.');
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        alert('Palun sisesta kehtiv e-posti aadress.');
        return;
      }
      
      try {
        btn.textContent   = 'Saadame...';
        btn.style.opacity = '0.7';
        btn.disabled = true;
        
        // Send to Formspree (free form backend service)
        const response = await fetch('https://formspree.io/f/xvgzbjel', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: formData
        });
        
        if (response.ok) {
          btn.textContent   = 'Saadetud ✓';
          btn.style.background = 'var(--terracotta)';
          form.reset();
          setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = '';
            btn.style.opacity = '1';
            btn.disabled = false;
          }, 3500);
        } else {
          throw new Error('Viga saatmisel');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        alert('Midagi läks valesti. Palun proovi hiljem uuesti või kirjuta meile otse: hei@stuudioedward.ee');
        btn.textContent = orig;
        btn.style.opacity = '1';
        btn.disabled = false;
      }
    });
  }

  /* ============================================================
     GSAP PREMIUM ANIMATSIOONID
     ============================================================ */
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right').forEach(el => {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
     1. MAGNEETILISED NUPUD
     ───────────────────────────────────────────── */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn-dark, .btn-outline, .nav-cta').forEach(btn => {
      if (btn.closest('.mobile-menu')) return;
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - r.left - r.width  / 2) * 0.28,
          y: (e.clientY - r.top  - r.height / 2) * 0.28,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  const aboutBadge = document.querySelector('.about-badge');
  if (aboutBadge) {
    aboutBadge.addEventListener('mousemove', e => {
      const r = aboutBadge.getBoundingClientRect();
      gsap.to(aboutBadge, {
        x: (e.clientX - r.left - r.width  / 2) * 0.28,
        y: (e.clientY - r.top  - r.height / 2) * 0.28,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
    aboutBadge.addEventListener('mouseleave', () => {
      gsap.to(aboutBadge, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    });
  }

  const footerLogo = document.querySelector('.footer-logo');
  if (footerLogo) {
    const logoImg = footerLogo.querySelector('.footer-logo-img');
    footerLogo.addEventListener('mousemove', e => {
      const r = footerLogo.getBoundingClientRect();
      gsap.to(logoImg, {
        x: (e.clientX - r.left - r.width  / 2) * 0.3,
        y: (e.clientY - r.top  - r.height / 2) * 0.3,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
    footerLogo.addEventListener('mouseleave', () => {
      gsap.to(logoImg, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    });
  }

  /* ─────────────────────────────────────────────
     2. HERO — maskeeritud tekst real-haaval + foto kardin
     ───────────────────────────────────────────── */
  const heroLines = document.querySelectorAll('.hero-headline .line');
  if (heroLines.length) {
    const tl = gsap.timeline({ delay: 0.12 });

    tl.fromTo(heroLines,
        { yPercent: 110 },
        { yPercent: 0, duration: 1.15, stagger: 0.13, ease: 'expo.out' }
      )
      .fromTo('.hero-label',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
        0.18
      )
      .fromTo('.hero-actions .btn',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
        0.62
      )
      // Foto: kardin alt üles + sisemine pilt suuremalt normaalsuurusele
      .fromTo('.hero-photo-wrap',
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 1.35, ease: 'expo.out' },
        0.35
      )
      .from('.hero-photo-wrap .photo',
        { scale: 1.13, duration: 1.9, ease: 'power3.out' },
        0.35
      )
      .fromTo('.hero-watermark',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        0.75
      );
  }

  /* ─────────────────────────────────────────────
     3. DEKORATIIVJOONED — joonistuvad vasakult paremale
     ───────────────────────────────────────────── */
  gsap.utils.toArray('.section-label-line, .hero-label-line').forEach(line => {
    gsap.fromTo(line,
      { scaleX: 0 },
      {
        scaleX: 1,
        transformOrigin: 'left',
        duration: 0.95,
        ease: 'expo.out',
        scrollTrigger: { trigger: line, start: 'top 90%', once: true }
      }
    );
  });

  /* ─────────────────────────────────────────────
     4. SEKTSIOONIDE PEALKIRJAD — slide up + fade
     ───────────────────────────────────────────── */
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.fromTo(el,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  /* ─────────────────────────────────────────────
     5. ABOUT — foto kardin + parallaks + badge pop
     ───────────────────────────────────────────── */
  const aboutWrap = document.querySelector('.about-photo-wrap');
  if (aboutWrap) {
    // Foto kardin ülevalt alla avaneb
    gsap.fromTo(aboutWrap,
      { clipPath: 'inset(0 0 100% 0)' },
      {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: aboutWrap, start: 'top 80%', once: true }
      }
    );
    // Foto ise scale-in samal ajal
    gsap.from(aboutWrap.querySelector('.photo'), {
      scale: 1.14,
      duration: 1.9, ease: 'power3.out',
      scrollTrigger: { trigger: aboutWrap, start: 'top 80%', once: true }
    });
    // Parallaks scrollimisel
    gsap.to(aboutWrap.querySelector('.photo'), {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: aboutWrap,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      }
    });
    // Badge elastne sisse-pop
    gsap.from('.about-badge', {
      scale: 0, opacity: 0,
      duration: 1.05, ease: 'back.out(1.7)',
      scrollTrigger: { trigger: aboutWrap, start: 'top 70%', once: true }
    });
  }

  // About tekst
  if (document.querySelector('.about-headline')) {
    gsap.from('.about-headline', {
      y: 42, opacity: 0,
      duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: '.about-left', start: 'top 82%', once: true }
    });
    gsap.from('.about-body', {
      y: 26, opacity: 0,
      duration: 0.9, ease: 'power3.out', delay: 0.12,
      scrollTrigger: { trigger: '.about-left', start: 'top 80%', once: true }
    });
    gsap.from('.about-left .link-arrow', {
      y: 16, opacity: 0,
      duration: 0.8, ease: 'power3.out', delay: 0.24,
      scrollTrigger: { trigger: '.about-left', start: 'top 78%', once: true }
    });
  }

  /* ─────────────────────────────────────────────
     6. TEENUS FEATURED — kardin alt üles
     ───────────────────────────────────────────── */
  const featPhoto = document.querySelector('.service-feat-photo');
  if (featPhoto) {
    const featOverlay = document.querySelector('.service-feat-overlay');
    gsap.fromTo([featPhoto, featOverlay],
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.3, ease: 'expo.out',
        scrollTrigger: { trigger: '.service-featured', start: 'top 78%', once: true }
      }
    );
    gsap.from('.service-feat-content > *:not(.service-feat-extra)', {
      y: 22, opacity: 0,
      stagger: 0.1, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.service-featured', start: 'top 70%', once: true }
    });
  }

  /* ─────────────────────────────────────────────
     7. TEENUSTE READ — vasakult sisse + õhuke punane
     ───────────────────────────────────────────── */
  gsap.utils.toArray('.service-row').forEach((row, i) => {
    gsap.from(row, {
      opacity: 0, x: -28,
      duration: 0.75, delay: i * 0.09,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.services-list', start: 'top 82%', once: true }
    });
  });

  /* ─────────────────────────────────────────────
     8. MEISTRITE KAARDID — scale + stagger
     ───────────────────────────────────────────── */
  const teamCards = document.querySelectorAll('.team-card');
  if (teamCards.length) {
    gsap.from(teamCards, {
      opacity: 0, y: 65, scale: 0.95,
      stagger: 0.15, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: '.team-grid', start: 'top 80%', once: true }
    });
  }

  /* ─────────────────────────────────────────────
     9. GALERII STRIP — vahelduv Y + kardin per pilt
     ───────────────────────────────────────────── */
  gsap.utils.toArray('.gallery-thumb').forEach((thumb, i) => {
    // Kardin efekt igal pildil
    gsap.fromTo(thumb,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.0,
        delay: i * 0.14,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.gallery-strip', start: 'top 82%', once: true }
      }
    );
    // Parallaks: iga teine pilt liigub veidi erineva kiirusega
    gsap.to(thumb.querySelector('.photo'), {
      yPercent: i % 2 === 0 ? -8 : -4,
      ease: 'none',
      scrollTrigger: {
        trigger: '.gallery-strip',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2.5
      }
    });
  });

  /* ─────────────────────────────────────────────
     10. QUOTE — elegantne reveal
     ───────────────────────────────────────────── */
  const quoteText = document.querySelector('.quote-text');
  if (quoteText) {
    gsap.from(quoteText, {
      y: 55, opacity: 0,
      duration: 1.3, ease: 'expo.out',
      scrollTrigger: { trigger: '.quote-section', start: 'top 74%', once: true }
    });
    gsap.from('.quote-author', {
      opacity: 0, duration: 1.0, ease: 'power2.out', delay: 0.45,
      scrollTrigger: { trigger: '.quote-section', start: 'top 74%', once: true }
    });
    // Kaks CTA nuppu liiguvad üksteisega vastu
    gsap.from('.quote-cta-a', {
      y: -28, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.6,
      scrollTrigger: { trigger: '.quote-ctas', start: 'top 84%', once: true }
    });
    gsap.from('.quote-cta-b', {
      y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.75,
      scrollTrigger: { trigger: '.quote-ctas', start: 'top 84%', once: true }
    });
  }

  /* ─────────────────────────────────────────────
     11. LEHTEDE HERO (alamlehed) — maskeeritud tiitel
     ───────────────────────────────────────────── */
  const pageTitle = document.querySelector('.page-hero-title');
  if (pageTitle) {
    gsap.fromTo(pageTitle,
      { yPercent: 28, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.2 }
    );
    gsap.fromTo('.page-hero-sub',
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', delay: 0.4 }
    );
  }

  /* ─────────────────────────────────────────────
     12. EDITORIAL GALERII — reas stagger
     ───────────────────────────────────────────── */
  gsap.utils.toArray('.ge-item').forEach((item, i) => {
    gsap.from(item, {
      opacity: 0, y: 40,
      duration: 0.95,
      delay: (i % 4) * 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 90%', once: true }
    });
  });

  /* ─────────────────────────────────────────────
     13. GALERII LEHT — kardin per pilt + parallaks
     ───────────────────────────────────────────── */
  gsap.utils.toArray('.gc-item').forEach((item) => {
    gsap.fromTo(item,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: item, start: 'top 88%', once: true }
      }
    );
    const photo = item.querySelector('.gc-photo');
    if (photo) {
      gsap.to(photo, {
        yPercent: -7,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2.2
        }
      });
    }
  });

  /* ─────────────────────────────────────────────
     14. MEESKONNA LEHT — foto kardin + info stagger
     ───────────────────────────────────────────── */
  gsap.utils.toArray('.team-profile-photo').forEach((wrap, i) => {
    gsap.fromTo(wrap,
      { clipPath: 'inset(0 0 100% 0)' },
      {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: wrap, start: 'top 88%', once: true }
      }
    );
    gsap.from(wrap.querySelector('.photo'), {
      scale: 1.1, duration: 1.9, ease: 'power3.out',
      scrollTrigger: { trigger: wrap, start: 'top 88%', once: true }
    });
  });

  gsap.utils.toArray('.team-profile-info').forEach((info, i) => {
    gsap.from(info.children, {
      y: 32, opacity: 0,
      stagger: 0.1, duration: 0.85, delay: 0.25, ease: 'power3.out',
      scrollTrigger: { trigger: info, start: 'top 84%', once: true }
    });
  });

  /* ─────────────────────────────────────────────
     14. TEENUSTE TABEL — rida haaval vasakult
     ───────────────────────────────────────────── */
  gsap.utils.toArray('.services-tbl tr').forEach((row, i) => {
    gsap.from(row, {
      opacity: 0, x: -22,
      duration: 0.65, delay: i * 0.05, ease: 'power3.out',
      scrollTrigger: { trigger: '.services-tbl', start: 'top 84%', once: true }
    });
  });

  /* ─────────────────────────────────────────────
     15. HERO PILT — parallaks scrollimisel + hover zoom
     ───────────────────────────────────────────── */
  const heroPhotoWrap = document.querySelector('.hero-photo-wrap');
  if (heroPhotoWrap) {
    gsap.to('.hero-photo-wrap', {
      yPercent: -14,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 2
      }
    });
    heroPhotoWrap.addEventListener('mouseenter', () => {
      const photo = heroPhotoWrap.querySelector('.photo');
      if (photo) {
        gsap.to(photo, { scale: 1.1, duration: 1.4, ease: 'power3.out', overwrite: 'auto' });
      }
    });
    heroPhotoWrap.addEventListener('mouseleave', () => {
      const photo = heroPhotoWrap.querySelector('.photo');
      if (photo) {
        gsap.to(photo, { scale: 1, duration: 1.4, ease: 'power3.out', overwrite: 'auto' });
      }
    });
  }

  /* ─────────────────────────────────────────────
     16. VORMI VÄLJAD
     ───────────────────────────────────────────── */
  gsap.utils.toArray('.form-grp').forEach((grp, i) => {
    gsap.from(grp, {
      opacity: 0, y: 18,
      duration: 0.65, delay: i * 0.07, ease: 'power3.out',
      scrollTrigger: { trigger: '.booking-form', start: 'top 80%', once: true }
    });
  });

  /* ─────────────────────────────────────────────
     17. GENERAALSED REVEALS (alamlehtede elemendid)
     ───────────────────────────────────────────── */
  gsap.utils.toArray('.reveal-up').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0,
      duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
  gsap.utils.toArray('.reveal-fade').forEach(el => {
    gsap.to(el, {
      opacity: 1, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.to(el, {
      opacity: 1, x: 0,
      duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  /* ===== LIGHTBOX ===== */
  (function () {
    const lb      = document.getElementById('lb');
    if (!lb) return;
    const stage   = document.getElementById('lb-stage');
    const closBtn = document.getElementById('lb-close');
    const prevBtn = document.getElementById('lb-prev');
    const nextBtn = document.getElementById('lb-next');
    const counter = document.getElementById('lb-counter');
    
    if (!stage || !closBtn || !prevBtn || !nextBtn) return;
    
    let items = [], cur = 0;

    function collect() {
      items = Array.from(document.querySelectorAll(
        '.gallery-thumb .photo, .gc-item .gc-photo'
      ));
    }

    function show(idx, dir) {
      cur = idx;
      const el  = items[cur];
      const cs  = window.getComputedStyle(el);
      const bgImg = cs.backgroundImage;

      const next = document.createElement('div');
      next.className = 'lb-photo';
      next.style.backgroundImage = bgImg;
      next.style.backgroundSize = 'cover';
      next.style.backgroundPosition = 'center top';
      stage.appendChild(next);

      const prev = stage.querySelector('.lb-photo:not(:last-child)');

      if (prev && dir !== 0) {
        gsap.fromTo(next,
          { x: dir > 0 ? 90 : -90, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }
        );
        gsap.to(prev, {
          x: dir > 0 ? -90 : 90, opacity: 0,
          duration: 0.38, ease: 'power3.in',
          onComplete: () => prev.remove()
        });
      } else {
        if (prev) prev.remove();
        gsap.fromTo(next,
          { scale: 0.86, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out' }
        );
      }

      prevBtn.disabled = cur === 0;
      nextBtn.disabled = cur === items.length - 1;
      if (counter) counter.textContent = (cur + 1) + ' / ' + items.length;
    }

    function open(idx) {
      collect();
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      show(idx, 0);
      requestAnimationFrame(() => lb.classList.add('open'));
    }

    function close() {
      const photo = stage.querySelector('.lb-photo');
      if (photo) gsap.to(photo, { scale: 0.88, opacity: 0, duration: 0.32, ease: 'power3.in' });
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => { stage.innerHTML = ''; }, 520);
    }

    document.addEventListener('click', e => {
      const item = e.target.closest('.gallery-thumb, .gc-item');
      if (!item) return;
      collect();
      const ph  = item.querySelector('.photo, .gc-photo');
      const idx = items.indexOf(ph);
      if (idx !== -1) open(idx);
    });

    closBtn.addEventListener('click', close);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    prevBtn.addEventListener('click', () => { if (cur > 0) show(cur - 1, -1); });
    nextBtn.addEventListener('click', () => { if (cur < items.length - 1) show(cur + 1, 1); });

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft'  && cur > 0)                show(cur - 1, -1);
      if (e.key === 'ArrowRight' && cur < items.length - 1) show(cur + 1,  1);
    });
  })();

  /* ===== ANCHOR HASH SCROLL (peale GSAP initi) ===== */
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        const navH = (document.querySelector('.nav') || {offsetHeight: 80}).offsetHeight;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }, 200);
    }
  }

  /* ===== BOOKING MODAL ===== */
  const BOOKING_URL = 'https://saloninfra.ee/booking/stuudioedward';

  const overlay = document.createElement('div');
  overlay.className = 'booking-modal-overlay';
  overlay.innerHTML = `
    <div class="booking-modal" role="dialog" aria-modal="true" aria-label="Broneeri aeg">
      <button class="booking-modal-close" aria-label="Sulge">
        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" stroke-width="1.5" stroke-linecap="round">
          <line x1="1" y1="1" x2="13" y2="13"/>
          <line x1="13" y1="1" x2="1" y2="13"/>
        </svg>
      </button>
      <div class="booking-modal-inner">
        <div class="booking-modal-header">
          <span class="booking-modal-label">Stuudio Edward</span>
          <h2 class="booking-modal-title">Broneeri aeg</h2>
        </div>
        <div class="booking-modal-cats">
          <button class="booking-cat-row" type="button" aria-label="Broneeri naistele">
            <span class="booking-cat-name">Naistele</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
          <button class="booking-cat-row" type="button" aria-label="Broneeri meestele">
            <span class="booking-cat-name">Meestele</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
          <button class="booking-cat-row" type="button" aria-label="Broneeri lastele">
            <span class="booking-cat-name">Lastele</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector('.booking-modal-close');

  function openBookingModal() {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeBookingModal);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeBookingModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeBookingModal();
  });

  // Footer CTA divider line hover animation
  document.querySelectorAll('.footer-cta-link').forEach(function(link) {
    var fill = link.parentElement.querySelector('.footer-cta-divider-fill');
    if (!fill) return;
    link.addEventListener('mouseenter', function() { fill.style.width = '100%'; });
    link.addEventListener('mouseleave', function() { fill.style.width = '0%'; });
  });

  // Intercept all "Broneeri" buttons that link to kontakt.html
  document.querySelectorAll('a.nav-cta, a.footer-cta-link, a.btn[href="kontakt.html"], a.svc-book').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      openBookingModal();
    });
  });

});
