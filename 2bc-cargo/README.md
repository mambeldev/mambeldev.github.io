# Prototipo — Portal de cliente 2BC Cargo

Prototipo navegable preparado por **Angel Mambel** para la propuesta de modernización del
portal de cliente de 2BC Cargo.

**Todos los datos son ficticios.** No es el sistema real de 2BC y no se conecta a ninguna
plataforma. Sirve para mostrar cómo funcionaría el portal propuesto.

---

## Qué demuestra

| Pantalla | Problema del portal actual que resuelve |
|---|---|
| **Tablero** | Hoy la pantalla de inicio dice «No se han encontrado registros» aunque la cuenta tenga paquetes activos. |
| **Mis paquetes** | Hoy el estado se comunica solo por el color de fondo de la fila y la modalidad por un ícono sin texto. |
| **Detalle del paquete** | Hoy no hay historia del envío, ni peso, ni valor, ni fecha estimada de llegada. |
| **Nueva pre-alerta** | Hoy no existe campo para elegir aéreo o marítimo, ni forma de dividir una compra entre ambas modalidades. Es el origen del sobrecosto documentado en la propuesta. |
| **Documentos** | Hoy «SUBIR FACTURA COMERCIAL» es un texto rojo, no un botón. |
| **Facturas** | Hoy hay notas de crédito sin explicación y el nombre de la cuenta aparece de dos formas distintas. |

Cada pantalla incluye un desplegable **«¿Qué cambia respecto al portal actual?»** que explica
el problema que resuelve. Así el prototipo se explica solo cuando lo abre alguien sin que
haya nadie presente para narrarlo.

---

## Personalizar con la marca de 2BC

### 1. Colores

Los cuatro colores están al principio de `css/styles.css`. Todo lo demás se deriva de ellos:

```css
:root {
  --brand-900: #0A2A4A;   /* azul oscuro del logo */
  --brand-700: #12508C;   /* azul medio           */
  --brand-500: #1E76C4;   /* azul claro / enlaces */
  --accent:    #D8332B;   /* rojo del logo        */
}
```

> Los valores actuales son **provisionales**, tomados a ojo del logo. Sustituir por los hex
> oficiales.

### 2. Logo

Colocar el archivo en `img/logo-2bc.png` (versión blanca, porque va sobre fondo azul oscuro)
y en `index.html` reemplazar:

```html
<span class="fallback">2<b>BC</b></span>
```

por:

```html
<img src="img/logo-2bc.png" alt="2BC Cargo">
```

### 3. Tarifas del estimador

En `js/data.js`, el objeto `TARIFAS`. Son valores de ejemplo: ajustar a las tarifas reales
antes de mostrarlo a 2BC, o dejarlos redondos si se prefiere no comprometer cifras.

---

## Desplegar en Vercel

Sitio estático puro, sin compilación ni dependencias.

**Opción A — desde el navegador (más rápido)**

1. Subir esta carpeta a un repositorio de GitHub.
2. En vercel.com → *Add New* → *Project* → importar el repositorio.
3. Framework Preset: **Other**. Build Command: vacío. Output Directory: vacío.
4. *Deploy*.

**Opción B — desde la terminal**

```bash
npm i -g vercel
cd demo-2bc
vercel        # despliegue de prueba
vercel --prod # despliegue definitivo
```

**Dominio recomendado:** un subdominio propio como `demo2bc.mambeldev.com` en lugar del
`*.vercel.app` por defecto. Se configura en Vercel → *Settings* → *Domains*. Un enlace bajo
dominio propio se ve mejor que uno genérico cuando lo abre un cliente.

---

## Estructura

```
demo-2bc/
├── index.html          Estructura, encabezado, navegación y pie
├── css/styles.css      Estilos (la paleta de marca está al inicio)
├── js/data.js          Datos de demostración y tarifas
├── js/app.js           Enrutador y vistas
└── README.md
```

Sin dependencias, sin build, sin backend. Funciona abriendo `index.html` directamente.

---

Angel Mambel · contacto@mambeldev.com · +58 424-5518967 · mambeldev.com
