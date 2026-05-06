class ApiService {
  constructor(baseURL, apiKey, host) {
    this.baseURL = baseURL;
    // Используем метод получения ключа по примеру из методички
    this.apiKey = this.getAPIKey(apiKey);
    this.host = host;
  }

  // Метод получения ключа (имитация process.env для клиентской лабы)
  getAPIKey(key) {
    // В реальном приложении ключи должны приходить с сервера (.env)
    // Для демонстрации используем переданный ключ (или demo_key как заглушку)
    return key || 'demo_key';
  }

  // Безопасный GET запрос (аналог makeSecureRequest из методички)
  async get(endpoint, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${this.baseURL}${endpoint}?${queryParams}`;

      // Проверка безопасности 1: Использование только HTTPS
      if (!url.startsWith('https://')) {
        throw new Error('Security Error: Разрешены только HTTPS запросы');
      }

      // Проверка безопасности 2: Безопасные опции fetch и ограничение метода (только GET)
      const secureOptions = {
        method: 'GET', // Строго ограничиваем метод
        mode: 'cors', // Проверка CORS (из методички)
        headers: {
          'Content-Type': 'application/json',
          // Скрываем ключи в заголовках, а не в URL
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': this.host,
        },
      };

      const response = await fetch(url, secureOptions);

      if (!response.ok) {
        // Точь-в-точь как на скриншоте методички
        throw new Error(`Secure request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Перехват ошибок как на скриншоте
      console.error('Secure request error:', error);
      throw error;
    }
  }
}

export default ApiService;
