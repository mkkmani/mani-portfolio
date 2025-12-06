'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '@/lib/faq-data';

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  description?: string;
}

export default function FAQSection({ faqs, title = 'Frequently Asked Questions', description }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
        {description && (
          <p className="text-foreground/60 text-lg">{description}</p>
        )}
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 overflow-hidden transition-all hover:border-accent/30"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left transition-colors hover:bg-white/5"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <h3 className="text-lg md:text-xl font-bold pr-8">
                {faq.question}
              </h3>
              <ChevronDown
                size={24}
                className={`flex-shrink-0 text-accent transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                  }`}
              />
            </button>

            <div
              id={`faq-answer-${index}`}
              className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
            >
              <div className="px-6 pb-5 pt-2">
                <p className="text-foreground/70 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
