'use server';

/**
 * @fileOverview A contextual AI tutor for theory lessons.
 *
 * - theoryChatFlow - A function that handles chat interactions within a lesson context.
 * - TheoryChatInputSchema - The input type for the theoryChatFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the input schema: chat history + lesson context + current question
const TheoryChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
    })
  ),
  lessonContext: z.string().describe('The full text of the current lesson.'),
  userQuery: z.string().describe('The current question from the user.'),
  userName: z.string().optional().describe("The user's name."),
});
export type TheoryChatInput = z.infer<typeof TheoryChatInputSchema>;

export const theoryChatFlow = ai.defineFlow(
  {
    name: 'theoryChatFlow',
    inputSchema: TheoryChatInputSchema,
    outputSchema: z.object({ text: z.string() }),
  },
  async (input) => {
    const { history, lessonContext, userQuery, userName } = input;

    // Build a robust system prompt with token optimization in mind
    const systemPrompt = `
      Eres Raven AI, un tutor experto de programación en la app RavenCode.
      Estás ayudando a ${userName || 'el estudiante'} con una lección específica.
      
      CONTEXTO DE LA LECCIÓN ACTUAL (Máximo 15000 caracteres):
      """
      ${lessonContext.substring(0, 15000)}
      """

      PROTOCOLO DE RESPUESTA (ESTRICTO):
      1. **LÍMITE DE LONGITUD:** Tu respuesta NO PUEDE exceder las 40 palabras. Sé telegráfico.
      2. **CERO RELLENO:** Prohibido usar frases introductorias ("Claro", "Es una buena pregunta", "En programación..."), despedidas o analogías ("Imagina que..."). Ve directo a la definición.
      3. **SOLO HECHOS:** Define el concepto basándote *exclusivamente* en el contexto proporcionado.
      4. **CÓDIGO:** Incluye código SOLO si es vital para entender, y máximo 1 línea.
      5. **FORMATO:** Usa negritas para el concepto principal. Evita listas a menos que sean estrictamente necesarias (máx 2 ítems).

      EJEMPLO CORRECTO:
      User: "¿Qué es un error de sintaxis?"
      Raven AI: "Es una violación de las reglas gramaticales del lenguaje, como olvidar un paréntesis. Impide que el programa se ejecute."

      EJEMPLO INCORRECTO (LO QUE NO DEBES HACER):
      Raven AI: "¡Hola! Un error de sintaxis es como cuando escribes mal en español... [explicación larga]... Por ejemplo..."
    `;

    // Generate the chat response using the Gemini model
    const response = await ai.generate({
      prompt: userQuery,
      history: [
        { role: 'system', content: systemPrompt },
        ...history,
      ],
      config: {
        // Lower temperature for more factual, less creative answers
        temperature: 0.2,
      }
    });

    return { text: response.text };
  }
);
