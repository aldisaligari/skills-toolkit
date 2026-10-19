# 🌀 Scroll inmersivo con Lenis + GSAP — recetario

Aprendizajes del rediseño del portfolio (`aldisaligari/artistic`, octubre 2026). Todo probado en desktop y mobile.
Código completo de referencia: `artistic/index.html`. Snippets sueltos en [`/snippets`](../snippets).

---

## 1. Reglas de oro (por qué se siente fluido y no "trabado")

| Regla | Por qué |
|---|---|
| **Scroll nativo + Lenis**, nunca scroll virtual | Sitios como studiomonstro.com usan scroll virtual (la página mide 720 px y todo se mueve con JS): se siente pesado y rompe trackpads/mobile. Lenis solo *suaviza* el scroll real. |
| `syncTouch: false` en Lenis | En mobile se usa la inercia nativa del dedo. Suavizar touch es lo que da la sensación de "trabado". |
| `lerp: 0.09` | 0.07–0.1 es el rango "premium". Menos = flota demasiado; más = brusco. |
| **Un solo RAF**: el ticker de GSAP maneja a Lenis | `gsap.ticker.add(t => lenis.raf(t * 1000))` + `gsap.ticker.lagSmoothing(0)`. Si cada librería tiene su RAF, aparecen saltos. |
| `scrub: true` (no `scrub: 1`) cuando ya usás Lenis | Lenis ya suaviza: sumar otro suavizado mete *lag* entre el dedo y la animación. |
| **`position: sticky` en vez de `pin`** | El pin de ScrollTrigger mete un pin-spacer y recalcula; sticky es CSS puro, cero saltos, funciona igual en iOS. La sección mide `N × 85vh`, el stage interno es `sticky; top:0; height:100svh`. |
| Animar solo `transform` y `opacity` | Nada de `filter: blur()` scrubeado, `top/left` o `width`: matan los FPS en mobile. |
| Precargar antes de que llegue | `ScrollTrigger.create({ start: 'top 250%', once: true })` → cambiar `loading="lazy"` a `eager` de las imágenes de esa sección. Nada aparece "a medias". |

## 2. Setup base

```js
gsap.registerPlugin(ScrollTrigger);
const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, syncTouch: false });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

// anclas suaves
document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  e.preventDefault();
  lenis.scrollTo(a.getAttribute('href'), { duration: 1.6, easing: (x) => 1 - Math.pow(1 - x, 4) });
}));
```

Librerías **vendorizadas** (copiadas al repo en `/vendor`), no CDN: GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13. Si un CDN se cae, el sitio no.

## 3. Mejora progresiva (el sitio nunca queda roto)

```html
<script>
  // en el <head>, antes del CSS
  const d = document.documentElement; d.classList.add('js');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) d.classList.add('motion');
</script>
```

- Todo el CSS "animable" cuelga de `.motion` (alturas largas, sticky, elementos ocultos para revelar).
- Sin JS o con *reducir movimiento*: página estática completa y legible.
- Todo el JS de motion va en `try/catch`; si algo falla → `root.classList.remove('motion')`.
- El loader tiene un **failsafe CSS** (`animation: … 5s forwards` que lo oculta) por si el JS nunca corre.

## 4. Patrones que usamos

### 4.1 Túnel 3D de capturas (hero)
Cards con `translate3d(x, y, z)` dentro de una escena `preserve-3d` con `perspective: 1000px`. El scroll mueve la "cámara" (`camZ = progress × 5300`) y cada card se acerca y te atraviesa.
- Opacidad por distancia: aparece entre z −4600 y −3100, se va entre +300 y +900.
- **Mientras el nombre está en pantalla, las cards bajan su opacidad** (0.3 en mobile, 0.6 en desktop) → el texto se lee primero.
- Mouse (solo desktop): la escena rota ±9°/±6° con `gsap.quickTo`.
- La última card (la del primer proyecto) queda centrada y grande: es el "portal" al capítulo de trabajo.

