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
            className={`border rounded-lg transition-all duration-200 overflow-hidden ${
              isOpen ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
          >
            <button
              onClick={() => toggle(faq._id)}
              className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
            >
              <span className={`font-semibold text-sm md:text-base pr-4 ${isOpen ? 'text-[#00005E]' : 'text-gray-800'}`}>
                {faq.question}
              </span>
              <ChevronDown 
                className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} 
              />
            </button>
            
            <div 
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-5 pt-0 text-gray-600 text-sm md:text-base leading-relaxed border-t border-gray-100/50">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}