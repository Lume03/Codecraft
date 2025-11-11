import React from 'react';
import type { ImagePlaceholder } from './placeholder-images';
import { placeholderImages } from './placeholder-images';

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
  streak: number;
  achievements: string[];
}

// This interface is now for type-checking Firestore data
export interface Course {
  id: string; // Document ID from Firestore
  title: string;
  description: string;
  icon: string; // Just the name of the icon
  imageId: string;
  progress?: number; // Progress will be stored separately per user
}

// This interface is now for type-checking Firestore data
export interface Module {
  id: string; // Document ID from Firestore
  title: string;
  type: 'theory' | 'quiz';
  contentId: string;
  duration: number; // Duration in minutes
  order: number;
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
  streak: 2,
  achievements: ['Primer quiz', 'Code Novice', 'Quiz Master', 'Racha de 3 días'],
};

export function PythonIcon(props: React.SVGProps<SVGSVGElement>) {
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

export function JavaScriptIcon(props: React.SVGProps<SVGSVGElement>) {
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


export function CppIcon(props: React.SVGProps<SVGSVGElement>) {
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

// This data is now only for local development or as a backup.
// The main app will fetch data from Firestore.

export const courses: Course[] = [
  {
    id: 'py-101',
    title: 'Python',
    description: 'Comienza tu viaje en la programación con Python, ideal para principiantes.',
    icon: 'PythonIcon',
    imageId: 'python-course',
    progress: 75,
  },
  {
    id: 'js-101',
    title: 'JavaScript',
    description: 'Domina los conceptos básicos de JavaScript, el lenguaje esencial de la web.',
    icon: 'JavaScriptIcon',
    imageId: 'js-course',
    progress: 40,
  },
  {
    id: 'cpp-101',
    title: 'C++',
    description: 'Aprende el poder de C++ para aplicaciones de alto rendimiento y sistemas.',
    icon: 'CppIcon',
    imageId: 'cpp-course',
    progress: 10,
  },
];

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
        text: 'Completa el código para mostrar una alerta con "Hola, RavenCode!".',
        codeSnippet: 'alert("___, ___!");',
        blocks: ['Hola', 'Mundo', 'RavenCode', 'Web'],
        correctAnswer: ['Hola', 'RavenCode'],
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
