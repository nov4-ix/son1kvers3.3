import { SUNO_CONFIG } from '../config/apiTokens';

interface TokenStatus {
  token: string;
  isValid: boolean;
  lastChecked: Date;
  errorCount: number;
}

class TokenManager {
  private currentToken: string = SUNO_CONFIG.AUTH_TOKEN;
  private tokenStatus: TokenStatus = {
    token: this.currentToken,
    isValid: true,
    lastChecked: new Date(),
    errorCount: 0
  };

  getToken(): string {
    return this.currentToken;
  }

  getHeaders() {
    return {
      ...SUNO_CONFIG.HEADERS,
      'authorization': this.getToken()
    };
  }

  markTokenAsInvalid() {
    this.tokenStatus.isValid = false;
    this.tokenStatus.errorCount++;
    console.error('[TokenManager] Token marked as invalid');
  }

  markTokenAsValid() {
    this.tokenStatus.isValid = true;
    this.tokenStatus.errorCount = 0;
  }

  isTokenValid(): boolean {
    return this.tokenStatus.isValid;
  }
}

export const tokenManager = new TokenManager();
