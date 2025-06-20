import { Flex, Heading, Text } from "@/once-ui/components";
import { generateLegalPageMetadata } from "@/app/utils/metadata";
import type { Language } from '@/atoms/language';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  return generateLegalPageMetadata('legalNotice', searchParams);
}

export default async function LegalNoticePage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const params = await searchParams;
  const language = (params?.lang === 'FR' ? 'FR' : 'EN') as Language;

  // Import the correct content based on language
  const contentModule = language === 'FR' 
    ? await import('@/app/resources/content.fr')
    : await import('@/app/resources/content');
    
  const legal = contentModule.legal;
  const content = legal.legalNotice;

  return (
    <Flex
      direction="column"
      maxWidth="l"
      paddingX="l"
      paddingY="m"
      gap="m"
    >
      <Flex direction="column" gap="xs">
        <Heading wrap="balance" variant="display-strong-s">
          {content.title}
        </Heading>
      </Flex>

      <Flex direction="column" gap="l">
        {/* Website Owner */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.owner.title}
          </Heading>
          <Text variant="body-default-m">
            {content.sections.owner.content}
          </Text>
        </Flex>

        {/* Contact */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.contact.title}
          </Heading>
          <Text variant="body-default-m">
            <strong>Email: </strong>{content.sections.contact.email}<br />
            <strong>{language === 'EN' ? 'Address' : 'Adresse'}: </strong>{content.sections.contact.address}<br />
            <strong>{language === 'EN' ? 'Website' : 'Site web'}: </strong>{content.sections.contact.website}
          </Text>
        </Flex>

        {/* Hosting Provider */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.hosting.title}
          </Heading>
          <Text variant="body-default-m">
            <strong>{content.sections.hosting.name}</strong><br />
            {content.sections.hosting.address.map((line, index) => (
              <span key={index}>{line}<br /></span>
            ))}
            <strong>{language === 'EN' ? 'Website' : 'Site web'}: </strong>{content.sections.hosting.website}
          </Text>
        </Flex>

        {/* Responsible for Content */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.responsible.title}
          </Heading>
          <Text variant="body-default-m">
            {content.sections.responsible.content}
          </Text>
        </Flex>

        {/* Disclaimer */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {language === 'EN' ? 'Disclaimer' : 'Clause de non-responsabilité'}
          </Heading>
          <Text variant="body-default-m">
            {content.sections.disclaimer.content}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
} 