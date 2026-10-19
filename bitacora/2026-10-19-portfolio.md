# Bitácora · Rediseño del portfolio (19 de octubre de 2026)

Todo lo que aprendimos rediseñando https://aldisaligari.github.io/artistic/ en una sesión. Recetas técnicas en [`../motion/scroll-inmersivo.md`](../motion/scroll-inmersivo.md); voz y reglas de escritura en [`../voz-y-criterios.md`](../voz-y-criterios.md).

## Cómo quedó (estructura final)
1. **Portada**: *ALDANA / Saligari* se arma letra por letra. Al bajar, el fondo pasa a azul eléctrico y aparece **NADA ES / porque sí.** con "Soy artista. Los artistas asignamos sentido." Dos órbitas de texto giran en sentidos opuestos y un punto orbita.
2. **Manifiesto**: "Veo el marketing como *hacer arte* para conectar con las personas. Lo literal me aburre." Se enciende palabra por palabra.
3. **Capítulo creativo**: "Cada marca *es un universo.*" Entropía, CREW y Aldi como historias sticky: ventana de navegador que se recorre sola, subtítulo vivo, atmósfera de color por marca. Se aclara que diseñé identidad y manual de marca.
4. **Capítulo SaaS**: "Del under *al SaaS.*" Caso PXSOL: *Diseño y marketing digital para SaaS*, landing de temporada (copia archivada en `/showcase/pxsol-temporada/` con `noindex` y etiqueta de pieza de portfolio), celular, sombrero y anteojos.
5. **Sobre mí**: "ME GUSTA / *el arte.*" con el manifiesto repartido en tres párrafos cortos.
6. **ACTIVEMOS / *el arte* / DE TU MARCA**: pieza de motion sin nada para tocar que lleva al mail.
7. **Contacto**: mail gigante que entra siempre en una línea.

## Lo que me encantó (repetir el criterio, no copiar)
- "ACTIVEMOS": letras que giran en 3D una por una, anillo de texto girando, cambio de colores, Unbounded + serif itálica.
- La portada nueva con ese mismo criterio pero otra variación.
- Las ventanas de navegador que se recorren solas, y la versión mobile como póster (encabezado, ventana, subtítulo).

## Lo que NO va (aprendido a los golpes)
- Rayas largas `—`, comillas `« »`, listas numeradas con separadores y contadores `04 / 04`: se ven hechas por IA.
- Librerías (GSAP, Lenis) en la lista de software.
- Secciones de "Planes" y "Próximamente".
- Una portada llena de capturas: el diseño y el motion ya muestran lo que sé hacer; los trabajos se ven abajo.
- "Soy artista" como título: mejor "Me gusta el arte" (más humilde, guiño al video).
- Textos que explican el truco técnico ("las reservas caen mientras scrolleás…"): mejor contar qué hago y para quién.

## Bugs que encontramos y cómo se arreglaron
| Síntoma | Causa | Arreglo |
|---|---|---|
| Mockups cortados y pixelados | `<img height="736">` fijaba la altura; con `object-fit:cover` la captura se ampliaba ~1,75× | `height:auto` + `aspect-ratio` real en CSS |
| Capturas poco nítidas | Capturas a 1536 px | Zoom de Claude in Chrome a resolución real del dispositivo, en dos mitades unidas (~1900 px); PXSOL renderizada a 2× |
| Mail del contacto cortado | Tamaño de letra fijo con Unbounded en mayúsculas | `font-size:min(4.6vw, 84px)` + `nowrap`, probado de 360 a 2560 px |
| La "g" de *Saligari* cortada en el celu | Safari recorta cada letra animada a su caja; la cola de la itálica sobresale | `padding` abajo y a los costados en cada letra, con margen negativo para compensar |
| En el celu los mockups no avanzaban / tardaban | Capturas con `loading="lazy"` escondidas dentro de la ventana: el celu no las cargaba | Sin `lazy` en las capturas de las ventanas |
| Huecos blancos en mobile antes de los mockups | Stage sticky centrado verticalmente | Layout póster: `display:contents` + `order` + `margin:auto 0` en la ventana |
| Proyecto que llegaba vacío al hacer scroll | La entrada empezaba recién en `top top` | Entrada mientras la sección entra a pantalla (`top 92%` → `top 8%`) |
| Título de la portada desbordado en mobile | El contenedor flex medía su propio contenido | `width:100%` en el contenedor antes de ajustar las líneas al ancho |

## Cómo trabajamos (para la próxima)
- **Primero mirar los sitios reales** con Claude in Chrome (colores, tipografías, si permiten mostrarse en un iframe).
- **Probar siempre** con Playwright en 1440×900, 1920×1080, 390×844 y 375×667, y con *reducir movimiento* activado. Revisar capturas antes de publicar.
- **Publicar** en `main` del repo `artistic` (GitHub Pages). Si no se ven los cambios: Ctrl + Shift + R o incógnito.
- **Registrar** lo aprendido en este repo y en la memoria del proyecto al final de cada sesión.

## Pendientes
- Poner privado este repo (`skills-toolkit`) desde GitHub: Settings → Danger Zone → Change visibility.
- Sumar PXSOL Vacation Rental (identidad) cuando se lance, y más casos SaaS.
- Probar en un iPhone real (el recorrido mobile se probó simulado en Chrome).
