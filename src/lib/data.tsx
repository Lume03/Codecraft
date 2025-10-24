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
  correctOrder?: string[]; // for reorder
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
        { id: 'py-m1', title: 'Getting Started', type: 'theory', contentId: 'py-intro' },
        { id: 'py-m2', title: 'Syntax Basics', type: 'theory', contentId: 'py-syntax' },
        { id: 'py-m3', title: 'First Quiz', type: 'quiz', contentId: 'py-quiz-1' },
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
      { id: 'js-m1', title: 'Introduction', type: 'theory', contentId: 'js-intro' },
      { id: 'js-m2', title: 'Variables Quiz', type: 'quiz', contentId: 'js-quiz-1' },
      { id: 'js-m3', title: 'Data Types', type: 'theory', contentId: 'js-data-types' },
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
        { id: 'cpp-m1', title: 'C++ Foundations', type: 'theory', contentId: 'cpp-intro' },
        { id: 'cpp-m2', title: 'First Steps Quiz', type: 'quiz', contentId: 'cpp-quiz-1' },
    ],
  },
];

export const theoryContent: Record<string, { title: string; pages: string[] }> = {
  'js-intro': {
    title: 'Introduction to JavaScript',
    pages: [
      'JavaScript is a high-level, interpreted programming language. It is a language which is also characterized as dynamic, weakly typed, prototype-based and multi-paradigm.',
      'Alongside HTML and CSS, JavaScript is one of the three core technologies of the World Wide Web. JavaScript enables interactive web pages and thus is an essential part of web applications.',
    ],
  },
   'js-data-types': {
    title: 'JavaScript Data Types',
    pages: [
      'JavaScript has several primitive data types: `String`, `Number`, `BigInt`, `Boolean`, `Undefined`, `Null`, and `Symbol`.',
      'There is also a complex data type: `Object`. Arrays and Functions are specialized objects.',
      'Example of declaring variables:\n```javascript\nlet name = "CodeCraft";\nconst score = 100;\nlet isComplete = false;\n```'
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
        text: '¿Es `null` un objeto en JavaScript?',
        correctAnswer: true,
      },
      {
        id: 'q3',
        type: 'complete_sentence',
        text: 'El operador `===` en JavaScript comprueba tanto el valor como el ____.',
        correctAnswer: 'type',
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
        text: 'Completa el código para mostrar una alerta con "Hello, World!".',
        codeSnippet: 'alert("___, ___!");',
        blocks: ['Hello', 'World', 'CodeCraft'],
        correctAnswer: ['Hello', 'World'],
      },
    ],
  },
  // Add other quizzes here...
];
