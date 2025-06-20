import { redirect } from 'next/navigation';

export default function FrenchBlog() {
  redirect('/blog?lang=FR');
} 