import dotenv from 'dotenv';

dotenv.config();

const callOpenRouter = async (prompt) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured.');
  }

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
        temperature: 0.3,
        max_tokens: 500
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error('OpenRouter Interview Error:', data);

    throw new Error(
      data?.error?.message ||
      `OpenRouter request failed with status ${response.status}.`
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

  try {
    return JSON.parse(cleanedContent);
  } catch (error) {
    console.error('Invalid Interview AI JSON:', cleanedContent);

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

Return ONLY valid JSON.
Do not use markdown.

Use exactly this structure:

{
  "questions": [
    {
      "question": "",
      "category": ""
    }
  ]
}

Rules:
- Generate exactly 4 questions.
- Keep questions short and clear.
- Match the target role.
- Match the interview type.
- Match the difficulty.
- For Technical: ask technical questions.
- For HR: ask behavioral questions.
- For Coding: ask coding/problem-solving questions.
- For Mixed: combine technical and behavioral questions.
- Do not provide answers.
`;

  return await callOpenRouter(prompt);
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

Return ONLY valid JSON.
Do not use markdown.

Use exactly this structure:

{
  "score": 0,
  "feedback": "",
  "strengths": [],
  "improvements": []
}

Rules:
- score must be an integer from 0 to 100.
- feedback must be maximum 2 short sentences.
- strengths: maximum 3 short items.
- improvements: maximum 3 short items.
- Be constructive and beginner-friendly.
- Evaluate relevance, clarity, correctness and completeness.
- Do not invent information about the candidate.
`;

  return await callOpenRouter(prompt);
};