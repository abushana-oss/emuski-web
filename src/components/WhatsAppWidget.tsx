import React, { useState, useEffect } from 'react';
import { Mail, ChevronRight } from 'lucide-react';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

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
          <ChevronRight className={`w-2 h-2 transform transition-transform duration-300 ${isMinimized ? '' : 'rotate-180'}`} />
        </div>

        {/* WhatsApp & Email Buttons */}
        {!isMinimized && (
          <>
            {/* WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 bg-[#25D366] hover:bg-[#20b85c] text-white transition-all duration-300 group relative"
              title="WhatsApp"
              data-url={whatsappUrl}
              data-tab-setting="hover"
              data-mobile-behavior="disable"
              data-flyout="disable"
            >
              <WhatsAppIcon />
              <div className="absolute right-12 top-0 h-12 bg-[#25D366] group-hover:bg-[#20b85c] flex items-center px-3 rounded-l-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
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
              <Mail className="w-4 h-4" />
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
