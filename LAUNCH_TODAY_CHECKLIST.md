# 🚀 CHECKLIST PARA LANZAR HOY - SON1KVERS3 + THE GENERATOR

> Plan de acción prioritario para deployment inmediato

---

## 🎯 OBJETIVO

Lanzar Son1KVers3 con The Generator funcional y sistema de autenticación básico.

---

## ⚡ PRIORIDAD MÁXIMA (Bloqueantes - 2 horas)

### 1. Ejecutar Migraciones en Supabase (15 min)
- [ ] Conectar a Supabase Dashboard
- [ ] Ejecutar `apps/web-classic/database/migrations/001_user_tiers.sql`
- [ ] Ejecutar `apps/the-generator/database/migrations/002_unified_token_pool.sql`
- [ ] Ejecutar `apps/the-generator/database/migrations/003_community_system.sql`
- [ ] Verificar tablas creadas

### 2. Configurar OAuth en Supabase (20 min)
- [ ] Google OAuth:
  - Ir a Supabase → Authentication → Providers → Google
  - Client ID: `TU_GOOGLE_CLIENT_ID`
  - Client Secret: `TU_GOOGLE_CLIENT_SECRET`
  - Redirect URL: `https://son1kvers3.com/auth/callback`
- [ ] Facebook OAuth (opcional para hoy):
  - Similar a Google
- [ ] Activar Email/Password si no está activo

### 3. Agregar Tokens al Pool Comunitario (10 min)
- [ ] Instalar extensión Chrome en modo desarrollador
- [ ] O agregar tokens manualmente vía SQL:
  ```sql
  INSERT INTO suno_auth_tokens (token, source, is_community)
  VALUES ('tu_token_jwt_aqui', 'manual', true);
  ```

### 4. Verificar Variables de Entorno (15 min)
- [ ] Verificar en Vercel/Netlify:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY`
  - `GROQ_API_KEY`
- [ ] Redeploy si se modificaron

### 5. Testing Básico (30 min)
- [ ] Registro de usuario nuevo
- [ ] Login con Google
- [ ] Generar canción en The Generator
- [ ] Verificar que descuenta del límite FREE (5/mes)
- [ ] Verificar audio se genera correctamente

### 6. Hacer Login Obligatorio en The Generator (30 min)
- [ ] Envolver The Generator con `<ProtectedRoute>`
- [ ] Commit y deploy

---

## 🔥 PRIORIDAD ALTA (Nice to have - 1 hora)

### 7. Página de Pricing Visible (15 min)
- [ ] Agregar link en navegación: `/pricing`
- [ ] Modo mock para Stripe (sin pagos reales hoy)
- [ ] Usuarios pueden VER planes pero no comprar

### 8. UI/UX Básico (30 min)
- [ ] Agregar indicador de tier en header
- [ ] Mostrar "X/5 canciones usadas este mes"
- [ ] Botón "Upgrade" que lleva a Pricing

### 9. Error Handling (15 min)
- [ ] Mensaje claro si se acaban las generaciones
- [ ] Mensaje si no hay tokens disponibles
- [ ] Mensaje de upgrade

---

## 📦 PRIORIDAD MEDIA (Para después del launch - 2 horas)

### 10. Activar Stripe Real
- [ ] Crear productos en Stripe
- [ ] Configurar Price IDs
- [ ] Configurar webhook
- [ ] Cambiar de mock a producción

### 11. Dashboard de Usuario
- [ ] Página `/profile` o `/settings`
- [ ] Ver tier actual
- [ ] Ver uso mensual
- [ ] Historial de generaciones

### 12. Email Notifications
- [ ] Confirmación de registro
- [ ] Límite de generaciones alcanzado
- [ ] Bienvenida

---

## 🚫 NO PRIORITARIO (Post-launch)

- ❌ TikTok OAuth
- ❌ Customer portal de Stripe
- ❌ Analytics avanzados
- ❌ API pública
- ❌ White-label

---

## 🛠️ COMANDOS RÁPIDOS

### Deploy Frontend Clásico
```bash
cd apps/web-classic
vercel --prod
# o
netlify deploy --prod
```

### Deploy The Generator
```bash
cd apps/the-generator
vercel --prod
```

### Verificar que frontend clásico está en son1kvers3.com
```bash
curl -I https://son1kvers3.com
```

### Verificar que The Generator está en the-generator.son1kvers3.com
```bash
curl -I https://the-generator.son1kvers3.com
```

---

## ✅ CRITERIOS DE ÉXITO PARA HOY

1. ✅ Usuario puede registrarse (Google o Email)
2. ✅ Usuario puede acceder a The Generator
3. ✅ Usuario puede generar música (5 canciones FREE)
4. ✅ Sistema descuenta del límite mensual
5. ✅ Audio se reproduce correctamente
6. ✅ Mensaje cuando se acaban generaciones

---

## 📝 NOTAS IMPORTANTES

### Modo Mock vs Producción

El sistema detecta automáticamente:
- **Mock**: Si no hay tokens en pool → usa token hardcoded
- **Producción**: Si hay tokens en pool → usa unified pool

### Para Hoy
- ✅ Enfocarnos en FREE tier funcionando
- ✅ Stripe en modo mock (no cobrar)
- ✅ Pool con al menos 5 tokens
- ✅ UX básico funcional

### Para Mañana
- ⏳ Activar pagos reales
- ⏳ Mejorar UX
- ⏳ Email notifications
- ⏳ Marketing

---

## 🚀 ORDEN DE EJECUCIÓN (Próximos 2 horas)

```
┌─────────────────────────────────────────────────────────┐
│ 1. Migraciones Supabase (15 min)                        │
│    └─ Ejecutar 3 archivos SQL                          │
├─────────────────────────────────────────────────────────┤
│ 2. OAuth Google (20 min)                                │
│    └─ Configurar en Supabase Dashboard                 │
├─────────────────────────────────────────────────────────┤
│ 3. Agregar tokens al pool (10 min)                      │
│    └─ Mínimo 5 tokens para testing                     │
├─────────────────────────────────────────────────────────┤
│ 4. Proteger The Generator (30 min)                      │
│    └─ Agregar ProtectedRoute + commit + deploy         │
├─────────────────────────────────────────────────────────┤
│ 5. Testing completo (30 min)                            │
│    └─ Registro → Login → Generar → Verificar           │
├─────────────────────────────────────────────────────────┤
│ 6. UI básico (30 min)                                   │
│    └─ Indicador de tier + contador + botón upgrade     │
└─────────────────────────────────────────────────────────┘

TOTAL: 2 horas 15 minutos
```

---

## 🎯 EMPECEMOS POR:

**PASO 1: Proteger The Generator con autenticación obligatoria**

¿Quieres que empiece por ahí? Es lo más crítico para el launch.

