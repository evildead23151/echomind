// File: lib/assemblyai.ts

// --- IMPORTANT ---
// Replace 'YOUR_ASSEMBLYAI_API_KEY' with your actual key.
const API_KEY = 'YOUR_ASSEMBLYAI_API_KEY'; 

// 1. Upload the local file to a temporary URL
export const uploadAudio = async (uri: string) => {
  console.log('Uploading audio from:', uri);
  
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        authorization: API_KEY,
        'Content-Type': 'application/octet-stream',
      },
      body: blob,
    });

    const uploadData = await uploadResponse.json();
    if (uploadData.upload_url) {
      console.log('Upload successful. URL:', uploadData.upload_url);
      return uploadData.upload_url;
    } else {
      console.error('Upload failed. Server response:', uploadData);
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('An error occurred during upload:', error);
    throw error;
  }
};

// 2. Submit the audio for transcription
export const transcribeAudio = async (audio_url: string) => {
  console.log('Submitting for transcription...');
  try {
    const response = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        authorization: API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ audio_url }),
    });

    const data = await response.json();
    if (data.id) {
      console.log('Transcription submitted. ID:', data.id);
      return data.id;
    } else {
      console.error('Transcription submission failed:', data);
      throw new Error('Transcription submission failed');
    }
  } catch (error) {
    console.error('An error occurred during transcription submission:', error);
    throw error;
  }
};

// 3. Poll for the transcription result
export const getTranscriptionResult = async (id: string): Promise<string> => {
  console.log('Polling for result...');
  const endpoint = `https://api.assemblyai.com/v2/transcript/${id}`;

  while (true) {
    try {
      const response = await fetch(endpoint, {
        headers: { authorization: API_KEY },
      });
      const data = await response.json();

      if (data.status === 'completed') {
        console.log('Transcription completed!');
        return data.text;
      } else if (data.status === 'failed') {
        console.error(`Transcription failed: ${data.error}`);
        throw new Error(`Transcription failed: ${data.error}`);
      } else {
        console.log('Transcription status:', data.status, '...retrying in 3 seconds.');
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
        console.error('An error occurred while polling for transcription result:', error);
        throw error;
    }
  }
};
