import ApiService from './api/apiService.js';
import LocalStorageService from './storage/localStorage.js';
import { API_CONFIG, FALLBACK_DATA } from './api/config.js';
import { formatDate, truncateText } from './utils/dataParser.js';

import { validateEmail, showError, clearErrors } from './utils/helpers.js';

document.addEventListener('DOMContentLoaded', () => {
  // Найти кнопку и меню по их ID
  const burgerBtn = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  // Если эти элементы есть на странице, повесить прослушку клика
  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      // При клике добавить/убирать классы с суффиксом --active
      burgerBtn.classList.toggle('header__burger--active');
      mobileMenu.classList.toggle('header__nav--active');
    });
  }

  // Работа с DOM
  // Поиск эл-в
  const projectTitle = document.querySelector('.header__title');
  const mainContent = document.querySelector('.main');
  const firstRoomCard = document.querySelector('.room-card');

  // Манипуляция контентом - изменить текстовое содержимое, добавив к названию сайта год
  if (projectTitle) {
    projectTitle.textContent = 'HotelBooking.ru (2026)';
  }

  // Манипуляция контентом - добавить приветственное уведомление
  if (mainContent) {
    const notificationHTML =
      '<div style="background-color: #2e7d32; color: white; text-align: center; padding: 10px;">Добро пожаловать! Акция на бронирование.</div>';
    mainContent.innerHTML = notificationHTML + mainContent.innerHTML;
  }

  // Работа с классами и стилями первой карточки (выделить лучший номер)
  if (firstRoomCard) {
    firstRoomCard.classList.add('room-card--highlighted');

    console.log('Моя первая карточка:', firstRoomCard);

    Object.assign(firstRoomCard.style, {
      backgroundColor: '#fffae6',
      outline: '3px solid #2e7d32',
      outlineOffset: '-3px',
    });
  }

  // Обработчик клика hero-кнопки
  const heroButton = document.querySelector('.hero__button');
  if (heroButton) {
    heroButton.addEventListener('click', function (event) {
      event.preventDefault();
      console.log('Кнопка бронирования нажата!');
      this.textContent = 'Подбираем варианты...';
    });
  }

  // Обработчик ввода в поле
  const searchInput = document.querySelector('.rooms__input-field');
  if (searchInput) {
    searchInput.addEventListener('input', function (event) {
      // Вывод в консоль каждого символа
      console.log('Поиск:', event.target.value);
    });
  }

  // Обработчик отправки формы
  const contactForm = document.querySelector('.footer__contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const formData = new FormData(this);
      console.log('Данные формы успешно собраны:', Object.fromEntries(formData));

      // Бонус: очищаем форму после отправки и благодарим
      this.reset();
      alert('Спасибо за подписку!');
    });
  }

  // Делегирование событий (скрытие карточки)
  // Найти общий контейнер, в котором лежат все карточки номеров
  const roomsGrid = document.querySelector('.rooms__grid');

  if (roomsGrid) {
    roomsGrid.addEventListener('click', function (event) {
      // Проверить, если клик был именно по элементу с классом room-card__button
      if (event.target.classList.contains('room-card__button')) {
        // Метод closest ищет ближайшего родителя с указанным классом
        const card = event.target.closest('.room-card');

        if (card) {
          card.style.display = 'none'; // Скрыть карточку со страницы
          console.log('Карточка номера скрыта!');
        }
      }
    });
  }

  // Индивидуальное задание
  // Фильтры
  const priceFilter = document.getElementById('price-filter');
  const priceValue = document.getElementById('price-value');
  const amenityFilters = document.querySelectorAll('.amenity-filter');

  // Событие input для ползунка цены (меняется в реальном времени)
  if (priceFilter && priceValue) {
    priceFilter.addEventListener('input', function () {
      priceValue.textContent = this.value;
      console.log('Новая максимальная цена:', this.value);
    });
  }

  // Событие change для чекбоксов (срабатывает при клике на галочку)
  amenityFilters.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      if (this.checked) {
        console.log(`Добавлен фильтр: ${this.value}`);
      } else {
        console.log(`Убран фильтр: ${this.value}`);
      }
    });
  });

  // Календарь и калькулятор
  const checkinInput = document.getElementById('checkin-date');
  const checkoutInput = document.getElementById('checkout-date');
  const totalPriceEl = document.getElementById('total-price');
  const BASE_PRICE = 2000; // Базовая цена за 1 ночь

  // Функция для расчета стоимости
  function calculatePrice() {
    // Получить значения дат
    const checkin = new Date(checkinInput.value);
    const checkout = new Date(checkoutInput.value);

    // Проверить, что обе даты выбраны и дата выезда позже даты заезда
    if (checkinInput.value && checkoutInput.value && checkout > checkin) {
      // Считать разницу в миллисекундах и перевести в дни
      const diffTime = checkout - checkin;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Умножить дни на цену и вывести на экран
      const total = diffDays * BASE_PRICE;
      totalPriceEl.textContent = total;
    } else if (checkout <= checkin) {
      totalPriceEl.textContent = 'Ошибка дат';
    } else {
      totalPriceEl.textContent = '0';
    }
  }

  // Событие change на оба календаря
  if (checkinInput && checkoutInput) {
    checkinInput.addEventListener('change', calculatePrice);
    checkoutInput.addEventListener('change', calculatePrice);
  }

  // Валидация формы (проверка email)
  const emailInput = document.querySelector('#footer-email');

  if (emailInput) {
    // Blur срабатывает, когда форма теряет фокус
    emailInput.addEventListener('blur', function () {
      clearErrors(this);

      // Если поле не пустое, но email не прошел проверку
      if (this.value !== '' && !validateEmail(this.value)) {
        showError(this, 'Введите корректный email (например, test@mail.ru)');
      }
    });
  }
});

