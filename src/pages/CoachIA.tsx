import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const CoachIA = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¿Puedo comer pan con mi gelatina?",
      isUser: true,
    },
    {
      id: 2,
      text: "¡Hola! Lo ideal es evitar carbohidratos refinados justo con la gelatina para maximizar el efecto metabólico. ¡Sigue así! 💚",
      isUser: false,
    },
  ]);

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputValue,
        isUser: true,
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: messages.length + 2,
          text: "¡Gracias por tu pregunta! Estoy aquí para ayudarte con tu plan metabólico. 🌟",
          isUser: false,
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with dark gradient and gold accents */}
      <header className="relative bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-800 pt-12 pb-8 px-5 rounded-b-[2rem] overflow-hidden">
        {/* Diagonal gold lines pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 30px,
              rgba(197, 160, 89, 0.15) 30px,
              rgba(197, 160, 89, 0.15) 31px
            )`
          }}
        />
        
        {/* Corner decorative lines */}
        <div className="absolute top-8 right-4 w-12 h-12">
          <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-[#C5A059]/50 to-transparent" />
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-[#C5A059]/50 to-transparent" />
          <div className="absolute top-4 right-4 w-6 h-px bg-[#C5A059]/30 rotate-45 origin-right" />
        </div>
        
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-12 left-5 text-[#C5A059] hover:text-[#D4B068] transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        
        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-[#C5A059] relative z-10">
          Tu Coach Metabólico 🤖
        </h1>
      </header>

      {/* Chat Area */}
      <main className="flex-1 bg-[#FAF9F6] px-5 py-6 overflow-y-auto pb-24">
        <div className="space-y-4 max-w-md mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-start" : "justify-end"}`}
            >
              {message.isUser ? (
                /* User Message */
                <div className="bg-white border border-[#C5A059] rounded-2xl px-4 py-3 max-w-[85%] shadow-sm">
                  <p className="text-zinc-900 text-sm leading-relaxed">
                    {message.text}
                  </p>
                </div>
              ) : (
                /* AI Message */
                <div className="flex items-end gap-2 max-w-[85%]">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-sm">👩</span>
                  </div>
                  
                  {/* Message bubble */}
                  <div className="bg-[#D4E4BC] rounded-2xl px-4 py-3 shadow-sm">
                    <p className="text-zinc-800 text-sm leading-relaxed">
                      {message.text}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FAF9F6] px-5 py-4 border-t border-zinc-200/50">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="w-full bg-white border border-[#C5A059]/40 rounded-full px-5 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30 transition-all"
            />
          </div>
          
          {/* Send Button */}
          <button
            onClick={handleSend}
            className="w-12 h-12 bg-[#C5A059] hover:bg-[#B48F48] rounded-full flex items-center justify-center shadow-lg shadow-[#C5A059]/20 transition-all hover:scale-105 active:scale-95"
          >
            <Send size={20} className="text-white -rotate-45" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoachIA;
