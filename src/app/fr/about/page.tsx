import { redirect } from 'next/navigation';

export default function FrenchAbout() {
  redirect('/about?lang=FR');
} 