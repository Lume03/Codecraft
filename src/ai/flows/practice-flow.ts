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

// --- Question Schemas ---
const QuestionSchema = z.object({
  id: z.string().describe('Unique identifier for the question (e.g., "q1").'),
  type: z
    .enum(['single_choice', 'boolean', 'reorder'])
    .describe('The type of question.'),
  text: z.string().describe('The question text.'),
  options: z.array(z.string()).optional().describe('List of options for single_choice or reorder.'),
  correctAnswer: z.union([z.string(), z.boolean(), z.array(z.string())]).describe('The correct answer for the question.'),
});

// --- Input Schema ---
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


// --- Output Schema ---
const GenerateOutputSchema = z.object({
  questions: z.array(QuestionSchema).length(5).describe('An array of 5 generated practice questions.'),
});

const GradingResultSchema = z.object({
    questionId: z.string(),
    isCorrect: z.boolean(),
    correctAnswer: z.union([z.string(), z.boolean(), z.array(z.string())]),
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

// --- Generation Flow ---

const generatePrompt = ai.definePrompt({
  name: 'practiceGeneratePrompt',
  input: { schema: GenerateModeSchema },
  output: { schema: GenerateOutputSchema },
  prompt: `You are an expert educator creating a practice quiz.
- Task: Generate exactly 5 diverse, easy-level questions based on the provided lesson content.
- Course: {{{courseTitle}}}
- Lesson: {{{lessonTitle}}}
- Content:
---
{{{theoryContent}}}
---
- Instructions:
  - Create a mix of 'single_choice', 'boolean', and 'reorder' question types.
  - Ensure the 'correctAnswer' field is accurately filled for each question.
  - Provide unique IDs for each question (e.g., "q1", "q2", ..., "q5").
  - The entire output MUST be a valid JSON object matching the specified schema.
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
    if (!output) {
      throw new Error('AI failed to generate practice questions.');
    }
    return output;
  }
);


// --- Grading Flow (Local Logic for Accuracy and Speed) ---
  
const practiceGradeFlow = ai.defineFlow(
    {
      name: 'practiceGradeFlow',
      inputSchema: GradeModeSchema,
      outputSchema: GradeOutputSchema,
    },
    async (input) => {
      const { questions, answers } = input;
      let score = 0;
      const results: z.infer<typeof GradingResultSchema>[] = [];
  
      for (const q of questions) {
        const userAnswerObj = answers.find(a => a.questionId === q.id);
        const userAnswer = userAnswerObj?.userAnswer;
  
        let isCorrect = false;
        // Deep equality check for arrays, strict equality for others.
        if (Array.isArray(q.correctAnswer) && Array.isArray(userAnswer)) {
          isCorrect = JSON.stringify(q.correctAnswer) === JSON.stringify(userAnswer);
        } else {
          isCorrect = q.correctAnswer === userAnswer;
        }
  
        if (isCorrect) {
          score++;
        }
  
        results.push({
          questionId: q.id,
          isCorrect,
          correctAnswer: q.correctAnswer,
          userAnswer: userAnswer ?? null, // Ensure userAnswer is not undefined
        });
      }
  
      return {
        score,
        maxScore: questions.length as 5,
        approved: score >= 3,
        results,
      };
    }
);
  
// --- EXPORTED HANDLER FUNCTION ---

export async function handlePractice(input: PracticeInput): Promise<PracticeOutput> {
  if (input.mode === 'generate') {
    return practiceGenerateFlow(input);
  } else {
    // For grading, we can do it locally to save tokens and improve speed/accuracy.
    return practiceGradeFlow(input);
  }
}