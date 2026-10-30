# Bolsillos 🪙

Aplicación web progresiva (**PWA**) y minimalista para el control financiero mediante el método de **Presupuestos Estancos** y **Metas de Ahorro**.

---

## ✨ Características Principales

1. **Espacios Estancos (4 Bolsillos)**:
   - Alimentación, Transporte, Entretenimiento y Emergencias.
   - Cálculo automático de saldo disponible, consumo porcentual y alertas visuales.
   - Regla estricta: alerta de color rojo ante sobregiros en cualquier bolsillo.
   - Deducción rápida de gastos mediante modal accesible desde cada tarjeta.

2. **Objetivos de Ahorro**:
   - Creación y seguimiento de metas personales (ej. comprar un carro, mensualidad de la universidad, viajes, cumpleaños).
   - Metas organizadas en cuadrícula de tarjetas con barras de progreso y registro de aportes.

3. **Reporte General de Gastos**:
   - Barra apilada con la distribución porcentual del presupuesto consumido.
   - Comparativa de consumo y cupo disponible para cada espacio estanco.
   - Indicadores de eficiencia y salud financiera.

4. **Modo Claro y Modo Oscuro**:
   - Selector en la cabecera con persistencia en `localStorage` y detección automática de preferencias del sistema.
   - Paleta sobria, moderna y minimalista con estética *glassmorphism*.

5. **Soporte PWA (Web App Instalable)**:
   - Configuración lista con `manifest.json`, Service Worker básico y metaetiquetas de pantalla completa para iOS y Android.
   - Se puede anclar al escritorio de tu móvil como una app nativa ("Añadir a pantalla de inicio").

---

## 🚀 Despliegue en Producción

El proyecto incluye configuración lista para despliegue directo en **Netlify** o **Render**:

### Opción 1: Netlify
- El repositorio cuenta con [netlify.toml](file:///c:/repos/emp-mvp/netlify.toml) y `public/_redirects` para soportar el enrutamiento SPA:
  - **Build Command**: `npm run build`
  - **Publish Directory**: `dist`

### Opción 2: Render
- Se incluye [render.yaml](file:///c:/repos/emp-mvp/render.yaml) configurado como servicio estático (*Static Site*):
  - **Build Command**: `npm run build`
  - **Publish Directory**: `./dist`

---

## 💻 Desarrollo Local

```powershell
# Instalar dependencias
npm install

# Levantar el entorno de desarrollo
npm run dev

# Compilar para producción
npm run build
```