//Для лабы 6

// Индивидуальное задание - Специализированный обработчик для Booking API
class BookingDataHandler {
  constructor(apiService) {
    this.api = apiService;
  }

  // Очищаем сырые данные от API, оставляем только нужное
  formatLocationData(rawData) {
    if (!Array.isArray(rawData)) return [];
    return rawData.slice(0, 5).map(item => ({
      id: item.dest_id || Date.now(),
      name: item.name || 'Неизвестно',
      description: item.label || item.dest_type || '',
      type: item.dest_type === 'city' ? 'Город' : 'Регион',
      imageUrl: item.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150',
    }));
  }

  // Красиво рисуем карточки отелей/городов
  renderLocations(locationsData, container, saveCallback) {
    if (!locationsData || locationsData.length === 0) {
      container.innerHTML = '<p class="no-data">По вашему запросу ничего не найдено.</p>';
      return;
    }

    let html = '';
    locationsData.forEach(loc => {
      html += `
                <div class="location-card" style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                    <img src="${loc.imageUrl}" alt="${loc.name}" style="width: 70px; height: 70px; border-radius: 8px; object-fit: cover;">
                    <div style="flex-grow: 1;">
                        <h4 style="margin: 0 0 5px 0; color: #0056b3;">${loc.name}</h4>
                        <p style="margin: 0 0 5px 0; font-size: 13px; color: #666;">${loc.description}</p>
                        <span style="background: #e3f2fd; color: #0056b3; padding: 3px 8px; border-radius: 12px; font-size: 12px;">${loc.type}</span>
                    </div>
                    <button class="btn-save" style="padding: 8px 15px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Сохранить</button>
                </div>
            `;
    });

    container.innerHTML = html;

    // Вешаем события сохранения на кнопки
    container.querySelectorAll('.btn-save').forEach((btn, index) => {
      btn.addEventListener('click', () => saveCallback(locationsData[index]));
    });
  }
}

// Главный класс приложения
class APIIntegrationManager {
  constructor() {
    this.localstorage = new LocalStorageService();
    this.api = null;
    this.currentData = null;
    this.dataHandler = null;
    this.init();
  }

  async init() {
    await this.initializeAPI();
    this.setupEventListeners();
    this.loadCachedData();
    this.setupSecurityMeasures();
    this.renderHistory(); // Запуск отрисовки истории поиска (Инд. задание)
  }

  async initializeAPI() {
    this.api = new ApiService(API_CONFIG.booking.url, API_CONFIG.booking.apiKey, API_CONFIG.booking.host);
    this.dataHandler = new BookingDataHandler(this.api);
  }

