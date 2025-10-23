# 🔐 CONFIGURAR GOOGLE OAUTH EN SUPABASE

> Guía paso a paso para activar login con Google

---

## 📋 PASO 1: Obtener Credenciales de Google

### 1.1 Ir a Google Cloud Console
```
https://console.cloud.google.com/
```

### 1.2 Crear Proyecto (si no tienes uno)
- Click en "Select a project" (arriba izquierda)
- Click en "NEW PROJECT"
- Nombre: `Son1KVers3`
- Click "CREATE"

### 1.3 Habilitar Google+ API
- En el menú lateral → "APIs & Services" → "Library"
- Buscar: `Google+ API`
- Click "ENABLE"

### 1.4 Crear OAuth Consent Screen
- "APIs & Services" → "OAuth consent screen"
- User Type: **External**
- App name: `Son1KVers3`
- User support email: `tu@email.com`
- Developer contact: `tu@email.com`
- Click "SAVE AND CONTINUE"
- Scopes: No agregar nada, click "SAVE AND CONTINUE"
- Test users: Agregar tu email
- Click "SAVE AND CONTINUE"

### 1.5 Crear Credentials
- "APIs & Services" → "Credentials"
- Click "CREATE CREDENTIALS" → "OAuth client ID"
- Application type: **Web application**
- Name: `Son1KVers3 Web`
- Authorized redirect URIs:
  ```
  https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback
  ```
  Reemplaza `YOUR_SUPABASE_PROJECT` con tu proyecto real

- Click "CREATE"
- **COPIAR Y GUARDAR**:
  - Client ID: `algo.apps.googleusercontent.com`
  - Client Secret: `GOCSPX-xxxxx`

---

## 📋 PASO 2: Configurar en Supabase

### 2.1 Ir a Supabase Dashboard
```
https://supabase.com/dashboard/project/YOUR_PROJECT
```

### 2.2 Navegar a Authentication
- Menú lateral → "Authentication"
- Tab → "Providers"

### 2.3 Habilitar Google
- Buscar "Google"
- Toggle → **Enabled**

### 2.4 Pegar Credenciales
- **Client ID**: Pegar el de Google Cloud Console
- **Client Secret**: Pegar el de Google Cloud Console

### 2.5 Configurar Redirect URL
- Copiar la "Callback URL" que muestra Supabase
- Volver a Google Cloud Console
- Credentials → Editar tu OAuth client
- "Authorized redirect URIs" → Verificar que esté la URL de Supabase
- Guardar

### 2.6 Configurar Site URL
- En Supabase → "Authentication" → "URL Configuration"
- **Site URL**: `https://son1kvers3.com`
- **Redirect URLs** (agregar ambas):
  ```
  https://son1kvers3.com/auth/callback
  https://the-generator.son1kvers3.com/auth/callback
  ```

### 2.7 Guardar Cambios
- Click "Save"

---

## ✅ PASO 3: Verificar que Funciona

### 3.1 Abrir The Generator
```
https://the-generator.son1kvers3.com
```

### 3.2 Click en "Continuar con Google"
- Debería abrir popup de Google
- Seleccionar tu cuenta
- Aceptar permisos
- Redirigir a The Generator (autenticado)

### 3.3 Verificar en Supabase
- Dashboard → "Authentication" → "Users"
- Deberías ver tu usuario creado

---

## 🐛 TROUBLESHOOTING

### Error: "redirect_uri_mismatch"
**Solución**:
- Verificar que la Redirect URI en Google Cloud Console coincida EXACTAMENTE con la de Supabase
- Debe terminar en `/auth/v1/callback`
- No debe tener espacios o caracteres extra

### Error: "access_denied"
**Solución**:
- Verificar que el proyecto Google esté en modo "Testing"
- Agregar tu email a "Test users"
- O publicar la app (cambiar a "Production")

### Error: "invalid_client"
**Solución**:
- Verificar Client ID y Client Secret copiados correctamente
- Sin espacios al inicio/final
- Regenerar credentials si es necesario

### No redirige después de login
**Solución**:
- Verificar que en Supabase → URL Configuration → Redirect URLs esté configurada
- Verificar que el código de callback esté implementado (`/auth/callback/route.ts`)

---

## 📝 CHECKLIST FINAL

- [ ] Proyecto creado en Google Cloud Console
- [ ] Google+ API habilitada
- [ ] OAuth Consent Screen configurado
- [ ] OAuth Client ID creado
- [ ] Client ID y Secret copiados
- [ ] Google habilitado en Supabase
- [ ] Credenciales pegadas en Supabase
- [ ] Redirect URIs configuradas (ambos lados)
- [ ] Site URL configurada en Supabase
- [ ] Testeado login con Google
- [ ] Usuario aparece en Supabase Dashboard

---

## 🚀 RESULTADO ESPERADO

Después de completar estos pasos:

✅ Usuarios pueden registrarse con Google en 1 click
✅ No necesitan crear contraseña
✅ Auto-creación de tier FREE al registrarse
✅ Redirigen a The Generator automáticamente

---

## 🔥 NOTA IMPORTANTE

Si quieres habilitar Facebook también, el proceso es similar:
1. Crear app en Facebook Developers
2. Obtener App ID y App Secret
3. Configurar en Supabase → Authentication → Providers → Facebook

Pero para el launch de hoy, **Google es suficiente**.

---

**Tiempo estimado**: 15-20 minutos
**Dificultad**: Media (requiere atención a detalles)

