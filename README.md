# RavenCode

> **Aprende a programar de forma práctica, interactiva y potenciada por Inteligencia Artificial.**

**RavenCode** es una plataforma educativa gamificada diseñada para enseñar lenguajes de programación (Python, JavaScript, C++, Java) mediante lecciones teóricas, cuestionarios generados dinámicamente y retos de código interactivos.

-----

## ✨ Características Principales

### 🎓 Aprendizaje Interactivo

  * **Rutas de Aprendizaje:** Cursos estructurados con seguimiento de progreso.
  * **Lecciones Ricas:** Contenido en Markdown con resaltado de sintaxis.
  * **Ejercicios Variados:**
      * 🧩 **Completar Código:** Arrastra y suelta bloques de código (Drag & Drop).
      * 📝 **Quizzes:** Selección múltiple, verdadero/falso y reordenamiento.
      * 🐛 **Depuración:** Encuentra y corrige errores.

### 🤖 Potenciado por IA (Google Genkit)

  * **Raven AI Tutor:** Un chat contextual en cada lección que responde dudas específicas sobre el contenido que estás estudiando.
  * **Generación de Prácticas:** La IA crea preguntas de práctica únicas basadas en el contenido de la lección.
  * **Recomendaciones Personalizadas:** Sugerencias de cursos basadas en tu historial y progreso.

### 🎮 Gamificación

  * **Sistema de Vidas:** Gestiona tus intentos con un sistema de vidas recargables (1 vida cada 2 horas).
  * **Rachas (Streaks):** Mantén la constancia diaria para ganar emblemas.
  * **Logros y Niveles:** Desbloquea insignias a medida que avanzas.

### ⚙️ Funcionalidades del Sistema

  * **Autenticación Híbrida:** Soporte para Google, GitHub y Email/Password (Firebase Auth).
  * **Panel de Administración:** Interfaz para crear, editar y eliminar cursos y lecciones sin tocar código.
  * **Notificaciones:** Recordatorios Push y resúmenes semanales por correo (Resend).
  * **Internacionalización:** Soporte completo para Español e Inglés.
  * **Modo Oscuro/Claro:** Adaptable a tus preferencias.

-----

## 🛠️ Tecnologías Utilizadas

  * **Frontend:** Next.js 15 (App Router), React 18, Tailwind CSS, Shadcn/UI.
  * **Backend & Base de Datos:**
      * **MongoDB:** Almacenamiento principal de datos (Cursos, Usuarios, Progreso).
      * **Firestore:** Autenticación, Cloud Messaging (Push Notifications).
  * **Inteligencia Artificial:** Google Genkit (Gemini Models).
  * **Emails:** Resend & React Email.
  * **Deploy:** Vercel.
-----

## 🚀 Configuración e Instalación

Sigue estos pasos para levantar el proyecto en tu entorno local.

### 1\. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/ravencode.git
cd ravencode
```

### 2\. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3\. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto y añade las siguientes claves (necesitarás credenciales de MongoDB, Firebase y Google AI):

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_VAPID_KEY=...

# Firebase Admin (Para notificaciones server-side)
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...

# Google GenAI (Genkit)
GOOGLE_GENAI_API_KEY=...

# Resend (Emails)
RESEND_API_KEY=...
CRON_SECRET=...
```

### 4\. Ejecutar el servidor de desarrollo

Puedes ejecutar la aplicación junto con la interfaz de Genkit para depurar los flujos de IA.

```bash
# Ejecuta Next.js
npm run dev

# En otra terminal, si deseas probar los flujos de IA (Genkit Developer UI)
npm run genkit:dev
```

Abre [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) en tu navegador.

-----

## 📂 Estructura del Proyecto

```
src/
├── ai/              # Definición de flujos y configuración de Genkit (IA)
├── app/             # Rutas de Next.js (App Router)
│   ├── (main)/      # Rutas protegidas de la app (learn, profile, practice)
│   ├── admin/       # Panel de administración
│   ├── api/         # Endpoints del backend (Next.js API Routes)
│   ├── auth/        # Páginas de Login/Registro
│   └── ...
├── components/      # Componentes de React reutilizables (UI, Widgets)
├── context/         # Contextos de React (Theme, Language)
├── firebase/        # Configuración y hooks de Firebase
├── lib/             # Utilidades, conexión a DB, tipos de datos
└── locales/         # Archivos de traducción (es.json, en.json)
```

-----

## 🧪 Flujos de IA (Genkit)

Este proyecto utiliza **Genkit** para orquestar las funcionalidades inteligentes. Los flujos principales se encuentran en `src/ai/flows/`:

1.  **`theory-chat.ts`**: Actúa como un tutor. Recibe el contexto de la lección y el historial de chat para responder dudas.
2.  **`practice-flow.ts`**: Genera preguntas de quiz y evalúa las respuestas del usuario.
3.  **`personalized-course-recommendations.ts`**: Analiza el progreso del usuario para sugerir el siguiente paso.

-----
