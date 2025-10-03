'use server';

/**
 * @fileOverview A flow to generate personalized course recommendations based on user learning history and progress.
 *
 * - getPersonalizedCourseRecommendations - A function that returns personalized course recommendations for a user.
 * - PersonalizedCourseRecommendationsInput - The input type for the getPersonalizedCourseRecommendations function.
 * - PersonalizedCourseRecommendationsOutput - The return type for the getPersonalizedCourseRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedCourseRecommendationsInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  learningHistory: z
    .array(z.string())
    .describe('List of course IDs the user has interacted with.'),
  progressData: z
    .record(z.number())
    .describe(
      'A map of course IDs to progress percentage (0-100) for each course.'
    ),
});
export type PersonalizedCourseRecommendationsInput = z.infer<
  typeof PersonalizedCourseRecommendationsInputSchema
>;

const PersonalizedCourseRecommendationsOutputSchema = z.object({
  courseRecommendations: z
    .array(z.string())
    .describe('List of recommended course IDs.'),
});
export type PersonalizedCourseRecommendationsOutput = z.infer<
  typeof PersonalizedCourseRecommendationsOutputSchema
>;

export async function getPersonalizedCourseRecommendations(
  input: PersonalizedCourseRecommendationsInput
): Promise<PersonalizedCourseRecommendationsOutput> {
  return personalizedCourseRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedCourseRecommendationsPrompt',
  input: {schema: PersonalizedCourseRecommendationsInputSchema},
  output: {schema: PersonalizedCourseRecommendationsOutputSchema},
  prompt: `You are a course recommendation system. Given a user's learning history and their progress in each course, suggest courses that the user might be interested in taking next. Only return course ids.

User ID: {{{userId}}}
Learning History: {{#if learningHistory}}{{#each learningHistory}}- {{{this}}}{{/each}}{{else}}None{{/if}}
Progress Data: {{#each progressData}}{{{@key}}}: {{{this}}}% {{/each}}

Recommended Courses:`, // Enforce returning course ids
});

const personalizedCourseRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedCourseRecommendationsFlow',
    inputSchema: PersonalizedCourseRecommendationsInputSchema,
    outputSchema: PersonalizedCourseRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
