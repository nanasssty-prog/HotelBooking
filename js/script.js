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
});
