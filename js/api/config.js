// Конфигурация для различных API
export const API_CONFIG = {
  booking: {
    url: 'https://booking-com.p.rapidapi.com/v1',
    apiKey: '557cf961e4msha9f40b1a7a31034p1c704ajsndcb76225775e',
    host: 'booking-com.p.rapidapi.com',
    endpoints: {
      // Эндпоинт для поиска городов
      locations: '/hotels/locations',
    },
  },
};

// Заглушка при недоступности API
export const FALLBACK_DATA = {
  locations: [
    { dest_id: '-2601889', name: 'London', label: 'London, United Kingdom' },
    { dest_id: '-2140479', name: 'Minsk', label: 'Minsk, Belarus' },
    { dest_id: '-194560', name: 'Paris', label: 'Paris, France' },
  ],
};
