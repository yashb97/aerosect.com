window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  let scrollPosition = window.scrollY;
  let maxScroll = 50;

  let transparency = Math.min(scrollPosition / maxScroll, 1);

  header.style.backgroundColor = `rgba(0, 0, 0, ${transparency})`;
  header.style.boxShadow = `0px 5px 10px rgba(0, 0, 0, ${1 * transparency})`;
});

// Add this code for the cursor pointer
// const cursorPointer = document.getElementById('cursor-pointer');
//
// document.addEventListener('mousemove', (event) => {
//   cursorPointer.style.top = event.clientY + 'px';
//   cursorPointer.style.left = event.clientX + 'px';
// });
//
// window.onscroll = function() {
//   let scrollY = window.scrollY;
//   cursorPointer.style.top = cursorPointer.offsetTop + scrollY + 'px';
// };
const logo = document.getElementById('logo');

logo.addEventListener('click', () => {
  window.location.href = '../index.html'; // Replace '/' with the actual path to your homepage
});

// Select elements
const menuButton = document.getElementById('menu-button');
const menuOverlay = document.getElementById('menu-overlay');
const menuItems = document.querySelectorAll('.menu-item');

// Toggle Menu Visibility
menuButton.addEventListener('click', () => {
  menuOverlay.classList.toggle('active');
  menuButton.classList.toggle('active'); // Keep the hamburger button visible

  // Add or remove the "active" class from each menu item to trigger animation
  menuItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.toggle('active');
    }, index * 100); // Delay each item for a staggered effect
  });
});

// Close the menu when clicking outside the menu items
menuOverlay.addEventListener('click', (e) => {
  if (!e.target.classList.contains('menu-item')) {
    menuOverlay.classList.remove('active');
    menuButton.classList.remove('active'); // Remove active class from button
    menuItems.forEach((item) => item.classList.remove('active'));
  }
});
