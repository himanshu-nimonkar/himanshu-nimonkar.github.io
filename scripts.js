// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    // if user has toggled before, respect their choice
    document.documentElement.dataset.theme = savedTheme;
    updateThemeIcon(savedTheme === 'dark');
  } else {
    // on first visit: force dark mode
    document.documentElement.dataset.theme = 'dark';
    updateThemeIcon(true);
    localStorage.setItem('theme', 'dark');
  }
}


function updateThemeIcon(isDark) {
    themeToggle.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.dataset.theme === 'dark';

    document.body.classList.add('theme-transition');
    document.documentElement.dataset.theme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    updateThemeIcon(!isDark);

    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 1000);
});

// Animate elements on scroll
// Animate elements on scroll + staggered list items
function animateOnScroll() {
  const sections = document.querySelectorAll('.section');
  const animationOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // 1) Reveal the section container
      entry.target.classList.add('section-visible');

      // 2) Stagger timeline items
      if (entry.target.querySelector('.timeline')) {
        const items = entry.target.querySelectorAll('.timeline-item');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('timeline-item-visible'), 150 * i);
        });
      }

      // 3) Stagger publication/project items
      if (entry.target.querySelector('.publications-list')) {
        const items = entry.target.querySelectorAll('.publication-item');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('publication-item-visible'), 150 * i);
        });
      }
      if (entry.target.querySelector('.projects-grid')) {
        const items = entry.target.querySelectorAll('.project-item');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('project-item-visible'), 150 * i);
        });
      }

      // 4) **NEW**: Stagger list items in Languages, Hobbies, and Courses
      const lists = entry.target.querySelectorAll('.languages-list, .hobbies-list, .courses-list');
      lists.forEach(list => {
        const items = list.querySelectorAll('li');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('list-item-visible'), 100 * i);
        });
      });
    });
  }, animationOptions);

  sections.forEach(section => observer.observe(section));
}


// Add hover effects to profile image
function setupProfileEffects() {
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.addEventListener('mouseover', () => {
            profileImage.classList.add('profile-hover');
        });
        profileImage.addEventListener('mouseout', () => {
            profileImage.classList.remove('profile-hover');
        });
    }
}

// Smooth navigation highlighting
function setupNavHighlighting() {
  const sections = Array.from(document.querySelectorAll('.section'));
  const navLinks = Array.from(document.querySelectorAll('.nav-links a, .dropdown-menu a'));

  const updateHighlight = () => {
    const middleY = window.innerHeight / 2;

    // 1. Find the section whose midpoint contains the viewport center
    let activeSection = sections[0];
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= middleY && rect.bottom >= middleY) {
        activeSection = sec;
      }
    });

    // 2. If you're scrolled to the very bottom, force the last section
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 2) {
      activeSection = sections[sections.length - 1];
    }

    // 3. Highlight the corresponding nav link
    navLinks.forEach(link => {
      link.classList.toggle(
        'active-nav',
        link.getAttribute('href') === `#${activeSection.id}`
      );
    });
  };

  window.addEventListener('scroll', updateHighlight);
  window.addEventListener('resize', updateHighlight);
  updateHighlight(); // initial call
}




// Responsive Navigation
function handleNavigation() {
    const navLinks = document.querySelector('.nav-links');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const links = Array.from(navLinks.children);

    function updateNavigation() {
        const availableWidth = navLinks.parentElement.offsetWidth - 100;
        let currentWidth = 0;

        links.forEach(link => {
            link.classList.remove('moved-to-dropdown');
            link.style.display = '';
        });
        dropdownMenu.innerHTML = '';

        if (window.innerWidth <= 768) {
            links.forEach((link, index) => {
                currentWidth += link.offsetWidth + 16;
                if (currentWidth > availableWidth && index > 1) {
                    link.classList.add('moved-to-dropdown');
                    const clonedLink = link.cloneNode(true);
                    dropdownMenu.appendChild(clonedLink);
                }
            });
        }
    }

    dropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
        if (dropdownMenu.classList.contains('show')) {
            dropdownMenu.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
            dropdownMenu.style.animation = 'fadeOut 0.3s ease forwards';
        }
    });

    document.addEventListener('click', () => {
        dropdownMenu.classList.remove('show');
    });

    window.addEventListener('resize', updateNavigation);
    updateNavigation();
}

// Custom Cursor
function setupCustomCursor() {
  if (window.matchMedia('(pointer: fine)').matches) {
    // Create the visible custom cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    // Create the follower ring
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    document.body.appendChild(follower);

    // Move both elements on mousemove
    document.addEventListener('mousemove', e => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      follower.style.left = `${e.clientX}px`;
      follower.style.top = `${e.clientY}px`;
    });

    // Enlarge on hover over interactive elements
    const hoverables = document.querySelectorAll(
      'a, button, .project-item, .publication-item, .tag, .project-image-container, #theme-toggle'
    );

    hoverables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        follower.style.transform = 'scale(1.2)';
        if (item.classList.contains('button') || item.tagName === 'BUTTON') {
          follower.style.backgroundColor = 'rgba(191, 87, 0, 0.2)';
        }
      });
      item.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        follower.style.transform = 'scale(1)';
        follower.style.backgroundColor = 'transparent';
      });
    });

    // ← HERE: ensure OS cursor is hidden inside the page
    document.documentElement.classList.add('no-cursor');

    // When leaving the window, restore the OS cursor
    window.addEventListener('mouseleave', () => {
      document.documentElement.classList.remove('no-cursor');
    });

    // When re-entering the window, hide the OS cursor again
    window.addEventListener('mouseenter', () => {
      document.documentElement.classList.add('no-cursor');
    });
  }
}

// Back to Top Button
function setupBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.remove('hidden');
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.add('hidden');
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animate tags with delay
function animateTags() {
    document.querySelectorAll('.tag, .project-tag').forEach((tag, index) => {
        tag.style.setProperty('--index', index);
        tag.style.animationDelay = `${index * 0.1}s`;
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  // initialize theme toggle
  initializeTheme();

  // responsive nav & dropdown
  handleNavigation();

  // hover effects on profile image
  setupProfileEffects();

  // highlight nav links on scroll
  setupNavHighlighting();

  // animate sections, timelines, publications, projects
  animateOnScroll();

  // staggered tag animations
  animateTags();

  // custom cursor (desktop)
  setupCustomCursor();

  // back-to-top button
  setupBackToTop();

  // ── Override anchor clicks to always scroll & highlight ──
  const allNavLinks = document.querySelectorAll('.nav-links a, .dropdown-menu a');
  allNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      // 1. Manually highlight this link
      allNavLinks.forEach(l => l.classList.remove('active-nav'));
      this.classList.add('active-nav');

      // 2. Smooth‐scroll to the target section
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // 3. Close dropdown (mobile) if open
      document.querySelector('.dropdown-menu')?.classList.remove('show');
    });
  });

  // hide custom cursor on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints) {
    document.documentElement.style.setProperty('--cursor-display', 'none');
  }
});



// Handle page transitions
window.addEventListener('load', () => {
    document.body.classList.add('page-loaded');
});
