import { redirect } from 'next/navigation';

export default function FrenchGallery() {
  redirect('/gallery?lang=FR');
} 