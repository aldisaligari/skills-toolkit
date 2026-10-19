# 🧰 Skills Toolkit — Motion, Animación & Diseño Web

Colección curada de herramientas **gratuitas**, snippets de código y referencias de inspiración para aplicar cuando retomemos el portfolio (y en cualquier otro proyecto de diseño web / motion).

> Idea: cada vez que encontremos algo copado, lo sumamos acá antes de que se pierda 😅

---

## ✍️ Voz y criterios (leer primero)

Mi manifiesto, cómo repartirlo en una página y la lista de cosas que se ven "hechas por IA" y no van nunca → [`voz-y-criterios.md`](voz-y-criterios.md)

---

## 🌀 Scroll inmersivo (Lenis + GSAP)

Todo lo aprendido en el rediseño del portfolio (oct. 2026): reglas para que el scroll **no se sienta trabado**, túnel 3D, historias sticky con captions narrados, atmósfera de color por sección, velocidad del scroll como input y vista en vivo de sitios.

- 📖 Recetario completo → [`motion/scroll-inmersivo.md`](motion/scroll-inmersivo.md)
- ✂️ Setup base Lenis + GSAP (+ temas y marquee por velocidad) → [`snippets/lenis-gsap-setup.js`](snippets/lenis-gsap-setup.js)
- ✂️ "Historia sticky" lista para copiar → [`snippets/sticky-story.html`](snippets/sticky-story.html)

**TL;DR:** scroll nativo + Lenis (`lerp .09`, `syncTouch:false`), un solo RAF (ticker de GSAP), `position: sticky` en vez de `pin`, `scrub: true`, solo `transform`/`opacity`, y todo como mejora progresiva (`.motion` en `<html>`).

---

## ⭐ Emil Kowalski — referencia obligada (taste + animación de interfaces)

Design engineer, ex-Vercel. Su laburo es probablemente la mejor referencia gratuita que hay hoy de "cómo animar interfaces con criterio" (no animar por animar). Vale la pena estudiarlo en detalle antes de tocar el portfolio.

- **Skills** (18.6k ⭐) — repo con skills de diseño/animación pensadas para usar con Claude/Cursor, incluye una skill de *review de animaciones*: https://github.com/emilkowalski/skills
- **Vaul** — drawer component para React, gran referencia de gestos + spring animations: https://github.com/emilkowalski/vaul
- **Sonner** — toast component, ejemplo de micro-interacciones prolijas: https://github.com/emilkowalski/sonner
- **emilkowal.ski** — su blog, notas cortas y con mucho criterio sobre UI (ej. "CSS Transforms"): https://emilkowal.ski/
- **animations.dev** — su curso pago "Animations on the web", si en algún momento queremos invertir en aprender esto en profundidad: https://animations.dev/

---

## 🎞️ Librerías de animación (JS)

| Librería | Qué hace | Link |
|---|---|---|
| **GSAP** | El estándar de la industria para animación en JS. Timelines, ScrollTrigger, SplitText. Gratis para casi todo uso comercial. | https://gsap.com/ |
| **Motion** (ex Framer Motion) | Animaciones declarativas para React/JS, muy usada en portfolios modernos. | https://motion.dev/ |
| **Anime.js** | Liviana, API simple, ideal para animaciones puntuales sin instalar un framework entero. | https://animejs.com/ |
| **Lenis** | Smooth scroll performante, se combina muy bien con GSAP ScrollTrigger. | https://lenis.darkroom.engineering/ |
| **Rive** | Animaciones vectoriales interactivas (tipo Lottie pero más liviano/interactivo), export directo a web. | https://rive.app/ |
| **Lottie / LottieFiles** | Animaciones exportadas desde After Effects, listas para reproducir en web con JSON. | https://lottiefiles.com/ |
| **AOS (Animate On Scroll)** | Librería simple solo-CSS+JS para animar elementos al hacer scroll, cero curva de aprendizaje. | https://michalsnik.github.io/aos/ |

## 🧱 Librerías de componentes ya animados (copiar/pegar)

Ideales para no reinventar la rueda: componentes con la animación ya resuelta, se copian al proyecto y se ajustan.

- **Motion Primitives** — 100+ componentes React animados (dock, spotlight cards, glassmorphism, scroll effects), con Motion/GSAP/Three.js, open source: https://motion-primitives.com/
- **Watermelon UI** — componentes, dashboards y bloques con mucho cuidado visual; tiene registro open source gratis además del plan premium: https://ui.watermelon.sh/
- **Animate UI** — componentes animados estilo shadcn: https://animate-ui.com/

