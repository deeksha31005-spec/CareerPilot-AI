import dotenv from 'dotenv';

dotenv.config();

console.log(
  'OpenRouter key loaded:',
  process.env.OPENROUTER_API_KEY ? 'YES' : 'NO'
);

export const analyzeResumeWithAI = async (
  resumeText,
  targetRole
) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error(
        'OPENROUTER_API_KEY is not configured.'
      );
    }

    const prompt = `
You are an ATS resume analyzer.

Analyze this resume for the target role.

TARGET ROLE:
${targetRole || 'Software Engineer'}

RESUME:
${resumeText}

Return ONLY valid JSON.
Do not use markdown.
Keep every value very short.

Use exactly:

{
  "atsScore": 0,
  "summary": "",
  "strengths": [],
  "missingSkills": [],
  "missingKeywords": [],
  "improvements": [],
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
- atsScore: integer from 0 to 100.
- strengths: exactly 3 short items.
- missingSkills: maximum 4 short items.
- missingKeywords: maximum 5 short items.
- improvements: exactly 3 very short actionable items.
- Each sectionAnalysis value must be very short.
- summary must be maximum 2 short sentences.
- Do not invent information.
- If a section is missing, say "Section missing."
- Focus on internships and entry-level jobs.
- Make sure the JSON is complete and valid.
`;

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',

        headers: {
          'Authorization': `Bearer ${apiKey}`,
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
          max_tokens: 500
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        'OpenRouter API Error:',
        data
      );

      throw new Error(
        data?.error?.message ||
        `OpenRouter API request failed with status ${response.status}.`
      );
    }

    const content =
      data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error(
        'AI returned an empty response.'
      );
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

    let analysis;

    try {
      analysis = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error(
        'Invalid AI JSON:',
        cleanedContent
      );

      throw new Error(
        'AI returned incomplete or invalid JSON. Please try analyzing the resume again.'
      );
    }

    return analysis;

  } catch (error) {
    console.error(
      'AI Resume Analysis Error:',
      error
    );

    throw new Error(
      error.message ||
      'Failed to analyze resume with AI.'
    );
  }
};