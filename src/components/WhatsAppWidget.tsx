import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaTimes, FaRobot } from 'react-icons/fa';

interface WhatsAppWidgetProps {
  phoneNumber: string; 
  message?: string;
  companyName?: string;
  replyTimeText?: string;
}

const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({ 
  phoneNumber, 
  message = "Hello! I would like to know more about EMUSKI services.",
  companyName = "EMUSKI Support",
  replyTimeText = "Typically replies within an hour"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeString, setTimeString] = useState(""); 

  useEffect(() => {
    setTimeString(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[99999] flex flex-col items-end gap-4 pointer-events-none" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>

      {/* Chat Window */}
      <div
        className={`
          w-80 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-95 opacity-0 translate-y-10 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="bg-emuski-teal-darker p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaRobot className="text-white w-6 h-6" /> 
            </div>
            <div>
              <h3 className="font-bold text-sm">{companyName}</h3>
              <p className="text-xs text-green-100">{replyTimeText}</p>
            </div>
          </div>
          <button onClick={toggleChat} className="text-white/80 hover:text-white" aria-label="Close chat">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="bg-[#E5DDD5] p-5 h-64 overflow-y-auto bg-opacity-30 relative">
           <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'radial-gradient(#4a4a4a 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
           <div className="relative z-10 bg-white p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl shadow-sm max-w-[85%] text-sm text-gray-800 mb-2">
              <span className="font-semibold text-emuski-teal-darker text-xs block mb-1">{companyName}</span>
              Hi there! 👋 <br/>
              How can we help you with your manufacturing and engineering needs today?
              <span className="block text-[10px] text-gray-400 text-right mt-1">
                {timeString}
              </span>
           </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-gray-100">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20b85c] text-white font-medium py-2.5 rounded-full transition-colors duration-200 shadow-md"
          >
            <FaWhatsapp className="w-5 h-5" />
            Start Chat
          </a>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`
            relative group hover:cursor-pointer flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110 pointer-events-auto
            ${isOpen ? 'bg-gray-700  rotate-90' : 'bg-[#25D366] hover:bg-[#20b85c]'}
        `}
        aria-label="Toggle Chat"
      >
         {isOpen ? (
             <FaTimes className="w-6 h-6  text-white transition-transform duration-300" />
         ) : (
            <>
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping -z-10"></span>
                <FaWhatsapp className="w-8 h-8 text-white" />
                <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white transform translate-x-1 -translate-y-1"></span>
            </>
         )}
      </button>

    </div>
  );
};

export default WhatsAppWidget;
