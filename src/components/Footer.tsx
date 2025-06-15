"use client";

import { Flex, IconButton, SmartLink, Text } from "@/once-ui/components";
import { person, social } from "@/app/resources/content";
import { useAtom } from 'jotai';
import { languageAtom } from '@/atoms/language';
import styles from "./Footer.module.scss";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [language] = useAtom(languageAtom);

  // Legal page names based on language
  const legalPageNames = {
    privacyPolicy: language === 'EN' ? 'Privacy Policy' : 'Politique de confidentialité',
    legalNotice: language === 'EN' ? 'Legal Notice' : 'Mentions légales',
    cookiePolicy: language === 'EN' ? 'Cookie Policy' : 'Politique de cookies'
  };

  return (
    <Flex
      as="footer"
      fillWidth
      padding="8"
      horizontal="center"
      mobileDirection="column"
    >
      <Flex
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="space-between"
        vertical="center"
      >
        <Text variant="body-default-s" onBackground="neutral-strong">
          <Text onBackground="neutral-weak">© {currentYear} /</Text>
          <Text paddingX="4">{person.name}</Text>
          <Text onBackground="neutral-weak">
            {/* Usage of this template requires attribution. Please don't remove the link to Once UI. */}
            / Built using {" "}
            <SmartLink
              href="https://once-ui.com"
            >
              Once UI
            </SmartLink>
          </Text>
        </Text>
        <Flex gap="16">
          {social.map(
            (item) =>
              item.link && (
                <IconButton
                  key={item.name}
                  href={item.link}
                  icon={item.icon}
                  tooltip={item.name}
                  size="s"
                  variant="ghost"
                />
              ),
          )}
        </Flex>
      </Flex>
      
      {/* Legal Links */}
      <Flex 
        maxWidth="m" 
        paddingX="16" 
        paddingBottom="8"
        gap="8" 
        horizontal="center" 
        wrap
      >
        <SmartLink 
          href="/privacy-policy"
          style={{ 
            fontSize: '12px', 
            color: 'var(--neutral-weak)',
            textDecoration: 'none'
          }}
        >
          {legalPageNames.privacyPolicy}
        </SmartLink>
        <Text 
          variant="body-default-xs" 
          onBackground="neutral-weak"
          style={{ fontSize: '12px' }}
        >
          •
        </Text>
        <SmartLink 
          href="/legal-notice"
          style={{ 
            fontSize: '12px', 
            color: 'var(--neutral-weak)',
            textDecoration: 'none'
          }}
        >
          {legalPageNames.legalNotice}
        </SmartLink>
        <Text 
          variant="body-default-xs" 
          onBackground="neutral-weak"
          style={{ fontSize: '12px' }}
        >
          •
        </Text>
        <SmartLink 
          href="/cookie-policy"
          style={{ 
            fontSize: '12px', 
            color: 'var(--neutral-weak)',
            textDecoration: 'none'
          }}
        >
          {legalPageNames.cookiePolicy}
        </SmartLink>
      </Flex>
      
      <Flex height="80" show="s"></Flex>
    </Flex>
  );
};
