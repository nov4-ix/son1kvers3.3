#!/bin/bash

# 🔐 SISTEMA DE CUENTAS SSV-BETA - SON1KVERSE AI MUSIC ENGINE
# Cuentas específicas del repositorio SSV-BETA con autenticación por email/contraseña

echo "🔐 CREANDO CUENTAS SSV-BETA - SON1KVERSE AI MUSIC ENGINE"
echo "========================================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para mostrar status
show_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Función para mostrar tier
show_tier() {
    case $1 in
        "admin")
            echo -e "${CYAN}👑 ADMIN${NC}"
            ;;
        "enterprise")
            echo -e "${PURPLE}🏢 ENTERPRISE${NC}"
            ;;
        "pro")
            echo -e "${BLUE}⭐ PRO${NC}"
            ;;
    esac
}

echo ""
echo "📋 CUENTAS SSV-BETA A CREAR:"
echo "============================"

echo ""
echo "👑 ADMINISTRADOR:"
echo "   Email: nov4-ix@son1kvers3.com"
echo "   Contraseña: admin123"
echo "   Tier: Admin (Ilimitado)"
echo "   Símbolo: ALVAE"

echo ""
echo "🏢 ENTERPRISE:"
echo "   Email: enterprise.tester@son1kvers3.com"
echo "   Contraseña: Premium!123"
echo "   Tier: Enterprise"
echo "   Símbolo: ALVAE"

echo ""
echo "⭐ PRO TESTERS (10 cuentas):"
for i in {1..10}; do
    echo "   Email: pro.tester${i}@son1kvers3.com"
    echo "   Contraseña: Premium!123"
    echo "   Tier: Pro"
    echo "   Símbolo: ALVAE"
    echo ""
done

echo ""
echo "🎯 CREANDO SISTEMA DE AUTENTICACIÓN:"
echo "===================================="

# Crear directorio de cuentas SSV-BETA
mkdir -p ssv-beta-accounts

# Función para crear cuenta
create_account() {
    local email=$1
    local password=$2
    local tier=$3
    local userId=$(echo $email | cut -d'@' -f1 | tr '.' '_')
    local token="${tier^^}_TOKEN_$(echo $userId | tr '[:lower:]' '[:upper:]')"
    
    echo ""
    show_tier $tier
    echo "   Email: $email"
    echo "   Usuario: $userId"
    echo "   Token: ${token:0:15}..."
    
    # Crear archivo de configuración de la cuenta
    cat > "ssv-beta-accounts/${userId}_config.js" << EOF
// Configuración SSV-BETA: $email
const USER_CONFIG = {
  userId: '$userId',
  email: '$email',
  password: '$password',
  tier: '$tier',
  token: '$token',
  dailyLimit: $([ "$tier" = "admin" ] && echo "999999" || [ "$tier" = "enterprise" ] && echo "1000" || echo "50"),
  monthlyLimit: $([ "$tier" = "admin" ] && echo "999999" || [ "$tier" = "enterprise" ] && echo "30000" || echo "1500"),
  concurrentLimit: $([ "$tier" = "admin" ] && echo "999" || [ "$tier" = "enterprise" ] && echo "10" || echo "3"),
  rateLimit: $([ "$tier" = "admin" ] && echo "999" || [ "$tier" = "enterprise" ] && echo "100" || echo "30"),
  userType: '$tier',
  sunoModel: 'suno-5.0',
  symbol: 'ALVAE',
  nickname: '', // Se asignará al registrarse
  isSSVBeta: true,
  createdAt: new Date().toISOString()
};

const USER_TOKENS = {
  primary: '$token',
  backup: '${token}_BACKUP'
};

// Configuración de branding
const BRANDING = {
  name: 'Son1kVerse AI Music Engine',
  version: '1.0.0',
  description: 'Genera música con IA usando Son1kVerse AI Music Engine - SSV-BETA $tier'
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { USER_CONFIG, USER_TOKENS, BRANDING };
}
EOF
    
    show_status 0 "Cuenta $email ($tier) creada"
}

# Crear cuenta de administrador
create_account "nov4-ix@son1kvers3.com" "admin123" "admin"

# Crear cuenta enterprise
create_account "enterprise.tester@son1kvers3.com" "Premium!123" "enterprise"

# Crear cuentas pro testers
for i in {1..10}; do
    create_account "pro.tester${i}@son1kvers3.com" "Premium!123" "pro"
done

echo ""
echo "🔐 CREANDO SISTEMA DE AUTENTICACIÓN:"
echo "===================================="

# Crear sistema de autenticación
cat > "ssv-beta-accounts/auth-system.js" << 'EOF'
// Sistema de autenticación SSV-BETA
class SSVBetaAuth {
  constructor() {
    this.accounts = new Map();
    this.sessions = new Map();
    this.loadAccounts();
  }

