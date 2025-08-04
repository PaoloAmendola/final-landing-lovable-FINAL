# 🚀 Guia de Deploy - NIVELA Landing Page

## 📋 Pré-Deploy Checklist

### ✅ Projeto Limpo
- [x] Dependências antigas removidas
- [x] URLs hardcoded removidas
- [x] Assets locais configurados
- [x] Formulários funcionando (placeholder)
- [x] Performance otimizada

### ✅ Configurações Básicas
- [x] Build sem erros
- [x] TypeScript validado
- [x] Service Worker otimizado
- [x] PWA configurado
- [x] Analytics preparado

## 🔧 Setup para Deploy

### 1. Vercel Deploy (Recomendado)

```bash
# Build local para testar
npm run build
npm run preview

# Configurações Vercel:
# Framework: Vite
# Build Command: npm run build
# Output Directory: dist
# Node Version: 18.x
```

### 2. Environment Variables

**Configurar na Vercel:**
```bash
# Analytics (Opcional)
VITE_GTM_ID=GTM-KZW3RTWD
VITE_GA_ID=G-SC9C7W6Q4F

# App Configuration
VITE_APP_URL=https://seu-dominio.com
VITE_ENVIRONMENT=production

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SERVICE_WORKER=true
```

## 🔗 Próximas Integrações

### GitHub Integration
1. Connect Lovable to GitHub
2. Sync repository
3. Configure auto-deploy

### Supabase Integration  
1. Create new Supabase project
2. Configure database tables
3. Add environment variables
4. Update form components

### Analytics Setup
1. Configure GTM container
2. Set up GA4 property
3. Test tracking events

## ⚡ Performance Optimizations

### Habilitadas
- [x] Critical CSS inline
- [x] Font preloading
- [x] Image optimization
- [x] Bundle splitting
- [x] Service Worker caching
- [x] PWA manifest

### Métricas Esperadas
- **LCP:** < 2.5s
- **FID:** < 100ms
- **CLS:** < 0.1
- **TTFB:** < 800ms

## 🛡️ Security Headers

```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

## 📊 Pós-Deploy Validation

### Testes Essenciais
- [ ] Página carrega completamente
- [ ] Formulários mostram feedback
- [ ] PWA instalável
- [ ] Service Worker ativo
- [ ] Analytics trackando
- [ ] Performance aceitável

### Ferramentas de Teste
- PageSpeed Insights
- Lighthouse
- Web Vitals Extension
- GTM Preview Mode

## 🚨 Troubleshooting

### Build Errors
```bash
# Limpar cache
npm run build --force
rm -rf dist node_modules package-lock.json
npm install
npm run build
```

### Performance Issues
- Verificar bundle size
- Otimizar imagens
- Revisar Service Worker
- Validar Critical CSS

---

**Status:** ✅ Projeto 100% pronto para deploy
**Deploy Time:** ~2-3 minutos na Vercel
**Performance Score:** 95+ esperado