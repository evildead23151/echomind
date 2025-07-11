// src/utils/transcribe.js

export async function transcribeAudio(audioBlob, openAIApiKey) {
  // Convert blob to base64
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBase64 = btoa(
    new Uint8Array(arrayBuffer)
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  );

  // Prepare form data for Whisper API
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");
  formData.append("model", "whisper-1");

  // Call OpenAI Whisper API
  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAIApiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Transcription failed");
  }

  const result = await response.json();
  return result.text; // The transcribed text
}
