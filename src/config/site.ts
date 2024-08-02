export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'SB Suite',
  description:
    'A simple app that allows you to keep track of your small business.',
  mainNav: [
    {
      title: 'Dashboard',
      href: '/'
    }
  ],
  links: {
    stripe: 'https://dashboard.stripe.com'
  }
};
