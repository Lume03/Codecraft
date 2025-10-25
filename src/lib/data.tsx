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

export interface CodeCompletionExercise {
  id: string;
  title: string;
  instruction: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  language: 'Python' | 'JavaScript';
  blocks: string[];
  correctOrder: string[];
  hint: string;
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
      '**¿Qué es Python?**\n\nPython es un **lenguaje de programación moderno y sencillo**.\nSe usa para crear páginas web, analizar datos, hacer videojuegos, inteligencia artificial y más.\n\nSu gran ventaja es que **es fácil de leer y aprender**.\n\n```python\nprint("¡Hola, Python!")\n```\n\n🧠 “Si puedes leer inglés simple, puedes leer Python.”',
      '**¿Por qué aprender Python?**\n\nPython es uno de los lenguajes más usados en el mundo 🌍.\nLo utilizan empresas como **Google, Netflix, Spotify** y hasta la **NASA** 🚀.\n\n**Ventajas clave:**\n\n* 🧩 Sintaxis fácil de entender\n* 📚 Mucha documentación y ayuda en línea\n* 💻 Funciona en cualquier sistema operativo\n* 🤖 Ideal para aprender lógica de programación',
      '**¿Qué puedes hacer con Python?**\n\nCon Python puedes construir casi cualquier cosa:\n\n* Sitios web 🕸️\n* Aplicaciones de escritorio 🧭\n* Videojuegos 🎮\n* Análisis de datos 📊\n* Inteligencia artificial 🤖\n\n```python\n# Un pequeño ejemplo de cálculo\nprecio = 10\nimpuesto = 0.18\ntotal = precio + (precio * impuesto)\nprint(total)  # 11.8\n```\n\n💬 “Python te permite resolver problemas con pocas líneas de código.”',
      '**Cómo funciona Python**\n\nPython lee tu código **línea por línea**, de arriba hacia abajo.\nCada línea es una **instrucción** que se ejecuta al instante.\n\n```python\nprint("Inicio")\nprint("Procesando...")\nprint("Fin")\n```\n\n▶️ “Python ejecuta tu código como si leyera un libro: una línea a la vez.”',
      '**Tu primer vistazo al código**\n\nEl primer programa de todo programador muestra un saludo simple.\nEn Python se escribe así:\n\n```python\nprint("Hello, World!")\n```\n\n🗨️ `print()` sirve para **mostrar texto en pantalla**.\n🔤 El texto va entre comillas `" "`. \n\n🎉 ¡Listo! Ya sabes qué es Python y cómo luce su código.\nEn la próxima lección conocerás su **sintaxis básica** y aprenderás a **usar variables**.',
    ],
  },
  'py-syntax': {
    title: 'Sintaxis básica',
    pages: [
      '**¿Cómo se escribe el código en Python?**\n\nPython es famoso por tener una **sintaxis limpia y natural**.\nNo necesitas escribir muchos signos como `;` o `{}` para que funcione.\n\n```python\n# Esto es un comentario\nprint("Hola, mundo")\nprint("Aprendiendo Python es fácil")\n```\n\n💬 Las líneas se ejecutan **una debajo de otra**.\n💡 El símbolo `#` indica un **comentario**: texto que Python no ejecuta.',
      '**¿Qué son las variables?**\n\nUna variable es como una **caja con nombre** donde guardas un valor.\nPuedes usarla para almacenar números, texto o resultados.\n\n```python\nnombre = "Lucía"\nedad = 20\nprint(nombre)\nprint(edad)\n```\n\n🧠 `=` se llama **operador de asignación**: guarda el valor en la variable.\n🗂️ Piensa que `nombre` → guarda el texto “Lucía”.',
      '**Actualizar el valor de una variable**\n\nPuedes **actualizar** el valor de una variable en cualquier momento.\n\n```python\npuntos = 10\npuntos = puntos + 5\nprint(puntos)  # 15\n```\n\n🎯 La nueva línea usa el valor anterior para calcular el nuevo.\n♻️ Python reemplaza el valor viejo por el nuevo automáticamente.',
      '**Tipos de datos básicos**\n\nPython usa diferentes **tipos de datos** según el valor que guardes.\nAlgunos de los más comunes son:\n\n| Tipo    | Ejemplo          | Descripción    |\n| ------- | ---------------- | -------------- |\n| `int`   | `10`             | Número entero  |\n| `float` | `3.14`           | Número decimal |\n| `str`   | `"Hola"`         | Texto o cadena |\n| `bool`  | `True` / `False` | Valor lógico   |\n\n```python\nnumero = 10\nprecio = 3.99\nnombre = "Sara"\nactivo = True\n```\n\n🔤 No necesitas declarar el tipo, Python lo detecta solo.\n✨ Puedes mezclar tipos en tus programas.',
      '**Cuida mayúsculas y espacios**\n\nPython distingue entre **mayúsculas y minúsculas**:\n`Nombre` y `nombre` son variables diferentes.\n\nAdemás, usa **espacios (indentación)** para definir bloques de código.\n\n```python\nnombre = "Luna"\n\nif nombre == "Luna":\n    print("¡Hola, Luna!")  # indentado\n```\n\n📏 Cuida los espacios al principio de cada línea.\n🚫 No los pongas al azar: Python los usa para entender tu estructura.',
      '**Un programa completo**\n\nMira cómo se combinan las variables, los tipos y la impresión en pantalla.\n\n```python\nnombre = "Carlos"\nedad = 25\nactivo = True\n\nprint(f"{nombre} tiene {edad} años. ¿Activo? {activo}")\n```\n\n**Resultado mostrado:**\n\n`Carlos tiene 25 años. ¿Activo? True`\n\n🎉 ¡Listo! Ya entiendes cómo se escribe código Python.\nEn la siguiente lección aprenderás sobre **variables, tipos de datos y operadores** en acción, dentro del apartado **Práctica**.',
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


export const codeCompletionExercises: CodeCompletionExercise[] = [
  {
    id: 'py-drag-1',
    title: 'Hola, Python',
    instruction: "Ordena los bloques para mostrar el texto 'Hola, Python' en pantalla.",
    blocks: ['print', '(', '"Hola, Python"', ')'],
    correctOrder: ['print', '(', '"Hola, Python"', ')'],
    hint: 'Recuerda que la función print() usa paréntesis para mostrar texto.',
    difficulty: 'Fácil',
    language: 'Python',
  },
  {
    id: 'py-drag-2',
    title: 'Crea tu primera variable',
    instruction: 'Arrastra los bloques para crear una variable llamada nombre con tu nombre dentro.',
    blocks: ['nombre', '=', '"Lucía"'],
    correctOrder: ['nombre', '=', '"Lucía"'],
    hint: 'Una variable se crea con nombre = valor.',
    difficulty: 'Fácil',
    language: 'Python',
  },
  {
    id: 'py-drag-3',
    title: 'Usar variable en print()',
    instruction: 'Ordena los bloques para mostrar el contenido de la variable nombre.',
    blocks: ['print', '(', 'nombre', ')'],
    correctOrder: ['print', '(', 'nombre', ')'],
    hint: 'No uses comillas al imprimir una variable.',
    difficulty: 'Fácil',
    language: 'Python',
  },
    {
    id: 'py-drag-4',
    title: 'Calcula el puntaje final',
    instruction: 'Arrastra los bloques para crear una variable `puntos_totales` que sea la suma de `puntos` y `bono`.',
    blocks: ['puntos_totales', '=', 'puntos', '+', 'bono'],
    correctOrder: ['puntos_totales', '=', 'puntos', '+', 'bono'],
    hint: 'Puedes sumar variables con el operador `+`.',
    difficulty: 'Fácil',
    language: 'Python',
  },
  {
    id: 'py-drag-5',
    title: 'Crea una variable numérica y otra de texto',
    instruction: 'Selecciona y ordena los bloques para crear una variable numérica `edad` y una de texto `nombre`.',
    blocks: ['nombre', '=', '"Ana"', 'edad', '=', '25'],
    correctOrder: ['nombre', '=', '"Ana"', 'edad', '=', '25'],
    hint: 'Los textos van entre comillas `" "`. Los números no llevan comillas.',
    difficulty: 'Fácil',
    language: 'Python',
  },
  {
    id: 'py-drag-6',
    title: 'Un programa sencillo',
    instruction: 'Ordena los bloques para crear un programa que muestre el nombre y edad del usuario.',
    blocks: ['nombre', '=', '"Lucas"', 'edad', '=', '21', 'print', '(', 'f"Hola, soy {nombre} y tengo {edad} años."', ')'],
    correctOrder: ['nombre', '=', '"Lucas"', 'edad', '=', '21', 'print', '(', 'f"Hola, soy {nombre} y tengo {edad} años."', ')'],
    hint: 'Usa f-strings para insertar variables dentro del texto.',
    difficulty: 'Fácil',
    language: 'Python',
  }
];
