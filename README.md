# Universal AI Chat (PWA)

Cliente universal de chat con IA que permite conectar múltiples proveedores (OpenAI, Anthropic, Google AI, Groq, Together, etc.). Preparado para desplegarse en **GitHub Pages** y con soporte **PWA instalable** (offline básico, actualización controlada).

## ✨ Características
- UI moderna con selector de proveedor/modelo y múltiples configuraciones guardadas en `localStorage`.
- Compatible con endpoints tipo OpenAI y variantes.
- PWA: manifest, service worker, instalación en escritorio/móvil, offline básico.
- Actualización del SW con aviso “Nueva versión disponible”.

## 🗂 Estructura mínima+
.
├─ index.html
├─ sw.js
├─ manifest.json
└─ icons/
├─ icon-192.png
├─ icon-512.png
└─ icon-512-maskable.png

> Asegúrate de que las rutas del `manifest` y los iconos coinciden con tu estructura.

## 🚀 Despliegue en GitHub Pages
1. Sube el repo a GitHub.
2. En **Settings → Pages**, selecciona la rama (por ej. `main`) y carpeta `/root` o `/docs` si usas esa carpeta.
3. Espera a que GitHub publique la web.
4. Accede a `https://usuario.github.io/mi-repo/`.

### Notas de ruta/scope
- En `manifest.json`, usamos `"start_url": "./"` y `"scope": "./"` para que funcione tanto en **User Pages** como en **Project Pages**.
- En `index.html`, registra el SW con `./sw.js`.

## 📲 Instalación como PWA
- En Chrome/Edge/Brave/Android: verás el botón “Instalar” en la barra de direcciones o el menú.
- En iOS (Safari): usa “Compartir → Añadir a pantalla de inicio”.

## 🔧 Desarrollo local
Sirve el proyecto con un servidor estático (idealmente sobre HTTPS):
```bash
# Opción rápida
npx serve -s .
# o
python3 -m http.server 5173

Los service workers requieren HTTPS o http://localhost.

🔄 Actualizaciones del SW
	•	Cambia SW_VERSION en sw.js para forzar una nueva versión de caché.
	•	El UI muestra un aviso cuando hay una actualización disponible (botón Actualizar que hace skipWaiting y recarga).

🔐 Sobre las API keys
	•	No hay backend: las claves se usan en el cliente y se guardan en localStorage si tú lo decides.
	•	Riesgo: no compartas públicamente tu instancia si contiene claves. Para producción multiusuario, crea un backend proxy con control de uso y CORS.

⚠️ CORS / Limitaciones
	•	Algunos proveedores pueden requerir cabeceras específicas o bloquear peticiones desde el navegador por CORS.
	•	Este cliente no cachea ni intercepta POST a las APIs (lo maneja la red en tiempo real).

🧰 Iconos
	•	Incluye al menos:
	•	icons/icon-192.png
	•	icons/icon-512.png (y variante -maskable si quieres recortes perfectos).
	•	Si tienes un SVG, genera PNGs con fondo correcto. Recomendado maskable para Android.

✅ Checklist PWA
	•	manifest.json enlazado en <head>
	•	meta name="theme-color"
	•	sw.js registrado y activo
	•	Iconos 192/512 (y maskable)
	•	Probado offline (recarga sin conexión)
	•	Instalación comprobada

    ---

## (Opcional) Consejos rápidos

- Si quieres un **fallback offline** más elaborado, crea `offline.html` y cámbialo en el SW (en lugar de `OFFLINE_HTML` inline).
- Si tu repo usa subcarpetas para assets, ajusta en `CORE_ASSETS` del `sw.js`.
- Para mostrar un **banner de actualización** con tu propio estilo, sustituye el pequeño `promptUpdate` del snippet por un modal/tostada de tu UI.

Si quieres, también te preparo los PNG `icon-192`, `icon-512` y el `maskable` a partir del SVG que ya tienes.