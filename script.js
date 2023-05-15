document.addEventListener('DOMContentLoaded', () => {
    const navList = document.querySelector('.nav-list');
  
    navList.addEventListener('mouseover', (event) => {
      const target = event.target;
      if (target.classList.contains('nav-item')) {
        const dropdownContent = target.querySelector('.dropdown-content');
        dropdownContent.style.display = 'block';
      }
    });
  
    navList.addEventListener('mouseout', (event) => {
      const target = event.target;
      if (target.classList.contains('nav-item')) {
        const dropdownContent = target.querySelector('.dropdown-content');
        dropdownContent.style.display = 'none';
      }
    });
  });
  