  setupEventListeners() {
    const searchBtn = document.getElementById('city-search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', e => {
        e.preventDefault();
        this.handleSearch();
      });
    }
  }

  async handleSearch() {
    const searchInput = document.getElementById('city-search-input');
    const query = searchInput.value.trim();

    if (!query) {
      this.showError('Введите поисковый запрос (например, London)');
      return;
    }

    this.saveToHistory(query); // Сохраняем запрос в историю (Инд. задание)

    await this.fetchData({ name: query, locale: 'en-gb' });
  }

  async fetchData(params = {}) {
    this.showLoading(true);

    try {
      const cacheKey = `api_data_${JSON.stringify(params)}`;
      const cachedData = this.localstorage.get(cacheKey, null, 3600000); // 1 час

      if (cachedData) {
        this.currentData = cachedData;
        this.renderData(cachedData);
        this.showNotification('Данные загружены из кэша');
        return;
      }

      const data = await this.api.get(API_CONFIG.booking.endpoints.locations, params);
      this.currentData = data;

      this.localstorage.set(cacheKey, data);
      this.localstorage.set('last_api_data', data);

      this.renderData(data);
      this.showNotification('Данные успешно загружены');
    } catch (error) {
      this.handleAPIError(error);
      // Если ошибка (например, кончился лимит API), показываем фолбэк данные (заглушку)
      this.currentData = FALLBACK_DATA.locations;
      this.renderData(this.currentData);
    } finally {
      this.showLoading(false);
    }
  }

  loadCachedData() {
    const lastData = this.localstorage.get('last_api_data');
    if (lastData) {
      this.currentData = lastData;
      this.renderData(lastData);
      this.showNotification('Показаны кэшированные данные');
    }
  }

  handleAPIError(error) {
    console.error('API Error:', error);
    let errorMessage = 'Произошла ошибка при загрузке данных';
    if (error.message.includes('429')) errorMessage = 'Превышен лимит запросов. Попробуйте позже';
    this.showError(errorMessage);
  }

  // Отрисовка (использует BookingDataHandler)
  renderData(data) {
    const container = document.getElementById('api-results-panel');
    if (!container) return;

    const formattedData = this.dataHandler.formatLocationData(data);
    this.dataHandler.renderLocations(formattedData, container, item => this.saveItem(item));
  }

  // Функции для истории поиска (Инд. задание)
  saveToHistory(query) {
    let history = this.localstorage.get('search_history', []);
    history = history.filter(item => item.toLowerCase() !== query.toLowerCase()); // Удаляем дубли
    history.unshift(query); // Добавляем в начало
    if (history.length > 5) history.pop(); // Оставляем только 5 последних

    this.localstorage.set('search_history', history);
    this.renderHistory();
  }

  renderHistory() {
    const historyList = document.getElementById('search-history-list');
    if (!historyList) return;

    const history = this.localstorage.get('search_history', []);
    historyList.innerHTML = '';

    history.forEach(query => {
      const btn = document.createElement('button');
      btn.textContent = query;
      btn.style.cssText =
        'background: #e0e0e0; border: none; padding: 5px 12px; border-radius: 12px; cursor: pointer; font-size: 13px; transition: background 0.3s;';
      btn.addEventListener('click', () => {
        document.getElementById('city-search-input').value = query;
        this.handleSearch();
      });
      historyList.appendChild(btn);
    });
  }

  saveItem(item) {
    const savedItems = this.localstorage.get('saved_items', []);
    savedItems.push({ ...item, savedAt: new Date().toISOString() });
    this.localstorage.set('saved_items', savedItems);
    this.showNotification(`Город ${item.name} сохранен!`);
  }

  setupSecurityMeasures() {
    this.localstorage.clearExpired();
  }

  showLoading(show = true) {
    const loader = document.getElementById('loading-indicator');
    if (loader) loader.style.display = show ? 'block' : 'none';
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 12px 20px; 
            border-radius: 4px; color: white; z-index: 1000;
            background: ${type === 'error' ? '#f44336' : '#4CAF50'};
            box-shadow: 0 4px 6px rgba(0,0,0,0.2); transition: opacity 0.3s;
        `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

const originalFetch = window.fetch;
window.fetch = async (...args) => {
  console.log('API Call:', args[0]);
  return originalFetch.apply(this, args);
};

document.addEventListener('DOMContentLoaded', () => {
  new APIIntegrationManager();
});
