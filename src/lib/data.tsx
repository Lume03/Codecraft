
import type { ImagePlaceholder } from './placeholder-images';
import { placeholderImages } from './placeholder-images';
import React from 'react';

const findImage = (id: string): ImagePlaceholder => {
  const image = placeholderImages.find((img) => img.id === id);
  if (!image) {
    throw new Error(`Image with id "${id}" not found.`);
  }
  return image;
};

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: ImagePlaceholder;
  level: number;
  xp: number;
  streak: number;
  achievements: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  image: ImagePlaceholder;
  progress: number;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  type: 'theory' | 'quiz';
  contentId: string;
  duration: number; // Duration in minutes
}

export type QuestionType =
  | 'single_choice'
  | 'boolean'
  | 'complete_sentence'
  | 'reorder'
  | 'code_blocks';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string | string[] | boolean;
  codeSnippet?: string;
  blocks?: string[]; // for code_blocks
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  questions: Question[];
}

export const user: User = {
  id: 'user-1',
  name: 'Alonso Luque',
  username: 'alonso.dev',
  email: 'alex.doe@example.com',
  avatar: findImage('user-avatar'),
  level: 5,
  xp: 450,
  streak: 2,
  achievements: ['Primer quiz', 'Code Novice', 'Quiz Master', 'Racha de 3 días'],
};

function PythonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 20v-8.5l-4-2.5 4-2.5v-5l-8 5v11l8 5z" fill="#9FE870" />
      <path d="M12 20v-8.5l4-2.5-4-2.5v-5l8 5v11l-8 5z" fill="#306998" />
    </svg>
  );
}

function JavaScriptIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <rect width="24" height="24" rx="3" fill="#FACC15"/>
      <path d="M7.5 16.5V7.5H12C13.6569 7.5 15 8.84315 15 10.5V10.5C15 12.1569 13.6569 13.5 12 13.5H9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.5 13.5H7.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}


function CppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
     <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 48 48"
      fill="#60A5FA"
      {...props}
    >
      <path d="M24.3 12.3c-2.3-2.2-5.1-3.3-8.4-3.3-3.1 0-5.7 1-7.9 3l3.1 3.1c1.5-1.3 3.1-2 4.8-2 2.7 0 4.7 1.3 4.7 3.8 0 1.2-.5 2.2-1.4 3.1-1 .9-2.5 1.7-4.6 2.4-3 .9-4.8 2-5.6 3.1-.7 1.1-1.1 2.5-1.1 4.2 0 3.3 1.1 5.9 3.4 7.6 2.3 1.8 5.1 2.7 8.5 2.7 3.1 0 5.8-1 8-3.1l-3-3.1c-1.5 1.4-3.1 2.1-4.9 2.1-2.9 0-4.8-1.5-4.8-4.3 0-1.8.8-3 2.3-3.9 1.5-.9 3.9-1.9 6.9-2.9 3.1-1.1 5-2.4 5.9-4.1.9-1.7 1.4-3.5 1.4-5.5 0-3.3-1.2-5.9-3.5-7.7zm13.5 13.5h-6v-6h-6v6h-6v6h6v6h6v-6h6v-6z"/>
    </svg>
  );
}

export const courses: Course[] = [
  {
    id: 'py-101',
    title: 'Python',
    description: 'Comienza tu viaje en la programación con Python, ideal para principiantes.',
    icon: PythonIcon,
    image: findImage('python-course'),
    progress: 75,
    modules: [
        { id: 'py-m1', title: 'Introducción a Python', type: 'theory', contentId: 'py-intro', duration: 5 },
        { id: 'py-m2', title: 'Sintaxis básica', type: 'theory', contentId: 'py-syntax', duration: 8 },
        { id: 'py-m3', title: 'Primer Quiz', type: 'quiz', contentId: 'py-quiz-1', duration: 4 },
    ],
  },
  {
    id: 'js-101',
    title: 'JavaScript',
    description: 'Domina los conceptos básicos de JavaScript, el lenguaje esencial de la web.',
    icon: JavaScriptIcon,
    image: findImage('js-course'),
    progress: 40,
    modules: [
      { id: 'js-m1', title: 'Introducción a JS', type: 'theory', contentId: 'js-intro', duration: 6 },
      { id: 'js-m2', title: 'Variables y Tipos', type: 'quiz', contentId: 'js-quiz-1', duration: 9 },
      { id: 'js-m3', title: 'Funciones', type: 'theory', contentId: 'js-data-types', duration: 12 },
      { id: 'js-m4', title: 'DOM y Eventos', type: 'theory', contentId: 'js-dom', duration: 10 },
    ],
  },
  {
    id: 'cpp-101',
    title: 'C++',
    description: 'Aprende el poder de C++ para aplicaciones de alto rendimiento y sistemas.',
    icon: CppIcon,
    image: findImage('cpp-course'),
    progress: 10,
    modules: [
        { id: 'cpp-m1', title: 'Fundamentos de C++', type: 'theory', contentId: 'cpp-intro', duration: 7 },
        { id: 'cpp-m2', title: 'Quiz de primeros pasos', type: 'quiz', contentId: 'cpp-quiz-1', duration: 5 },
    ],
  },
];

