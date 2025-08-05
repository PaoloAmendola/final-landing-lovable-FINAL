# NIVELA® - Landing Page Oficial

Landing page premium para NIVELA®, a evolução da escova progressiva profissional da Bem Beauty Professional.

## 🎯 **Visão Geral**

Plataforma de captação de leads qualificados com foco em profissionais de beleza (35-60 anos), transmitindo sofisticação, segurança e profissionalismo condizente com cosméticos de luxo.

## 🏗️ **Arquitetura Técnica**

### **Stack Principal**
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **Build**: Vite 5
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deploy**: Vercel

### **Performance Targets**
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **Lighthouse Score**: > 90

## 📁 **Estrutura do Projeto**

```
src/
├── components/
│   ├── landing/           # Seções da landing page
│   │   ├── Header.tsx     # Hero + CTA principal
│   │   ├── Manifesto.tsx  # Vídeo institucional
│   │   ├── ProductSection.tsx
│   │   ├── TechnologySection.tsx
│   │   ├── IngredientsSection.tsx
│   │   ├── AccessFormModal.tsx  # Formulário de captação
│   │   └── Footer.tsx
│   └── ui/               # Componentes base (Shadcn)
├── hooks/                # Hooks customizados
├── integrations/         # Supabase client
├── utils/                # Utilities e helpers
└── pages/                # Páginas principais
```

## 🎨 **Design System**

### **Cores da Marca (HSL)**
```css
--brand-black: 198 52% 8%;     /* #0D181C - Preto */
--brand-latte: 30 33% 73%;     /* #D9C0AA - Café com Leite */
--brand-caramel: 20 79% 35%;   /* #9D4916 - Caramelo */
--brand-cloud: 201 23% 70%;    /* #A6B8C1 - Azul Nuvem */
--brand-deep: 196 39% 25%;     /* #254C5A - Azul Profundo */
--brand-light: 0 0% 98%;       /* #FAFAFA - Branco Premium */
```

### **Tipografia**
- **Fonte Principal**: Montserrat (Google Fonts)
- **Pesos**: 400, 500, 600, 700, 800
- **Display**: swap (otimização de carregamento)

## 🗃️ **Supabase Configuration**

### **Project Details**
- **Project ID**: fsntuympgysgfgqdvzsp
- **Project URL**: https://fsntuympgysgfgqdvzsp.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

### **Storage Buckets**
```sql
-- Imagens otimizadas
imagens (public: true)
├── frasco-nivela-hero.webp      # Produto principal
├── frasco-nivela-destaque.webp  # Seção "Conheça"
└── ingredientes/                # Ativos da Amazônia

-- Vídeos compactados
videos (public: true)
├── video-manifesto-oficial-compactado.mp4
└── tecnologia-oficial-compactado.mp4

-- Favicons e PWA
favicon (public: true)
├── favicon-96x96.png
├── favicon.svg
├── favicon.ico
├── apple-touch-icon.png
└── site.webmanifest
```

### **Políticas de Acesso (RLS)**
Atualmente configurado como público para landing page. Para implementação de autenticação:

```sql
-- Tabela de leads (exemplo)
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT NOT NULL,
  tipo_estabelecimento TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS habilitado para controle futuro
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
```

## 📊 **URLs de Recursos Otimizados**

### **Imagens Críticas**
```
# Hero Principal (preload)
https://xnexfhgtqlryfkyuvihq.supabase.co/storage/v1/object/public/imagens/frasco-nivela-hero.webp

# Produto em Destaque
https://xnexfhgtqlryfkyuvihq.supabase.co/storage/v1/object/public/imagens/frasco-nivela-destaque.webp
```

### **Vídeos Otimizados**
```
# Manifesto (autoplay, muted, loop)
https://xnexfhgtqlryfkyuvihq.supabase.co/storage/v1/object/public/videos/video-manifesto-oficial-compactado.mp4

# Tecnologia (lazy load)
https://xnexfhgtqlryfkyuvihq.supabase.co/storage/v1/object/public/videos/tecnologia-oficial-compactado.mp4
```

## 🔗 **Integrações de Rastreamento**

### **Google Analytics 4**
- **Tracking ID**: G-SC9C7W6Q4F
- **Events**: Page views, conversions, form submissions

