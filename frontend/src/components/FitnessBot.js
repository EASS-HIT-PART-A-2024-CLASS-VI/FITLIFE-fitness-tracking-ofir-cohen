import React, { useState } from 'react';
import './FitnessBot.css';
import fitnessBotImage from '../assets/fitness-bot-image.jpg';

function FitnessBot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    const question = userInput.trim();
    if (!question) return;

    // 1) Add user's message to chat
    setMessages(prev => [...prev, { sender: 'user', text: question }]);
    setUserInput('');
    setIsLoading(true);

    try {
      // 2) Send request to chatbot microservice
      const response = await fetch('http://localhost:8001/chatbot/llm_chatbot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.detail || 'Error from chatbot backend');
      }

      // 3) Extract the bot's answer
      const data = await response.json();
      const botReply = data.response || 'No response received.';

      // 4) Add bot's message to chat
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (err) {
      console.error('Error in chatbot request:', err);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'An error occurred. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Press Enter to send
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fitness-bot-container">
      <div className="fitness-bot-header">
        <h2>FITNESS BOT</h2>
        <img 
          src={fitnessBotImage} 
          alt="Fitness Bot" 
          className="fitness-bot-image" 
        />
      </div>

      <div className="messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message bot-msg">
            Thinking...
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask a fitness/nutrition question..."
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default FitnessBot;