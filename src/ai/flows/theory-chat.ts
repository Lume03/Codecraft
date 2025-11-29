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

export async function theoryChatFlow(
    input: TheoryChatInput
): Promise<{ text: string }> {
    const { history, lessonContext, userQuery, userName } = input;

    // Build a robust system prompt with token optimization in mind
    const systemPrompt = `
      Eres Raven AI, un tutor experto de programación en la app RavenCode.
      Estás ayudando a ${userName || 'el estudiante'} con una lección específica.
      
      CONTEXTO DE LA LECCIÓN ACTUAL (Máximo 15000 caracteres):
      """
      ${lessonContext.substring(0, 15000)}
      """

      PROTOCOLO DE RESPUESTA (CRÍTICO - DEBES SEGUIRLO EXACTAMENTE):
      
      1. **LÍMITE ESTRICTO:** Máximo 80 palabras. Cuenta las palabras antes de responder.
      
      2. **ESTRUCTURA SIMPLE:**
         - Primera línea: Define el concepto con **negritas**
         - Segunda parte: Un ejemplo de código CORTO (máximo 3 líneas)
         - Tercera parte: Una oración explicativa (opcional)
      
      3. **CÓDIGO CORTO:**
         - Si es 1 línea: usa inline \`codigo\`
         - Si son 2-3 líneas: usa bloque \`\`\`
        - NUNCA más de 3 líneas de código

    4. ** PROHIBIDO:**
        - Listas numeradas largas
            - Múltiples párrafos
                - Explicaciones detalladas paso a paso
                    - Frases introductorias

    5. ** FORMATO OBLIGATORIO:**
      
      ** Concepto clave ** es[definición breve en una línea].

    \`\`\`python
      [código ejemplo]
      \`\`\`
      
      [Una oración de contexto]

      EJEMPLO CORRECTO (56 palabras):
      User: "¿Qué es una instrucción de entrada?"
      Raven AI: "Una **instrucción de entrada** (\`input()\`) recibe datos del usuario durante la ejecución.
      
      \`\`\`python
      nombre = input("¿Tu nombre? ")
      print(f"Hola {nombre}")
      \`\`\`
      
      El programa pausa hasta que el usuario escribe algo y presiona Enter."
    `;
    // Generate the chat response using the Gemini model
    // Format history as a string for the prompt
    const historyText = history.map((m) => `${m.role === 'user' ? 'User' : 'Model'}: ${m.content}`).join('\n\n');
    const fullPrompt = `${systemPrompt}\n\n${historyText}\n\nUser: ${userQuery}`;

    const response = await ai.generate({
        prompt: fullPrompt,
        config: {
            // Lower temperature for more factual, less creative answers
            temperature: 0.2,
        },
    });

    return { text: response.text };
}
