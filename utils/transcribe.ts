// utils/transcribe.ts

export async function transcribeAudio(uri: string, apiKey: string): Promise<string> {
  // 1. Upload audio file
  const audioData = await fetch(uri);
  const audioBlob = await audioData.blob();

  const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
    method: "POST",
    headers: { authorization: apiKey },
    body: audioBlob,
  });

  if (!uploadRes.ok) throw new Error("Upload failed: " + uploadRes.statusText);
  const { upload_url } = await uploadRes.json();

  // 2. Request transcription
  const transcriptRes = await fetch("https://api.assemblyai.com/v2/transcript", {
    method: "POST",
    headers: {
      authorization: apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({ audio_url: upload_url }),
  });

  if (!transcriptRes.ok) throw new Error("Transcription request failed: " + transcriptRes.statusText);
  const { id } = await transcriptRes.json();

  // 3. Poll for completion (max 10 tries)
  let status = "queued";
  let text = "";
  let tries = 0;
  while (status !== "completed" && status !== "failed" && tries < 10) {
    await new Promise((res) => setTimeout(res, 3000));
    const pollingRes = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
      headers: { authorization: apiKey },
    });
    const data = await pollingRes.json();
    status = data.status;
    text = data.text;
    tries++;
    if (status === "failed") throw new Error("Transcription failed: " + (data.error || "Unknown error"));
  }

  if (status === "completed") return text;
  throw new Error("Transcription timed out or did not complete.");
}
