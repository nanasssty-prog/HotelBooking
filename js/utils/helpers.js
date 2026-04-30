// Прверить, похож ли текст на email (с помощью регулярного выражения)
export const validateEmail = email => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Показать ошибку: красная рамка с текстом
export const showError = (element, message) => {
  element.style.borderColor = 'red';

  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.style.color = 'red';
  errorElement.style.fontSize = '12px';
  errorElement.style.marginTop = '5px';
  errorElement.textContent = message;

  element.parentNode.appendChild(errorElement);
};

// Убрать ошибку (если пользователь всё исправил)
export const clearErrors = element => {
  element.style.borderColor = '';
  const errorElement = element.parentNode.querySelector('.error-message');
  if (errorElement) {
    errorElement.remove();
  }
};
