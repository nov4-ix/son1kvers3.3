
# O con VSCode
code src/config/apiTokens.tsexport const SUNO_CONFIG = {
  BASE_URL: 'https://ai.imgkits.com/suno',
  POLLING_URL: 'https://usa.imgkits.com/node-api/suno',
AUTH_TOKEN: 'Bearer TU_NUEVO_TOKEN_AQUI',
  HEADERS: {
    'Content-Type': 'application/json',
    'channel': 'node-api',
    'origin': 'https://www.livepolls.app',
    'referer': 'https://www.livepolls.app/'
  }
};

export const API_CONFIG = {
  MAX_POLLING_ATTEMPTS: 60,
  POLLING_INTERVAL_MS: 5000,
  REQUEST_TIMEOUT_MS: 30000
};
