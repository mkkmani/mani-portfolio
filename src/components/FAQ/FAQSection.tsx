'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQItem } from '@/lib/faq-data';

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  description?: string;
}

export default function FAQSection({ faqs, title = 'FAQs', description }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-48 px-6 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 gap-12">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] text-accent font-black block">
              [ LOG.04 // KNOWLEDGE ]
            </span>
            <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">
              Common<br />Queries
            </h3>
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/20 md:text-right leading-relaxed max-w-xs">
            {description || "// ANSWERS TO COMMON QUESTIONS ABOUT MY PROCESS AND SERVICES."}
          </p>
        </div>

        <div className="max-w-4xl">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-white/5 overflow-hidden group"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full py-10 flex items-center justify-between gap-8 text-left transition-all hover:pl-4"
                aria-expanded={openIndex === index}
              >
                <h3 className={`text-xl md:text-2xl font-black uppercase tracking-tight transition-colors duration-300 ${openIndex === index ? 'text-accent' : 'text-white/80 group-hover:text-white'}`}>
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 text-accent transition-transform duration-500">
                  {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-700 ease-in-out ${openIndex === index ? 'max-h-96 pb-12 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <p className="text-foreground/40 text-lg leading-relaxed lowercase italic max-w-2xl pl-0 md:pl-4 transition-all">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
