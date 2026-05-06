class LocalStorageService {
  constructor() {
    this.storage = window.localStorage;
    this.initializeStorage();
  }

  initializeStorage() {
    // Инициализация необходимых ключей
    if (!this.get('app_settings')) {
      this.set('app_settings', {
        theme: 'light',
        language: 'ru',
        cacheDuration: 3600000, // 1 час в миллисекундах
      });
    }
  }

  // Сохранение данных с временной меткой
  set(key, value) {
    try {
      const item = {
        value: value,
        timestamp: new Date().getTime(),
      };
      const serializedValue = JSON.stringify(item);
      this.storage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  // Получение данных с проверкой актуальности
  get(key, defaultValue = null, maxAge = null) {
    try {
      const item = this.storage.getItem(key);
      if (!item) return defaultValue;

      const parsedItem = JSON.parse(item);

      // Проверка актуальности данных
      if (maxAge && new Date().getTime() - parsedItem.timestamp > maxAge) {
        this.remove(key);
        return defaultValue;
      }

      return parsedItem.value;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  // Удаление данных
  remove(key) {
    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  // Очистка устаревших данных
  clearExpired() {
    const settings = this.get('app_settings');
    const cacheDuration = settings?.cacheDuration || 3600000;
    const now = new Date().getTime();

    Object.keys(this.storage).forEach(key => {
      if (key !== 'app_settings') {
        const item = this.storage.getItem(key);
        if (item) {
          try {
            const parsedItem = JSON.parse(item);
            if (now - parsedItem.timestamp > cacheDuration) {
              this.remove(key);
            }
          } catch (error) {
            // Невалидные данные - удаляем
            this.remove(key);
          }
        }
      }
    });
  }

  // Получение всех ключей
  getAllKeys() {
    return Object.keys(this.storage);
  }

  // Проверка существования актуальных данных
  hasValid(key, maxAge = null) {
    return this.get(key, null, maxAge) !== null;
  }
}

export default LocalStorageService;