  loadAccounts() {
    // Cargar cuentas SSV-BETA
    const accounts = [
      // Admin
      {
        email: 'nov4-ix@son1kvers3.com',
        password: 'admin123',
        tier: 'admin',
        userId: 'nov4_ix',
        token: 'ADMIN_TOKEN_NOV4_IX',
        dailyLimit: 999999,
        monthlyLimit: 999999,
        symbol: 'ALVAE'
      },
      // Enterprise
      {
        email: 'enterprise.tester@son1kvers3.com',
        password: 'Premium!123',
        tier: 'enterprise',
        userId: 'enterprise_tester',
        token: 'ENTERPRISE_TOKEN_ENTERPRISE_TESTER',
        dailyLimit: 1000,
        monthlyLimit: 30000,
        symbol: 'ALVAE'
      }
    ];

    // Pro testers
    for (let i = 1; i <= 10; i++) {
      accounts.push({
        email: `pro.tester${i}@son1kvers3.com`,
        password: 'Premium!123',
        tier: 'pro',
        userId: `pro_tester${i}`,
        token: `PRO_TOKEN_PRO_TESTER${i}`,
        dailyLimit: 50,
        monthlyLimit: 1500,
        symbol: 'ALVAE'
      });
    }

    // Cargar en Map
    accounts.forEach(account => {
      this.accounts.set(account.email, account);
    });
  }

  authenticate(email, password) {
    const account = this.accounts.get(email);
    if (!account) {
      return { success: false, error: 'Email no encontrado' };
    }

    if (account.password !== password) {
      return { success: false, error: 'Contraseña incorrecta' };
    }

    // Crear sesión
    const sessionId = this.generateSessionId();
    const session = {
      ...account,
      sessionId,
      loginTime: new Date().toISOString(),
      nickname: account.nickname || ''
    };

    this.sessions.set(sessionId, session);

    return {
      success: true,
      sessionId,
      user: {
        userId: account.userId,
        email: account.email,
        tier: account.tier,
        symbol: account.symbol,
        nickname: account.nickname || '',
        dailyLimit: account.dailyLimit,
        monthlyLimit: account.monthlyLimit
      }
    };
  }

  setNickname(sessionId, nickname) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false, error: 'Sesión no válida' };
    }

    session.nickname = nickname;
    this.sessions.set(sessionId, session);

    return { success: true, nickname };
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  generateSessionId() {
    return 'ssv_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  logout(sessionId) {
    this.sessions.delete(sessionId);
    return { success: true };
  }
}

// Exportar para uso en la extensión
if (typeof window !== 'undefined') {
  window.SSVBetaAuth = SSVBetaAuth;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SSVBetaAuth;
}
EOF

show_status 0 "Sistema de autenticación creado"

echo ""
echo "🎨 CREANDO INTERFAZ DE LOGIN:"
echo "============================="

