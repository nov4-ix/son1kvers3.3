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