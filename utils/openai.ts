import axios from 'axios';

import { OPENAI_API_KEY } from '@env';


export async function summarizeWithOpenAI(prompt: string): Promise<string> {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 128,
      temperature: 0.7,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    }
  );
  // Return the summary text
  return response.data.choices[0].message.content.trim();
}
