
// This file contains the seed data for the courses.
// In a real application, you would use a script to populate the database from this file.

type Page = {
  title: string;
  order: number;
  content: string; // Markdown content
};

type Lesson = {
  title: string;
  duration: number; // minutes
  pages: Page[];
};

type Module = {
  title: string;
  lessons: Lesson[];
};

export const pythonCourseData: Module[] = [
  {
    title: 'Básico',
    lessons: [
      {
        title: 'Ejecución Secuencial e Instrucciones',
        duration: 8,
        pages: [
          { title: 'Qué es un programa', order: 1, content: '...' },
          { title: 'Ejecución secuencial', order: 2, content: '...' },
          { title: 'Tipos de instrucciones', order: 3, content: '...' },
          { title: 'Sintaxis y errores', order: 4, content: '...' },
        ],
      },
      {
        title: 'Abstracción de Datos',
        duration: 10,
        pages: [
          { title: 'Qué es la abstracción de datos', order: 1, content: '...' },
          { title: 'Datos y tipos de datos en Python', order: 2, content: '...' },
          { title: 'Variables y abstracción', order: 3, content: '...' },
          { title: 'Constantes y mutabilidad', order: 4, content: '...' },
          { title: 'Estructuras de datos simples como abstracciones', order: 5, content: '...' },
          { title: 'Niveles de abstracción', order: 6, content: '...' },
        ],
      },
      {
        title: 'Interacción y Representación de Datos (Entrada y Salida)',
        duration: 9,
        pages: [
          { title: 'Comunicación entre el programa y el usuario', order: 1, content: '...' },
          { title: 'Función input() – Recibir datos del usuario', order: 2, content: '...' },
          { title: 'Función print() – Mostrar información', order: 3, content: '...' },
          { title: 'Representación de datos y formato de salida', order: 4, content: '...' },
          { title: 'Tipos de conversión y manipulación de texto', order: 5, content: '...' },
        ],
      },
      {
        title: 'Listas',
        duration: 12,
        pages: [
          { title: 'Introducción a las listas', order: 1, content: '...' },
          { title: 'Creación y acceso a elementos', order: 2, content: '...' },
          { title: 'Modificación y métodos de listas', order: 3, content: '...' },
          { title: 'Recorridos y operaciones con listas', order: 4, content: '...' },
          { title: 'Listas anidadas y abstracción de datos', order: 5, content: '...' },
          { title: 'Listas por comprensión', order: 6, content: '...' },
        ],
      },
      {
        title: 'Tuplas',
        duration: 7,
        pages: [
          { title: 'Introducción a las tuplas', order: 1, content: '...' },
          { title: 'Creación y acceso a elementos', order: 2, content: '...' },
          { title: 'Inmutabilidad y ventajas', order: 3, content: '...' },
          { title: 'Desempaquetado y operaciones', order: 4, content: '...' },
        ],
      },
      {
        title: 'Conjuntos (Sets)',
        duration: 8,
        pages: [
          { title: 'Introducción a los conjuntos', order: 1, content: '...' },
          { title: 'Creación y propiedades de los sets', order: 2, content: '...' },
          { title: 'Operaciones entre conjuntos', order: 3, content: '...' },
          { title: 'Métodos útiles y recorridos', order: 4, content: '...' },
        ],
      },
      {
        title: 'Diccionarios',
        duration: 10,
        pages: [
          { title: 'Introducción a los diccionarios', order: 1, content: '...' },
          { title: 'Creación y acceso a elementos', order: 2, content: '...' },
          { title: 'Modificación y eliminación', order: 3, content: '...' },
          { title: 'Recorridos y métodos comunes', order: 4, content: '...' },
          { title: 'Diccionarios anidados', order: 5, content: '...' },
        ],
      },
      {
        title: 'Condicionales',
        duration: 10,
        pages: [
          { title: 'Introducción a las condiciones y la toma de decisiones', order: 1, content: '...' },
          { title: 'Estructura if', order: 2, content: '...' },
          { title: 'Estructura if–else', order: 3, content: '...' },
          { title: 'Estructura if–elif–else', order: 4, content: '...' },
          { title: 'Operadores relacionales y lógicos', order: 5, content: '...' },
          { title: 'Condicionales anidados', order: 6, content: '...' },
          { title: 'Expresiones condicionales simplificadas', order: 7, content: '...' },
        ],
      },
      {
        title: 'Bucles',
        duration: 10,
        pages: [
          { title: 'Introducción a los bucles', order: 1, content: '...' },
          { title: 'Bucle while', order: 2, content: '...' },
          { title: 'Bucle for', order: 3, content: '...' },
          { title: 'Función range()', order: 4, content: '...' },
          { title: 'Control de flujo con break y continue', order: 5, content: '...' },
          { title: 'Bucles anidados', order: 6, content: '...' },
          { title: 'Diferencias y buenas prácticas', order: 7, content: '...' },
        ],
      },
    ],
  },
  {
    title: 'Intermedio',
    lessons: [
      {
        title: 'Funciones y Modularidad',
        duration: 12,
        pages: [
          { title: 'Introducción a las funciones', order: 1, content: '...' },
          { title: 'Definición y ejecución de funciones', order: 2, content: '...' },
          { title: 'Parámetros y argumentos', order: 3, content: '...' },
          { title: 'Valores de retorno', order: 4, content: '...' },
          { title: 'Ámbito de variables (scope)', order: 5, content: '...' },
          { title: 'Modularidad y reutilización de código', order: 6, content: '...' },
          { title: 'Funciones integradas y documentación interna', order: 7, content: '...' },
        ],
      },
      {
        title: 'Manejo de Excepciones',
        duration: 10,
        pages: [
          { title: 'Qué es una excepción', order: 1, content: '...' },
          { title: 'Estructura try–except', order: 2, content: '...' },
          { title: 'Tipos comunes de excepciones', order: 3, content: '...' },
          { title: 'Bloques else y finally', order: 4, content: '...' },
          { title: 'Manejo de excepciones anidadas y múltiples', order: 5, content: '...' },
          { title: 'Creación de excepciones personalizadas', order: 6, content: '...' },
        ],
      },
      {
        title: 'Paradigmas de Programación',
        duration: 9,
        pages: [
          { title: 'Concepto de paradigma de programación', order: 1, content: '...' },
          { title: 'Paradigma imperativo', order: 2, content: '...' },
          { title: 'Paradigma estructurado', order: 3, content: '...' },
          { title: 'Paradigma funcional', order: 4, content: '...' },
          { title: 'Paradigma orientado a objetos', order: 5, content: '...' },
          { title: 'Comparación y aplicaciones reales', order: 6, content: '...' },
        ],
      },
      {
        title: 'POO I',
        duration: 12,
        pages: [
          { title: 'Conceptos fundamentales de la POO', order: 1, content: '...' },
          { title: 'Clases y objetos en Python', order: 2, content: '...' },
          { title: 'El método __init__ y los atributos', order: 3, content: '...' },
          { title: 'Métodos de instancia', order: 4, content: '...' },
          { title: 'Variables de clase e instancia', order: 5, content: '...' },
          { title: 'Representación de objetos y el método __str__', order: 6, content: '...' },
          { title: 'Encapsulación básica', order: 7, content: '...' },
        ],
      },
      {
        title: 'POO II',
        duration: 12,
        pages: [
          { title: 'Principios avanzados de la POO', order: 1, content: '...' },
          { title: 'Herencia en Python', order: 2, content: '...' },
          { title: 'Herencia múltiple', order: 3, content: '...' },
          { title: 'Encapsulamiento y métodos getter y setter', order: 4, content: '...' },
          { title: 'Polimorfismo', order: 5, content: '...' },
          { title: 'Sobrescritura de métodos', order: 6, content: '...' },
          { title: 'Clases abstractas e interfaces conceptuales', order: 7, content: '...' },
        ],
      },
      {
        title: 'Estructuras de Datos Fundamentales I',
        duration: 9,
        pages: [
          { title: 'Concepto de archivo y persistencia de datos', order: 1, content: '...' },
          { title: 'Apertura y cierre de archivos', order: 2, content: '...' },
          { title: 'Lectura de archivos', order: 3, content: '...' },
          { title: 'Escritura y adición de contenido', order: 4, content: '...' },
          { title: 'El contexto with y buenas prácticas', order: 5, content: '...' },
          { title: 'Manejo de errores en archivos', order: 6, content: '...' },
        ],
      },
       {
        title: 'Estructuras de Datos Fundamentales II',
        duration: 9,
        pages: [
          { title: 'Repaso de las estructuras de datos principales', order: 1, content: '...' },
          { title: 'Introducción al módulo collections', order: 2, content: '...' },
          { title: 'namedtuple – Tuplas con nombre', order: 3, content: '...' },
          { title: 'deque – Colas dobles', order: 4, content: '...' },
          { title: 'Counter – Contadores de elementos', order: 5, content: '...' },
          { title: 'defaultdict y OrderedDict', order: 6, content: '...' },
        ],
      },
    ],
  },
];
