import dotenv from 'dotenv';

dotenv.config();

export const generateCareerRoadmapWithAI = async (
  resumeText,
  targetRole
) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured.');
    }

    const prompt = `
You are an AI career advisor.

Create a short personalized career roadmap based on the resume and target role.

TARGET ROLE:
${targetRole || 'Software Engineer'}

RESUME:
${resumeText}

Return ONLY valid JSON.
Do not use markdown.
Keep all text concise.

Use exactly this structure:

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
- careerSummary: maximum 2 short sentences.
- skillGap: maximum 5 short skills.
- roadmap: exactly 3 phases.
- Each phase: maximum 4 skills.
- Each phase: maximum 3 tasks.
- recommendedProjects: maximum 3 projects.
- recommendedCertifications: maximum 3 certifications.
- Keep every item short.
- Do not invent experience or skills that are not present in the resume.
- Focus on internships and entry-level jobs.
- Return complete valid JSON.
`;

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3001',
          'X-Title': 'CareerPilot AI'
        },
        body: JSON.stringify({
          model: 'openai/gpt-chat-latest',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 800
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter API Error:', data);

      throw new Error(
        data?.error?.message ||
        `OpenRouter API request failed with status ${response.status}.`
      );
    }

    const content =
      data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('AI returned an empty response.');
    }

    let cleanedContent = content.trim();

    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent
        .replace(/^```json/, '')
        .replace(/```$/, '')
        .trim();
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent
        .replace(/^```/, '')
        .replace(/```$/, '')
        .trim();
    }

    let roadmap;

    try {
      roadmap = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error(
        'Invalid AI JSON:',
        cleanedContent
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