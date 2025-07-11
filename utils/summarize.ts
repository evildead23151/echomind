// utils/summarize.ts
export async function summarizeJournalEntry(transcript: string, openAIApiKey: string): Promise<string> {
  const prompt = `
You are a journaling assistant. Turn this transcript into a reflective, emotionally intelligent journal entry.

Transcript:
${transcript}

Return Format:
- Journal Title
- Entry Text
- Emotions Detected
- Tags
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAIApiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 512,
      temperature: 0.8,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error("GPT API failed: " + (data?.error?.message || response.statusText));
  return data.choices?.[0]?.message?.content || "No summary generated.";
}
