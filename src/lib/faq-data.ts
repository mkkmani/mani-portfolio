export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  category: string;
  faqs: FAQItem[];
}


export const homepageFAQs: FAQItem[] = [
  {
    question: 'What technologies do you specialize in?',
    answer: 'I specialize in the MERN stack (MongoDB, Express.js, React, Node.js) along with Next.js, TypeScript, and modern web technologies. I have extensive experience building full-stack applications, RESTful APIs, and responsive user interfaces.',
  },
  {
    question: 'How can I get in touch with you for project collaborations?',
    answer: 'You can reach out to me through the contact page on this website, or connect with me on LinkedIn and GitHub. I\'m always open to discussing new opportunities and interesting projects.',
  },
  {
    question: 'Do you offer freelance or consulting services?',
    answer: 'Yes, I am available for freelance projects and consulting work. Whether you need help with a specific feature, code review, or full project development, feel free to contact me to discuss your requirements.',
  },
  {
    question: 'What kind of projects have you worked on?',
    answer: 'I have worked on various projects including e-commerce platforms, social media applications, portfolio websites, and AI-powered tools. You can check out my projects section to see detailed case studies and live demos.',
  },
  {
    question: 'Do you provide mentorship or interview preparation help?',
    answer: 'Yes! I offer AI-powered interview preparation sessions through this platform where you can practice technical interviews and get personalized feedback. Visit the Interview Prep section to get started.',
  },
];


export const interviewPrepFAQs: FAQItem[] = [
  {
    question: 'How does the AI interview preparation work?',
    answer: 'Our AI interview coach conducts personalized interview sessions based on your selected topic and difficulty level. You can practice answering technical questions and receive detailed feedback to improve your interview skills.',
  },
  {
    question: 'What topics are covered in the interview preparation?',
    answer: 'We cover a wide range of topics including JavaScript, React, Node.js, Data Structures, Algorithms, System Design, and more. You can choose your topic of interest and difficulty level before starting a session.',
  },
  {
    question: 'Can I save my interview practice sessions?',
    answer: 'Yes, all your practice sessions are automatically saved so you can review them later and track your progress over time.',
  },
  {
    question: 'Is the interview preparation free?',
    answer: 'Yes, the basic interview preparation features are completely free to use. You can start unlimited practice sessions and access all published study guides.',
  },
];

export const notelogsFAQs: FAQItem[] = [
  {
    question: 'How often do you publish new articles?',
    answer: 'I publish new technical articles regularly, covering topics like web development, MERN stack tutorials, best practices, and insights from real-world projects. Subscribe to stay updated with the latest posts.',
  },
  {
    question: 'Can I request topics for future articles?',
    answer: 'Absolutely! I welcome topic suggestions from readers. Feel free to reach out through the contact page or social media with topics you\'d like me to cover.',
  },
  {
    question: 'Are the code examples in the articles production-ready?',
    answer: 'Yes, all code examples are tested and follow best practices. However, always review and adapt them to fit your specific use case and requirements.',
  },
];
