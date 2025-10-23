# 🎵 Son1kVers3 - Sistema Comunitario de Generación Musical

[![Status](https://img.shields.io/badge/status-ready-brightgreen)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-orange)]()

---

## 📖 Descripción

**Son1kVers3** es un ecosistema completo de generación musical impulsado por IA que incluye:

- 🎵 **The Generator** - Herramienta de generación de música con IA
- 🌐 **Sistema Comunitario** - Pool de tokens compartido entre usuarios
- 🔌 **Extensión de Chrome** - Acceso transparente al pool comunitario
- 💳 **Sistema de Créditos** - Recompensas por contribuciones
- 🎨 **Frontend Clásico** - Dashboard de usuario con estadísticas

---

## ✨ Características Principales

### **Para Usuarios**
- ✅ Generación de música ilimitada sin cuenta de Suno
- ✅ Sistema de créditos por contribuciones
- ✅ Extensión de Chrome transparente
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Sin límites de uso (con extensión)

### **Para Desarrolladores**
- ✅ Arquitectura escalable (monorepo con Turborepo)
- ✅ APIs REST robustas
- ✅ Base de datos PostgreSQL (Supabase)
- ✅ Sistema de créditos completo
- ✅ Pool de tokens con rotación automática

---

## 🚀 Quick Start

```bash
# 1. Clonar repositorio
git clone https://github.com/son1kvers3/SSV-ALFA
cd SSV-ALFA

# 2. Ejecutar script de setup
./setup-community-system.sh

# 3. Seguir instrucciones del script
# (Configurar .env.local, aplicar migraciones, etc.)

# 4. ¡Listo!
```

Ver: [`QUICK_START.md`](QUICK_START.md) para guía detallada paso a paso.

---

## 📂 Estructura del Proyecto

```
SSV-ALFA/
├── apps/
│   ├── the-generator/          # Backend (Next.js API)
│   ├── web-classic/            # Frontend clásico (React)
│   ├── nexus-immersive/        # Frontend inmersivo
│   └── admin-dashboard/        # Panel de administración
├── packages/
│   ├── ui/                     # Componentes compartidos
│   └── utils/                  # Utilidades compartidas
├── suno-token-capture-extension/  # Extensión de Chrome
└── database/
    └── migrations/             # Migraciones SQL
```

---

## 🛠️ Stack Tecnológico

### **Frontend**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Zustand (state)
- Framer Motion (animations)

### **Backend**
- Next.js 14 (App Router)
- Supabase (PostgreSQL + Auth)
- OpenAI / Groq API
- Stripe (payments)

### **Extensión**
- Chrome Extensions API (Manifest V3)
- Vanilla JavaScript
- Chrome Storage API

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [`QUICK_START.md`](QUICK_START.md) | Guía de inicio rápido (15 min) |
| [`IMPLEMENTACION_COMPLETA.md`](IMPLEMENTACION_COMPLETA.md) | Guía completa de implementación |
| [`MODELO_FINAL_EXTENSION.md`](MODELO_FINAL_EXTENSION.md) | Arquitectura del sistema |
| [`ENTREGA_SISTEMA_COMUNITARIO.md`](ENTREGA_SISTEMA_COMUNITARIO.md) | Documento de entrega |
| [`suno-token-capture-extension/README.md`](suno-token-capture-extension/README.md) | Documentación de extensión |

---

## 🎯 Roadmap

### **Fase 1: MVP** ✅ COMPLETADO
- [x] Extensión de Chrome funcional
- [x] APIs del pool comunitario
- [x] Sistema de créditos
- [x] Frontend integrado
- [x] Migraciones SQL

### **Fase 2: Optimización** (1-2 semanas)
- [ ] Crear iconos profesionales para extensión
- [ ] Publicar en Chrome Web Store
- [ ] Sistema de auto-contribución
- [ ] Tests automatizados
- [ ] CI/CD pipeline

### **Fase 3: Monetización** (2-4 semanas)
- [ ] Planes de pago (Basic, Pro, Unlimited)
- [ ] Integración completa con Stripe
- [ ] Sistema de referidos
- [ ] Analytics avanzado

### **Fase 4: Escalabilidad** (1-2 meses)
- [ ] CDN para tokens (Redis cache)
- [ ] Load balancer para APIs
- [ ] Rate limiting por usuario
- [ ] Auto-scaling de infraestructura

---

## 🤝 Contribuir

¿Quieres contribuir al proyecto?

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agrega nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

Ver: [`CONTRIBUTING.md`](CONTRIBUTING.md) para más detalles.

---

## 📜 Licencia

Este proyecto está bajo la licencia MIT. Ver [`LICENSE`](LICENSE) para más detalles.

---

## 📞 Soporte

- **Email:** support@son1kvers3.com
- **Discord:** [son1kvers3.com/discord](https://son1kvers3.com/discord)
- **GitHub Issues:** [Reportar problema](https://github.com/son1kvers3/SSV-ALFA/issues)

---

## 🏆 Créditos

Desarrollado con ❤️ por el equipo de **Son1kVers3**

Gracias a la comunidad por hacer posible este sistema cooperativo de generación musical.

---

## ⚖️ Términos de Uso

Al usar este sistema, aceptas:
- Conectarte al pool comunitario de tokens
- Compartir tokens de forma opcional para ganar créditos
- Usar el servicio de forma responsable y ética

Ver [Términos Completos](https://son1kvers3.com/terms) para más información.

---

**🎉 ¡Genera música ilimitada con la comunidad!**

[Instalar Extensión](https://son1kvers3.com/extension) • [Dashboard](https://son1kvers3.com/community) • [Documentación](IMPLEMENTACION_COMPLETA.md)
