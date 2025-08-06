# 🚀 NIVELA® - Landing Page Oficial

![NIVELA Logo](./public/lovable-uploads/icone-bem-beauty.png)

**A evolução da escova progressiva profissional** - Landing page premium para captação de leads qualificados da Bem Beauty Professional.

---

## 🎯 **Visão Geral**

Landing page otimizada para conversão de profissionais de beleza (35-60 anos) interessados no NIVELA®, transmitindo sofisticação, segurança e profissionalismo condizente com cosméticos de luxo.

**🔗 URL de Produção**: `https://nivela.bembeauty.com.br`

---

## 🏗️ **Stack Técnica**

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 18.3.1 | Framework frontend |
| **TypeScript** | 5.5.3 | Tipagem estática |
| **Vite** | 5.4.1 | Build tool & bundler |
| **Tailwind CSS** | 3.4.11 | Framework CSS |
| **Shadcn/UI** | Latest | Biblioteca de componentes |
| **Framer Motion** | 12.23.11 | Animações |
| **Supabase** | 2.53.0 | Backend & Storage |
| **Vercel** | - | Deploy & hosting |

---

## 📊 **Métricas de Performance**

### **Core Web Vitals (Target)**
- ✅ **LCP**: < 2.5s (otimizado)
- ✅ **FID**: < 100ms
- ✅ **CLS**: < 0.1
- ✅ **Lighthouse Score**: > 90

### **Analytics Implementado**
- 📈 **Google Analytics 4**: `G-SC9C7W6Q4F`
- 🏷️ **Google Tag Manager**: `GTM-KZW3RTWD`
- 🎯 **Eventos de Conversão**: `cta_acessar_loja`
- 📊 **UTM Tracking**: Completo

---

## 🎨 **Design System**

### **Cores da Marca (HSL)**
```css
/* Paleta NIVELA */
--brand-black: 198 52% 8%;     /* #0D181C - Preto Premium */
--brand-latte: 30 33% 73%;     /* #D9C0AA - Café com Leite */
--brand-caramel: 20 79% 35%;   /* #9D4916 - Caramelo */
--brand-cloud: 201 23% 70%;    /* #A6B8C1 - Azul Nuvem */
--brand-deep: 196 39% 25%;     /* #254C5A - Azul Profundo */
--brand-light: 0 0% 98%;       /* #FAFAFA - Branco Premium */
```

### **Tipografia**
- **Font**: Montserrat (Google Fonts)
- **Pesos**: 400, 500, 600, 700, 800
- **Otimização**: `display: swap`

---

## 📁 **Estrutura do Projeto**

```
src/
├── components/
│   ├── landing/                # Seções da landing page
│   │   ├── Header.tsx          # Hero + CTA principal
│   │   ├── Manifesto.tsx       # Vídeo institucional
│   │   ├── ProductSection.tsx  # Apresentação do produto
│   │   ├── TechnologySection.tsx # Tecnologia ASTRO QUAT V3
│   │   ├── AmazonIngredientsSection.tsx # Ativos da Amazônia
│   │   ├── AccessFormModal.tsx # Modal de captação
│   │   ├── PreFooter.tsx       # CTA final
│   │   └── Footer.tsx          # Rodapé
│   └── ui/                     # Componentes base (Shadcn)
├── hooks/                      # Hooks customizados
├── integrations/               # Supabase client
├── utils/                      # Utilities e helpers
└── pages/                      # Páginas principais
```

---

## 🗃️ **Supabase Configuration**

### **Project Details**
- **Project ID**: `fsntuympgysgfgqdvzsp`
- **Project URL**: `https://fsntuympgysgfgqdvzsp.supabase.co`
- **Anon Key**: Configurado via variáveis de ambiente

### **Storage Buckets**
```sql
-- Imagens otimizadas (public: true)
imagens/
├── frasco-nivela-hero.webp
├── frasco-nivela-destaque.webp
└── logo-bembeauty-transparente.webp

-- Vídeos compactados (public: true)
videos/
├── video-manifesto-oficial-compactado.mp4
└── tecnologia-oficial-compactado.mp4

-- Assets locais otimizados
public/
├── lovable-uploads/icone-bem-beauty.png
└── assets/frasco-nivela-hero-optimized.webp
```

### **Tabela de Leads**
```sql
CREATE TABLE public.leads_nivela (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT NOT NULL,
  tipo_estabelecimento TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS habilitado para segurança
ALTER TABLE public.leads_nivela ENABLE ROW LEVEL SECURITY;
```

---

## 🔗 **Integrações & Rastreamento**

### **URLs com UTM Parameters**
```bash
# CTA Principal
https://bembeauty.com.br?utm_source=landing-nivela&utm_medium=referral&utm_campaign=acesso_loja

# Redirecionamentos
/loja → https://bembeauty.com.br?utm_source=landing&utm_medium=redirect&utm_campaign=acesso_loja
```

### **GTM Events Configurados**
```javascript
// Evento de clique em CTA
data-gtm-event="cta_acessar_loja"

// Envio de formulário
form_submit: {
  event_category: 'lead_generation',
  event_label: 'access_form'
}
```

---

