# Guia de Tipografia e Hierarquia - Bem Beauty

## 📋 Visão Geral

Este documento detalha todo o sistema tipográfico da landing page da Bem Beauty, incluindo hierarquia, estilos, tamanhos e aplicações específicas.

## 🎨 Fonte Principal

**Fonte:** Montserrat (Google Fonts)
- **Família:** Sans-serif moderna
- **Aplicação:** Utilizada em toda a interface
- **Configuração:** `font-montserrat` no Tailwind
- **Fallback:** 'Montserrat', 'sans-serif'

## 📐 Hierarquia Tipográfica

### 1. Títulos Premium (H1)
**Classe:** `.titulo-premium-h1`
- **Mobile:** 2.5rem (40px) / line-height: 1.1 / weight: 800
- **Desktop:** 4rem (64px) / line-height: 1.1 / weight: 800
- **Uso:** Título principal do hero (Header)
- **Cor:** `text-primary` (variável do tema)

### 2. Subtítulos Premium
**Classe:** `.subtitulo-premium`
- **Mobile:** 1.125rem (18px) / line-height: 1.6 / weight: 400
- **Desktop:** 1.5rem (24px) / line-height: 1.6 / weight: 400
- **Uso:** Subtítulos descritivos no hero
- **Cor:** `text-muted-foreground`

### 3. Títulos de Seção (H2)
**Classes:** `text-2xl lg:text-3xl xl:text-4xl font-bold`
- **Mobile:** 1.5rem (24px)
- **Large:** 1.875rem (30px)
- **XL:** 2.25rem (36px)
- **Weight:** 700 (bold)
- **Uso:** Títulos principais das seções
- **Cor:** `text-primary`

### 4. Títulos Secundários (H3)
**Classes:** `text-xl lg:text-2xl font-bold`
- **Mobile:** 1.25rem (20px)
- **Large:** 1.5rem (24px)
- **Weight:** 700 (bold)
- **Uso:** Subtítulos dentro das seções
- **Cor:** `text-primary`

### 5. Texto de Parágrafo Principal
**Classes:** `text-base lg:text-lg`
- **Mobile:** 1rem (16px)
- **Large:** 1.125rem (18px)
- **Weight:** 400 (normal)
- **Line-height:** 1.6
- **Uso:** Texto descritivo principal
- **Cor:** `text-muted-foreground`

### 6. Texto de Parágrafo Grande
**Classes:** `text-lg lg:text-xl`
- **Mobile:** 1.125rem (18px)
- **Large:** 1.25rem (20px)
- **Weight:** 400 (normal)
- **Uso:** Texto descritivo em destaque
- **Cor:** `text-muted-foreground`

## 🔘 Elementos Interativos

### Botão CTA Principal
**Classe:** `.cta-primary`
- **Mobile:** 1rem (16px) / weight: 700 / padding: 1rem 1.5rem
- **Desktop:** 1.125rem (18px) / weight: 700 / padding: 1.25rem 2rem
- **Estilo:** Gradiente com sombra premium
- **Cor:** `text-brand-black`

### Badges de Características
**Classes:** `text-xs lg:text-sm font-medium`
- **Mobile:** 0.75rem (12px)
- **Large:** 0.875rem (14px)
- **Weight:** 500 (medium)
- **Estilo:** Background com border radius
- **Cor:** Baseada no tema

### Links de Navegação
**Classes:** `text-sm font-medium`
- **Tamanho:** 0.875rem (14px)
- **Weight:** 500 (medium)
- **Hover:** Escala e cor
- **Cor:** Variável do tema

## 📱 Responsividade

### Breakpoints Utilizados
- **Base (Mobile):** 0px - 1023px
- **Large (lg):** 1024px - 1279px
- **Extra Large (xl):** 1280px+

### Padrões de Escala
1. **Títulos:** Incremento de ~0.5rem entre breakpoints
2. **Parágrafos:** Incremento de ~0.125rem entre breakpoints
3. **Espaçamentos:** Proporcionais ao texto

## 🎯 Aplicações por Seção

### Header (Hero)
- **Título Principal:** `.titulo-premium-h1`
- **Subtítulo:** `.subtitulo-premium`
- **CTA:** `.cta-primary`
- **Badges:** `text-xs lg:text-sm font-medium`

### Manifesto
- **Quote:** `text-xl lg:text-2xl xl:text-3xl font-medium italic`
- **Estilo:** Itálico com destaque visual

### Seções de Produto/Tecnologia
- **Títulos:** `text-2xl lg:text-3xl xl:text-4xl font-bold`
- **Parágrafos:** `text-base lg:text-lg`
- **Destaques:** `text-lg lg:text-xl`

### Formulários
- **Labels:** `text-sm font-medium`
- **Inputs:** `text-base`
- **Placeholders:** Cor reduzida
- **Validação:** `text-sm` com cores de estado

### Footer
- **Links:** `text-sm font-medium`
- **Copyright:** `text-xs`
- **Títulos:** `text-lg font-semibold`

## 🌈 Sistema de Cores Tipográficas

### Cores Primárias
- **`text-primary`:** Texto principal em destaque
- **`text-muted-foreground`:** Texto secundário/descritivo
- **`text-brand-black`:** Texto em elementos de marca

### Cores de Estado
- **`text-green-500`:** Validação positiva
- **`text-red-500`:** Erros e validação negativa
- **`text-destructive`:** Alertas importantes

### Cores Contextuais
- **Cards:** `text-card-foreground`
- **Sidebar:** `text-sidebar-foreground`
- **Popover:** `text-popover-foreground`

## ⚡ Performance e Acessibilidade

### Otimizações
- **Font Display:** `swap` para carregamento rápido
- **Preload:** Fonte carregada no `index.html`
- **Fallbacks:** Sans-serif genérica como backup

### Acessibilidade
- **Contraste:** Todas as combinações atendem WCAG AA
- **Tamanhos:** Mínimo 16px para leitura confortável
- **Line-height:** 1.6 para textos longos
- **Hierarquia:** Semântica clara com headings apropriados

## 🔧 Implementação Técnica

### CSS Custom Properties
```css
/* Definidas em index.css */
--font-montserrat: 'Montserrat', sans-serif;
```

### Tailwind Configuration
```js
// tailwind.config.ts
fontFamily: {
  'montserrat': ['Montserrat', 'sans-serif'],
}
```

### Classes Utilitárias Personalizadas
- `.titulo-premium-h1`
- `.subtitulo-premium`
- `.cta-primary`

## 📊 Métricas de Uso

### Frequência por Tipo
1. **Parágrafos:** ~60% do conteúdo
2. **Títulos H2/H3:** ~25% do conteúdo
3. **Elementos interativos:** ~10% do conteúdo
4. **Títulos H1:** ~5% do conteúdo

### Consistência
- ✅ Sistema unificado com Montserrat
- ✅ Escalas responsivas consistentes
- ✅ Cores semânticas padronizadas
- ✅ Classes reutilizáveis definidas