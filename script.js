
document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------
     THEME TOGGLE (safe)
     --------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  // Load saved theme first
  const saved = localStorage.getItem('theme') || 'dark';
  body.setAttribute('data-theme', saved);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const newTheme = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  /* ---------------------------
     MOBILE MENU
     --------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      menuToggle.classList.add('active');
    });
  }
  if (menuClose && mobileMenu && menuToggle) {
    menuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuToggle.classList.remove('active');
    });
  }
  if (mobileMenu) {
    mobileMenu.addEventListener('click', e => {
      if (e.target === mobileMenu) {
        mobileMenu.classList.remove('open');
        if (menuToggle) menuToggle.classList.remove('active');
      }
    });
  }
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.remove('open');
      if (menuToggle) menuToggle.classList.remove('active');
    });
  });

  /* ---------------------------
     TYPED.JS (only if available)
     --------------------------- */
  if (typeof Typed !== 'undefined' && document.querySelector('#typed')) {
    try {
      // if you don't want typed behaviour replace this block with static text in HTML
      new Typed("#typed", {
        strings: ["Joseph Gitari", "a Web Developer", "a UI/UX Designer", "from Kenya"],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 1500,
        loop: true
      });
    } catch (err) {
      console.warn("Typed.js init failed:", err);
    }
  } else {
    // If Typed isn't loaded, ensure the title shows static name
    const typedEl = document.getElementById('typed');
    if (typedEl) typedEl.textContent = "Joseph Gitari";
  }

  /* ---------------------------
     TILT (only if available)
     --------------------------- */
  if (typeof VanillaTilt !== 'undefined' && document.querySelectorAll('[data-tilt]').length) {
    try {
      VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.3
      });
    } catch (err) {
      console.warn("VanillaTilt init failed:", err);
    }
  }

  /* ---------------------------
     SKILLS ANIMATION (one observer)
     --------------------------- */
  const skillSection = document.querySelector("#skills");
  const percentNumbers = document.querySelectorAll(".percent-number");
  const fillBars = document.querySelectorAll(".fill");
  let hasAnimatedSkills = false;

  function animateSkillNumbersAndBars() {
    if (hasAnimatedSkills) return;
    hasAnimatedSkills = true;

    // Animate numbers
    percentNumbers.forEach(num => {
      const target = parseInt(num.getAttribute("data-target") || num.textContent || "0", 10);
      if (isNaN(target)) return;
      let count = 0;
      const duration = 900; // ms
      const steps = Math.max(Math.floor(duration / 25), 1);
      const increment = target / steps;
      const interval = setInterval(() => {
        count += increment;
        if (count >= target) {
          num.textContent = target;
          clearInterval(interval);
        } else {
          num.textContent = Math.ceil(count);
        }
      }, 25);
    });

    // Animate fill bars
    fillBars.forEach(bar => {
      const percent = parseInt(bar.getAttribute("data-percent") || "0", 10);
      if (!isNaN(percent)) {
        // ensure transition is enabled in CSS (.fill { transition: width ... })
        bar.style.width = percent + "%";
      }
    });
  }

  if (skillSection) {
    const skillsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSkillNumbersAndBars();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    skillsObserver.observe(skillSection);
  } else {
    // If the section isn't present, still set widths (useful for testing)
    // but avoid crashing
    fillBars.forEach(bar => {
      const percent = bar.getAttribute("data-percent");
      if (percent) bar.style.width = percent + "%";
    });
  }

  /* ---------------------------
     PORTFOLIO LIGHTBOX (defensive)
     --------------------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxDesc = document.getElementById("lightboxDesc");
  const lightboxClose = document.querySelector(".close");

  document.querySelectorAll(".portfolio-card").forEach(card => {
    card.addEventListener("click", () => {
      if (!lightbox) return;
      const title = card.getAttribute("data-title") || "";
      const desc = card.getAttribute("data-desc") || "";
      // fallback if background-image style not set
      const bg = card.style.backgroundImage;
      const img = bg ? bg.slice(5, -2) : card.dataset.img || "";
      if (lightboxImg && img) lightboxImg.src = img;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;
      lightbox.style.display = "flex";
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener("click", () => {
      lightbox.style.display = "none";
    });
  }
  // close when clicking outside image
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.style.display = "none";
    });
  }

  /* ---------------------------
     CONTACT FORM (safe)
     --------------------------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // demo behaviour - replace with real submission logic
      alert("Message sent! (Demo mode)");
      contactForm.reset();
    });
  }

  /* ---------------------------
     CV DOWNLOAD (fixed undefined)
     --------------------------- */
  const downloadCV = document.getElementById("downloadCV");
  const downloadCVMobile = document.getElementById("downloadCVMobile");

  const triggerDownload = (e) => {
    e.preventDefault();
    const cv = `JOSEPH GITARI - WEB ARCHITECT\n\nEmail: josephwanjohi508@gmail.com\nPhone: +254 111 270 277\nLocation: Nairobi, Kenya\n\nSkills: HTML, CSS, JS, React, GSAP, Three.js`;
    const blob = new Blob([cv], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "Joseph-Gitari-CV.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (downloadCV) downloadCV.addEventListener("click", triggerDownload);
  if (downloadCVMobile) downloadCVMobile.addEventListener("click", triggerDownload);

  /* ---------------------------
     ACTIVE NAV ON SCROLL
     --------------------------- */
  const header = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    let current = "";
    document.querySelectorAll("section[id]").forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.id;
    });
    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${current}`);
    });
    if (header) header.classList.toggle("scrolled", window.scrollY > 50);
  });

});