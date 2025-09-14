import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [storyIndex, setStoryIndex] = useState(0);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [sentimentResult, setSentimentResult] = useState(null);
  const [storyData, setStoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000/api';

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/story`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStoryData(data);
      } catch (err) {
        setError('Failed to fetch story data. Please make sure the backend server is running.');
        console.error('Fetching error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStoryData();
  }, []);

  const handleNext = () => {
    setStoryIndex(prevIndex => prevIndex + 1);
  };

  const handleExerciseClick = (option) => {
    const currentData = storyData[storyIndex];
    const isCorrect = option === currentData.answer;
    setMessageType(isCorrect ? 'correct' : 'incorrect');
    setMessage(isCorrect ? "Correct! You're a great detective!" : "Not quite, try again!");
  };

  const handleAnalyze = async () => {
    if (userInput.trim() === '') {
      setMessageType('info');
      setMessage("Please type a sentence first.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/analyze-sentiment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: userInput }),
      });
      if (!response.ok) {
        throw new Error('Sentiment analysis failed.');
      }
      const data = await response.json();
      
      let result;
      if (data.sentiment === 'POSITIVE') {
        result = { label: 'POSITIVE', color: 'bg-green-500', emoji: '😊' };
      } else if (data.sentiment === 'NEGATIVE') {
        result = { label: 'NEGATIVE', color: 'bg-red-500', emoji: '😔' };
      } else {
        result = { label: 'NEUTRAL', color: 'bg-gray-500', emoji: '😐' };
      }
      setSentimentResult(result);
    } catch (err) {
      setMessageType('error');
      setMessage('An error occurred during sentiment analysis.');
      console.error('Analysis error:', err);
    }
  };

  const handleMessageDismiss = () => {
    setMessage(null);
    setMessageType(null);
    if (messageType === 'correct') {
      handleNext();
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="text-center text-xl font-semibold text-blue-500 mt-4">Loading the story...</div>
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-lg font-semibold text-red-500">{error}</div>;
    }
    
    const currentData = storyData[storyIndex];
    if (!currentData) return null;

    switch (currentData.type) {
      case 'story':
        return (
          <div className="text-base sm:text-lg" dangerouslySetInnerHTML={{ __html: currentData.text }} />
        );
      case 'exercise':
        return (
          <div>
            <div className="text-base sm:text-lg" dangerouslySetInnerHTML={{ __html: currentData.text }} />
            <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4 mt-6">
              {currentData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleExerciseClick(option)}
                  className="bg-purple-500 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-full shadow-lg hover:bg-purple-600 transition-colors transform hover:scale-105 w-full md:w-auto"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      case 'demo':
        return (
          <div>
            <div className="text-base sm:text-lg" dangerouslySetInnerHTML={{ __html: currentData.text }} />
            <textarea
              id="userInput"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full h-24 p-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-200 transition-all resize-none shadow-inner"
              placeholder="Type your sentence here..."
            />
            {sentimentResult && (
              <div
                className={`mt-6 p-6 rounded-2xl text-center text-2xl font-bold text-white transition-all duration-300 ${sentimentResult.color}`}
              >
                {sentimentResult.emoji} {sentimentResult.label}
              </div>
            )}
            <button
              onClick={handleAnalyze}
              className="bg-teal-500 text-white font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-full shadow-lg hover:bg-teal-600 transition-all transform hover:scale-105 mt-4 w-full md:w-auto"
            >
              Analyze
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const currentItemType = storyData[storyIndex]?.type;
  const showNextButton = currentItemType === 'story' && storyIndex < storyData.length - 1;

  return (
    <div className="bg-slate-50 min-h-screen flex justify-center items-start pt-8 sm:pt-16 font-sans">
      <div className="main-container bg-white p-6 sm:p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col gap-6 sm:gap-8 w-full mx-4 sm:mx-8 max-w-2xl">

        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-700 pb-2 mb-2 drop-shadow-md">
            The Thought-O-Meter
          </h1>
          <p className="text-gray-500 text-base sm:text-lg">A story about feelings in words!</p>
        </header>

        <div id="content" className="flex flex-col gap-6 text-gray-700 leading-relaxed">
          {renderContent()}
        </div>

        <div className="flex justify-center mt-4 gap-4">
          {showNextButton && (
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-full shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 animate-pulse-slow w-full md:w-auto"
            >
              Next
            </button>
          )}
        </div>

      </div>

      {/* Message Box */}
      {message && (
        <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 sm:p-8 rounded-3xl shadow-2xl z-50 text-center transition-all duration-500 border-4 w-11/12 max-w-sm
          ${messageType === 'correct' ? 'bg-green-50 border-green-500 text-green-700' :
          messageType === 'incorrect' ? 'bg-red-50 border-red-500 text-red-700' :
          'bg-gray-50 border-gray-500 text-gray-800'}`}>
          <div className="text-4xl mb-4">
            {messageType === 'correct' ? '👍' :
             messageType === 'incorrect' ? '👎' :
             '💬'}
          </div>
          <p className="text-xl font-bold">{message}</p>
          <button
            onClick={handleMessageDismiss}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-full mt-4 hover:bg-gray-300 transition-colors transform hover:scale-105"
          >
            Got it!
          </button>
        </div>
      )}
    </div>
  );
}

export default App