export const theoryContent: Record<string, { title: string; pages: string[] }> = {
  'py-intro': {
    title: 'Introducción a Python',
    pages: [
      'Python es un **lenguaje de programación moderno, simple y versátil**.\nSe utiliza para crear sitios web, analizar datos, desarrollar inteligencia artificial y automatizar tareas del día a día.\n\nSu sintaxis es clara y fácil de leer, lo que lo hace ideal para **principiantes** y profesionales.\n```python\nprint("¡Hola, Python!")  # Muestra un mensaje en pantalla\n```\nEl nombre *Python* viene del grupo de comedia británico *Monty Python*, no del animal 🐍.',
      'Python es uno de los lenguajes más demandados del mundo.\nSu facilidad para integrarse con bases de datos, servicios web y herramientas de ciencia de datos lo convierte en una **herramienta poderosa** para cualquier campo tecnológico.\n\n**Ventajas:**\n\n*   Sintaxis fácil de leer 🧠\n*   Amplia comunidad y recursos 🌍\n*   Compatible con Windows, macOS y Linux 💻\n*   Usado por empresas como Google, Netflix y NASA 🚀\n```python\n# Python también se usa en ciencia de datos\nimport math\narea = math.pi * 5**2\nprint(area)  # 78.5398...\n```',
      'Puedes programar en Python de varias maneras:\n\n*   Descargando el **intérprete oficial** desde [python.org](https://www.python.org)\n*   Usando **entornos en línea** como Replit o Jupyter Notebook\n*   O directamente desde el **terminal o editor VS Code**\n\nEl programa más simple de todos se conoce como *“Hello World”*.\n```python\n# Tu primer programa en Python\nprint("Hello, World!")\n```\n**Resultado:**\n`Hello, World!`\nCada vez que ves `print()`, Python mostrará texto o el valor de una variable en la pantalla.',
      'Python **lee tu código línea por línea**, de arriba hacia abajo.\nCada instrucción se ejecuta inmediatamente.\nPor eso es ideal para aprender lógica paso a paso sin necesidad de compilar.\n```python\nprint("Inicio")\nprint("Aprendiendo Python...")\nprint("Fin")\n```\n**Salida:**\n`Inicio`\n`Aprendiendo Python...`\n`Fin`\n\nPiensa en tu programa como una serie de pasos que Python sigue uno tras otro.',
      'Crea tu primer programa que muestre tu nombre y edad en una sola línea.\n```python\nnombre = "Alex"\nedad = 20\nprint(f"Hola, soy {nombre} y tengo {edad} años.")\n```\n**Resultado:**\n`Hola, soy Alex y tengo 20 años.`\n\n🎉 ¡Excelente! Ya sabes ejecutar tu primer código en Python.\nEn la siguiente lección aprenderás su **sintaxis básica**, cómo usar **variables** y cómo **interactuar con los datos**.',
    ],
  },
  'js-intro': {
    title: 'Introducción a JavaScript',
    pages: [
      'JavaScript es un lenguaje de programación interpretado y de alto nivel. Es un lenguaje que también se caracteriza por ser dinámico, débilmente tipado, basado en prototipos y multiparadigma.',
      'Junto con HTML y CSS, JavaScript es una de las tres tecnologías principales de la World Wide Web. JavaScript permite páginas web interactivas y, por lo tanto, es una parte esencial de las aplicaciones web.',
    ],
  },
   'js-data-types': {
    title: 'Tipos de datos en JavaScript',
    pages: [
      'JavaScript tiene varios tipos de datos primitivos: `String`, `Number`, `BigInt`, `Boolean`, `Undefined`, `Null` y `Symbol`.',
      'También existe un tipo de dato complejo: `Object`. Los arrays y las funciones son objetos especializados.',
      'Ejemplo de declaración de variables:\n```javascript\nlet name = "CodeCraft";\nconst score = 100;\nlet isComplete = false;\n```'
    ],
   },
  // Add other theory content here...
};

export const quizzes: Quiz[] = [
  {
    id: 'js-quiz-1',
    title: 'Quiz de Variables en JavaScript',
    courseId: 'js-101',
    questions: [
      {
        id: 'q1',
        type: 'single_choice',
        text: '¿Qué palabra clave se utiliza para declarar una variable que no se puede reasignar?',
        options: ['let', 'var', 'const', 'static'],
        correctAnswer: 'const',
      },
      {
        id: 'q2',
        type: 'boolean',
        text: '¿El valor `null` es de tipo objeto en JavaScript?',
        correctAnswer: true,
      },
      {
        id: 'q3',
        type: 'complete_sentence',
        text: 'El operador `===` en JavaScript comprueba tanto el valor como el ____.',
        correctAnswer: 'tipo',
      },
      {
        id: 'q4',
        type: 'reorder',
        text: 'Reordena las líneas para declarar correctamente una variable `x` y asignarle el valor `10`.',
        options: ['x = 10;', 'let x;'],
        correctAnswer: ['let x;', 'x = 10;'],
      },
      {
        id: 'q5',
        type: 'code_blocks',
        text: 'Completa el código para mostrar una alerta con "Hola, CodeCraft!".',
        codeSnippet: 'alert("___, ___!");',
        blocks: ['Hola', 'Mundo', 'CodeCraft', 'Web'],
        correctAnswer: ['Hola', 'CodeCraft'],
      },
    ],
  },
  // Add other quizzes here...
];