### **Google Tag Manager**
- **Container ID**: GTM-KZW3RTWD
- **Custom Events**: `cta_acessar_loja`, `form_submit`, `section_view`

### **CTA Rastreado**
```html
<!-- Botão com UTM parameters -->
<a href="https://bembeauty.com.br?utm_source=landing&utm_medium=botao&utm_campaign=acesso_loja"
   data-gtm-event="cta_acessar_loja">
   ACESSAR LOJA OFICIAL
</a>
```

## ⚡ **Otimizações de Performance**

### **Carregamento**
- **Fonts**: Preload + display: swap
- **Images**: Lazy loading + WebP + sizes optimizadas
- **Videos**: Autoplay sem controles + preload: metadata
- **Critical CSS**: Inline no `<head>`

### **Bundle Optimization**
- **Tree shaking**: Imports específicos
- **Code splitting**: Lazy loading de componentes
- **Asset optimization**: Compressão automática

### **Caching Strategy**
- **Static assets**: Cache longo (1 ano)
- **Images**: CDN + compressão
- **Fonts**: Font-display: swap

## 🧪 **Testing & QA**

### **Responsividade**
```
Mobile:  375px - 640px
Tablet:  640px - 1024px
Desktop: 1024px+
```

### **Checklist de Validação**
- [x] Formulário de captação funcional
- [x] Vídeos autoplay sem controles
- [x] Performance > 70 (otimizado)
- [x] Todos os links UTM funcionais
- [x] SEO meta tags completas
- [x] Favicons carregando corretamente

## 🚀 **Deploy & Ambiente**

### **Produção**
- **URL**: https://nivela.bembeauty.com.br
- **CDN**: Vercel Edge Network
- **SSL**: Automático

### **Scripts de Build**
```bash
# Desenvolvimento
npm run dev

# Build otimizado
npm run build

# Preview local
npm run preview

# Linting
npm run lint
```

## 📋 **Roadmap & Manutenção**

### **Próximas Implementações**
1. **Autenticação**: Login profissional via Supabase Auth
2. **Dashboard**: Área restrita para distribuidores
3. **Analytics Avançado**: Heatmaps e user journey
4. **A/B Testing**: Otimização de conversão

### **Monitoramento**
- **Performance**: Web Vitals automático
- **Errors**: Console monitoring (dev only)
- **Analytics**: GA4 + GTM events
- **Uptime**: Vercel monitoring

## ✅ **AUDITORIA COMPLETA REALIZADA**

### **✅ 1. Atualizações Gerais**
- [x] Nome do projeto atualizado para NIVELA®
- [x] URLs otimizadas do Supabase Storage implementadas
- [x] Links de vídeos e imagens atualizados
- [x] Remoção de links quebrados

### **✅ 2. Supabase**
- [x] Storage buckets configurados (imagens, videos, favicon)
- [x] RLS policies verificadas (sem problemas detectados)
- [x] Estrutura otimizada para captação de leads

### **✅ 3. Estrutura e Código**
- [x] Componentes de desenvolvimento removidos da produção
- [x] Imports desnecessários eliminados
- [x] Código duplicado removido
- [x] Performance monitor otimizado

### **✅ 4. Otimizações Técnicas**
- [x] Fonts otimizadas com preload + display: swap
- [x] Imagens com lazy loading e sizes definidos
- [x] Vídeos autoplay sem controles implementados
- [x] Bundle size reduzido (componentes dev removidos)

### **✅ 5. Documentação Técnica**
- [x] README.md completo criado
- [x] Estrutura de pastas documentada
- [x] URLs de recursos organizados
- [x] Fluxo de dados mapeado

### **✅ 6. Testes e Performance**
- [x] Responsividade validada
- [x] Formulários funcionais
- [x] Performance otimizada (LCP reduzido)
- [x] Console limpo (logs apenas em dev)

---

## 📞 **Suporte & Contato**

**Bem Beauty Professional**  
📱 WhatsApp: +55 21 3269-0484  
🌐 Site: https://bembeauty.com.br  
📧 Contato: via formulário da landing page

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2025  
**Licença**: Proprietário - Bem Beauty Professional Ltda.