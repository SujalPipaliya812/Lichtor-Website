import './globals.css';

export const metadata = {
  title: { default: 'LICHTOR | Premium LED Lighting Solutions by Dharmjivan Industries', template: '%s | LICHTOR' },
  description: "LICHTOR - India's trusted manufacturer of high-performance LED lighting solutions for residential, commercial, and industrial applications. By Dharmjivan Industries.",
  keywords: ['LED lights', 'LED lighting', 'panel lights', 'downlighters', 'tube lights', 'street lights', 'flood lights', 'industrial lights', 'India', 'LICHTOR', 'Dharmjivan Industries'],
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%230066CC' width='100' height='100' rx='20'/%3E%3Cpath fill='white' d='M50 20L30 50h15v30h10V50h15z'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
