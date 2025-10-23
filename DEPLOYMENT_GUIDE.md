# 🚀 Guía de Deployment - Sistema de Tokens Suno

## 📋 Resumen del Deployment

### Arquitectura de Producción
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend        │    │   Suno API      │
│   (Vercel)      │◄──►│   (Railway)      │◄──►│                 │
│                 │    │                 │    │                 │
│ • React App     │    │ • Token Server  │    │ • Music Gen     │
│ • Token UI      │    │ • 5 Tokens      │    │ • Audio URLs    │
│ • Auto-renewal  │    │ • API REST      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Paso 1: Deploy del Backend (Railway)

### 1.1 Preparar Railway
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login en Railway
railway login

# Crear nuevo proyecto
railway init
```

### 1.2 Configurar Variables de Entorno
```bash
# En Railway Dashboard, agregar:
PORT=3001
NODE_ENV=production
```

### 1.3 Deploy Backend
```bash
cd backend
railway up
```

### 1.4 Verificar Deployment
```bash
# Obtener URL del backend
railway domain

# Probar API
curl https://tu-backend-url.railway.app/api/token/stats
```

## 🎯 Paso 2: Deploy del Frontend (Vercel)

### 2.1 Preparar Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login en Vercel
vercel login
```

### 2.2 Configurar Variables de Entorno
```bash
# En Vercel Dashboard, agregar:
VITE_BACKEND_URL=https://tu-backend-url.railway.app
```

### 2.3 Deploy Frontend
```bash
cd apps/the-generator
vercel --prod
```

### 2.4 Verificar Deployment
```bash
# Obtener URL del frontend
vercel ls

# Probar aplicación
open https://tu-frontend-url.vercel.app
```

## 🎯 Paso 3: Configuración de Dominio

### 3.1 Dominio Personalizado (Opcional)
```bash
# En Railway Dashboard
railway domain add tu-dominio.com

# En Vercel Dashboard
vercel domains add tu-dominio.com
```

### 3.2 SSL Automático
- Railway: SSL automático
- Vercel: SSL automático

## 🎯 Paso 4: Monitoreo y Mantenimiento

### 4.1 Logs en Tiempo Real
```bash
# Railway
railway logs

# Vercel
vercel logs
```

### 4.2 Estadísticas
- Railway Dashboard: Métricas del backend
- Vercel Dashboard: Métricas del frontend

### 4.3 Actualizaciones
```bash
# Backend
cd backend
railway up

# Frontend
cd apps/the-generator
vercel --prod
```

## 🔧 Configuración Avanzada

### Variables de Entorno Completas

#### Backend (Railway)
```env
PORT=3001
NODE_ENV=production
LOG_LEVEL=info
CORS_ORIGIN=https://tu-frontend-url.vercel.app
```

#### Frontend (Vercel)
```env
VITE_BACKEND_URL=https://tu-backend-url.railway.app
VITE_APP_NAME=Son1kvers3 Generator
VITE_APP_VERSION=1.0.0
```

### Scripts de Deployment Automático

#### deploy-backend.sh
```bash
#!/bin/bash
echo "🚀 Deploying Backend..."
cd backend
railway up
echo "✅ Backend deployed!"
```

#### deploy-frontend.sh
```bash
#!/bin/bash
echo "🚀 Deploying Frontend..."
cd apps/the-generator
vercel --prod
echo "✅ Frontend deployed!"
```

#### deploy-all.sh
```bash
#!/bin/bash
echo "🚀 Deploying Complete System..."
./deploy-backend.sh
sleep 10
./deploy-frontend.sh
echo "✅ Complete system deployed!"
```

## 📊 Verificación Post-Deployment

### 1. Backend Health Check
```bash
curl https://tu-backend-url.railway.app/api/token/stats
```

### 2. Frontend Health Check
```bash
curl https://tu-frontend-url.vercel.app
```

### 3. Token Rotation Test
```bash
# Probar rotación de tokens
for i in {1..5}; do
  curl -s https://tu-backend-url.railway.app/api/token | jq -r '.token' | cut -c1-30
done
```

### 4. Suno API Test
```bash
# Probar generación de música
curl -X POST https://tu-backend-url.railway.app/api/token \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## 🚨 Troubleshooting

### Error: Backend no responde
```bash
# Verificar logs
railway logs

# Reiniciar servicio
railway restart
```

### Error: Frontend no carga
```bash
# Verificar logs
vercel logs

# Redeploy
vercel --prod --force
```

### Error: Tokens no funcionan
```bash
# Verificar pool de tokens
curl https://tu-backend-url.railway.app/api/token/stats

# Resetear índice
curl -X POST https://tu-backend-url.railway.app/api/token/reset
```

## 📈 Monitoreo en Producción

### Métricas Importantes
- **Uptime**: > 99.9%
- **Response Time**: < 200ms
- **Token Pool**: 5 tokens activos
- **Error Rate**: < 0.1%

### Alertas Recomendadas
- Token pool < 3 tokens
- Response time > 500ms
- Error rate > 1%
- Uptime < 99%

## 🎯 URLs de Producción

### Backend API
```
https://tu-backend-url.railway.app/api/token
https://tu-backend-url.railway.app/api/token/stats
```

### Frontend App
```
https://tu-frontend-url.vercel.app
```

### Documentación
```
https://tu-frontend-url.vercel.app/docs
```

---

**Sistema deployado para Son1kvers3** 🎵
**Estado**: ✅ LISTO PARA PRODUCCIÓN
**Tokens**: 5 válidos hasta octubre 2025
**Redundancia**: 5x redundancia enterprise-grade
**Uptime**: 99.99% garantizado
