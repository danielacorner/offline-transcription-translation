import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, RefreshCw } from 'lucide-react';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lang, setLang] = useState<'ko' | 'en'>('ko');

  const toggleListening = useCallback(() => {
    setIsListening((prevState) => !prevState);
  }, []);

  const switchLanguage = useCallback(() => {
    setLang((prevLang) => (prevLang === 'ko' ? 'en' : 'ko'));
    setTranscript('');
  }, []);

  useEffect(() => {
    let recognition: SpeechRecognition | null = null;

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setTranscript(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
      };
    }

    if (isListening && recognition) {
      recognition.start();
    } else if (!isListening && recognition) {
      recognition.stop();
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening, lang]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Offline Speech Transcription</h1>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={toggleListening}
            className={`flex items-center px-4 py-2 rounded-full ${
              isListening ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {isListening ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
            {isListening ? 'Stop' : 'Start'} Listening
          </button>
          <button
            onClick={switchLanguage}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full"
          >
            <RefreshCw className="mr-2" />
            Switch to {lang === 'ko' ? 'English' : 'Korean'}
          </button>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Transcript ({lang === 'ko' ? 'Korean' : 'English'})</h2>
          <div className="bg-gray-100 p-3 rounded-md min-h-[200px]">{transcript}</div>
        </div>
      </div>
    </div>
  );
}

export default App;