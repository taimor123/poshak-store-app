import { siteConfig } from '@/config/site';

/** WhatsApp chat link with an optional pre-filled message. */
export const whatsappHref = (text?: string) =>
  `https://wa.me/${siteConfig.contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const emailHref = (subject?: string) => `mailto:${siteConfig.contact.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
