import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const callGemini = async (prompt, responseSchema) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',

    contents: prompt,

    config: {
      maxOutputTokens: 800,

      thinkingConfig: {
        thinkingLevel: 'minimal'
      },

      responseMimeType: 'application/json',

      responseSchema
    }
  });

  const content = response.text;

  if (!content) {
    throw new Error('AI returned an empty response.');
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    console.error(
      'Invalid Interview Gemini JSON:',
      content
    );

    throw new Error(
      'AI returned incomplete or invalid JSON. Please try again.'
    );
  }
};


export const generateInterviewQuestions = async (
  targetRole,
  interviewType,
  difficulty
) => {

  const prompt = `
You are an AI interview preparation assistant.

Generate interview questions for a student preparing for an entry-level job.

TARGET ROLE:
${targetRole || 'Software Engineer'}

INTERVIEW TYPE:
${interviewType}

DIFFICULTY:
${difficulty}

Generate exactly 4 short questions.

Rules:
- Match the target role.
- Match the interview type.
- Match the difficulty.
- Technical: technical questions.
- HR: behavioral questions.
- Coding: coding/problem-solving questions.
- Mixed: combine technical and behavioral questions.
- Do not provide answers.
`;

  return await callGemini(
    prompt,
    {
      type: 'object',

      properties: {
        questions: {
          type: 'array',

          items: {
            type: 'object',

            properties: {
              question: {
                type: 'string'
              },

              category: {
                type: 'string'
              }
            },

            required: [
              'question',
              'category'
            ]
          }
        }
      },

      required: [
        'questions'
      ]
    }
  );
};


export const evaluateInterviewAnswer = async (
  targetRole,
  question,
  answer
) => {

  const prompt = `
You are an AI interview evaluator.

Evaluate the candidate's answer for an entry-level interview.

TARGET ROLE:
${targetRole || 'Software Engineer'}

QUESTION:
${question}

CANDIDATE ANSWER:
${answer}

Rules:
- score must be 0-100.
- feedback maximum 2 short sentences.
- strengths maximum 3 short items.
- improvements maximum 3 short items.
- Be constructive and beginner-friendly.
- Evaluate relevance, clarity, correctness and completeness.
- Do not invent information about the candidate.
`;

  return await callGemini(
    prompt,
    {
      type: 'object',

      properties: {
        score: {
          type: 'integer'
        },

        feedback: {
          type: 'string'
        },

        strengths: {
          type: 'array',

          items: {
            type: 'string'
          }
        },

        improvements: {
          type: 'array',

          items: {
            type: 'string'
          }
        }
      },

      required: [
        'score',
        'feedback',
        'strengths',
        'improvements'
      ]
    }
  );
};