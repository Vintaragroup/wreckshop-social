/**
 * In-Memory Cache Utility
 * 
 * Provides caching for dashboard data with TTL management
 * Uses in-memory store with automatic expiration
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<any>>();

/**
 * Initialize cache (no-op for in-memory)
 */
export async function initializeCache(): Promise<void> {
  console.log('[cache] In-memory cache initialized');
}

/**
 * Get value from cache
 * 
 * @param key Cache key
 * @returns Cached value or null if not found or expired
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const entry = cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      cache.delete(key);
      return null;
    }

    return entry.value as T;
  } catch (error) {
    console.error('[cache] Error reading from cache:', error);
    return null;
  }
}

/**
 * Set value in cache with TTL
 * 
 * @param key Cache key
 * @param value Value to cache
 * @param ttlSeconds Time to live in seconds
 */
export async function setInCache<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  try {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    cache.set(key, { value, expiresAt });
  } catch (error) {
    console.error('[cache] Error writing to cache:', error);
  }
}

/**
 * Delete value from cache
 * 
 * @param key Cache key
 */
export async function deleteFromCache(key: string): Promise<void> {
  try {
    cache.delete(key);
  } catch (error) {
    console.error('[cache] Error deleting from cache:', error);
  }
}

/**
 * Clear all cache entries matching a pattern
 * 
 * @param pattern Key pattern (e.g., "dashboard:*")
 */
export async function clearCacheByPattern(pattern: string): Promise<void> {
  try {
    const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
    for (const key of cache.keys()) {
      if (regex.test(key)) {
        cache.delete(key);
      }
    }
  } catch (error) {
    console.error('[cache] Error clearing cache pattern:', error);
  }
}

/**
 * Cache key builders for common dashboard queries
 */
export const cacheKeys = {
  // Leaderboard keys
  leaderboard: (metric: string, limit: number) => `leaderboard:${metric}:${limit}`,
  leaderboardByGenre: (metric: string, genre: string, limit: number) =>
    `leaderboard:${metric}:${genre}:${limit}`,

  // Discovery keys
  trending: (timeframe: string) => `trending:${timeframe}`,
  newArtists: () => `newArtists`,
  byGenre: (genre: string, limit: number) => `genre:${genre}:${limit}`,

  // Manager dashboard keys
  managerOverview: (managerId: string) => `manager:${managerId}:overview`,
  managerArtists: (managerId: string, page: number, limit: number) =>
    `manager:${managerId}:artists:${page}:${limit}`,

  // Artist profile keys
  artistProfile: (artistId: string) => `artist:${artistId}:profile`,
  artistStats: (artistId: string) => `artist:${artistId}:stats`,

  // Search keys
  artistSearch: (query: string, limit: number) => `search:artist:${query}:${limit}`,
};

/**
 * Cache TTL constants (in seconds)
 */
export const cacheTTL = {
  LEADERBOARD: 3600, // 1 hour
  TRENDING: 1800, // 30 minutes
  ARTIST_PROFILE: 600, // 10 minutes
  ARTIST_STATS: 300, // 5 minutes
  SEARCH: 300, // 5 minutes
  DISCOVERY: 3600, // 1 hour
};

export default {
  initializeCache,
  getFromCache,
  setInCache,
  deleteFromCache,
  clearCacheByPattern,
  cacheKeys,
  cacheTTL,
};
