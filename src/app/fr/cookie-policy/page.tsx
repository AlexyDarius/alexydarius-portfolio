import { redirect } from 'next/navigation';

export default function FrenchCookiePolicy() {
  redirect('/cookie-policy?lang=FR');
} 