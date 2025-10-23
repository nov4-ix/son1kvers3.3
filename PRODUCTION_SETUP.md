# Configuración para Producción - The Generator

## Variables de Entorno para Vercel

### Servidor de Tokens
TOKEN_SERVER_URL=https://tu-servidor-de-tokens.railway.app

### Groq API (para traducción)
GROQ_API_KEY=tu_groq_api_key_aqui

### Admin Configuration
NEXT_PUBLIC_ADMIN_PASSWORD=iloveMusic!90
ADMIN_EMAIL=nov4-ix@son1kvers3.com

## Instrucciones de Despliegue

### 1. Desplegar Servidor de Tokens en Railway
1. Ve a https://railway.app
2. Crea un nuevo proyecto
3. Conecta tu repositorio
4. Usa el archivo `token-server-production.js`
5. Agrega el `package.json` correspondiente
6. Despliega y copia la URL

### 2. Configurar Variables en Vercel
1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega:
   - `TOKEN_SERVER_URL` = URL de tu servidor Railway
   - `GROQ_API_KEY` = Tu clave de Groq
   - `NEXT_PUBLIC_ADMIN_PASSWORD` = iloveMusic!90

### 3. Agregar Tokens Iniciales
Una vez desplegado, agrega tokens frescos usando la página de administración:
- Ve a https://tu-app.vercel.app/admin
- Agrega tokens frescos de Suno

## URLs de Producción
- **Aplicación:** https://the-generator.son1kvers3.com
- **Administración:** https://the-generator.son1kvers3.com/admin
- **Servidor de Tokens:** https://tu-servidor.railway.app