# Crear interfaz de login
cat > "ssv-beta-accounts/login.html" << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <title>SSV-BETA Login - Son1kVerse AI Music Engine</title>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #0A0C10 0%, #1a1a2e 50%, #16213e 100%);
      color: white;
      margin: 0;
      padding: 20px;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .login-container {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
    
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .logo h1 {
      background: linear-gradient(45deg, #00FFE7, #B84DFF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-size: 2rem;
      margin: 0;
    }
    
    .symbol {
      font-size: 3rem;
      color: #00FFE7;
      margin: 10px 0;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #B84DFF;
      font-weight: 600;
    }
    
    .form-group input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      color: white;
      font-size: 16px;
      box-sizing: border-box;
    }
    
    .form-group input:focus {
      outline: none;
      border-color: #00FFE7;
      box-shadow: 0 0 10px rgba(0, 255, 231, 0.3);
    }
    
    .form-group input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    
    .login-btn {
      width: 100%;
      padding: 14px;
      background: linear-gradient(45deg, #00FFE7, #B84DFF);
      border: none;
      border-radius: 10px;
      color: white;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 255, 231, 0.3);
    }
    
    .error {
      color: #ff6b6b;
      text-align: center;
      margin-top: 15px;
      padding: 10px;
      background: rgba(255, 107, 107, 0.1);
      border-radius: 8px;
      display: none;
    }
    
    .success {
      color: #51cf66;
      text-align: center;
      margin-top: 15px;
      padding: 10px;
      background: rgba(81, 207, 102, 0.1);
      border-radius: 8px;
      display: none;
    }
    
    .nickname-section {
      display: none;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .tier-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 10px;
    }
    
    .tier-admin { background: #00FFE7; color: #0A0C10; }
    .tier-enterprise { background: #B84DFF; color: white; }
    .tier-pro { background: #4DABF7; color: white; }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="logo">
      <h1>Son1kVerse AI Music Engine</h1>
      <div class="symbol">ALVAE</div>
      <p>SSV-BETA Access</p>
    </div>
    
    <form id="loginForm">
      <div class="form-group">
        <label for="email">Email SSV-BETA</label>
        <input type="email" id="email" placeholder="tu.email@son1kvers3.com" required>
      </div>
      
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" placeholder="Tu contraseña" required>
      </div>
      
      <button type="submit" class="login-btn">🔐 Acceder</button>
    </form>
    
    <div id="error" class="error"></div>
    <div id="success" class="success"></div>
    
    <div id="nicknameSection" class="nickname-section">
      <h3>Configurar Nickname</h3>
      <div class="form-group">
        <label for="nickname">Tu Nickname</label>
        <input type="text" id="nickname" placeholder="MiNickname" required>
      </div>
      <button type="button" id="setNickname" class="login-btn">✨ Guardar Nickname</button>
    </div>
  </div>

  <script src="auth-system.js"></script>
  <script>
    const auth = new SSVBetaAuth();
    let currentSession = null;

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      const result = auth.authenticate(email, password);
      
      if (result.success) {
        currentSession = result.sessionId;
        const user = result.user;
        
        document.getElementById('success').innerHTML = `
          ✅ Login exitoso<br>
          Usuario: ${user.userId}<br>
          Tier: <span class="tier-badge tier-${user.tier}">${user.tier.toUpperCase()}</span><br>
          Símbolo: ${user.symbol}
        `;
        document.getElementById('success').style.display = 'block';
        document.getElementById('error').style.display = 'none';
        
        if (!user.nickname) {
          document.getElementById('nicknameSection').style.display = 'block';
        } else {
          // Ya tiene nickname, proceder a la extensión
          proceedToExtension(user);
        }
      } else {
        document.getElementById('error').innerHTML = `❌ ${result.error}`;
        document.getElementById('error').style.display = 'block';
        document.getElementById('success').style.display = 'none';
      }
    });

    document.getElementById('setNickname').addEventListener('click', () => {
      const nickname = document.getElementById('nickname').value;
      
      if (nickname) {
        const result = auth.setNickname(currentSession, nickname);
        
        if (result.success) {
          const session = auth.getSession(currentSession);
          proceedToExtension(session);
        }
      }
    });

    function proceedToExtension(user) {
      // Guardar sesión en localStorage
      localStorage.setItem('ssv_beta_session', JSON.stringify({
        sessionId: currentSession,
        user: user,
        loginTime: new Date().toISOString()
      }));
      
      // Redirigir a la extensión principal
      window.location.href = '../index.html';
    }
  </script>
</body>
</html>
EOF

show_status 0 "Interfaz de login creada"

echo ""
echo "📊 RESUMEN DE CUENTAS SSV-BETA:"
echo "==============================="

# Contar cuentas por tier
admin_count=$(ls ssv-beta-accounts/*admin* 2>/dev/null | wc -l)
enterprise_count=$(ls ssv-beta-accounts/*enterprise* 2>/dev/null | wc -l)
pro_count=$(ls ssv-beta-accounts/*pro* 2>/dev/null | wc -l)

echo ""
echo "👑 Admin: $admin_count cuenta"
echo "🏢 Enterprise: $enterprise_count cuenta"
echo "⭐ Pro: $pro_count cuentas"
echo ""
echo "📈 Total: $((admin_count + enterprise_count + pro_count)) cuentas SSV-BETA"

echo ""
echo "🔐 CREDENCIALES DE ACCESO:"
echo "=========================="
echo ""
echo "👑 ADMINISTRADOR:"
echo "   Email: nov4-ix@son1kvers3.com"
echo "   Contraseña: admin123"
echo "   Tier: Admin (Ilimitado)"
echo ""
echo "🏢 ENTERPRISE:"
echo "   Email: enterprise.tester@son1kvers3.com"
echo "   Contraseña: Premium!123"
echo "   Tier: Enterprise"
echo ""
echo "⭐ PRO TESTERS:"
echo "   Email: pro.tester1@son1kvers3.com hasta pro.tester10@son1kvers3.com"
echo "   Contraseña: Premium!123"
echo "   Tier: Pro"

echo ""
echo "🚀 INSTRUCCIONES DE USO:"
echo "======================="
echo ""
echo "1. 📁 Archivos creados en: ./ssv-beta-accounts/"
echo "2. 🔐 Para probar el login:"
echo "   - Abrir ssv-beta-accounts/login.html en el navegador"
echo "   - Usar las credenciales de arriba"
echo "   - Configurar nickname al primer login"
echo ""
echo "3. 🎵 Para integrar con la extensión:"
echo "   - Copiar auth-system.js a la raíz de la extensión"
echo "   - Modificar index.html para incluir el sistema de auth"
echo "   - Las cuentas se autenticarán automáticamente"
echo ""

echo "✨ ¡CUENTAS SSV-BETA CREADAS EXITOSAMENTE! ✨"
echo "============================================="
