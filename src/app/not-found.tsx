import NotFound from "@/components/Common/NotFound";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Manikanta Ketha',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFoundPage() {
  return <NotFound />
}
