import React from 'react';
import type { ImagePlaceholder } from './placeholder-images';
import { placeholderImages } from './placeholder-images';

// Note: This file now primarily serves for local development, fallback data,
// or for data structures not suited for Firestore like static quiz questions.
// The main course content is intended to be fetched from MongoDB.

const findImage = (id: string): ImagePlaceholder => {
  const image = placeholderImages.find((img) => img.id === id);
  if (!image) {
    // Return a default or throw an error
    const defaultImage = placeholderImages.find((p) => p.id === 'user-avatar');
    if (defaultImage) return defaultImage;
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

// This interface is for type-checking MongoDB data for a Course
export interface Course {
  id: string; // Document ID from MongoDB
  title: string;
  description: string;
  imageId: string;
  progress?: number; // User-specific progress, not stored on the course doc
}

// This interface is for type-checking MongoDB data for a Module
export interface Module {
  id: string; // Document ID from MongoDB
  courseId: string;
  title: string;
  type: 'theory' | 'quiz';
  contentId: string; // ID for the corresponding Theory or Quiz document
  duration: number; // Duration in minutes
  order: number;
  moduleType: 'basico' | 'intermedio' | 'avanzado';
}

export interface Theory {
    id: string;
    title: string;
}

export interface TheoryPage {
    id: string;
    theoryId: string;
    title: string;
    content: string;
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

// --- Static Data (Quizzes, Exercises) ---

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
];

export const codeCompletionExercises: CodeCompletionExercise[] = [
  {
    id: 'py-drag-1',
    title: 'Hola, Python',
    instruction:
      "Ordena los bloques para mostrar el texto 'Hola, Python' en pantalla.",
    blocks: ['print', '(', '"Hola, Python"', ')'],
    correctOrder: ['print', '(', '"Hola, Python"', ')'],
    hint: 'Recuerda que la función print() usa paréntesis para mostrar texto.',
    difficulty: 'Fácil',
    language: 'Python',
  },
  {
    id: 'py-drag-2',
    title: 'Crea tu primera variable',
    instruction:
      'Arrastra los bloques para crear una variable llamada nombre con tu nombre dentro.',
    blocks: ['nombre', '=', '"Lucía"'],
    correctOrder: ['nombre', '=', '"Lucía"'],
    hint: 'Una variable se crea con nombre = valor.',
    difficulty: 'Fácil',
    language: 'Python',
  },
  {
    id: 'py-drag-3',
    title: 'Usar variable en print()',
    instruction:
      'Ordena los bloques para mostrar el contenido de la variable nombre.',
    blocks: ['print', '(', 'nombre', ')'],
    correctOrder: ['print', '(', 'nombre', ')'],
    hint: 'No uses comillas al imprimir una variable.',
    difficulty: 'Fácil',
    language: 'Python',
  },
  {
    id: 'py-drag-4',
    title: 'Calcula el puntaje final',
    instruction:
      'Arrastra los bloques para crear una variable `puntos_totales` que sea la suma de `puntos` y `bono`.',
    blocks: ['puntos_totales', '=', 'puntos', '+', 'bono'],
    correctOrder: ['puntos_totales', '=', 'puntos', '+', 'bono'],
    hint: 'Puedes sumar variables con el operador `+`.',
    difficulty: 'Fácil',
    language: 'Python',
  },
  {
    id: 'py-drag-5',
    title: 'Crea una variable numérica y otra de texto',
    instruction:
      'Selecciona y ordena los bloques para crear una variable numérica `edad` y una de texto `nombre`.',
    blocks: ['nombre', '=', '"Ana"', 'edad', '=', '25'],
    correctOrder: ['nombre', '=', '"Ana"', 'edad', '=', '25'],
    hint: 'Los textos van entre comillas `" "`. Los números no llevan comillas.',
    difficulty: 'Fácil',
    language: 'Python',
  },
  {
    id: 'py-drag-6',
    title: 'Un programa sencillo',
    instruction:
      'Ordena los bloques para crear un programa que muestre el nombre y edad del usuario.',
    blocks: [
      'nombre',
      '=',
      '"Lucas"',
      'edad',
      '=',
      '21',
      'print',
      '(',
      'f"Hola, soy {nombre} y tengo {edad} años."',
      ')',
    ],
    correctOrder: [
      'nombre',
      '=',
      '"Lucas"',
      'edad',
      '=',
      '21',
      'print',
      '(',
      'f"Hola, soy {nombre} y tengo {edad} años."',
      ')',
    ],
    hint: 'Usa f-strings para insertar variables dentro del texto.',
    difficulty: 'Fácil',
    language: 'Python',
  },
];
