import { useState } from 'react';
import WebcamFeed from './components/WebcamFeed';

function App() {
  const [exercise, setExercise] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">🧍‍♂️ AI Fitness Evaluator</h1>
      <div className="flex gap-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
          onClick={() => setExercise('squats')}
        >
          Start Squats
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl"
          onClick={() => setExercise('pushups')}
        >
          Start Push-Ups
        </button>
      </div>

      {exercise && (
        <WebcamFeed exercise={exercise} />
      )}
    </div>
  );
}

export default App;


