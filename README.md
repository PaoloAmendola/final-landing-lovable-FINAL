# 🌟 NIVELA® - Landing Page Oficial

> **Sistema Revolucionário de Retexturização Capilar com Tecnologia ASTRO QUAT V3®**

[![Performance](https://img.shields.io/badge/Performance-90%2B-brightgreen)]()
[![Responsive](https://img.shields.io/badge/Responsive-✓-blue)]()
[![PWA](https://img.shields.io/badge/PWA-Ready-purple)]()
[![Supabase](https://img.shields.io/badge/Backend-Supabase-green)]()

---

## 🚀 **Stack Técnica**

### **Frontend**
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **Shadcn/ui** + **Framer Motion**
- **Service Workers** + **PWA** otimizado

### **Backend**
- **Supabase** (Database + Storage + Auth)
- **Edge Functions** para processamento
- **Row Level Security** configurado

### **Performance**
- **Lazy Loading** de imagens e vídeos
- **Critical Resource Preloading**
- **Service Worker** avançado com cache inteligente
- **Bundle Splitting** otimizado

---

## 📁 **Estrutura do Projeto**

```
src/
├── components/
│   ├── landing/          # Seções da landing page
│   │   ├── Header.tsx           # Hero section
│   │   ├── Manifesto.tsx        # Vídeo institucional
│   │   ├── ProductSection.tsx   # Apresentação produto
│   │   ├── TechnologySection.tsx       # Demo tecnologia
│   │   ├── CompleteTechnologySection.tsx # Seção completa
│   │   ├── AmazonIngredientsSection.tsx # Ingredientes
│   │   ├── SynergyCallout.tsx          # Sinergia
│   │   ├── BemTechSection.tsx          # Parceria BemTech
│   │   ├── DistributorSection.tsx      # Formulário distribuidores
│   │   ├── FAQSection.tsx              # FAQ
│   │   ├── PreFooter.tsx               # CTA final
│   │   └── Footer.tsx                  # Rodapé
│   └── ui/               # Componentes reutilizáveis
│       ├── OptimizedImage.tsx    # Imagens otimizadas
│       ├── VideoLazy.tsx         # Vídeos lazy loading
│       ├── AnimatedSection.tsx   # Animações de entrada
│       ├── CTAButton.tsx         # Botões call-to-action
│       └── ErrorBoundary.tsx     # Tratamento de erros
├── hooks/                # Hooks personalizados
│   ├── use-performance-optimization.ts
│   ├── use-analytics.ts
│   ├── use-facebook-pixel.ts
│   └── use-form-progress.ts
├── integrations/         # Integrações externas
│   └── supabase/
│       ├── client.ts           # Cliente Supabase
│       └── types.ts            # Tipos do banco
└── utils/
    ├── logger.ts               # Sistema de logs
    └── preloader.ts            # Preload de recursos
```

---

## 🗄️ **Banco de Dados (Supabase)**

### **Tabelas**
```sql
-- Leads do formulário principal
CREATE TABLE leads_nivela (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  tipo_estabelecimento TEXT NOT NULL,
  origem TEXT DEFAULT 'landing_page',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address INET,
  user_agent TEXT,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidaturas para distribuição
CREATE TABLE distribuidores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  cidade TEXT NOT NULL,
  empresa TEXT,
  ja_distribui TEXT NOT NULL,
  apresentacao TEXT,
  origem TEXT DEFAULT 'landing_page',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address INET,
  user_agent TEXT,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **RLS (Row Level Security)**
```sql
-- Apenas administradores podem visualizar
CREATE POLICY "Apenas administradores podem visualizar leads" 
ON leads_nivela FOR SELECT USING (false);

-- Qualquer um pode inserir (formulários públicos)
CREATE POLICY "Permite inserção de leads" 
ON leads_nivela FOR INSERT WITH CHECK (true);
```

### **Storage Buckets**
- **`imagens/`** - Imagens otimizadas (WebP, público)
- **`videos/`** - Vídeos compactados (MP4, público)
- **`favicon/`** - Ícones e manifests (PNG/ICO, público)

---

## 🌐 **URLs de Assets**

### **Vídeos**
```
https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/videos/
├── video-manifesto-oficial-compactado.mp4
└── tecnologia-oficial-compactado.mp4
```

### **Imagens**
```
https://fsntuympgysgfgqdvzsp.supabase.co/storage/v1/object/public/imagens/
├── frasco-nivela-destaque.webp
├── logo-bem-beauty.webp
└── hero-background.webp
```

### **Assets Locais**
```
/lovable-uploads/
├── image-hero.png
├── icone-bem-beauty.png
├── image-conheca-nivela.png
└── f576ae9a-1852-4645-bbb2-d9b8594bef91.png
```

---

## ⚙️ **Variáveis de Ambiente**

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://fsntuympgysgfgqdvzsp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzbnR1eW1wZ3lzZ2ZncWR2enNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzk4NzYsImV4cCI6MjA2OTkxNTg3Nn0.4PKYrz9P95Y37Z9iiZczRvaTIW63z0TUDrDKc8yTQwY
```

---

## 🚀 **Deploy (Vercel)**

### **Configuração**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### **Scripts NPM**
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint ."
}
```

---

## 📊 **Performance Metrics**

### **Web Vitals Targets**
- **LCP**: < 2.5s ⚡
- **CLS**: < 0.1 📏
- **INP**: < 200ms 🖱️
- **FCP**: < 1.8s 🚀

### **Lighthouse Scores**
- **Performance**: 90+ 🎯
- **Accessibility**: 95+ ♿
- **Best Practices**: 100 ✅
- **SEO**: 100 🔍

### **Otimizações Implementadas**
- ✅ **Image Optimization**: WebP + Lazy Loading + Preload críticas
- ✅ **Video Optimization**: MP4 compactado + Lazy Loading
- ✅ **Code Splitting**: Chunks otimizados + Tree Shaking
- ✅ **Caching**: Service Worker + Browser Cache otimizado
- ✅ **Critical CSS**: Inline + Font preload

---

## 🔧 **Comandos de Desenvolvimento**

```bash
# Instalar dependências
npm install

# Desenvolvimento local
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint do código
npm run lint

# Deploy via Vercel CLI
vercel --prod
```

---

## 📱 **PWA Features**

### **Manifest**
- ✅ **Installable**: Web App Manifest configurado
- ✅ **Icons**: 192x192 e 512x512 otimizados
- ✅ **Offline**: Service Worker com cache inteligente
- ✅ **Theme**: Colors e display otimizados

### **Service Worker**
- ✅ **Cache Strategy**: Network First para recursos críticos
- ✅ **Background Sync**: Formulários offline
- ✅ **Push Notifications**: Preparado para notificações

---

## 📈 **Analytics & Tracking**

### **Implementado**
- ✅ **Google Analytics**: Eventos customizados
- ✅ **Facebook Pixel**: Conversões e remarketing
- ✅ **Performance Monitoring**: Web Vitals automático
- ✅ **Error Tracking**: Logger customizado

### **Eventos Trackados**
```javascript
// Conversões principais
track('lead_generated', { source: 'form' });
track('cta_clicked', { section: 'hero' });
track('video_played', { video: 'manifesto' });
track('form_completed', { type: 'distributor' });
```

---

## 🧪 **Testes & QA**

### **Checklist Manual**
- [x] **Formulários**: Validação e submissão
- [x] **Responsividade**: Mobile, Tablet, Desktop
- [x] **Performance**: Web Vitals < targets
- [x] **Acessibilidade**: WCAG 2.1 AA
- [x] **SEO**: Meta tags e estrutura semântica
- [x] **PWA**: Instalação e offline functionality

### **Cross-Browser**
- [x] **Chrome** 90+ ✅
- [x] **Firefox** 88+ ✅
- [x] **Safari** 14+ ✅
- [x] **Edge** 90+ ✅

---

## 🔗 **Links Importantes**

### **Produção**
- 🌐 **Website**: [A definir - Vercel]
- 📊 **Analytics**: [Dashboard personalizado]
- 🗄️ **Supabase**: [Dashboard](https://supabase.com/dashboard/project/fsntuympgysgfgqdvzsp)

### **Desenvolvimento**
- 💻 **GitHub**: `final-landing-lovable-FINAL`
- 🚀 **Vercel**: [Painel de deploy]
- 📝 **Documentação**: Este README

---

## 👨‍💻 **Manutenção**

### **Monitoramento Contínuo**
- 📊 **Performance**: Lighthouse CI + Web Vitals
- 🐛 **Errors**: Supabase Analytics + Logger
- 📈 **Conversões**: GA4 + Facebook Analytics
- ⬆️ **Uptime**: Vercel Analytics

### **Updates Regulares**
- 🔄 **Dependencies**: Mensal
- 🧪 **A/B Testing**: Conversão de CTAs
- 📱 **Mobile UX**: Continuous improvement
- 🚀 **Performance**: Otimização contínua

---

**Desenvolvido com ❤️ para Bem Beauty Professional**  
**Tecnologia ASTRO QUAT V3® - Nova era em retexturização capilar**

---

*Última atualização: Janeiro 2025*