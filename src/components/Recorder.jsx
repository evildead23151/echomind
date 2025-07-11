// src/components/Recorder.jsx
import React, { useState, useRef } from "react";
import { transcribeAudio } from "../utils/transcribe";

function Recorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new window.MediaRecorder(stream);
    audioChunks.current = [];
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      // Start transcription
      if (apiKey) {
        transcribe(audioBlob);
      }
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const transcribe = async (audioBlob) => {
    setLoading(true);
    try {
      const text = await transcribeAudio(audioBlob, apiKey);
      setTranscript(text);
    } catch (err) {
      setTranscript("Transcription failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      <input
        type="password"
        placeholder="Paste your OpenAI API key"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
        className="mb-4 px-3 py-2 border rounded"
      />
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-6 py-3 rounded-full text-white font-bold transition ${
          isRecording ? "bg-red-600 animate-pulse" : "bg-green-600"
        }`}
        disabled={!apiKey}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioURL && (
        <audio controls src={audioURL} className="mt-4" />
      )}
      {loading && <div className="text-blue-400">Transcribing...</div>}
      {transcript && (
        <div className="bg-gray-800 text-white rounded p-4 mt-4 w-full max-w-xl">
          <strong>Transcript:</strong>
          <div className="mt-2">{transcript}</div>
        </div>
      )}
    </div>
  );
}

export default Recorder;
