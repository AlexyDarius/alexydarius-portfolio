import { redirect } from 'next/navigation';

export default function FrenchHome() {
  redirect('/?lang=FR');
} 