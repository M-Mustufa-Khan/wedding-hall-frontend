/* src/utils/localCache.js */

// Generic local storage cache with optional TTL (time-to-live) in milliseconds.
// Stores an object: { data: <any>, savedAt: <timestamp> }

export const setCache = (key, data, ttl = null) => {
  try {
    const payload = { data, savedAt: Date.now(), ttl };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (e) {
    console.warn('Failed to set cache', key, e);
  }
};

export const getCache = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, savedAt, ttl } = JSON.parse(raw);
    if (ttl && Date.now() - savedAt > ttl) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (e) {
    console.warn('Failed to get cache', key, e);
    return null;
  }
};

export const clearCache = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('Failed to clear cache', key, e);
  }
};

export const getCachedBookings = () => {
  const data = getCache('cachedBookings');
  return data ? data : [];
};

export const setCachedBookings = (bookings) => {
  setCache('cachedBookings', bookings);
};

export const addBookingToCache = (booking) => {
  const bookings = getCachedBookings();
  bookings.push(booking);
  setCachedBookings(bookings);
};
