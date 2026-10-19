// snippet: lenis-gsap-setup.js
// Base de scroll suave "pro" que NO se siente trabado. Ver /motion/scroll-inmersivo.md
// Requiere: gsap + ScrollTrigger + lenis (idealmente vendorizados en /vendor).

(function () {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !window.gsap || !window.Lenis) return; // página estática completa

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    lerp: 0.09,          // 0.07–0.1 = premium
    smoothWheel: true,
    syncTouch: false,    // mobile: inercia nativa del dedo (clave para que no se trabe)
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000)); // un solo RAF para todo
  gsap.ticker.lagSmoothing(0);

  // Atmósfera: cada [data-theme] repinta la página al entrar
  const THEMES = {
    light: { bg: '#f7f6f3', fg: '#0a0a0a', accent: '#1c3fff' },
    dark:  { bg: '#070707', fg: '#f2f2f2', accent: '#E6B325' },
  };
  const meta = document.querySelector('meta[name="theme-color"]');
  const setTheme = (name) => {
    const t = THEMES[name]; if (!t) return;
    gsap.to(root, { '--bg': t.bg, '--fg': t.fg, '--accent': t.accent, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
    if (meta) meta.content = t.bg;
  };
  document.querySelectorAll('[data-theme]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el, start: 'top 55%', end: 'bottom 55%',
      onEnter: () => setTheme(el.dataset.theme),
      onEnterBack: () => setTheme(el.dataset.theme),
    });
  });

  // Marquee que reacciona a la velocidad y dirección del scroll
  const track = document.querySelector('.marquee-track');
  if (track) {
    const loop = gsap.to(track, { xPercent: -50, duration: 30, ease: 'none', repeat: -1 });
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        const dir = self.direction < 0 ? -1 : 1;
        gsap.to(loop, { timeScale: dir * Math.max(1, Math.abs(self.getVelocity() / 300)), duration: 0.3, overwrite: true,
          onComplete: () => gsap.to(loop, { timeScale: dir, duration: 1.2 }) });
      },
    });
  }

  window.lenis = lenis;
})();
