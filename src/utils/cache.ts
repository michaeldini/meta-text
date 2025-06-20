// Generic cache utility for API responses
import log from './logger';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  defaultTTL: number; // Default TTL in milliseconds
  maxSize: number; // Maximum number of entries
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5 minutes default
      maxSize: 100, // Max 100 entries
      ...config,
    };
  }

  /**
   * Generate a cache key from function name and parameters
   */
  private generateKey(functionName: string, params: any[]): string {
    const paramStr = params.map(p => 
      typeof p === 'object' ? JSON.stringify(p) : String(p)
    ).join('|');
    return `${functionName}:${paramStr}`;
  }

  /**
   * Check if cache entry is still valid
   */
  private isValid<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  /**
   * Clean up expired entries and enforce max size
   */
  private cleanup(): void {
    // Remove expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isValid(entry)) {
        this.cache.delete(key);
        log.info(`Cache: Removed expired entry for ${key}`);
      }
    }

    // Enforce max size by removing oldest entries
    if (this.cache.size > this.config.maxSize) {
      const entries = Array.from(this.cache.entries());
      const sortedByAge = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toRemove = sortedByAge.slice(0, entries.length - this.config.maxSize);
      
      for (const [key] of toRemove) {
        this.cache.delete(key);
        log.info(`Cache: Removed old entry for ${key} (max size reached)`);
      }
    }
  }

  /**
   * Get cached data if valid
   */
  get<T>(functionName: string, params: any[]): T | null {
    const key = this.generateKey(functionName, params);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (!this.isValid(entry)) {
      this.cache.delete(key);
      log.info(`Cache: Removed expired entry for ${key}`);
      return null;
    }

    log.info(`Cache: Hit for ${key}`);
    return entry.data;
  }

  /**
   * Set cached data
   */
  set<T>(functionName: string, params: any[], data: T, ttl?: number): void {
    const key = this.generateKey(functionName, params);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
    };

    this.cache.set(key, entry);
    log.info(`Cache: Stored entry for ${key} (TTL: ${entry.ttl}ms)`);

    // Cleanup periodically
    if (this.cache.size % 10 === 0) {
      this.cleanup();
    }
  }

  /**
   * Invalidate cache entries by pattern
   */
  invalidate(pattern: string | RegExp): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      const matches = typeof pattern === 'string' 
        ? key.includes(pattern)
        : pattern.test(key);
        
      if (matches) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
      log.info(`Cache: Invalidated ${key}`);
    }

    if (keysToDelete.length > 0) {
      log.info(`Cache: Invalidated ${keysToDelete.length} entries matching pattern: ${pattern}`);
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    const count = this.cache.size;
    this.cache.clear();
    log.info(`Cache: Cleared all ${count} entries`);
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      defaultTTL: this.config.defaultTTL,
    };
  }
}

// Create a singleton cache instance
export const apiCache = new ApiCache({
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
});

/**
 * Higher-order function to add caching to async functions
 */
export function withCache<T extends any[], R>(
  functionName: string,
  asyncFunction: (...args: T) => Promise<R>,
  ttl?: number
) {
  return async (...args: T): Promise<R> => {
    // Try to get from cache first
    const cached = apiCache.get<R>(functionName, args);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    try {
      const result = await asyncFunction(...args);
      apiCache.set(functionName, args, result, ttl);
      return result;
    } catch (error) {
      // Don't cache errors
      throw error;
    }
  };
}

/**
 * Development utilities for cache monitoring
 */
export const cacheUtils = {
  /**
   * Get current cache statistics
   */
  getStats: () => apiCache.getStats(),

  /**
   * Clear all cache entries
   */
  clearAll: () => apiCache.clear(),

  /**
   * Log cache contents (development only)
   */
  logCacheContents: () => {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'development') {
      const stats = apiCache.getStats();
      log.info('Cache Stats:', stats);
      
      // Log individual cache entries
      const cacheInstance = apiCache as any;
      const entries = Array.from(cacheInstance.cache.entries() as Iterable<[string, CacheEntry<any>]>)
        .map(([key, entry]) => ({
          key,
          hasData: !!entry.data,
          age: Date.now() - entry.timestamp,
          ttl: entry.ttl,
          expired: Date.now() - entry.timestamp > entry.ttl
        }));
      
      log.info('Cache Entries:', entries);
    }
  },

  /**
   * Warm up cache with commonly accessed data
   */
  warmUp: async () => {
    try {
      log.info('Cache: Warming up with commonly accessed data...');
      
      // Import services dynamically to avoid circular dependencies
      const { fetchSourceDocuments } = await import('../services/sourceDocumentService');
      const { fetchMetaTexts } = await import('../services/metaTextService');
      
      // Pre-load common data
      await Promise.allSettled([
        fetchSourceDocuments(),
        fetchMetaTexts()
      ]);
      
      log.info('Cache: Warm-up completed');
    } catch (error) {
      log.error('Cache: Warm-up failed', error);
    }
  }
};

// Expose cache utilities in development mode only
if (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && 
    import.meta.env && import.meta.env.MODE === 'development') {
  (window as any).cacheUtils = cacheUtils;
}

export default apiCache;
