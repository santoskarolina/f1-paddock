import { CACHE_TTL_MS } from '../config/constants';

export class HttpError extends Error {
  constructor(url, status) {
    super(`Falha ao buscar ${url} (HTTP ${status})`);
    this.name = 'HttpError';
    this.status = status;
  }
}

const memoryCache = new Map();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const cacheKey = (url) => `paddock:${url}`;

function readStoredCache(key, ttl) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { savedAt, data } = JSON.parse(raw);
    return Date.now() - savedAt < ttl ? data : null;
  } catch {
    return null;
  }
}

function writeStoredCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Armazenamento cheio ou bloqueado: o cache é só uma otimização.
  }
}

/**
 * GET com cache (memória + localStorage) e nova tentativa em caso de 429,
 * para respeitar o limite de requisições das APIs públicas.
 */
export async function fetchJson(url, { ttl = CACHE_TTL_MS, retries = 2, signal } = {}) {
  const key = cacheKey(url);
  const cached = memoryCache.get(key) ?? readStoredCache(key, ttl);
  if (cached) return cached;

  for (let attempt = 0; ; attempt += 1) {
    const response = await fetch(url, { signal });

    if (response.status === 429 && attempt < retries) {
      await sleep(1000 * (attempt + 1));
      continue;
    }
    if (!response.ok) throw new HttpError(url, response.status);

    const data = await response.json();
    memoryCache.set(key, data);
    writeStoredCache(key, data);
    return data;
  }
}
