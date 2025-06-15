"use client";

import { Flex, Heading, Text } from "@/once-ui/components";
import { useAtom } from 'jotai';
import { languageAtom } from '@/atoms/language';
import { legal as legalEN } from "../resources/content";
import { legal as legalFR } from "../resources/content.fr";

export default function CookiePolicyPage() {
  const [language] = useAtom(languageAtom);
  const legal = language === 'EN' ? legalEN : legalFR;
  const content = legal.cookiePolicy;

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
        {/* What Are Cookies */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.what.title}
          </Heading>
          <Text variant="body-default-m">
            {content.sections.what.content}
          </Text>
        </Flex>

        {/* Types of Cookies */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.types.title}
          </Heading>
          <Text variant="body-default-m">
            <strong>{content.sections.types.essential}</strong><br />
            <strong>{content.sections.types.analytics}</strong>
          </Text>
        </Flex>

        {/* Cookies Used */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.used.title}
          </Heading>
          <Flex direction="column" gap="xs">
            {content.sections.used.items.map((item, index) => (
              <Text key={index} variant="body-default-m">
                • <strong>{item.name}:</strong> {item.purpose}
              </Text>
            ))}
          </Flex>
        </Flex>

        {/* Third-Party Cookies */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.thirdParty.title}
          </Heading>
          <Text variant="body-default-m">
            {content.sections.thirdParty.content}
          </Text>
        </Flex>

        {/* Cookie Duration */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.duration.title}
          </Heading>
          <Text variant="body-default-m">
            • <strong>{content.sections.duration.session}</strong><br />
            • <strong>{content.sections.duration.persistent}</strong>
          </Text>
        </Flex>

        {/* Managing Cookies */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.managing.title}
          </Heading>
          <Text variant="body-default-m">
            {content.sections.managing.content}
          </Text>
        </Flex>

        {/* Consent */}
        <Flex direction="column" gap="xs">
          <Heading variant="heading-strong-m">
            {content.sections.consent.title}
          </Heading>
          <Text variant="body-default-m">
            {content.sections.consent.content}
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