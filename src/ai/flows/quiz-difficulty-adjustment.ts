'use server';

/**
 * @fileOverview A quiz difficulty adjustment AI agent.
 *
 * - adjustQuizDifficulty - A function that handles the quiz difficulty adjustment process.
 * - AdjustQuizDifficultyInput - The input type for the adjustQuizDifficulty function.
 * - AdjustQuizDifficultyOutput - The return type for the adjustQuizDifficulty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustQuizDifficultyInputSchema = z.object({
  userLearningHistory: z
    .string()
    .describe('The learning history of the user, including completed courses, quiz scores, and areas of strength and weakness.'),
  currentQuizDifficulty: z
    .string()
    .describe('The current difficulty level of the quiz (e.g., easy, medium, hard).'),
});
export type AdjustQuizDifficultyInput = z.infer<typeof AdjustQuizDifficultyInputSchema>;

const AdjustQuizDifficultyOutputSchema = z.object({
  adjustedQuizDifficulty: z
    .string()
    .describe('The adjusted difficulty level of the quiz, based on the user learning history.'),
  explanation: z
    .string()
    .describe('An explanation of why the quiz difficulty was adjusted.'),
});
export type AdjustQuizDifficultyOutput = z.infer<typeof AdjustQuizDifficultyOutputSchema>;

export async function adjustQuizDifficulty(input: AdjustQuizDifficultyInput): Promise<AdjustQuizDifficultyOutput> {
  return adjustQuizDifficultyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adjustQuizDifficultyPrompt',
  input: {schema: AdjustQuizDifficultyInputSchema},
  output: {schema: AdjustQuizDifficultyOutputSchema},
  prompt: `You are an AI quiz difficulty adjuster. You will analyze the user's learning history and the current quiz difficulty, and suggest an adjusted quiz difficulty level.

  User Learning History: {{{userLearningHistory}}}
  Current Quiz Difficulty: {{{currentQuizDifficulty}}}

  Based on the user's learning history, should the quiz difficulty be adjusted? If so, should it be increased, decreased, or stay the same?
  Explain your reasoning and provide the adjusted quiz difficulty level.

  Adjusted Quiz Difficulty: {{adjustedQuizDifficulty}}
  Explanation: {{explanation}}`,
});

const adjustQuizDifficultyFlow = ai.defineFlow(
  {
    name: 'adjustQuizDifficultyFlow',
    inputSchema: AdjustQuizDifficultyInputSchema,
    outputSchema: AdjustQuizDifficultyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
