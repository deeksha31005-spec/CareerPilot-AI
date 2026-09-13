import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

console.log(
  'Gemini key loaded:',
  process.env.GEMINI_API_KEY ? 'YES' : 'NO'
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const analyzeResumeWithAI = async (
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
Analyze this resume for the target role.

TARGET ROLE:
${targetRole || 'Software Engineer'}

RESUME:
${resumeText}

Return ONLY one valid JSON object.

Keep every answer extremely short.

Use exactly:

{
  "atsScore": 0,
  "summary": "",
  "strengths": ["", "", ""],
  "missingSkills": [],
  "missingKeywords": [],
  "improvements": ["", "", ""],
  "sectionAnalysis": {
    "contact": "",
    "summary": "",
    "skills": "",
    "education": "",
    "experience": "",
    "projects": "",
    "certifications": ""
  }
}

Rules:
- atsScore must be 0-100.
- summary: maximum 10 words.
- strengths: exactly 3 items, maximum 5 words each.
- missingSkills: maximum 4 items, maximum 4 words each.
- missingKeywords: maximum 5 items, maximum 3 words each.
- improvements: exactly 3 items, maximum 6 words each.
- sectionAnalysis: maximum 5 words per value.
- If a section is missing, use "Section missing."
- Do not invent information.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',

      contents: prompt,

      config: {
  maxOutputTokens: 1000,

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
      'Gemini response received successfully.'
    );

    let analysis;

    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      console.error(
        'Invalid Gemini JSON:',
        content
      );

      throw new Error(
        'AI returned incomplete or invalid JSON. Please try analyzing the resume again.'
      );
    }

    return analysis;

  } catch (error) {
    console.error(
      'Gemini Resume Analysis Error:',
      error
    );

    throw new Error(
      error.message ||
      'Failed to analyze resume with AI.'
    );
  }
};