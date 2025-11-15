'use server';
/**
 * @fileOverview An AI agent for generating and grading practice questions.
 *
 * - handlePractice - A function that handles question generation and grading.
 * - PracticeInput - The input type for the handlePractice function.
 * - PracticeOutput - The return type for the handlePractice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// --- Esquemas de Preguntas ---
const QuestionSchema = z.object({
  id: z.string().describe('Unique identifier for the question (e.g., "q1").'),
  type: z
    .enum(['single_choice', 'boolean', 'reorder'])
    .describe('The type of question.'),
  text: z.string().describe('The question text.'),
  options: z.array(z.string()).optional().describe('List of options for single_choice or reorder.'),
  correctAnswer: z.union([z.string(), z.boolean(), z.array(z.string())]).describe('The correct answer for the question.'),
});
type Question = z.infer<typeof QuestionSchema>;

// --- Esquema de Entrada ---
const GenerateModeSchema = z.object({
  mode: z.literal('generate'),
  courseTitle: z.string().describe('Title of the course.'),
  lessonTitle: z.string().describe('Title of the lesson.'),
  theoryContent: z
    .string()
    .describe('The full Markdown content of the lesson theory.'),
});

const UserAnswerSchema = z.object({
    questionId: z.string(),
    userAnswer: z.union([z.string(), z.boolean(), z.array(z.string())]),
});

const GradeModeSchema = z.object({
  mode: z.literal('grade'),
  questions: z.array(QuestionSchema).describe("The original questions that were given to the user."),
  answers: z.array(UserAnswerSchema).describe("The user's answers."),
});

export const PracticeInputSchema = z.union([
  GenerateModeSchema,
  GradeModeSchema,
]);
export type PracticeInput = z.infer<typeof PracticeInputSchema>;


// --- Esquema de Salida ---
const GenerateOutputSchema = z.object({
  questions: z.array(QuestionSchema).length(5).describe('An array of 5 generated practice questions.'),
});

const GradingResultSchema = z.object({
    questionId: z.string(),
    isCorrect: z.boolean(),
    correctAnswer: z.union([z.string(), z.boolean(), z.array(z E.string())]),
    userAnswer: z.union([z.string(), z.boolean(), z.array(z.string())]),
});

const GradeOutputSchema = z.object({
  score: z.number().int().min(0).max(5).describe('The number of correct answers.'),
  maxScore: z.literal(5),
  approved: z.boolean().describe('Whether the user passed the practice (score >= 3).'),
  results: z.array(GradingResultSchema).describe('A detailed breakdown of each answer.'),
});

export const PracticeOutputSchema = z.union([
  GenerateOutputSchema,
  GradeOutputSchema,
]);
export type PracticeOutput = z.infer<typeof PracticeOutputSchema>;

// --- Exported Flow ---

export async function handlePractice(input: PracticeInput): Promise<PracticeOutput> {
  if (input.mode === 'generate') {
    return practiceGenerateFlow(input);
  } else {
    return practiceGradeFlow(input);
  }
}

// --- Flujo de Generación ---

const generatePrompt = ai.definePrompt({
  name: 'practiceGeneratePrompt',
  input: { schema: GenerateModeSchema },
  output: { schema: GenerateOutputSchema },
  prompt: `You are an expert educator. Your task is to create a practice quiz with exactly 5 questions based on the provided lesson content.

Course: {{{courseTitle}}}
Lesson: {{{lessonTitle}}}
Content:
---
{{{theoryContent}}}
---

Generate 5 diverse, easy-level questions in the specified JSON format. The question types should be a mix of 'single_choice', 'boolean', and 'reorder'. Ensure the 'correctAnswer' field is accurately filled for each question.
Provide unique IDs for each question (e.g., "q1", "q2", ... "q5").
`,
});

const practiceGenerateFlow = ai.defineFlow(
  {
    name: 'practiceGenerateFlow',
    inputSchema: GenerateModeSchema,
    outputSchema: GenerateOutputSchema,
  },
  async (input) => {
    const { output } = await generatePrompt(input);
    return output!;
  }
);


// --- Flujo de Calificación ---

const gradePrompt = ai.definePrompt({
    name: 'practiceGradePrompt',
    input: { schema: GradeModeSchema },
    output: { schema: GradeOutputSchema },
    prompt: `You are an AI grading assistant. Your task is to evaluate the user's answers against the provided questions and correct answers.
  
  You must return a score, a boolean 'approved' status (true if score is 3 or more), and a detailed result for each question.
  
  The questions and their correct answers are:
  {{#each questions}}
  - Question {{id}}: "{{text}}" | Correct Answer: {{{json correctAnswer}}}
  {{/each}}
  
  The user's submitted answers are:
  {{#each answers}}
  - For Question {{questionId}}: {{{json userAnswer}}}
  {{/each}}
  
  Now, provide the evaluation in the required JSON format.
  `,
  });
  
  const practiceGradeFlow = ai.defineFlow(
    {
      name: 'practiceGradeFlow',
      inputSchema: GradeModeSchema,
      outputSchema: GradeOutputSchema,
    },
    async (input) => {
      const { output } = await gradePrompt(input);
      return output!;
    }
  );
  
