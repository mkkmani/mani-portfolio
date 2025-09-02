import { ReactNode } from 'react';

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export const SectionWrapper = ({ 
  id, 
  children, 
  className = '' 
}: SectionWrapperProps) => {
  return (
    <section 
      id={id}
      className={`min-h-screen w-full flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="w-full max-w-6xl mx-auto">
        {children}
      </div>
    </section>
  );
};
