# SecureTravel - Insurance Website (Next.js)

This is a modern, modular travel insurance website built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. The project consolidates three original HTML pages into a unified, scalable application with the App Router architecture.

## 🚀 Features

- **Multi-page Structure**: Home, Plans, and Support pages
- **Modular Components**: Reusable UI components organized by feature
- **Material Design 3**: Custom color system and typography
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Type-safe code throughout the application
- **Image Optimization**: Next.js Image component for performance
- **SEO Optimized**: Metadata configuration for each page

## 📁 Project Structure

```
nextjs-insurance-app/
├── app/
│   ├── layout.tsx              # Root layout with fonts & metadata
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles & Tailwind
│   ├── plans/
│   │   └── page.tsx            # Plans & comparison page
│   └── support/
│       └── page.tsx            # Customer support page
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Main navigation
│   │   └── Footer.tsx          # Site footer
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── TrustBadges.tsx
│   │   ├── WhyInsurance.tsx
│   │   ├── TravelerTypes.tsx
│   │   ├── PricingPlans.tsx
│   │   ├── FAQ.tsx
│   │   └── FinalCTA.tsx
│   ├── plans/
│   │   ├── QuickQuoteWidget.tsx
│   │   ├── BenefitsBento.tsx
│   │   └── DestinationsGrid.tsx
│   └── support/
│       ├── ContactForm.tsx
│       └── WhatsAppMockup.tsx
└── public/
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15.1.0 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.17
- **Fonts**: Google Fonts (Inter, Manrope)
- **Icons**: Material Symbols Outlined

## 🚦 Getting Started

### Installation

```bash
# Navigate to project directory
cd nextjs-insurance-app

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Design System

The project uses a custom Material Design 3 color palette with the following key colors:

- **Primary**: `#000e24` (Deep Blue)
- **Secondary**: `#006e2a` (Green)
- **Background**: `#f8f9ff` (Light Blue)
- **Accent**: Emerald tones for CTAs

### Typography

- **Display Font**: Manrope (700, 600)
- **Body Font**: Inter (400, 500, 600)

## 📄 Pages

### 1. Home (`/`)
- Hero section with CTA
- Trust badges (medical, luggage, 24/7, security)
- Why insurance matters
- Traveler type cards (Families, Individuals, Groups, Students, Business)
- Pricing plans (Basic, Plus, Premium)
- FAQ accordion
- Final CTA

### 2. Plans (`/plans`)
- Hero with overlay image
- Quick quote widget (destination, dates, travelers)
- Benefits bento grid (digital gear, flight delays, coverage minimums, adventure sports)
- Pricing plans comparison
- Detailed comparison table
- Popular destinations grid (Europe, Asia, USA, Oceania)

### 3. Support (`/support`)
- Contact form (name, destination, dates, travelers)
- WhatsApp mockup preview with chat simulation
- Support features (fast response, certified advisors, multilingual)

## 🔧 Configuration

### Tailwind Config

Custom colors, spacing, fonts, and design tokens are defined in `tailwind.config.ts`.

### Next.js Config

Remote image patterns are configured in `next.config.ts` to allow Google User Content images.

## 📦 Dependencies

```json
{
  "next": "^15.1.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5",
  "tailwindcss": "^3.4.17",
  "@tailwindcss/forms": "latest"
}
```

## 🌐 Deployment

This project can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- Any Node.js hosting platform

## 📝 License

Private project - All rights reserved © 2024 SecureTravel Insurance Services

## 🤝 Contributing

This is a private project. For questions or support, contact the development team.