## ⚡ **Otimizações Implementadas**

### **Performance**
- ✅ **Critical CSS**: Inline no `<head>`
- ✅ **Font Preload**: Google Fonts otimizado
- ✅ **Image Optimization**: WebP + lazy loading
- ✅ **Video Optimization**: Autoplay + preload metadata
- ✅ **Bundle Splitting**: Componentes lazy
- ✅ **Service Worker**: Cache inteligente

### **SEO**
- ✅ **Meta Tags**: Completas (OG + Twitter)
- ✅ **Schema.org**: Organization + Product
- ✅ **Sitemap**: Gerado automaticamente
- ✅ **Robots.txt**: Configurado
- ✅ **Canonical URLs**: Implementadas

### **Acessibilidade**
- ✅ **ARIA Labels**: Todos os elementos
- ✅ **Skip to Content**: Navegação por teclado
- ✅ **Focus Management**: Visível e lógico
- ✅ **Screen Readers**: Compatível
- ✅ **Touch Targets**: 44px mínimo

---

## 🚀 **Deploy & CI/CD**

### **Ambiente de Produção**
- **Platform**: Vercel
- **Domain**: `nivela.bembeauty.com.br`
- **SSL**: Automático (Let's Encrypt)
- **CDN**: Vercel Edge Network
- **Analytics**: Vercel Analytics integrado

### **Scripts Disponíveis**
```bash
# Desenvolvimento
npm run dev         # Inicia dev server (porta 5173)

# Build
npm run build       # Build otimizado para produção
npm run preview     # Preview do build local

# Qualidade
npm run lint        # ESLint check
npm run type-check  # TypeScript validation
```

### **Variáveis de Ambiente**
```bash
# .env.local (desenvolvimento)
VITE_SUPABASE_URL=https://fsntuympgysgfgqdvzsp.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GTM_ID=GTM-KZW3RTWD
VITE_GA_ID=G-SC9C7W6Q4F
VITE_APP_URL=https://nivela.bembeauty.com.br
VITE_ENVIRONMENT=production
```

---

## 🧪 **Testing & Validação**

### **Checklist de QA**
- [x] **Responsividade**: Mobile, Tablet, Desktop
- [x] **Formulário**: Validação + envio funcional
- [x] **Performance**: Lighthouse > 90
- [x] **SEO**: Meta tags + Schema.org
- [x] **Analytics**: GTM + GA4 funcionando
- [x] **UTMs**: Rastreamento completo
- [x] **Acessibilidade**: WCAG AA compliance

### **Devices Testados**
```
📱 Mobile:  320px - 640px (iPhone, Android)
📱 Tablet:  640px - 1024px (iPad, tablets)
💻 Desktop: 1024px+ (monitors, laptops)
```

---

## 📈 **Conversão & Analytics**

### **Funil de Conversão**
1. **Landing Page View** → Usuário acessa a página
2. **Section Engagement** → Scroll e interação com conteúdo
3. **Form Start** → Usuário inicia preenchimento
4. **Form Submit** → Lead qualificado gerado
5. **CTA Click** → Redirecionamento para loja oficial

### **KPIs Monitorados**
- **Taxa de Conversão**: Form submissions / Page views
- **Bounce Rate**: < 40% (target)
- **Time on Page**: > 3 min (target)
- **CTA Click Rate**: > 15% (target)
- **Form Completion**: > 85% (target)

---

## 🔧 **Manutenção & Updates**

### **Atualizações Regulares**
- **Performance**: Monitoramento semanal via Lighthouse
- **Analytics**: Review mensal de métricas
- **Content**: Updates conforme campanhas
- **Security**: Patches automáticos via Dependabot

### **Backup & Recovery**
- **Code**: GitHub repository (backup automático)
- **Database**: Supabase automatic backups
- **Assets**: Supabase Storage (CDN distribuído)

---

## 📞 **Suporte & Contato**

### **Bem Beauty Professional**
- 📱 **WhatsApp**: +55 21 3950-0901
- 🌐 **Site**: https://bembeauty.com.br
- 📧 **Email**: comercial@bembeauty.com.br
- 📍 **Endereço**: Av. Cesário de Melo, 3006 - Campo Grande, RJ

### **Equipe Técnica**
- 🛠️ **Desenvolvimento**: Lovable.dev
- 📊 **Analytics**: Google Analytics 4
- 🚀 **Deploy**: Vercel
- 💾 **Backend**: Supabase

---

## 📄 **Licença & Direitos**

**© 2025 Bem Beauty Professional Ltda.**  
**CNPJ**: 51.635.148/0001-33  
**Todos os direitos reservados.**

NIVELA® é marca registrada da Bem Beauty Professional Ltda.

---

## 🎉 **Changelog**

### **v1.0.0** (Janeiro 2025)
- ✅ Launch inicial da landing page
- ✅ Formulário de captação implementado
- ✅ Integração Supabase completa
- ✅ Analytics GTM + GA4 configurado
- ✅ Performance otimizada (Lighthouse > 90)
- ✅ SEO completo com Schema.org
- ✅ Deploy automatizado na Vercel

---

**🚀 Ready for Production Deploy!**