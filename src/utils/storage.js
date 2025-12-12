/**
 * Safe localStorage wrapper with error handling
 */

export const storageUtils = {
  /**
   * Get item from localStorage with validation
   * @param {string} key
   * @returns {string|null}
   */
  getItem: (key) => {
    try {
      if (typeof globalThis?.window === "undefined") return null;
      const value = localStorage?.getItem(key);
      if (!value || value === "undefined" || value === "null") return null;
      return value;
    } catch {
      return null;
    }
  },

  /**
   * Set item in localStorage
   * @param {string} key
   * @param {string} value
   */
  setItem: (key, value) => {
    try {
      if (typeof globalThis?.window === "undefined") return;
      localStorage?.setItem(key, value);
    } catch (err) {
      console.warn(`Failed to set ${key} in localStorage:`, err);
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key
   */
  removeItem: (key) => {
    try {
      if (typeof globalThis?.window === "undefined") return;
      localStorage?.removeItem(key);
    } catch (err) {
      console.warn(`Failed to remove ${key} from localStorage:`, err);
    }
  },

  /**
   * Clear localStorage
   */
  clear: () => {
    try {
      if (typeof globalThis?.window === "undefined") return;
      localStorage?.clear();
    } catch (err) {
      console.warn("Failed to clear localStorage:", err);
    }
  },

  /**
   * Parse JSON from localStorage
   * @param {string} key
   * @returns {any|null}
   */
  getJSON: (key) => {
    try {
      const value = storageUtils.getItem(key);
      if (!value) return null;
      return JSON.parse(value);
    } catch (err) {
      console.warn(`Failed to parse JSON from ${key}:`, err);
      storageUtils.removeItem(key);
      return null;
    }
  },

  /**
   * Set JSON to localStorage
   * @param {string} key
   * @param {any} value
   */
  setJSON: (key, value) => {
    try {
      storageUtils.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`Failed to stringify and set ${key}:`, err);
    }
  },
};

export default storageUtils;
