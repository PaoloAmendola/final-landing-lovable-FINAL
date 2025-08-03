# NIVELA® - Bem Beauty Professional Landing Page

## 🚀 Project Overview

**Landing page oficial do produto NIVELA®** - Retexturizador hidro nutritivo sem formol com tecnologia ASTRO QUAT V3® da Bem Beauty Professional.

### 📋 Project Info

- **Project Name:** final-landing-lovable-julho-69  
- **Live URL:** https://final-landing-lovable-julho-69.vercel.app
- **Lovable Project:** https://lovable.dev/projects/5e1da86f-688f-4351-9165-29fdf082ac7d  
- **Supabase Project:** xnexfhgtqlryfkyuvihq  
- **GitHub Repository:** https://github.com/PaoloAmendola/final-landing-lovable-julho-69.git  
- **Status:** 🚀 PRONTO PARA PRODUÇÃO - Deploy Vercel Configurado

### 🛠 Tech Stack

- **Frontend:** React 18.3.1 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn-ui components
- **Backend:** Supabase (Database, Auth, Storage)
- **Deployment:** Vercel
- **Analytics:** Custom analytics system with Web Vitals
- **PWA:** Service Worker + Manifest
- **Performance:** Advanced monitoring and optimization

### ⚡ Performance Features

- Lazy loading for below-the-fold components
- Image optimization with WebP format
- Font preloading and optimization
- Bundle splitting and code optimization
- Critical CSS inlining
- Advanced performance monitoring
- Core Web Vitals tracking

### 🎨 Design System

- Dark premium theme with sophisticated color palette
- Montserrat typography optimized for readability
- Responsive design mobile-first
- Accessibility compliance (WCAG AA)
- Micro-interactions and animations

### 📱 PWA Features

- Installable app experience
- Offline functionality
- Push notifications ready
- App-like navigation
- Service worker optimization

## 🔧 Development

### Prerequisites

- Node.js 18+ & npm
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/PaoloAmendola/final-landing-lovable-julho-69.git

# Navigate to project directory
cd final-landing-lovable-julho-69

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript checking
```

## 🚀 Deployment

### Via Vercel (Recommended)
O projeto está configurado para deploy automático na Vercel com configurações otimizadas:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Framework:** Vite
- **Node Version:** 18.x

### Via Lovable
1. Open [Lovable Project](https://lovable.dev/projects/5e1da86f-688f-4351-9165-29fdf082ac7d)
2. Click Share → Publish
3. Configure custom domain if needed

### Deploy Manual
```bash
npm run build
npm run preview  # Test production build locally
```

## 📊 Analytics & Monitoring

- Custom analytics system integrated
- Performance monitoring with alerts
- Error tracking and reporting
- User journey tracking
- Conversion funnel analysis

## 🎯 SEO Optimization

- Structured data for products and organization
- Meta tags optimization
- Open Graph and Twitter Cards
- XML sitemap generation
- International SEO ready

## ♿ Accessibility

- WCAG AA compliance
- Screen reader optimization
- Keyboard navigation
- High contrast support
- Focus management
- Skip links implementation

## 📐 Architecture

```
src/
├── components/
│   ├── landing/        # Landing page sections
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── utils/             # Utility functions
└── integrations/      # External service integrations
```

## 🔐 Environment Variables

Para desenvolvimento local, copie `.env.template` para `.env.local`:

```bash
# Supabase (Já configurado via integração Lovable)
SUPABASE_URL=https://xnexfhgtqlryfkyuvihq.supabase.co
SUPABASE_ANON_KEY=[Configurado automaticamente]

# Google Analytics
GTM_ID=GTM-KZW3RTWD
```

Para produção na Vercel, as variáveis são configuradas automaticamente via integração Supabase.
