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
