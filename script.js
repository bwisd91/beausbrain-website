// Toggle article visibility
function toggleArticle(articleNum) {
      const article = document.getElementById('article-' + articleNum);
      const fullArticle = article.querySelector('.full-article');
      const button = article.querySelector('.read-more');

    if (fullArticle.style.display === 'none') {
              fullArticle.style.display = 'block';
              button.textContent = 'Show less ←';
    } else {
              fullArticle.style.display = 'none';
              button.textContent = 'Read more →';
    }
}

// Set current year in footer
document.addEventListener('DOMContentLoaded', function() {
      const yearElement = document.getElementById('year');
      if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
      }
});

// Mobile menu toggle (optional enhancement)
const hamburger = document.getElementById('hamburger');
if (hamburger) {
      hamburger.addEventListener('click', function() {
                const navbar = document.getElementById('navbar');
                navbar.style.display = navbar.style.display === 'flex' ? 'none' : 'flex';
      });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                              target.scrollIntoView({
                                                behavior: 'smooth'
                              });
                }
      });
});