## 🎨 CSS / Scroll effects

- **Scroll-driven animations (CSS nativo)** — animar con `animation-timeline: scroll()` sin JS: https://scroll-driven-animations.style/
- **Cubic-bezier.com** — editor visual de curvas de easing: https://cubic-bezier.com/
- **Easing functions cheatsheet**: https://easings.net/
- **Animista** — generador de animaciones CSS listas para copiar/pegar: https://animista.net/
- **CSS clip-path generator** (para reveals y máscaras): https://bennettfeely.com/clippy/

---

## ✂️ Snippets reutilizables

### Scroll reveal con Intersection Observer (vanilla JS, sin librerías)

```js
// snippet: reveal-on-scroll.js
const revealEls = document.querySelectorAll('[data-reveal]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

revealEls.forEach((el) => observer.observe(el));
```

```css
/* pareja del snippet de arriba */
[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Fade-in con GSAP + ScrollTrigger

```js
// snippet: gsap-scrolltrigger-fade.js
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('.fade-in').forEach((el) => {
  gsap.from(el, {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
    },
  });
});
```

### Hover magnético (para botones/links tipo portfolio)

```js
// snippet: magnetic-hover.js
document.querySelectorAll('.magnetic').forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)';
  });
});
```

### Marquee infinito solo con CSS

```css
/* snippet: css-marquee.css */
.marquee {
  overflow: hidden;
  white-space: nowrap;
}
.marquee__track {
  display: inline-block;
  animation: marquee 18s linear infinite;
}
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```

### Smooth scroll nativo (sin librerías)

```css
/* snippet: smooth-scroll.css */
html {
  scroll-behavior: smooth;
}
```

---

## 🖼️ Inspiración de diseño

- **Awwwards** — https://www.awwwards.com/
- **Godly** — https://godly.website/
- **Land-book** — https://land-book.com/
- **SiteInspire** — https://www.siteinspire.com/
- **One Page Love** — https://onepagelove.com/
- **Mobbin** (patrones de UI mobile/web) — https://mobbin.com/
- **Typewolf** (referencias de tipografía real en uso) — https://www.typewolf.com/
- **Curated.design** — https://curated.design/

## 🔤 Fuentes gratis

- **Google Fonts** — https://fonts.google.com/
- **Fontshare** (Indian Type Foundry, muy prolijas) — https://www.fontshare.com/
- **Font Squirrel** — https://www.fontsquirrel.com/

## 🧩 Iconos e ilustraciones

- **Lucide Icons** — https://lucide.dev/
- **Phosphor Icons** — https://phosphoricons.com/
- **Tabler Icons** — https://tabler.io/icons
- **Heroicons** — https://heroicons.com/
- **unDraw** (ilustraciones editables por color) — https://undraw.co/
- **Blush** (ilustraciones estilo collage) — https://blush.design/

## 🎨 Color y paletas

- **Coolors** — https://coolors.co/
- **Realtime Colors** (preview en un mockup real) — https://www.realtimecolors.com/
- **Radix Colors** (paletas pensadas para UI, con accesibilidad) — https://www.radix-ui.com/colors

## 🛠️ Prototipado y assets

- **Figma** (free tier) — https://www.figma.com/
- **Spline** (3D interactivo para web) — https://spline.design/
- **Blender** (3D open source, gratis) — https://www.blender.org/

## 📚 Para aprender motion design aplicado a web

- **GSAP – Learning Center** — https://gsap.com/resources/
- **Josh W. Comeau – CSS animation posts** — https://www.joshwcomeau.com/
- **Emil Kowalski – Animations on the web** — https://emilkowalski.com/

## 🤖 Bonus: herramientas con IA para acelerar

- **Manus** — agente de IA general que puede investigar y armar borradores/tareas de punta a punta, útil como asistente extra en el proceso (no reemplaza el criterio de diseño): https://manus.im/

---

## Ideas para cuando retomemos el portfolio

- [x] Definir 1 sola librería de motion principal → **GSAP + Lenis** (ver recetario).
- [x] Usar reveals en las secciones y `magnetic-hover` en los CTAs.
- [ ] Sumar el caso **PXSOL Vacation Rental** (identidad) cuando se lance.
- [ ] Sumar más casos al capítulo SaaS.
- [ ] Sacar paleta de color con Realtime Colors antes de tocar código.
- [ ] Buscar 3 referencias en Godly/Land-book de portfolios de perfiles similares (dev + creativo) antes de arrancar.
