import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const generateCareerRoadmapWithAI = async (
  resumeText,
  targetRole
) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        'GEMINI_API_KEY is not configured.'
      );
    }

    const prompt = `
You are an AI career advisor.

Create a short personalized career roadmap based on the resume and target role.

TARGET ROLE:
${targetRole || 'Software Engineer'}

RESUME:
${resumeText}

Return ONLY one valid JSON object.
Keep every value very short.

Use exactly:

{
  "targetRole": "",
  "currentLevel": "",
  "careerSummary": "",
  "skillGap": [],
  "roadmap": [
    {
      "phase": 1,
      "title": "",
      "duration": "",
      "skills": [],
      "tasks": []
    },
    {
      "phase": 2,
      "title": "",
      "duration": "",
      "skills": [],
      "tasks": []
    },
    {
      "phase": 3,
      "title": "",
      "duration": "",
      "skills": [],
      "tasks": []
    }
  ],
  "recommendedProjects": [],
  "recommendedCertifications": []
}

Rules:
- targetRole: target job role.
- currentLevel: beginner, intermediate, or advanced.
- careerSummary: maximum 10 words.
- skillGap: maximum 5 short items.
- roadmap: exactly 3 phases.
- Each phase: maximum 4 skills.
- Each phase: maximum 3 tasks.
- Each skill/task: maximum 5 words.
- recommendedProjects: maximum 3 short items.
- recommendedCertifications: maximum 3 short items.
- Do not invent experience or skills.
- Focus on internships and entry-level jobs.
- Keep the JSON compact.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',

      contents: prompt,

      config: {
        maxOutputTokens: 1200,

        thinkingConfig: {
          thinkingLevel: 'minimal'
        },

        responseMimeType: 'application/json'
      }
    });

    const content = response.text;

    if (!content) {
      throw new Error(
        'AI returned an empty response.'
      );
    }

    console.log(
      'Gemini Career Roadmap response received successfully.'
    );

    let roadmap;

    try {
      roadmap = JSON.parse(content);
    } catch (parseError) {
      console.error(
        'Invalid Gemini Roadmap JSON:',
        content
      );

      throw new Error(
        'AI returned incomplete or invalid JSON. Please try again.'
      );
    }

    return roadmap;

  } catch (error) {
    console.error(
      'Career Roadmap AI Error:',
      error
    );

    throw new Error(
      error.message ||
      'Failed to generate career roadmap.'
    );
  }
};