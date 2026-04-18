import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "model", text: "Hello! I am your store assistant. How can I help you today?" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { backendUrl, token } = useContext(ShopContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMessage = { role: "user", text: inputVal };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInputVal("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/ai/chat`,
        { 
          message: userMessage.text,
          history: currentMessages.slice(0, -1) // send previous history
        },
        { headers: { token: token || "" } } // token might be empty if guest
      );

      if (response.data.success) {
        setMessages((prev) => [...prev, { role: "model", text: response.data.message }]);
      } else {
        setMessages((prev) => [...prev, { role: "model", text: "Sorry, I am having trouble connecting right now." }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "model", text: "An error occurred while sending your message." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white border rounded-lg shadow-xl w-80 sm:w-96 h-[400px] flex flex-col mb-4 overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white px-4 py-3 flex justify-between items-center rounded-t-lg">
            <h3 className="font-semibold text-lg">Store Assistant AI</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-300 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                    msg.role === "user" 
                      ? "bg-black text-white rounded-br-none" 
                      : "bg-gray-200 text-black rounded-bl-none"
                  }`}
                >
                  {/* Basic markdown simulation by splitting newlines */}
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>{line}<br/></span>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-black px-3 py-2 rounded-lg rounded-bl-none text-sm animate-pulse">
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="border-t p-3 bg-white flex gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={token ? "Ask me anything..." : "Please login for full features..."}
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-black"
            />
            <button 
              type="submit" 
              disabled={isLoading || !inputVal.trim()}
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 disabled:bg-gray-400 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={toggleChat}
        className={`${isOpen ? 'hidden' : 'flex'} items-center justify-center w-14 h-14 bg-black text-white rounded-full shadow-lg hover:scale-105 transition-transform`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 pb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
};

export default Chatbot;
