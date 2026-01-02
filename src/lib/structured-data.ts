import { SiteConfig } from './seo-config';
import { IBlog, IProject } from '@/types/api';
import { IPreparation, IMessage } from '@/services/api/preparation';


interface Thing {
  '@type': string;
  '@id'?: string;
  name?: string;
  url?: string;
  description?: string;
}

interface Person extends Thing {
  '@type': 'Person';
  name: string;
  url: string;
  jobTitle?: string;
  email?: string;
  sameAs?: string[];
  worksFor?: Organization[];
  hasOccupation?: {
    '@type': 'Occupation';
    name: string;
    description: string;
    occupationLocation: {
      '@type': 'City';
      name: string;
    };
  };
}

interface Organization extends Thing {
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: ContactPoint;
}

interface ContactPoint {
  '@type': 'ContactPoint';
  contactType: string;
  email?: string;
  url?: string;
}

interface ProfessionalService extends Thing {
  '@type': 'ProfessionalService';
  name: string;
  url: string;
  image?: string;
  address?: {
    '@type': 'PostalAddress';
    addressLocality: string;
    addressCountry: string;
  };
  priceRange: string;
}

interface SiteNavigationElement extends Thing {
  '@type': 'SiteNavigationElement';
  hasPart: ListItem[];
}

interface Blog extends Thing {
  '@type': 'Blog';
  name: string;
  description: string;
  url: string;
  author?: Person;
}

interface BlogPosting extends Thing {
  '@type': 'BlogPosting';
  headline: string;
  description?: string;
  datePublished: string;
  dateModified?: string;
  author: Person;
  publisher?: Organization;
  articleBody?: string;
  image?: string;
  keywords?: string;
  url: string;
  mainEntityOfPage?: string;
}

interface QAPage extends Thing {
  '@type': 'QAPage';
  name: string;
  mainEntity: Question;
}

interface Question extends Thing {
  '@type': 'Question';
  name: string;
  text?: string;
  dateCreated?: string;
  answerCount?: number;
  acceptedAnswer?: Answer;
  suggestedAnswer?: Answer[];
}

interface Answer extends Thing {
  '@type': 'Answer';
  text: string;
  dateCreated?: string;
  author?: Person;
}

interface FAQPage extends Thing {
  '@type': 'FAQPage';
  mainEntity: Question[];
}

interface ListItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
  url?: string;
  description?: string;
}

interface BreadcrumbList extends Thing {
  '@type': 'BreadcrumbList';
  itemListElement: ListItem[];
}

interface ItemList extends Thing {
  '@type': 'ItemList';
  name: string;
  description: string;
  itemListElement: ListItem[];
  numberOfItems: number;
}

interface ProfilePage extends Thing {
  '@type': 'ProfilePage';
  mainEntity: Person;
}

interface SoftwareSourceCode extends Thing {
  '@type': 'SoftwareSourceCode';
  name: string;
  description: string;
  codeRepository: string;
  runtimePlatform?: string;
  programmingLanguage: string | string[];
  author: Person;
}

interface WebSite extends Thing {
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  author?: Person;
  potentialAction?: SearchAction;
}

interface SearchAction {
  '@type': 'SearchAction';
  target: string;
  'query-input': string;
}

interface SoftwareApplication extends Thing {
  '@type': 'SoftwareApplication';
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  offers?: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
}

interface WithContext<T> {
  '@context': 'https://schema.org';
  [key: string]: any;
}

export interface FAQItem {
  question: string;
  answer: string;
}


export function generatePersonSchema(config: SiteConfig): WithContext<Person> {
  const sameAs: string[] = [];

  if (config.social.github) sameAs.push(config.social.github);
  if (config.social.linkedin) sameAs.push(config.social.linkedin);
  if (config.social.twitter) {
    const twitterUrl = config.social.twitter.startsWith('http')
      ? config.social.twitter
      : `https://twitter.com/${config.social.twitter.replace('@', '')}`;
    sameAs.push(twitterUrl);
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Manikanta Ketha',
    alternateName: 'Mani Kanta',
    url: config.url,
    jobTitle: config.author.jobTitle,
    email: config.author.email,
    description: config.description,
    knowsAbout: [
      'Full Stack Development',
      'MERN Stack',
      'Next.js',
      'React',
      'Node.js',
      'MongoDB',
      'TypeScript',
      'JavaScript',
      'Cloud Architecture',
      'AI Integration'
    ],
    alumniOf: {
      '@type': 'Organization',
      name: 'PureCode Software'
    },
    worksFor: [
      {
        '@type': 'Organization',
        name: 'PureCode Software',
        url: 'https://purecode.ai'
      }
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Software Engineer',
      description: 'Full-stack development, AI integration, and architecting scalable web solutions.',
      occupationLocation: {
        '@type': 'City',
        name: 'India'
      }
    },
    brand: {
      '@type': 'Brand',
      name: 'Manikanta Ketha'
    },
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

export function generateProfessionalServiceSchema(config: SiteConfig): WithContext<ProfessionalService> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: config.name,
    url: config.url,
    image: `${config.url}${config.ogImage}`,
    description: 'Expert Full-stack MERN development and Next.js optimization services.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'India',
      addressCountry: 'IN',
    },
    priceRange: '$$',
  };
}

