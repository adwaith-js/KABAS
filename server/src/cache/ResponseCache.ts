export class ResponseCache<T> {
  private cache: Map<string, { data: T; expiresAt: number }>;
  private ttlMs: number;

  constructor(ttlSeconds: number = 60) {
    this.cache = new Map();
    this.ttlMs = ttlSeconds * 1000;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key: string, data: T): void {
    this.cache.set(key, { data, expiresAt: Date.now() + this.ttlMs });
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
