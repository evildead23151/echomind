// src/App.jsx
import Recorder from "./components/Recorder";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <h1 className="text-4xl font-extrabold text-blue-400 mb-4">
        EchoMind MVP
      </h1>
      <p className="text-lg text-gray-300 mb-8">
        Voice-first journaling. Tap to record your thoughts.
      </p>
      <Recorder />
    </div>
  );
}

export default App;
