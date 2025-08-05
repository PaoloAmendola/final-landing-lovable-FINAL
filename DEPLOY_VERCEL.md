# Deploy Vercel - NIVELA Landing Page

## Configuração Completa para Deploy

### 1. Verificação de Preparação
✅ Projeto sincronizado com GitHub (`final-landing-lovable-FINAL`)
✅ Branch principal: `main`
✅ Todas as URLs dos vídeos corrigidas
✅ Imagens otimizadas para carregamento rápido
✅ Configurações de build otimizadas

### 2. Configurações do Vercel
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### 3. Variáveis de Ambiente
```
VITE_SUPABASE_URL=https://fsntuympgysgfgqdvzsp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzbnR1eW1wZ3lzZ2ZncWR2enNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzk4NzYsImV4cCI6MjA2OTkxNTg3Nn0.4PKYrz9P95Y37Z9iiZczRvaTIW63z0TUDrDKc8yTQwY
```

### 4. Domínio Personalizado
Após deploy bem-sucedido, configure seu domínio personalizado nas configurações do Vercel.

### 5. Performance Otimizada
- ✅ Lazy loading implementado nos vídeos
- ✅ Preload otimizado (`metadata` ao invés de `none`)
- ✅ Imagens prioritárias marcadas como `eager`
- ✅ Chunks otimizados no Vite
- ✅ Service Workers configurados
- ✅ Headers de cache e segurança configurados

### 6. Problemas Resolvidos
- ✅ Vídeo manifesto: preload otimizado e threshold ajustado
- ✅ Vídeo tecnologia: URLs corrigidas e configurações melhoradas
- ✅ Imagem "Conheça NIVELA": prioridade alta e carregamento eager
- ✅ Performance geral melhorada

### 7. Próximos Passos
1. Commit e push das mudanças para o GitHub
2. Conectar repositório no Vercel
3. Deploy automático
4. Configurar domínio personalizado (se necessário)
5. Monitorar performance e métricas

### 8. Links Importantes
- **GitHub Repository**: `final-landing-lovable-FINAL`
- **Branch**: `main`
- **Vercel Dashboard**: https://vercel.com/dashboard

---

**Status**: ✅ Pronto para deploy via Vercel
**Última atualização**: Janeiro 2025