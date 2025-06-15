"use client";

import { Flex, Heading, Text, Badge } from "@/once-ui/components";
import { useAtom } from 'jotai';
import { languageAtom } from '@/atoms/language';
import { legal as legalEN } from "../resources/content";
import { legal as legalFR } from "../resources/content.fr";

export default function PrivacyPolicyPage() {
  const [language] = useAtom(languageAtom);
  const legal = language === 'EN' ? legalEN : legalFR;
  const content = legal.privacyPolicy;

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
        <Text variant="body-default-s" onBackground="neutral-weak">
          {language === 'EN' ? 'Last updated' : 'Dernière mise à jour'}: {content.lastUpdated}
        </Text>
      </Flex>

      <Flex direction="column" gap="l">
        {/* Introduction */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.introduction.title}
          </Heading>
          <Text variant="body-default-m">
            {content.sections.introduction.content}
          </Text>
        </Flex>

        {/* Data Controller */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.dataController.title}
          </Heading>
          <Text variant="body-default-m">
            <strong>{language === 'EN' ? 'Name' : 'Nom'}: </strong>{content.sections.dataController.content.name}<br />
            <strong>Email: </strong>{content.sections.dataController.content.email}<br />
            <strong>{language === 'EN' ? 'Address' : 'Adresse'}: </strong>{content.sections.dataController.content.address}
          </Text>
        </Flex>

        {/* Data Types */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.dataTypes.title}
          </Heading>
          <Flex direction="column" gap="xs">
            {content.sections.dataTypes.items.map((item, index) => (
              <Text key={index} variant="body-default-m">• {item}</Text>
            ))}
          </Flex>
        </Flex>

        {/* Purpose */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.purpose.title}
          </Heading>
          <Text variant="body-default-m">
            {content.sections.purpose.content}
          </Text>
          <Flex direction="column" gap="xs">
            {content.sections.purpose.items.map((item, index) => (
              <Text key={index} variant="body-default-m">• {item}</Text>
            ))}
          </Flex>
        </Flex>

        {/* Processors */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.processors.title}
          </Heading>
          <Text variant="body-default-m">
            {content.sections.processors.content}
          </Text>
          <Flex direction="column" gap="s">
            <Flex direction="column" gap="xs">
              <Text variant="body-default-m">
                <strong>{content.sections.processors.vercel.name}</strong> ({content.sections.processors.vercel.role})
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {content.sections.processors.vercel.address}
              </Text>
              <Text variant="body-default-s">
                {language === 'EN' ? 'Privacy Policy' : 'Politique de confidentialité'}: {content.sections.processors.vercel.privacy}
              </Text>
            </Flex>
            <Text variant="body-default-m">• {content.sections.processors.analytics}</Text>
          </Flex>
        </Flex>

        {/* Retention */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.retention.title}
          </Heading>
          <Text variant="body-default-m">
            {content.sections.retention.content}
          </Text>
        </Flex>

        {/* Rights */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.rights.title}
          </Heading>
          <Text variant="body-default-m">
            {content.sections.rights.content}
          </Text>
          <Flex direction="column" gap="xs">
            {content.sections.rights.items.map((item, index) => (
              <Text key={index} variant="body-default-m">• {item}</Text>
            ))}
          </Flex>
        </Flex>

        {/* Cookies */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.cookies.title}
          </Heading>
          <Text variant="body-default-m">
            {content.sections.cookies.content}
          </Text>
        </Flex>

        {/* Security */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.security.title}
          </Heading>
          <Text variant="body-default-m">
            {content.sections.security.content}
          </Text>
        </Flex>

        {/* Contact */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.contact.title}
          </Heading>
          <Text variant="body-default-m">
            {content.sections.contact.content}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
} 