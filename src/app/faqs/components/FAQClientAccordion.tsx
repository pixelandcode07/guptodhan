'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

export default function FAQClientAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq) => {
        const isOpen = openId === faq._id;

        return (
          <div 
            key={faq._id} 
            className={`border rounded-xl transition-all duration-300 overflow-hidden ${
              isOpen ? 'border-[#00005E]/20 bg-[#00005E]/5 shadow-sm' : 'border-gray-200 bg-white hover:border-[#00005E]/30'
            }`}
          >
            <button
              onClick={() => toggle(faq._id)}
              className="w-full flex justify-between items-center p-5 md:p-6 text-left focus:outline-none"
            >
              <span className={`font-semibold text-base md:text-lg pr-4 transition-colors ${isOpen ? 'text-[#00005E]' : 'text-gray-800'}`}>
                {faq.question}
              </span>
              <div className={`p-1 rounded-full transition-colors ${isOpen ? 'bg-[#00005E]/10' : 'bg-gray-100'}`}>
                <ChevronDown 
                  className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#00005E]' : 'text-gray-500'}`} 
                />
              </div>
            </button>
            
            <div 
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0 text-gray-600 text-sm md:text-base leading-relaxed">
                <div className="h-px w-full bg-gray-200 mb-4 opacity-50"></div>
                {/* HTML content handling (in case answer contains HTML from a rich text editor) */}
                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}