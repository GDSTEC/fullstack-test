export const AsyncLocalStorage = {
  async setItem(key: string, value: string): Promise<void> {
    return Promise.resolve().then(function () {
      localStorage.setItem(key, value);
    });
  },
  async getItem(key: string): Promise<string | null> {
    return Promise.resolve().then(function () {
      return localStorage.getItem(key);
    });
  }
};