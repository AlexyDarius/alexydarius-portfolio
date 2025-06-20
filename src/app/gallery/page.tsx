import { Flex } from "@/once-ui/components";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import { baseURL } from "@/app/resources";
import { gallery, person } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";
import type { Language } from '@/atoms/language';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const params = await searchParams;
  const language = (params?.lang === 'FR' ? 'FR' : 'EN') as Language;

  // Import the correct content based on language
  const content = language === 'FR' 
    ? await import('@/app/resources/content.fr')
    : await import('@/app/resources/content');
  
  const { gallery } = content;
  const title = gallery.title;
  const description = gallery.description;
  const ogImage = `${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseURL}/gallery?lang=${language}`,
      siteName: content.person.name,
      locale: language === 'FR' ? 'fr_FR' : 'en_US',
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      languages: {
        'en': `${baseURL}/gallery?lang=EN`,
        'fr': `${baseURL}/gallery?lang=FR`,
        'x-default': `${baseURL}/gallery?lang=EN`
      }
    }
  };
}

export default function Gallery() {
  return (
    <Flex maxWidth="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={gallery.title}
        description={gallery.description}
        path={gallery.path}
        image={`${baseURL}/og?title=${encodeURIComponent(gallery.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${gallery.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <MasonryGrid />
    </Flex>
  );
}