### 4.2 Historia sticky por proyecto (el corazón del portfolio)
Inspirado en animos.app (ventana de browser) + la narración de aldisaligari.com:
1. **Entrada mientras la sección entra a pantalla** (`start:'top 92%' → end:'top 8%'`): la ventana se levanta del "piso" (`rotationX 30 → 0`, `scale .82 → 1`). ⚠️ Si la entrada empieza en `top top`, el proyecto llega vacío.
2. **Narración**: la ventana tiene un *strip* vertical con N capturas. Timeline scrubeado: *pausa → desliza un panel (`power3.inOut`) → pausa…* (`yPercent: -100 × i / N`). La pausa es lo que la hace sentir narrada y no una cinta.
3. **Captions sincronizados**: lista numerada al costado; el ítem activo se calcula desde `tl.time()` (funciona igual subiendo).
4. **Profundidad**: 2 capturas chicas flotando (`.float`) con distinto `data-depth` → parallax a distinta velocidad.
5. **Palabra gigante de fondo** con `-webkit-text-stroke` que se desliza horizontal todo el rato (capa más lejana).
6. **Salida**: la ventana se hunde (`rotationX -10`, `scale .9`).

### 4.3 Atmósfera por sección
Cada bloque tiene `data-theme`; al entrar se tweenean las variables CSS del `:root`:
```js
gsap.to(document.documentElement, { '--bg': t.bg, '--fg': t.fg, '--accent': t.accent, duration: .9, ease: 'power2.out', overwrite: 'auto' });
```
GSAP interpola colores dentro de custom properties. También actualizar `<meta name="theme-color">` (la barra del navegador mobile cambia de color 🤌).
Header con `mix-blend-mode: difference` → se lee sobre cualquier fondo.

### 4.4 Manifiesto palabra por palabra
Split propio (sin SplitText) que respeta spans internos; `opacity .12 → 1` con `stagger` scrubeado. Para i18n: dos párrafos (`.lang-es` / `.lang-en`) ya spliteados, se muestra uno con CSS.

### 4.5 Velocidad del scroll como input
- Marquee: `timeScale` según `self.getVelocity()`, cambia de sentido al subir.
- Recortes (sombrero, anteojos, valija de PXSOL): `skewY` con tope ±8° según velocidad (`gsap.quickTo`). Sin scroll quedan quietos.

### 4.6 "Explorar en vivo"
Click en la ventana (solo desktop, `pointer: fine`) abre un modal con el sitio real en `<iframe>`; `lenis.stop()` mientras está abierto, `Esc` cierra y se libera el iframe (`about:blank`).
Antes, chequear que el sitio no mande `X-Frame-Options` / `frame-ancestors` (WordPress de Hostinger: ✔︎ embebibles).

### 4.7 Cursor con label
Punto que sigue al mouse (`quickTo` 0.35 s), crece a 96 px con texto ("Explorar") sobre `[data-cursor]` y desaparece sobre links/botones. Solo `(hover:hover) and (pointer:fine)`.

## 5. Mobile (que también diga "OOOO")
- Mismo relato, mismo scroll: nada de "versión simplificada" salvo lo que no aporta (descripción larga y tags se ocultan; quedan título, captions y CTA).
- Ventana arriba, texto abajo (`order: -1`).
- Alturas `100svh` (no `vh`) para que la barra del navegador no haga saltar el sticky.
- Tocar la ventana abre el sitio (no modal).

## 6. Capturas para las ventanas
- Sacadas con Claude in Chrome (`window.scrollTo` + screenshot a escala 1), recortando la scrollbar (17 px).
- WebP 1440 px q74 (~60–120 KB) + versión `-sm` 560 px para el túnel.
- Ratio fijo `1440/736` con `aspect-ratio` → cero layout shift.

## 7. Referencias
- **Lenis** — https://lenis.darkroom.engineering/
- **GSAP ScrollTrigger** — https://gsap.com/docs/v3/Plugins/ScrollTrigger/ · demos: https://gsap.com/showcase/
- **animos.app** — idea de mostrar sitios dentro de una ventana de browser animada.
- **studiomonstro.com** — referencia visual (tipografía, composición). ⚠️ Usa scroll virtual: lo que NO queremos copiar.
- **aldisaligari.com** — nuestra propia referencia de narración por scroll (capítulos, polaroids 3D, REC).
- **Landing Temporada PXSOL** — recortes que reaccionan a la velocidad, reservas que "caen" sin pin.
