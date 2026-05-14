/* ============================================================
   SPARTA – Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // === NAVBAR SCROLL ===
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // === HAMBURGER / MOBILE NAV ===
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // === SCROLL REVEAL ===
  const fadeEls = document.querySelectorAll('.fade-up, .blur-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));

  // === COUNTER ANIMATION ===
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4); // Stronger easing
          current = Math.round(eased * target);

          if (target >= 1000) {
            el.textContent = (current / 1000).toFixed(1) + (current >= 4000 ? '' : ''); 
            // Custom logic for 4000 -> 4K
            if (target === 4000) el.textContent = Math.round(current/1000);
          } else {
            el.textContent = current;
          }

          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));
  
  // === PROGRESS BAR ANIMATION ===
  const progressNums = document.querySelectorAll('.progress-num');
  const progressFills = document.querySelectorAll('.progress-fill');
  
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate the percentage text
        const numEl = entry.target.querySelector('.progress-num') || (entry.target.classList.contains('progress-num') ? entry.target : null);
        if (numEl) {
          const target = parseInt(numEl.dataset.target);
          let current = 0;
          const duration = 2000;
          const startTime = performance.now();
          const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            current = Math.round(eased * target);
            numEl.textContent = current + '%';
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }

        // Animate the bar width
        const fillEl = entry.target.querySelector('.progress-fill') || (entry.target.classList.contains('progress-fill') ? entry.target : null);
        if (fillEl) {
          const targetWidth = fillEl.dataset.width;
          setTimeout(() => {
            fillEl.style.width = targetWidth + '%';
          }, 100);
        }

        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.progress-item').forEach(item => progressObserver.observe(item));

  // === TESTIMONIAL SLIDER ===
  const testiTrack = document.querySelector('.testimonial-slider-track');
  const testiSlides = document.querySelectorAll('.testimonial-slide');
  const testiPrev = document.getElementById('testiPrev');
  const testiNext = document.getElementById('testiNext');
  const testiDotsContainer = document.getElementById('testiDots');
  
  if (testiTrack && testiSlides.length > 0) {
    let currentSlide = 0;
    const slideCount = testiSlides.length;

    // Create dots
    testiSlides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      testiDotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    const updateSlider = () => {
      testiTrack.style.transform = `translateX(-${currentSlide * (100 / slideCount)}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    };

    const goToSlide = (index) => {
      currentSlide = index;
      updateSlider();
    };

    testiNext.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slideCount;
      updateSlider();
    });

    testiPrev.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slideCount) % slideCount;
      updateSlider();
    });

    // Auto slide optional
    setInterval(() => {
      testiNext.click(); 
    }, 6000);
  }

  // === REVIEWS SLIDER ===
  const reviewsTrack = document.getElementById('reviewsTrack');
  const reviewsSlides = document.querySelectorAll('.reviews-slide');
  const reviewsPrev = document.getElementById('reviewsPrev');
  const reviewsNext = document.getElementById('reviewsNext');
  const reviewsDotsContainer = document.getElementById('reviewsDots');

  if (reviewsTrack && reviewsSlides.length > 0) {
    let currentRevSlide = 0;
    const revSlideCount = reviewsSlides.length;

    // Create dots
    reviewsSlides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToRevSlide(i));
      reviewsDotsContainer.appendChild(dot);
    });

    const revDots = reviewsDotsContainer.querySelectorAll('.dot');

    const updateReviewsSlider = () => {
      reviewsTrack.style.transform = `translateX(-${currentRevSlide * (100 / revSlideCount)}%)`;
      revDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentRevSlide);
      });
    };

    const goToRevSlide = (index) => {
      currentRevSlide = index;
      updateReviewsSlider();
    };

    reviewsNext.addEventListener('click', () => {
      currentRevSlide = (currentRevSlide + 1) % revSlideCount;
      updateReviewsSlider();
    });

    reviewsPrev.addEventListener('click', () => {
      currentRevSlide = (currentRevSlide - 1 + revSlideCount) % revSlideCount;
      updateReviewsSlider();
    });

    // Auto slide every 5 seconds
    setInterval(() => {
      reviewsNext.click();
    }, 5000);
  }

  // === HERO SLIDER ===
  const heroSlides = [
    {
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80',
      subtitle: 'FORGE YOUR<br/><span class="accent">STRENGTH</span><br/>IN THE BOX'
    },
    {
      img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1600&q=80',
      subtitle: 'JOIN OUR<br/><span class="accent">COMMUNITY</span><br/>OF WARRIORS'
    },
    {
      img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80',
      subtitle: 'ELITE PERFORMANCE<br/>WITHOUT<br/>EXCUSES'
    }
  ];

  let currentSlide = 0;
  const heroImg = document.querySelector('.hero-img');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const dots = document.querySelectorAll('.dot');

  function goToSlide(idx) {
    currentSlide = (idx + heroSlides.length) % heroSlides.length;
    if (heroImg) {
      heroImg.style.opacity = '0';
      heroImg.style.filter = 'blur(10px)';
      setTimeout(() => {
        heroImg.src = heroSlides[currentSlide].img;
        heroImg.style.opacity = '1';
        heroImg.style.filter = 'blur(0)';
      }, 600);
    }
    if (heroSubtitle) {
      heroSubtitle.style.opacity = '0';
      heroSubtitle.style.transform = 'translateY(20px)';
      setTimeout(() => {
        heroSubtitle.innerHTML = heroSlides[currentSlide].subtitle;
        heroSubtitle.style.opacity = '1';
        heroSubtitle.style.transform = 'translateY(0)';
      }, 600);
    }
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  document.querySelector('.next-btn')?.addEventListener('click', () => goToSlide(currentSlide + 1));
  document.querySelector('.prev-btn')?.addEventListener('click', () => goToSlide(currentSlide - 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

  if (heroSlides.length > 0 && heroImg) {
    setInterval(() => goToSlide(currentSlide + 1), 6000);
  }

  // === PARALLAX EFFECTS ===
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    // Hero Parallax
    const heroImgEl = document.querySelector('.hero-img');
    if (heroImgEl && scrolled < window.innerHeight) {
      heroImgEl.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
    }

    // Generic Parallax BG
    document.querySelectorAll('.parallax-bg').forEach(bg => {
      const parent = bg.parentElement;
      const rect = parent.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (window.innerHeight - rect.top) * 0.1;
        bg.style.transform = `translateY(${offset}px)`;
      }
    });
  });

  // === CONTACT FORM (WhatsApp Redirect fallback) ===
  const contactForm = document.getElementById('contactForm');
  if (contactForm && !window.location.pathname.includes('contact.html')) {
    // Only handle if not on contact.html (which has its own script)
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.name.value;
      const message = contactForm.message.value;
      const whatsappNumber = "0778502118";
      const text = `*New Lead from SPARTA Website*%0A%0A*Name:* ${name}%0A*Message:* ${message}`;
      window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
    });
  }

});