export function generateNavigationSchema(navItems: Array<{ name: string; url: string }>, config: SiteConfig): WithContext<SiteNavigationElement> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    hasPart: navItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `${config.url}${item.url}`,
    })),
  };
}

export function generateOrganizationSchema(config: SiteConfig): WithContext<Organization> {
  const sameAs: string[] = [];
  if (config.social.github) sameAs.push(config.social.github);
  if (config.social.linkedin) sameAs.push(config.social.linkedin);
  if (config.social.twitter) sameAs.push(config.social.twitter);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    url: config.url,
    logo: `${config.url}${config.ogImage}`,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Professional',
      email: config.author.email,
      url: `${config.url}/contact`,
    },
  };
}

export function generateWebsiteSchema(config: SiteConfig): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    url: config.url,
    description: config.description,
    author: {
      '@type': 'Person',
      name: config.author.name,
      url: config.url,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${config.url}/notelogs?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}


export function generateBlogSchema(config: SiteConfig): WithContext<Blog> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${config.name} - Notelogs`,
    description: 'Technical articles, tutorials, and insights on web development, MERN stack, and modern technologies.',
    url: `${config.url}/notelogs`,
    author: {
      '@type': 'Person',
      name: config.author.name,
      url: config.url,
      jobTitle: config.author.jobTitle,
    },
  };
}

export function generateBlogPostingSchema(
  blog: IBlog,
  config: SiteConfig
): WithContext<BlogPosting> {
  const blogUrl = `${config.url}/notelogs/${blog.slug}`;

  const articleBody = blog.content
    ? blog.content
      .replace(/[#*`_~\[\]()]/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .substring(0, 500)
    : blog.excerpt;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      '@type': 'Person',
      name: config.author.name,
      url: config.url,
      jobTitle: config.author.jobTitle,
    },
    publisher: {
      '@type': 'Organization',
      name: config.name,
      url: config.url,
      logo: `${config.url}${config.ogImage}`,
    },
    articleBody,
    image: blog.image ? `${config.url}${blog.image}` : `${config.url}${config.ogImage}`,
    keywords: blog.tags.join(', '),
    url: blogUrl,
    mainEntityOfPage: blogUrl,
  };
}

export function generateQAPageSchema(
  preparation: IPreparation,
  config: SiteConfig
): WithContext<QAPage> {
  const prepUrl = `${config.url}/interview-prep/${preparation.slug}`;

  const qaMessages = preparation.messages.filter(
    (msg) => msg.role === 'user' || msg.role === 'assistant'
  );

  const suggestedAnswers: Answer[] = [];
  for (let i = 0; i < qaMessages.length; i++) {
    if (qaMessages[i].role === 'assistant') {
      suggestedAnswers.push({
        '@type': 'Answer',
        text: qaMessages[i].content.substring(0, 500),
        dateCreated: qaMessages[i].createdAt,
        author: {
          '@type': 'Person',
          name: 'AI Interview Coach',
          url: config.url,
        },
      });
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    name: preparation.title,
    mainEntity: {
      '@type': 'Question',
      name: preparation.topic,
      text: preparation.excerpt,
      dateCreated: preparation.createdAt,
      answerCount: suggestedAnswers.length,
      suggestedAnswer: suggestedAnswers.length > 0 ? suggestedAnswers : undefined,
    },
  };
}


export function generateFAQPageSchema(
  faqs: FAQItem[],
  config: SiteConfig
): WithContext<FAQPage> {
  const mainEntity: Question[] = faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
}


export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url?: string }>,
  config: SiteConfig
): WithContext<BreadcrumbList> {
  const itemListElement: ListItem[] = breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: crumb.url ? `${config.url}${crumb.url}` : undefined,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}



export function generateProjectsSchema(
  projects: IProject[],
  config: SiteConfig
): WithContext<ItemList> {
  const itemListElement: ListItem[] = projects.map((project, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: project.title,
    url: project.link || project.github,
    description: project.description,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${config.name} - Projects`,
    description: 'Portfolio of web development projects showcasing expertise in modern technologies.',
    itemListElement,
    numberOfItems: projects.length,
  };
}

export function generateProfilePageSchema(config: SiteConfig): WithContext<ProfilePage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `${config.name} Professional Profile`,
    mainEntity: generatePersonSchema(config),
  };
}

export function generateSoftwareSourceCodeSchema(
  project: IProject,
  config: SiteConfig
): WithContext<SoftwareSourceCode> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.title,
    description: project.description,
    codeRepository: project.github || '',
    programmingLanguage: project.tags,
    author: generatePersonSchema(config),
    runtimePlatform: project.tags.includes('Node.js') ? 'Node.js' : undefined,
  };
}

export function generateSoftwareApplicationSchema(
  project: IProject,
  config: SiteConfig
): WithContext<SoftwareApplication> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    url: project.link || config.url,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}
