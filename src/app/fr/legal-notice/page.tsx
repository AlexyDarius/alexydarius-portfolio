import { redirect } from 'next/navigation';

export default function FrenchLegalNotice() {
  redirect('/legal-notice?lang=FR');
} 