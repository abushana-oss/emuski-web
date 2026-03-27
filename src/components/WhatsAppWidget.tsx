import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaTimes, FaRobot, FaEnvelope, FaChevronRight } from 'react-icons/fa';

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
  const [isMinimized, setIsMinimized] = useState(false);
  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    setTimeString(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const toggleMinimize = () => setIsMinimized(!isMinimized);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">

      {/* Connected Widget Stack */}
      <div className="shadow-xl rounded-l-lg overflow-hidden">

        {/* Minimize/Expand Button Tab */}
        <div
          className="bg-black text-white cursor-pointer flex items-center justify-center w-12 h-8 hover:bg-gray-800 transition-colors"
          onClick={toggleMinimize}
        >
          <FaChevronRight className={`w-2 h-2 transform transition-transform duration-300 ${isMinimized ? '' : 'rotate-180'}`} />
        </div>

        {/* WhatsApp & Email Buttons */}
        {!isMinimized && (
          <>
            {/* WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-10 bg-[#25D366] hover:bg-[#20b85c] text-white transition-all duration-300 group relative"
              title="WhatsApp"
              data-url={whatsappUrl}
              data-tab-setting="hover"
              data-mobile-behavior="disable"
              data-flyout="disable"
            >
              <FaWhatsapp className="w-4 h-4" />
              <div className="absolute right-12 top-0 h-10 bg-[#25D366] group-hover:bg-[#20b85c] flex items-center px-3 rounded-l-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                <span className="text-sm font-medium">WhatsApp</span>
              </div>
            </a>

            {/* Email Button */}
            <a
              href="mailto:enquiries@emuski.com?subject=Inquiry%20about%20EMUSKI%20Manufacturing%20Services&body=Hello%20EMUSKI%20Team,%0A%0AI%20would%20like%20to%20know%20more%20about%20your%20manufacturing%20and%20engineering%20services.%0A%0APlease%20get%20back%20to%20me%20at%20your%20earliest%20convenience.%0A%0AThank%20you!"
              className="flex items-center justify-center w-12 h-10 bg-emuski-teal hover:bg-emuski-teal-darker text-white transition-all duration-300 group relative"
              title="Mail us"
              data-url="mailto:enquiries@emuski.com"
              data-tab-setting="hover"
              data-mobile-behavior="disable"
              data-flyout="disable"
            >
              <FaEnvelope className="w-4 h-4" />
              <div className="absolute right-12 top-0 h-10 bg-emuski-teal group-hover:bg-emuski-teal-darker flex items-center px-3 rounded-l-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                <span className="text-sm font-medium">Mail us</span>
              </div>
            </a>
          </>
        )}

      </div>
    </div>
  );
};

export default WhatsAppWidget;
